import { CCInteger, Component, Node, _decorator, Animation, AnimationState, AnimationClip } from "cc";
import { EventComponent } from "../../event/EventComponent";
import { EventData } from "../../event/EventManager";
import { mius } from "../../mius";
import { UI_VAR } from "./ui_constant";
import { UIDelegateComponent } from "./UIDelegateComponent";

const { ccclass, property } = _decorator;

/** UI 节点父类 */
@ccclass('UIComponent')
export class UIComponent extends EventComponent {
    /**
     * 生成节点传进来的参数
     */
    private _build_args : any = null;
    get build_args(): any {
        return this._build_args;
    }

    /**
     * 节点的UIID，在ui_config里面配置
     */
    private _uiid : number = 0;
    get uiid() : number{
        return this._uiid;
    }

    /**
     * 做进场动画或退场动画的节点
     */
    @property({type:Node, tooltip:"做进场动画或退场动画的节点"})
    ani_node : Node = null!;


    //节点从生成到销毁的方法调用顺序
    //onDestroy 是引擎自带，onRemoved 是自定义的
    // onLoad -> onAdded -> start -> update -> onBeforeRemove -> onRemoved -> onDestroy

    /**在 UIDelegateComponent 中被调用*/
    public onAdded( params : any ){
        mius.log.logView( this._uiid, "UIComponent:onAdded:" )

    }

    /**在 UIDelegateComponent 中被调用*/
    public onBeforeRemove( params : any ){
        mius.log.logView( this._uiid, "UIComponent:onBeforeRemove:" )
        this.clean_events()
    }

    /**在 UIDelegateComponent 中被调用*/
    public onRemoved( params : any ){
        mius.log.logView( this._uiid, "UIComponent:onRemoved:" )
        this.clean_events()
    }



    onDestroy(){
        mius.log.logView( this._uiid, "UIComponent:onDestroy:" )
        super.onDestroy()
    }

    onDisable(): void {
        super.onDisable()    
    }
    
    onLoad(){
        mius.log.logView( this._uiid, "UIComponent:onLoad:" )
        //在 onLoad 里面处理打开 UI 的参数
        let _component : UIDelegateComponent | null = this.node.getComponent(UIDelegateComponent);
        this._build_args = _component?.ui_attribute?.params;
        this._uiid = _component?.ui_attribute?.uiid!;

        this.add_listener()
    }

    /**
     * 添加监听事件，子类重写
     */
    protected add_listener(){

    }


    /**
     * 隐藏自己
     * 调用 removeFromParent，不会从内存中释放，因为引擎内部仍会持有它的数据，且不会触发 onDestroy 和 onRemoved
     * 因此如果一个节点不再使用，请直接调用 destory_myself，否则会导致内存泄漏。
     */
    hide_myself(){
        mius.gui.remove( this._uiid, false );
    }

    /**
     * 销毁自己
     * destory_myself 调用 destroy，如果一个节点不是频繁使用的，调用此方法去销毁掉
     * 因此如果一个节点会重复使用，请调用 hide_myself。
     */
    destory_myself(){
        mius.gui.remove( this._uiid, true );
    }
}