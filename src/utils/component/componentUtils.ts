import { log } from "node:console";
import { getAllRoutingModuleFiles, getElementFiles, getFileContent } from "../../common/file-reader";
import { Component, ComponentModel } from "../../models/models";
import path = require("path");

export const getAllComponents = (projectPath: string): ComponentModel[] => {
   //le tableau de tours des chemins des fichiers des components
   const componentFiles = getElementFiles(projectPath, 'component');
   let components: ComponentModel[] = [];
   //pour chaque fichier de component
   componentFiles.forEach(componentFile => {
      const componentContent = getFileContent(projectPath, componentFile);
      //const selectorMatch = componentContent.match(/selector:\s*['"`]\s*([\w-]+)\s*['"`]/);
      // const templateUrlMatch = componentContent.match(/templateUrl:\s*['"`]\s*([^'"`]+)\s*['"`]/);
      // const classNameMatch = componentContent.match(/export\s+class\s+([\w-]+)\s+{/);
      const classRegex = /export\s+class\s+([\w-]+)\s+/;
      const selectorRegex = /@Component\s*\({[^}]*selector:\s*['"`]\s*([\w-]+)\s*['"`]/;
      const templateUrlRegex = /@Component\s*\({[^}]*templateUrl:\s*['"`]\s*([^'"`]+)\s*['"`]/;
      const selectorMatch = componentContent.match(selectorRegex);
      const templateUrlMatch = componentContent.match(templateUrlRegex);
      const classNameMatch = componentContent.match(classRegex);
      if (selectorMatch || templateUrlMatch || classNameMatch) {
         components.push({
            selector: selectorMatch ? selectorMatch[1] : '',
            templateUrl: templateUrlMatch ? templateUrlMatch[1] : '',
            className: classNameMatch ? classNameMatch[1] : '',
            isInRountingModule: false,
            componentTsPath: componentFile,
            lisrOfUsedSelectors: [],
            listOfUsedClasses: [],
            amUsedIn: [],
            countInModule: 0

         });

      }
   });
   //log(components);
   return components;
};

export const findSelectorInHtml = (htmlContent: any, selector: string): boolean => {
   const regex = new RegExp(`<${selector}\\b[^>]*>`, 'g');
   const matches = htmlContent.match(regex);
   return matches ? true : false;
};

export const findClassNameInTs = (tsContent: any, className: string): boolean => {
   const regex = new RegExp(`\\b${className}\\b`, 'g');
   const matches = tsContent.match(regex);
   return matches ? true : false;
};

export const isComponentUsedInRouter = (projectPath: string, moduleFile: string, componentClassName: string): number => {
   const moduleContent = getFileContent(projectPath, moduleFile);
   const regex = new RegExp(`\\b${componentClassName}\\b`, 'g');
   const matches = moduleContent.match(regex);
   return matches ? matches.length : 0;
};


//algo :
//1. voir les selectors des autres components utilise : .html  // lister l'endroit ou il est trouvé
//2. le nom des class des classes utilisées dans les autres components // meme chose 
//3. la presence dans les modules de routage : .ts // lister l'endroit ou il est trouvé

// importer mais pas utiliser 
export const getUnUsedProjectComponents = (projectPath: string, type: "used" | "not-used"): ComponentModel[] => {
   //map of all components with their where they are used 
   let mapComponents: Map<string, Component> = new Map();
   // Create sets to store used selectors and used classes
   const usedSelectors: Set<string> = new Set();
   const usedClasses: Set<string> = new Set();
   const usedModules: Set<string> = new Set();

   const components = getAllComponents(projectPath);
   const modules = getAllRoutingModuleFiles(projectPath);


   components.forEach((component) => {
      mapComponents.set(component.selector, { selectorsCall: new Set(), classCalls: new Set(), moduleCalls: new Set() });
   });

   // Iterate through all the components and check if their selectors are used in any of the HTML files
   // and check if their classes are used in any of the TypeScript files
   components.forEach((component) => {
      component.lisrOfUsedSelectors = [];
      component.listOfUsedClasses = [];
      component.amUsedIn = [];
      // Check for selector usage in HTML files
      components.forEach((componentY) => {
         //ignore the same component
         //check if the selector is used in the html file
         try {
            // Get the absolute path of the component's HTML file
            const relativeComponetHtml = path.resolve(path.dirname(componentY.componentTsPath), componentY.templateUrl);
            // Get the content of the component's HTML file
            const htmlContent = getFileContent(projectPath, relativeComponetHtml);
            const isUsed = findSelectorInHtml(htmlContent, component.selector);
            if (isUsed) {
               usedSelectors.add(component.selector);
               component.lisrOfUsedSelectors.push(componentY.selector);
               mapComponents.get(component.selector)?.selectorsCall.add(componentY.selector);
               component.amUsedIn.push(componentY.componentTsPath);
            }
         } catch (error) {
            log("error", error);
         }

         // Check for class usage in the component's TypeScript file
         //dont check for component class in its own file
         if (componentY.className !== component.className) {
            // Get the content of the component's TypeScript file
            const componentTsContent = getFileContent(projectPath, componentY.componentTsPath);
            const isItUsed = findClassNameInTs(componentTsContent, component.className);
            if (isItUsed) {
               usedClasses.add(component.className);
               component.listOfUsedClasses.push(componentY.className);
               mapComponents.get(component.selector)?.classCalls.add(componentY.selector);
               component.amUsedIn.push(componentY.componentTsPath);
            }
         }


      });

      // Check for selector usage in the component's TypeScript file
      let count = 0;
      modules.forEach((module) => {
         const isUsed = isComponentUsedInRouter(projectPath, module, component.className);
         if (isUsed !== 0) {
            usedModules.add(component.selector);
            component.amUsedIn.push(module);
            mapComponents.get(component.selector)?.moduleCalls.add(module);
            component.isInRountingModule = true;
         }
         count += isUsed;
      }


      );


      component.countInModule = count;




   });

   //log("modules", modules);
   //log(mapComponents);

   const unusedComponents = components.filter((component) =>
      !usedSelectors.has(component.selector) &&
      !usedClasses.has(component.className) && component.countInModule <= 2
   );

   //log("in ", components.length, " components, ", a.length, " are not used");
   return unusedComponents;
};