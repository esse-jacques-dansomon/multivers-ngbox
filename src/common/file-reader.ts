import * as path from 'node:path';
import * as fs from 'node:fs';
import * as glob from 'glob';
import { DirectiveModel, PipeModel, ServiceModel } from "../models/models";

export const getAllTsFileas = (projectPath: string): string[] => {
    const globPattern = '**/*.ts';
    return glob.sync(globPattern, { cwd: projectPath });
};

export const getElementFiles = (projectPath: string, type: 'component' | 'pipe' | 'service' | 'directive' | 'module' | 'routing.module'): string[] => {
    const globPattern = `**/*.${type}.ts`;
    //ignore node_modules
    const listIgnore = ['**/node_modules/**', '**/*.spec.ts'];
    return glob.sync(globPattern, { cwd: projectPath, ignore: listIgnore });
};

// export const getAllRoutingModuleFiles = (projectPath: string): string[] => {
//     const globPattern = '**/*-routing.module.ts';
//     return glob.sync(globPattern, { cwd: projectPath, ignore: '**/*.spec.ts' });
// };

export const getAllRoutingModuleFiles = (projectPath: string): string[] => {

    const allFiles = getElementFiles(projectPath, 'module');

    return allFiles;
};

export const getFileContent = (projectPath: string, filePath: string): string => {
    //we need to join the project path with the file path because the file path is relative to the project path
    //and we need to read the file from the project path
    // the file path is src/app/app.component.ts
    //then we need to read the file from /home/user/project/src/app/app.component.ts
    //abolute : 
    return fs.readFileSync(path.join(projectPath, filePath), { encoding: 'utf8' });
};
























export const getAllPipes = (projectPath: string): PipeModel[] => {
    const pipeFiles = getElementFiles(projectPath, 'pipe');
    let pipes: PipeModel[] = [];
    pipeFiles.forEach(pipeFile => {
        const pipeContent = fs.readFileSync(path.join(projectPath, pipeFile), { encoding: 'utf8' });
        const classNameMatch = pipeContent.match(/export\s+class\s+([\w-]+)\s+implements\s+PipeTransform/);
        if (classNameMatch) {
            pipes.push({
                className: classNameMatch[1],
                pipeTsPath: pipeFile
            });
        }
    });
    return pipes;
};

export const getAllServices = (projectPath: string): ServiceModel[] => {
    const serviceFiles = getElementFiles(projectPath, 'service');
    let services: ServiceModel[] = [];
    serviceFiles.forEach(serviceFile => {
        const serviceContent = fs.readFileSync(path.join(projectPath, serviceFile), { encoding: 'utf8' });
        const classNameMatch = serviceContent.match(/export\s+class\s+([\w-]+)\s+/);
        if (classNameMatch) {
            services.push({
                className: classNameMatch[1],
                serviceTsPath: serviceFile
            });
        }
    });
    return services;
};

export const getAllDirectives = (projectPath: string): DirectiveModel[] => {
    const directiveFiles = getElementFiles(projectPath, 'directive');
    let directives: DirectiveModel[] = [];
    directiveFiles.forEach(directiveFile => {
        const directiveContent = fs.readFileSync(path.join(projectPath, directiveFile), { encoding: 'utf8' });
        const selectorMatch = directiveContent.match(/selector:\s*['"`]\s*([\w-]+)\s*['"`]/);
        const templateUrlMatch = directiveContent.match(/templateUrl:\s*['"`]\s*([\w-]+)\s*['"`]/);
        const classNameMatch = directiveContent.match(/export\s+class\s+([\w-]+)\s+{/);
        if (selectorMatch && templateUrlMatch && classNameMatch) {
            directives.push({
                selector: selectorMatch[1],
                templateUrl: templateUrlMatch[1],
                className: classNameMatch[1],
                directiveTsPath: directiveFile
            });
        }
    });
    return directives;
};
