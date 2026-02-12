import { UIID } from "../config/ui_config";

export namespace CAT_CONFIG {
    export const VOICE_CONFIG: { voice: string }[] = [
        { voice: "cat:audio/cat_voice_1" },
        { voice: "cat:audio/cat_voice_2" },
        { voice: "cat:audio/cat_voice_3" },
        { voice: "cat:audio/cat_voice_4" },
        { voice: "cat:audio/cat_voice_5" },
        { voice: "cat:audio/cat_voice_6" },
    ]

    export const GAME_CONFIG: { game_id: number }[] = [
        { game_id: UIID.GAME_2048 },
        { game_id: UIID.GAME_2048 },
        { game_id: UIID.GAME_2048 },
        { game_id: UIID.GAME_2048 },
        { game_id: UIID.GAME_2048 },
        { game_id: UIID.GAME_2048 },
    ]

    export const MAX_PLAYER_NUM = 4;
    export const DICE_TIME = 8; // 正常行动时间
    export const AUTO_TIME = 5;  // 托管时间

    export enum GAME_STAGE {
        NONE = 0,
        PREPARE = 1,
        PLAYING = 2,
        FINISH = 3,
    }

    export enum SEAT_STAGE {
        IDLE = 0,
        READY = 1,
        PLAYING = 2,
    }

    export enum PLAYER_POS {
        RED = 0,
        GREEN = 1,
        YELLOW = 2,
        BLUE = 3,
    }


    export const LUDO_BUYIN = [
        10, 100, 500, 2000, 5000, 10000
    ]

    // 道具类型
    export const ITEM_TYPE = {
        GOLD_DICE: 0,
    }

    export const ITEM_CONFIG: { icon: string }[] = [
        { icon: "ludo:images/item_gold_dice" },
    ]
}