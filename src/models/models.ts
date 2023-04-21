export interface ComponentModel {
    selector: string;
    templateUrl: string;
    className: string;
    componentTsPath: string;
    isInRountingModule: boolean;
    countInModule: number;


    lisrOfUsedSelectors: string[];
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
