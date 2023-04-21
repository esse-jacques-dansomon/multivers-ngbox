// import { log } from "node:console";
// import { getElementFiles, getFileContent } from "../../common/file-reader";
// import { Component, ComponentModel } from "../../models/models";
// import path = require("path");

// export const getAllComponents = (projectPath: string): ComponentModel[] => {
//    //le tableau de tours des chemins des fichiers des components
//    const componentFiles = getElementFiles(projectPath, 'component');
//    let components: ComponentModel[] = [];
//    //pour chaque fichier de component
//    componentFiles.forEach(componentFile => {
//       const componentContent = getFileContent(projectPath, componentFile);
//       //const selectorMatch = componentContent.match(/selector:\s*['"`]\s*([\w-]+)\s*['"`]/);
//       // const templateUrlMatch = componentContent.match(/templateUrl:\s*['"`]\s*([^'"`]+)\s*['"`]/);
//       // const classNameMatch = componentContent.match(/export\s+class\s+([\w-]+)\s+{/);
//       const classRegex = /export\s+class\s+([\w-]+)\s+/;
//       const selectorRegex = /@Component\s*\({[^}]*selector:\s*['"`]\s*([\w-]+)\s*['"`]/;
//       const templateUrlRegex = /@Component\s*\({[^}]*templateUrl:\s*['"`]\s*([^'"`]+)\s*['"`]/;
//       const selectorMatch = componentContent.match(selectorRegex);
//       const templateUrlMatch = componentContent.match(templateUrlRegex);
//       const classNameMatch = componentContent.match(classRegex);
//       if (selectorMatch || templateUrlMatch || classNameMatch) {
//          components.push({
//             selector: selectorMatch ? selectorMatch[1] : '',
//             templateUrl: templateUrlMatch ? templateUrlMatch[1] : '',
//             className: classNameMatch ? classNameMatch[1] : '',
//             componentTsPath: componentFile,
//             lisrOfUsedSelectors: [],
//             listOfUsedClasses: [],
//             amUsedIn: []
//          });

//       }
//    });
//    //log(components);
//    return components;
// };

// export const getAllModules = (projectPath: string): string[] => {
//    const moduleFiles = getElementFiles(projectPath, 'module');
//    return moduleFiles;
// };

// export const getAllSectorsInHtml = (string: any): string[] => {
//    const regex = /<([\w-]+)\s*/g;
//    const matches = string.match(regex);
//    return matches ? matches : [];
// };


// export const findAngularComponentSelectors = (htmlContent: any): Set<string> => {
//    return htmlContent.match(/<([a-z]+-[a-z]+)[^>]*>|<([a-z]+)(?=[^>]*>)|<([a-z]+-[a-z]+)(?=[^>]*>)/g);
//    const selectorRegex = /<([a-z]+-[a-z]+)[^>]*>|<([a-z]+)(?=[^>]*>)|<([a-z]+-[a-z]+)(?=[^>]*>)/g;
//    const componentSelectors = new Set<string>();
//    let match;
//    while ((match = selectorRegex.exec(htmlContent)) !== null) {
//       const componentName = `${match[1]}-${match[2]}`;
//       componentSelectors.add(componentName);
//    }

//    return componentSelectors;
// };





// //algo :
// //1. voir les selectors des autres components utilise : .html  // lister l'endroit ou il est trouvé
// //2. le nom des class des classes utilisées dans les autres components // meme chose 
// //3. verfier dans les modules 
// export const getUnUsedProjectComponents = (projectPath: string, type: "used" | "not-used"): ComponentModel[] => {
//    //map of all components with their where they are used 
//    let mapComponents: Map<string, Component> = new Map();
//    // Create sets to store used selectors and used classes
//    const usedSelectors: Set<string> = new Set();
//    const usedClasses: Set<string> = new Set();

//    const components = getAllComponents(projectPath);
//    const modules = getAllModules(projectPath);


//    components.forEach((component) => {
//       mapComponents.set(component.className, { selectorsCall: new Set(), classCalls: new Set(), moduleCalls: new Set() });
//    });

//    // Iterate through all the components and check if their selectors are used in any of the HTML files
//    // and check if their classes are used in any of the TypeScript files
//    let i = 0;
//    components.forEach((component) => {
//       component.lisrOfUsedSelectors = [];
//       component.listOfUsedClasses = [];
//       component.amUsedIn = [];
//       // Check for selector usage in HTML files

//       try {
//          // Get the absolute path of the component's HTML file
//          const relativeComponetHtml = path.resolve(path.dirname(component.componentTsPath), component.templateUrl);
//          // Get the content of the component's HTML file
//          const componentHtmlContent = getFileContent(projectPath, relativeComponetHtml);

//          // // If the selector is found, add it to the set of used selectors
//          const arrayOfSelectorMatch = findAngularComponentSelectors(componentHtmlContent);
//          // if (arrayOfSelectorMatch) {
//          //    //usedSelectors.add();
//          //    component.lisrOfUsedSelectors.push(component.selector);
//          //    mapComponents.get(component.className)?.selectorsCall.add(component.selector);
//          //    log("component.selector " + component.className, arrayOfSelectorMatch.length);
//          // }
//          // log("component.selector " + component.className, arrayOfSelectorMatch);
//          log("---------Start ----------");
//          log("selectors in " + component.className, arrayOfSelectorMatch);
//          log("---------End----------");
//       } catch (error) {
//          log("error", error);
//       }

//       // Check for class usage in the component's TypeScript file
//       // (we don't need to check for the class usage in the HTML file because the selector is used in the HTML file)
//       const componentTsContent = getFileContent(projectPath, component.componentTsPath);
//       const listClassMatch = componentTsContent.match(new RegExp(`\\b${component.className}\\b`));
//       //dont check for component class in its own file
//       if (listClassMatch) {
//          listClassMatch.forEach((match) => {
//             if (match !== component.className) {
//                //usedClasses.add(match);
//                usedClasses.add(component.className);
//                component.listOfUsedClasses.push(match);
//                mapComponents.get(component.className)?.classCalls.add(match);
//             }
//          });
//       }

//    });


//    //log("mapComponents", mapComponents);
//    // if (type === "used") {
//    //    const a = components.filter((component) => usedSelectors.has(component.selector) || usedClasses.has(component.className));
//    //    const unUsed = components.filter((component) => !usedSelectors.has(component.selector) && !usedClasses.has(component.className));
//    //    log("in ", components.length, " components, ", a.length, " are used", unUsed);
//    //    return a;
//    // } else {
//    const a = components.filter((component) => !usedSelectors.has(component.selector) && !usedClasses.has(component.className));

//    log("in ", components.length, " components, ", a.length, " are not used");
//    return a;




// };

