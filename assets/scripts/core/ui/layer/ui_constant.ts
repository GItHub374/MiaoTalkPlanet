/*
 * Gui模块常用类型定义
 */
import { Node } from "cc";

export namespace UI_VAR {

    /** 本类型仅供gui模块内部使用，请勿在功能逻辑中使用 */
    export class NODE_ATTRIBUTE {
        /** 界面唯一标识，客户端生成 */
        public ui_key!: string;
        /** 预制路径 */
        public prefabPath!: string;
        /** bundle */        
        public bundle? : string;
        /** 传递给打开界面的参数 */
        public params: any | null;
        /** 是否在使用状态 */
        public valid: boolean = true;
        /** 界面根节点 */
        public node: Node | null = null;
        /**界面UIID，在ui_config里面定义的，跟 ui_key 不一样 */
        public uiid!: number;
    }

    /** UI配置结构体 */
    export interface UI_CONFIG {
        bundle   ?: string;
        layer     : LayerType;
        prefab    : string;
        animation?: number;
        uiid      : number;
    }

    /** 节点配置结构体 */
    export interface WG_CONFIG {
        bundle?: string;
        prefab : string;
        wgid   : number;
    }

    /**
     * 网络遮罩的参数
     */
    export interface NETMASK_PARAMS {
        key            : string;
        show_sec?      : number;  //遮罩显示的时间，到时间后自动移除，等于 0 时表示不自动移除
        delay_show_sec?: number;  //延迟多少时间显示
        hide_timestamp?: number;  //消失的时间戳，不用传入，会自动根据show_sec生成
        show_timestamp?: number;  //显示黑色半透明遮罩的时间戳，不用传入，会自动根据delay_show_sec生成
    }

    /**
     * 遮罩的默认停留时长
     */
    export const NetMaskKeepTime : number = 15;

    /**
     * 遮罩颜色延迟多久才显示
     * 一开始是无色遮罩，等待一段时候后才会出现黑色半透明遮罩
     */
    export const NetMaskDelayShowTime : number = 3;
}


/** gui.popup.add 弹框层回调对象定义 */



export enum LayerType {
    UI         = "LayerUI",
    PopUp      = "LayerPopUp",
    QueuePopup = "LayerQueuePopup",
    Toast      = "LayerToast",
    NetMask    = "LayerNetMask",
    Debug      = "LayerDebug",
}







