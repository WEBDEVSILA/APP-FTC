
export interface AlertParams {
    title: string;
    subTitle?: string;
    buttons? : Array<buttonParams> | Array<string>;
}

export interface buttonParams {
    text: string;
    role?: string;
    handler?: () => void;
}