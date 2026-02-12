import { BlockInputEvents, error, instantiate, Layers, Prefab, Node, _decorator, director } from "cc";
import { mius } from "../../mius";
import { UI_VAR } from "./ui_constant";
import { LayerUI } from "./LayerUI";
const { ccclass } = _decorator;

/*
 * 网络加载遮罩
 */
@ccclass('LayerNetMask')
export class LayerNetMask extends LayerUI {
    //遮罩的key数组
    //可能同一时间会有几种情况都触发遮罩，需要等到全部情况都处理完成才移除
    protected array_mask_key : UI_VAR.NETMASK_PARAMS[] = [];

    protected black!: BlockInputEvents;

    private _mask : Node = null!;

    /**
     * 准备删除的遮罩key
     */
    private _pre_remove_key : string = "";

    constructor(name: string) {
        super(name);
        this.init();
    }

    private init() {
        this.layer = Layers.Enum.UI_2D;
        this.black = this.addComponent(BlockInputEvents);
        this.black.enabled = false;

        this.create_mask_node()
    }

    private create_mask_node(){
        mius.res.load("ui/common/net_mask", (err: Error | null, res: Prefab) => {
            if (err) {
                error(err);
            }
            this._mask = instantiate(res);
            this._mask.parent = this
            this._mask.active = false
        });
    }

    update(){
        if (this._pre_remove_key != "") {
            for (let i = 0; i < this.array_mask_key.length; i++) {
                let mask = this.array_mask_key[i];
                if (mask.key == this._pre_remove_key) {
                    this.array_mask_key.splice(i, 1)
                    break
                }
            }
            this._pre_remove_key = ""
        }

        let _show_gray = false //显示黑色半透明遮罩
        let _now = mius.time.get_now()

        for (let i = this.array_mask_key.length-1; i >= 0 ; i--) {
            let mask = this.array_mask_key[i];
            if (_now >= mask.hide_timestamp!) {
                this.array_mask_key.splice( i, 1 )
            }else{
                _show_gray = _show_gray || (_now >= mask.show_timestamp!)
            }
        }

        if (this._mask) {
            this._mask.active = _show_gray            
        }

        if (this.array_mask_key.length == 0) {
            this.black.enabled = false
            if (this._mask) {
                this._mask.active = false                
            }
            director.getScheduler().unschedule( this.update, this )
        }
    }

    /**
     * 显示遮罩
     * @param args 
     * @returns 
     */
    show_mask(args:UI_VAR.NETMASK_PARAMS): string {
        if (args.show_sec == null) {
            args.show_sec = UI_VAR.NetMaskKeepTime
        }
        if (args.delay_show_sec == null) {
            args.delay_show_sec = UI_VAR.NetMaskDelayShowTime
        }
        let _now = mius.time.get_now()
        if (args.show_sec == 0) {
            args.hide_timestamp = 9999999999
        }else{
            args.hide_timestamp = _now + args.show_sec
        }
        args.show_timestamp = args.delay_show_sec + _now

        let is_exist = false
        for (let i = 0; i < this.array_mask_key.length; i++) {
            let mask = this.array_mask_key[i];
            if (mask.key == args.key) {
                this.array_mask_key[i] = args
                is_exist = true
                break
            }
        }
        if (!is_exist) {
            this.array_mask_key.push(args);            
        }

        if (this.array_mask_key.length > 0) {
            this.black.enabled = true
            //开启定时器
            director.getScheduler().schedule( this.update, this, 1, 0 )
            this.update()
        }

        return args.key;
    }

    /**
     * 移除遮罩
     * @param key 
     */
    remove_mask(key:string){
        if (key && key != "") {
            this._pre_remove_key = key
            this.update()
        }
    }

    /**
     * 清空
     * @param is_destroy 
     */
    clear() {
        this.black.enabled = false
        if (this._mask) {
            this._mask.active = false            
        }
        director.getScheduler().unschedule( this.update, this )
        this.array_mask_key = []
        this._pre_remove_key = ""
    }
}