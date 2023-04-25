import { log } from "node:console";
import { getAllRoutingModuleFiles, getElementFiles, getFileContent } from "../../common/file-reader";
import { AngularFile, ComponentModel } from "../../models/models";
import * as path from 'node:path';

export const getAllComponents = (projectPath: string): ComponentModel[] => {
   //le tableau de tours des chemins des fichiers des components
   const componentFiles = getElementFiles(projectPath, 'component');
   let components: ComponentModel[] = [];
   //pour chaque fichier de component
   componentFiles.forEach(componentFile => {
      const componentContent = getFileContent(projectPath, componentFile);

      const classRegex = /\s*export\s+class\s+([\w-]+)\s+/;
      // const classRegex = /\s*export\s+class\s+([\w-]+)\s+/;
      //const classRegex = /\s*export\s+class\s+([\w-]+)\s+/;


      // const selectorRegex = /@Component\s*\({[^}]*selector:\s*['"`]\s*([\w-]+)\s*['"`]/;
      // const templateUrlRegex = /@Component\s*\({[^}]*templateUrl:\s*['"`]\s*([^'"`]+)\s*['"`]/;
      // const inlineTemplateRegex = /@Component\s*\({[^}]*template:\s*['"`]\s*([^'"`]+)\s*['"`]/;
      // const styleUrlsRegex = /@Component\s*\({[^}]*styleUrls:\s*\[\s*(['"`][^'"`]+['"`](?:\s*,\s*['"`][^'"`]+['"`])*\s*)\]/;
      //const classRegex = /\s*export\s+class\s+([\w-]+)\s+/;
      const selectorRegex = /@Component\s*\({[^}]*selector:\s*['"`]?\s*([\w-]+)\s*['"`]?\s*/;
      const templateUrlRegex = /@Component\s*\({[^}]*templateUrl:\s*['"`]?\s*([^'"`\s]+)\s*['"`]?\s*/;
      const inlineTemplateRegex = /@Component\s*\({[^}]*template:\s*['"`]?\s*([^'"`\s]+)\s*['"`]?\s*/;
      const styleUrlsRegex = /@Component\s*\({[^}]*styleUrls:\s*\[\s*(['"`][^'"`\s]+['"`](?:\s*,\s*['"`][^'"`\s]+['"`])*\s*)\]\s*/;

      const selectorMatch = componentContent.match(selectorRegex);
      const templateUrlMatch = componentContent.match(templateUrlRegex);
      const classNameMatch = componentContent.match(classRegex);
      const inlineTemplateMatch = componentContent.match(inlineTemplateRegex);
      const styleUrlsMatch = componentContent.match(styleUrlsRegex);
      if (selectorMatch || templateUrlMatch || classNameMatch) {
         let projectSrc = componentFile.split(path.sep).slice(0, componentFile.split(path.sep).indexOf('src') + 1).join(path.sep);
         //get the last folder of the path //
         let firstFolder = projectPath.split(path.sep).slice(-1)[0];
         projectSrc = firstFolder + path.sep + projectSrc;
         const component: ComponentModel = ({
            selector: selectorMatch ? selectorMatch[1] : '',
            isInlineTemplate: inlineTemplateRegex.test(componentContent),
            templateUrl: inlineTemplateRegex.test(componentContent) ? '' : templateUrlMatch ? templateUrlMatch[1] : '',
            inlineTemplate: inlineTemplateRegex.test(componentContent) ? inlineTemplateMatch ? inlineTemplateMatch[1] : '' : '',
            className: classNameMatch ? classNameMatch[1] : '',


            componentTsPath: componentFile,
            countInModule: 0,
            codeNumberLines: {
               html: 0,
               ts: 0,
               css: 0
            },
            styleUrls: styleUrlsMatch ? styleUrlsMatch[1].split(',').map((styleUrl: string) => styleUrl.trim().replace(/['"`]/g, '')) : [],
            // get the first folders of the path and stop at src
            projectSrc: projectSrc,
            usedIn: {
               modules: [],
               components: [],
               services: [],
               pipes: [],
               directives: [],
               htmls: []
            }

         });
         const updateComponent = calComponentLines(projectPath, component);
         components.push(updateComponent);
      }
   });
   //log(components);
   return components;
};

export const calComponentLines = (projectPath: string, component: ComponentModel): ComponentModel => {
   try {
      const htmlContent = component.isInlineTemplate ?
         component.inlineTemplate : getFileContent(projectPath, path.join(path.dirname(component.componentTsPath),
            component.templateUrl));
      component.codeNumberLines.html = countFilelLines(htmlContent);
   }
   catch (e) {
      console.log(e);
   }


   component.styleUrls.forEach((styleUrl) => {
      try {
         const styleContent = getFileContent(projectPath, path.join(path.dirname(component.componentTsPath), styleUrl));
         component.codeNumberLines.css += countFilelLines(styleContent);
      }
      catch (e) {
         console.log(e);
      }
   });


   try {
      const tsContent = getFileContent(projectPath, component.componentTsPath);
      component.codeNumberLines.ts = countFilelLines(tsContent);
   }
   catch (e) {
      console.log(e);
   }
   const tsContent = getFileContent(projectPath, component.componentTsPath);
   component.codeNumberLines = {
      html: component.codeNumberLines.html,
      ts: component.codeNumberLines.ts,
      css: component.codeNumberLines.css
   };
   return component;
};

export const findSelectorInHtml = (htmlContent: any, selector: string): boolean => {
   const regex = new RegExp(`<${selector}\\b[^>]*>`, 'g');
   const matches = htmlContent.match(regex);
   return !!matches;
};

export const findClassNameInTs = (tsContent: any, className: string): boolean => {
   const regex = new RegExp(`\\b${className}\\b`, 'g');
   const matches = tsContent.match(regex);
   return !!matches;
};

export const isComponentUsedInRouter = (projectPath: string, moduleFile: string, componentClassName: string): number => {
   const moduleContent = getFileContent(projectPath, moduleFile);
   const regex = new RegExp(`\\b${componentClassName}\\b`, 'g');
   const matches = moduleContent.match(regex);
   return matches ? matches.length : 0;
};

export const countFilelLines = (fileContent: string): number => {
   const lines = fileContent.split(/\r\n|\r|\n/);
   return lines.length;
};
export const getFindFileType = (fileContent: any): AngularFile => {

   if (fileContent.includes('@NgModule')) {
      return 'module';
   } else if (fileContent.includes('@Component')) {
      return 'component';
   } else if (fileContent.includes('@Injectable')) {
      return 'service';
   } else if (fileContent.includes('@Pipe')) {
      return 'pipe';
   } else if (fileContent.includes('@Directive')) {
      return 'directive';
   } else if (fileContent.includes('const routes: Routes')) {
      return 'route';
   } else {
      return 'unknown';
   }
};

//algorithm:
//1. check the selectors used by other components: .html // eg: <app-xxx>
//2. the name of the classes used in other components: .ts // eg: this.service.call(ComponentClass) // import {ComponentClass} from 'path'
//3. the presence in modules (routing and modules): .ts // eg: import {ComponentClass} from 'path', // eg: {path: 'xxx', component: ComponentClass},

export const getUnUsedProjectComponents = (projectPath: string): any => {
   const data = getComponentWIthTHeirDetailsProjectComponents(projectPath, "not-used");
   const usedSelectors: Set<string> = data.usedSelectors as Set<string>;
   const usedClasses: Set<string> = data.usedClasses as Set<string>;
   const usedModules: Set<string> = data.usedModules as Set<string>;
   const components = data.components as ComponentModel[];

   const unusedComponents = components.filter((component) =>
      !usedSelectors.has(component.selector) &&
      !usedClasses.has(component.className) && component.countInModule <= 2
   );
   //order by projectSrc
   return unusedComponents.sort((a, b) => {
      return a.projectSrc.localeCompare(b.projectSrc);
   });
};

// importer mais pas utiliser 
export const getComponentWIthTHeirDetailsProjectComponents = (projectPath: string, type: "used" | "not-used"): any => {
   // Create sets to store used selectors and used classes and used modules
   const usedSelectors: Set<string> = new Set();
   const usedClasses: Set<string> = new Set();
   const usedModules: Set<string> = new Set();

   const components = getAllComponents(projectPath);
   const modules = getAllRoutingModuleFiles(projectPath);



   // Iterate through all the components and check if their selectors are used in any of the HTML files
   // and check if their classes are used in any of the TypeScript files
   components.forEach((component) => {
      component.usedIn = {
         modules: [],
         components: [],
         services: [],
         pipes: [],
         directives: [],
         htmls: []
      };

      // Check for selector usage in HTML files
      components.forEach((componentY) => {
         //ignore the same component
         //check if the selector is used in the html file
         try {
            let htmlContent = '';
            if (componentY.isInlineTemplate) {
               htmlContent = componentY.inlineTemplate;
            } else {
               // Get the absolute path of the component's HTML file
               const relativeComponetHtml = path.join(path.dirname(componentY.componentTsPath), componentY.templateUrl);
               // Get the content of the component's HTML file
               htmlContent = getFileContent(projectPath, relativeComponetHtml);
            }
            const isUsed = findSelectorInHtml(htmlContent, component.selector);
            if (isUsed) {
               usedSelectors.add(component.selector);
               component.usedIn.htmls.push(componentY.className);
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
               component.usedIn.components.push(componentY.componentTsPath);
            }
         }


      });

      // Check for class usage in the component's TypeScript file
      let count = 0;
      modules.forEach((module) => {
         const isUsed = isComponentUsedInRouter(projectPath, module, component.className);
         if (isUsed !== 0) {
            usedModules.add(component.selector);
            //
            const fileType = getFindFileType(getFileContent(projectPath, module));
            log("info", `component ${component.className} is used in ${module} as ${fileType}`);
            switch (fileType) {
               case 'module':
               case 'route':
                  component.usedIn.modules.push(module);
                  break;
               case 'service':
                  component.usedIn.services.push(module);
                  break;
               case 'pipe':
                  component.usedIn.pipes.push(module);
                  break;
               case 'directive':
                  component.usedIn.directives.push(module);
                  break;
               default:
                  break;

            }
         }
         count += isUsed;
      });
      component.countInModule = count;
   });
   return {
      usedSelectors,
      usedClasses,
      usedModules,
      components
   };


};



export const orderAllComponents = (projectPath: string): ComponentModel[] => {
   const cssPoints = 1;
   const htmlPoints = 2;
   const tsPoints = 3;
   const components = getComponentWIthTHeirDetailsProjectComponents(projectPath, "used").components as ComponentModel[];
   return components.sort((a, b) => {
      const pointA = a.codeNumberLines.css * cssPoints + a.codeNumberLines.html * htmlPoints + a.codeNumberLines.ts * tsPoints;
      const pointB = b.codeNumberLines.css * cssPoints + b.codeNumberLines.html * htmlPoints + b.codeNumberLines.ts * tsPoints;
      return pointB - pointA;
   });

};