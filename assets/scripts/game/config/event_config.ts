export namespace EVENT_VAR {
    export enum HTTP_EVT  {
        NO_NETWORK = "HTTP.NO_NETWORK",                  // 断网
        UNKNOWN_ERROR = "HTTP.UNKNOWN_ERROR",            // 未知错误
        TIMEOUT = "HTTP.TIMEOUT"                          // 请求超时
    }

    export enum LANG_EVT {
        /** 语种变化事件 */
        CHANGE = 'LANG.CHANGE',
        /** 语种资源释放事件 */
        RELEASE_RES = "LANG.RELEASE_RES"
    }

    export enum SYS_EVT {
        BACKGROUND = "SYS.BACKGROUND", // 进入后台
        FOREGROUND = "SYS.FOREGROUND", // 进入前台
        SIGNAL_BRC = "SYS.SIGNAL_BRC", // 信号变化

        MUSIC_SWITCH = "SYS.MUSIC_SWITCH", // 背景音乐开关
        EFFECT_SWITCH = "SYS.EFFECT_SWITCH", // 音效开关

        MUSIC_VOLUME = "SYS.MUSIC_VOLUME", // 背景音乐开关
        EFFECT_VOLUME = "SYS.EFFECT_VOLUME", // 音效开关
    }

    export enum WS_EVT {
        CLOSED = "WS.CLOSED", // 连接关闭
        CONNECTED = "WS.CONNECTED", // 连接成功
    }

    export enum GAME_EVT {
        CHAT_MSG = "GAME.CHAT_MSG",
        USER_INFO = "GAME.USER_INFO", // 用户信息
        COIN_UPDATE = "GAME.COIN_UPDATE", // 金币更新
        APP_UPDATE_COIN = "GAME.APP_UPDATE_COIN", // APP通知，充值成功，需要更新金币
        INITIATIVE_COIN_UPDATE = "GAME.INITIATIVE_COIN_UPDATE", // 主动更新金币
        OTHER_LOGIN = "GAME.OTHER_LOGIN", // 其他设备登录
        TODAY_WIN = "GAME.TODAY_WIN", // 今日盈利
        SIT_DOWN_RSP = "GAME.SIT_DOWN_RSP", // 坐下返回
        SIT_DOWN_BRC = "GAME.SIT_DOWN_BRC", // 坐下广播
        STAND_UP_RSP = "GAME.STAND_UP_RSP", // 坐下返回
        STAND_UP_BRC = "GAME.STAND_UP_BRC", // 坐下广播
    }

    export enum STORY_EVT {
        QUIT_GAME = "STORY.QUIT_GAME",
    }
}