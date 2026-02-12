import { LayerType, UI_VAR } from "../../core/ui/layer/ui_constant";

/** 界面唯一标识 */
export enum UIID {
    /** 测试界面 */
    Demo = 1,
    /**Popup1 */
    Popup1 = 2,
    /**Popup2 */
    Popup2 = 3,
    /**Dialog1 */
    Dialog1 = 4,
    /**Dialog2 */
    Dialog2 = 5,

    /**Toast */
    Toast = 6,

    /**Demo Websocket */
    Demo_WebSocket = 7,

    Demo_HotUpdate = 8,

    Demo_Button = 9,

    MINESWEEPER_MENU = 10,
    MINESWEEPER_GAME = 11,
    MINESWEEPER_RESULT = 12,

    NAVIGATION_MAIN = 13,
    GAME_SNAKE = 15,
    GAME_TETRIS = 16,

    MOVE_MATCH_GAME = 17,
    MOVE_MATCH_HOME = 18,

    LOG_VIEW = 19,

    CHAT_VIEW = 20,

    LUCKY_GAME = 21,
    LUCKY_HISTORY = 22,
    LUCKY_RULE = 23,
    LUCKY_MY_HISTORY = 24,

    NOTICE_DIALOG = 30,

    LOBBY_UI = 50,
    GAME_2048 = 51,
    TEST_UI = 52,
}

export const UI_CONFIG_DATA: UI_VAR.UI_CONFIG[] = [
    { uiid: UIID.Demo, layer: LayerType.UI, prefab: "ui/view/demo" },
    { uiid: UIID.Popup1, layer: LayerType.PopUp, prefab: "ui/view/demo_popup" },
    { uiid: UIID.Popup2, layer: LayerType.PopUp, prefab: "ui/view/demo_popup" },
    { uiid: UIID.Dialog1, layer: LayerType.QueuePopup, prefab: "ui/view/demo_dialog" },
    { uiid: UIID.Dialog2, layer: LayerType.QueuePopup, prefab: "ui/view/demo_dialog" },
    { uiid: UIID.Toast, layer: LayerType.Toast, prefab: "ui/common/toast_node" },
    { uiid: UIID.Demo_WebSocket, layer: LayerType.PopUp, prefab: "ui/view/demo_ws" },
    { uiid: UIID.Demo_HotUpdate, layer: LayerType.PopUp, prefab: "ui/view/demo_hotupdate" },
    { uiid: UIID.Demo_Button, layer: LayerType.PopUp, prefab: "ui/view/demo_button" },

    { uiid: UIID.MINESWEEPER_MENU, layer: LayerType.UI, bundle: "minesweeper", prefab: "prefab/minesweeper-menu" },
    { uiid: UIID.MINESWEEPER_GAME, layer: LayerType.UI, bundle: "minesweeper", prefab: "prefab/minesweeper-game" },
    { uiid: UIID.MINESWEEPER_RESULT, layer: LayerType.PopUp, bundle: "minesweeper", prefab: "prefab/minesweeper-result" },

    { uiid: UIID.NAVIGATION_MAIN, layer: LayerType.UI, bundle: "navigation", prefab: "prefab/navigation-main" },

    { uiid: UIID.GAME_SNAKE, layer: LayerType.UI, bundle: "snake", prefab: "prefab/snake-game" },
    { uiid: UIID.GAME_TETRIS, layer: LayerType.UI, bundle: "tetris", prefab: "prefab/tetris-game" },

    { uiid: UIID.MOVE_MATCH_GAME, layer: LayerType.UI, bundle: "move_match", prefab: "prefab/movematch-game" },
    { uiid: UIID.MOVE_MATCH_HOME, layer: LayerType.UI, bundle: "move_match", prefab: "prefab/movematch-main" },
    { uiid: UIID.LOG_VIEW, layer: LayerType.Debug, prefab: "ui/debug/log_view" },
    { uiid: UIID.CHAT_VIEW, layer: LayerType.UI, bundle: "chat", prefab: "prefab/chat_view" },
    { uiid: UIID.NOTICE_DIALOG, layer: LayerType.PopUp, prefab: "ui/common/notice_dialog" },

    { uiid: UIID.LOBBY_UI, layer: LayerType.UI, bundle: "cat", prefab: "prefab/lobby" },
    { uiid: UIID.GAME_2048, layer: LayerType.UI, bundle: "game_2048", prefab: "prefab/game_main" },
    { uiid: UIID.TEST_UI, layer: LayerType.UI, bundle: "cat", prefab: "prefab/test" },
]