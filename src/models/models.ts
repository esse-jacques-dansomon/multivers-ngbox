export interface ComponentModel {
    selector: string;
    templateUrl: string;
    isInlineTemplate: boolean;
    inlineTemplate: string;
    className: string;
    componentTsPath: string;
    isInRoutingModule: boolean;
    countInModule: number;
    projectSrc: string;
    styleUrls: string[];


    codeNumberLines: {
        html: number;
        ts: number;
        css: number;
    }


    listOfUsedSelectors: string[];
    listOfUsedClasses: string[];
    amUsedIn: string[];
    // templateUrlPath: string;
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
