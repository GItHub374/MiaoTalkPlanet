/*
 * 入口文件
 */

import { assert, Camera, error, instantiate, Layers, Node, Prefab, warn, Widget } from "cc";
import { GUI } from "../GUI";
import { LayerType, UI_VAR } from "./ui_constant";
import { LayerQueuePopup } from "./LayerQueuePopup";
import { LayerToast } from "./LayerToast";
import { LayerPopUp } from "./LayerPopup";
import { LayerUI } from "./LayerUI";
// import { LayerNetMask } from "./LayerNetMask";
import { UI_CONFIG_DATA } from "../../../game/config/ui_config";
import { WG_CONFIG_DATA } from "../../../game/config/wg_config";
import { mius } from "../../mius";
import { BaseManager } from "../../common/BaseManager";


export class LayerManager extends BaseManager {
    /** 界面根节点 */
    public root!: Node;
    /** 界面摄像机 */
    public camera!: Camera;

    /** 界面层 */
    private _layer_ui!: LayerUI;
    /** 弹窗层 */
    private _layer_popup!: LayerPopUp;
    /** 弹窗队列，一次一个 */
    private _layer_queuepopup!: LayerQueuePopup;
    /** 网络加载遮罩 */
    // private _layer_mask! : LayerNetMask;
    /** 消息提示控制器*/
    private _layer_toast!: LayerToast;
    /**调试 */
    private _layer_debug!: LayerUI;

    /** UI配置 */
    private configs: Map<number, UI_VAR.UI_CONFIG> = new Map();

    /** WIDGET配置 */
    private wg_configs: Map<number, UI_VAR.WG_CONFIG> = new Map();

    /** 是否为竖屏显示 */
    public get portrait() {
        return this.root.getComponent(GUI)!.portrait;
    }

    public init(root: Node) {
        this.root = root;
        this.camera = this.root.getComponentInChildren(Camera)!;

        this._layer_ui = new LayerUI(LayerType.UI);
        this._layer_popup = new LayerPopUp(LayerType.PopUp);
        this._layer_queuepopup = new LayerQueuePopup(LayerType.QueuePopup);
        // this._layer_mask = new LayerNetMask(LayerType.NetMask);
        this._layer_toast = new LayerToast(LayerType.Toast);

        root.addChild(this._layer_ui);
        root.addChild(this._layer_popup);
        root.addChild(this._layer_queuepopup);
        // root.addChild(this._layer_mask);
        root.addChild(this._layer_toast);

        if (mius.app_config.is_debug_mode) {
            this._layer_debug = new LayerUI(LayerType.Debug);
            root.addChild(this._layer_debug);
        }

        this.load_ui_config(UI_CONFIG_DATA)
        this.load_wg_config(WG_CONFIG_DATA)
    }

    clean(): void {
        
    }

    /**
     * 加载所有UI的配置对象
     * @param configs 配置对象
     */
    private load_ui_config(configs: UI_VAR.UI_CONFIG[]): void {
        for (let cfg of configs) {
            this.configs.set( cfg.uiid, cfg )
        }
    }

    /**
     * 加载所有节点的配置对象
     * @param configs 配置对象
     */
    private load_wg_config(configs: UI_VAR.WG_CONFIG[]): void {
        for (let cfg of configs) {
            this.wg_configs.set( cfg.wgid, cfg )
        }
    }

    private create_layer(name: string) {
        var node = new Node(name);
        node.layer = Layers.Enum.UI_2D;
        var w: Widget = node.addComponent(Widget);
        w.isAlignLeft = w.isAlignRight = w.isAlignTop = w.isAlignBottom = true;
        w.left = w.right = w.top = w.bottom = 0;
        w.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE; //ON_WINDOW_RESIZE  一开始会像 ONCE 一样对齐一次，之后每当窗口大小改变时还会重新对齐。
        w.enabled = true;
        return node;
    }



    /**
     * 显示toast
     * @param content 文本表示
     */
    public show_toast(content: string, time : number = 0) {
        this._layer_toast.show(content, time)
    }


    /**
     * 显示网络遮罩
     * @param key 
     */
    public show_mask(args : UI_VAR.NETMASK_PARAMS | string, show_sec? : number){
        let params: UI_VAR.NETMASK_PARAMS;
        if (typeof args === "string") {
            assert(show_sec != null, "show_mask show_sec can not be null");
            params = {
                key: args,
                show_sec: show_sec,
            };
        } else {
            params = args;
        }
        // this._layer_mask.show_mask(params);
    }

    public remove_mask(key:string){
        // this._layer_mask.remove_mask(key);
    }

    /**
     * 通过 uiid 获取ui配置
     * @param uiid 
     * @returns UI_VAR.UI_CONFIG
     */
    public get_config_by_uiid(uiid:number) : UI_VAR.UI_CONFIG{
        return this.configs.get(uiid)!;
    }

    /**
     * 显示 LayerType.UI 层的界面
     * @param uiid : UIID
     * @param ui_args : 界面参数
     * @returns 
     */
    public show_ui(uiid: number, ui_args: any = null): void {
        var config = this.configs.get(uiid);
        if (config == null) {
            warn(`show_ui [${uiid}] failed, config not exist`);
            return;
        }
        if (config.layer != LayerType.UI) {
            assert(false, "ui which is not belong LayerType.UI can not use show_ui")
            return;
        }
        this._layer_ui.add(config, ui_args);
    }

