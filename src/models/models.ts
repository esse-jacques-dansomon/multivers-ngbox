export interface ComponentModel {
    selector: string;
    templateUrl: string;
    isInlineTemplate: boolean;
    inlineTemplate: string;
    className: string;
    componentTsPath: string;
    countInModule: number;
    projectSrc: string;
    styleUrls: string[];


    codeNumberLines: {
        html: number;
        ts: number;
        css: number;
    }

    usedIn: {
        modules: string[];
        components: string[];
        htmls: string[];
        services: string[];
        pipes: string[];
        directives: string[];
    }


}

export type Component = {
    selectorsCall: Set<string>;
    classCalls: Set<string>;
    moduleCalls: Set<string>;
};


export interface PipeModel {
    className: string;
    pipeTsPath: string;
}

export interface ServiceModel {
    className: string;
    serviceTsPath: string;
}

export interface DirectiveModel {
    selector: string;
    templateUrl: string;
    className: string;
    directiveTsPath: string;
}

export interface ProjectModel {
    projectSrc: string;
    components: {
        used: ComponentModel[];
        unused: ComponentModel[];
    };


}

//declare file types
export type AngularFile = "component" | "module" | "service" | "pipe" | "directive" | "route" | "unknown";
