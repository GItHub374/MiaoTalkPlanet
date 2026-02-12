import { CCInteger, Component, Node, _decorator, Animation, AnimationState, AnimationClip } from "cc";
import { mius } from "../../mius";
import { UIComponent } from "./UIComponent";

const { ccclass, property } = _decorator;

/** UI 节点父类 */
@ccclass('UIPopupComponent')
export class UIPopupComponent extends UIComponent {

    /**在 UIDelegateComponent 中被调用*/
    public onAdded( params : any ){
        mius.log.logView( this.uiid, "UIPopupComponent:onAdded:" )

        if (this.ani_node) {
            this.ani_node.active = false
            mius.res.load(["animation/common/scale_enter", "animation/common/scale_exit"], (err: Error | null, res: any) => {
                this.ani_node.active = true

                let anim = this.ani_node.getComponent(Animation);
                if (!anim) {
                    anim = this.ani_node.addComponent(Animation)
                }
                var ac_start : AnimationClip = mius.res.get("animation/common/scale_enter", AnimationClip)!;
                var ac_end : AnimationClip = mius.res.get("animation/common/scale_exit", AnimationClip)!;
                anim.defaultClip = ac_start;
                anim.createState(ac_start, ac_start?.name);
                anim.createState(ac_end, ac_end?.name);
                anim.play( "scale_enter" )
                anim.on( Animation.EventType.FINISHED, ()=>{
                    this.on_enter_finish()
                })
            })
        }
    }

    /**进场动画结束回调，子类重写 */
    protected on_enter_finish(){

    }

    /**退场动画结束回调，子类重写 */
    protected on_exit_finish(){

    }

    /**
     * 隐藏自己
     * 调用 removeFromParent，不会从内存中释放，因为引擎内部仍会持有它的数据，且不会触发 onDestroy 和 onRemoved
     * 因此如果一个节点不再使用，请直接调用 destory_myself，否则会导致内存泄漏。
     */
    hide_myself(){
        if (this.ani_node) {
            let comp = this.ani_node.getComponent(Animation)
            if (comp) {
                comp.on( Animation.EventType.FINISHED, ()=>{
                    mius.gui.remove( this.uiid, true );
                    this.on_exit_finish()
                } )
                comp.play( "scale_exit" )
            }
        }else{
            mius.gui.remove( this.uiid, true );
        }
    }

    /**
     * 销毁自己
     * destory_myself 调用 destroy，如果一个节点不是频繁使用的，调用此方法去销毁掉
     * 因此如果一个节点会重复使用，请调用 hide_myself。
     */
    destory_myself(){
        if (this.ani_node) {
            let comp = this.ani_node.getComponent(Animation)
            if (comp) {
                comp.on(Animation.EventType.FINISHED, ()=>{
                    mius.gui.remove( this.uiid, true );
                })
                comp.play( "scale_exit" )
            }
        }else{
            mius.gui.remove( this.uiid, true );
        }
    }
}