    /**
     * 显示 LayerType.Debug 层的界面
     * @param uiid : UIID
     * @param ui_args : 界面参数
     * @returns 
     */
    public show_debug_ui(uiid: number, ui_args: any = null): void {
        var config = this.configs.get(uiid);
        if (config == null) {
            warn(`show_debug_ui [${uiid}] failed, config not exist`);
            return;
        }
        if (config.layer != LayerType.Debug) {
            assert(false, "ui which is not belong LayerType.UI can not use show_debug_ui")
            return;
        }
        this._layer_debug.add(config, ui_args);
    }

    /**
     * 显示 LayerType.PopUp 层的界面
     * @param uiid : UIID
     * @param ui_args : 界面参数
     * @returns 
     */
    public show_popup(uiid: number, ui_args: any = null){
        var config = this.configs.get(uiid);
        if (config == null) {
            warn(`show_popup [${uiid}] failed, config not exist`);
            return;
        }
        if (config.layer != LayerType.PopUp) {
            assert(false, "ui which is not belong LayerType.PopUp can not use show_popup")
            return;
        }
        this._layer_popup.add(config, ui_args);
    }

    /**
     * 显示 LayerType.QueuePopup 层的界面
     * @param uiid : UIID
     * @param ui_args : 界面参数
     * @returns 
     */
    public show_queue_popup(uiid: number, ui_args: any = null){
        var config = this.configs.get(uiid);
        if (config == null) {
            warn(`show_queue_popup [${uiid}] failed, config not exist`);
            return;
        }
        if (config.layer != LayerType.QueuePopup) {
            assert(false, "ui which is not belong LayerType.QueuePopup can not use show_queue_popup")
            return;
        }
        this._layer_queuepopup.add(config, ui_args);
    }

    /**
     * 创建节点
     * @param wgid 
     * @param callback 
     * @returns 
     */
    public create_widget( wgid : number, onComplete? : Function ){
        var config = this.wg_configs.get(wgid);
        if (config == null) {
            warn(`create_widget [${wgid}] failed, config not exist`);
            return;
        }
        mius.res.load(config.prefab, (err: Error | null, res: Prefab) => {
            if (err) {
                error(err);
            }
            onComplete && onComplete(instantiate(res));
        });
    }
    

    public get_layer_with_name( name : LayerType ){
        if (name == LayerType.UI) {
            return this._layer_ui;
            
        }else if (name == LayerType.PopUp) {
            return this._layer_popup;

        }else if (name == LayerType.QueuePopup) {
            return this._layer_queuepopup;

        }else if (name == LayerType.NetMask) {
            // return this._layer_mask;
            
        }else if (name == LayerType.Toast) {
            return this._layer_toast;
            
        }else if (name == LayerType.Debug) {
            return this._layer_debug;
            
        }
    }


    /**
     * 界面是否正在显示
     * @param uiId 
     * @returns 
     */
    public get_is_showing(uiId: number) {
        var config = this.configs.get(uiId);
        if (config == null) {
            warn(`get_is_showing ui [${uiId}] failed, config not exist`);
            return;
        }

        var result = false;
        switch (config.layer) {
            case LayerType.UI:
                result = this._layer_ui.get_is_showing(uiId);
                break;
            case LayerType.PopUp:
                result = this._layer_popup.get_is_showing(uiId);
                break;
            case LayerType.QueuePopup:
                result = this._layer_queuepopup.get_is_showing(uiId);
                break;
            case LayerType.Debug:
                result = this._layer_debug.get_is_showing(uiId);
                break;
        }
        return result;
    }

    /**
     * 移除节点，isDestroy 默认true
     * @param uiId 
     * @param isDestroy 
     * @returns 
     */
    public remove(uiid: number, isDestroy = true) {
        var config = this.configs.get(uiid);
        if (config == null) {
            warn(`删除编号为【${uiid}】的界面失败，配置信息不存在`);
            return;
        }

        switch (config.layer) {
            case LayerType.UI:
                this._layer_ui.remove_by_uiid(uiid, isDestroy);
                break;
            case LayerType.PopUp:
                this._layer_popup.remove_by_uiid(uiid, isDestroy);
                break;
            case LayerType.QueuePopup:
                this._layer_queuepopup.remove_by_uiid(uiid, isDestroy);
                break;
            case LayerType.Debug:
                this._layer_debug.remove_by_uiid(uiid, isDestroy);
                break;
        }
    }


    /**
     * 清空所有界面
     */
    public clear() {
        this.clear_layer_ui();
        this.clear_layer_popup();
        this.clear_layer_queuepopup();
        this.clear_layer_mask()
        // this.clear_layer_toast();
    }

    public clear_layer_ui(){
        this._layer_ui.clear( );
    }

    public clear_layer_popup(is_destroy : boolean = true){
        this._layer_popup.clear(is_destroy);
    }

    public clear_layer_queuepopup(is_destroy : boolean = true){
        this._layer_queuepopup.clear(is_destroy);
    }

    public clear_layer_toast(is_destroy : boolean = true){
        this._layer_toast.clear(is_destroy);
    }

    public clear_layer_mask(is_destroy : boolean = true){
        // this._layer_mask.clear()
    }
}