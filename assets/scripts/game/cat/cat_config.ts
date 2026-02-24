import { UIID } from "../config/ui_config";

export namespace CAT_CONFIG {
    export enum CONTENT_TYPE {
        NONE = 0,
        TITLE = 1,
        VOICE = 2,
    }

    export const VOICE_VIEW_CONFIG: { type: number, voice_path?:string, img_path?:string, text?:string }[] = [
        { type: CONTENT_TYPE.TITLE, text: "听猫咪声音" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_mm", img_path:"cat:images/voice/voice_icon_mm", voice_path: "audio/cat_voice_1" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_cn", img_path:"cat:images/voice/voice_icon_cn", voice_path: "audio/cat_voice_2" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_dmm", img_path:"cat:images/voice/voice_icon_dmm", voice_path: "audio/cat_voice_3" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_fdp", img_path:"cat:images/voice/voice_icon_fdp", voice_path: "audio/cat_voice_4" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_fk", img_path:"cat:images/voice/voice_icon_fk", voice_path: "audio/cat_voice_5" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_fn", img_path: "cat:images/voice/voice_icon_fn", voice_path: "audio/cat_voice_6" },
        { type: CONTENT_TYPE.TITLE, text: "陪猫咪玩" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_qt", img_path: "cat:images/voice/voice_icon_qt", voice_path: "audio/cat_voice_1" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_gx", img_path: "cat:images/voice/voice_icon_gx", voice_path: "audio/cat_voice_2" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_hs", img_path: "cat:images/voice/voice_icon_hs", voice_path: "audio/cat_voice_3" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_hx", img_path: "cat:images/voice/voice_icon_hx", voice_path: "audio/cat_voice_4" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_jy", img_path: "cat:images/voice/voice_icon_jy", voice_path: "audio/cat_voice_5" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_ml", img_path: "cat:images/voice/voice_icon_ml", voice_path: "audio/cat_voice_6" },
        { type: CONTENT_TYPE.TITLE, text: "陪猫咪玩2" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_qt", img_path: "cat:images/voice/voice_icon_qt", voice_path: "audio/cat_voice_1" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_gx", img_path: "cat:images/voice/voice_icon_gx", voice_path: "audio/cat_voice_2" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_hs", img_path: "cat:images/voice/voice_icon_hs", voice_path: "audio/cat_voice_3" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_hx", img_path: "cat:images/voice/voice_icon_hx", voice_path: "audio/cat_voice_4" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_jy", img_path: "cat:images/voice/voice_icon_jy", voice_path: "audio/cat_voice_5" },
        { type: CONTENT_TYPE.VOICE, text: "voice_icon_ml", img_path: "cat:images/voice/voice_icon_ml", voice_path: "audio/cat_voice_6" },
    ]

    type GAME_TYPE = {
        bundle_name: string;
        show_uid: number;
        img_path?: string;
    };

    export const STORY_GAME_CONFIG = new Map<string, GAME_TYPE>([
        ["cat_day", { bundle_name: "story", img_path: "images", show_uid: UIID.STORY_MAIN }],
    ]);

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