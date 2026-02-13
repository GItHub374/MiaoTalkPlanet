export interface StoryCmd {
    cmd?: string;
    label?: string;

    // say
    name?: string;
    text?: string;

    // jump
    jump?: string;

    // choice
    options?: {
        text: string;
        jump: string;
        condition?: string;
    }[];

    // flag
    set?: { [key: string]: any };
    if?: string;
}