import { UI_VAR } from "../../core/ui/layer/ui_constant";

/** 节点唯一标识 */
export enum WGID {
    DEBUG_BUTTON = 1,

    LOG_ITEM = 2,

    CHAT_ITEM = 3,
}


export const WG_CONFIG_DATA : UI_VAR.WG_CONFIG[] = [
    { wgid : WGID.DEBUG_BUTTON, prefab: "ui/debug/debug_button" },
    { wgid : WGID.LOG_ITEM, prefab: "ui/debug/log_item" },
    { wgid : WGID.CHAT_ITEM, bundle : "chat", prefab: "prefab/chat_item" },
]
