export interface StoryCmd {
    cmd?: string;
    jumpFlag?: string;

    // say
    name?: string;
    text?: string;

    // jump
    jump?: string;

    // choice
    options?: {
        text: string;
        jumpTo: string;
        condition?: string;
    }[];

    // flag
    set?: { [key: string]: any };
    if?: { [key: string]: any };
}