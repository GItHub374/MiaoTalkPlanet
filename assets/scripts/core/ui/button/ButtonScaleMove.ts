import { Animation, AnimationClip, EventTouch, UITransform, Vec3, _decorator, v3 } from "cc";
import ButtonBase from "./ButtonBase";
import { mius } from "../../mius";

const { ccclass, property, menu } = _decorator;

/**
 * 按钮有移动的话就不触发点击事件
 */
@ccclass("ButtonScaleMove")
@menu('ui/button/ButtonScaleMove')
export default class ButtonScaleMove extends ButtonBase {
    @property({
        tooltip: "是否开启"
    })
    private disabledEffect: boolean = false;

    private _begin_pos : Vec3 = v3(0,0,0);

    protected onTouchtStart(event: EventTouch) {
        if (!this.disabledEffect) {
            this.node.scale = new Vec3(0.95, 0.95, 1)
        }

        let pos = event.getUILocation();
        let transform = this.node?.parent?.getComponent(UITransform);
        this._begin_pos = transform?.convertToNodeSpaceAR( v3(pos.x, pos.y, 0) )!;
    }

    protected onTouchEnd(event: EventTouch) {
        if (!this.disabledEffect) {
            this.node.scale = new Vec3(1, 1, 1)
        }

        let pos = event.getUILocation();
        let transform = this.node?.parent?.getComponent(UITransform);
        let tmp_pos = transform?.convertToNodeSpaceAR( v3(pos.x, pos.y, 0) )!;

        if (this.has_moved( tmp_pos )) {
            return
        }
        super.onTouchEnd(event);
    }

    protected onTouchCancel(event: EventTouch) {
        if (!this.disabledEffect) {
            this.node.scale = new Vec3(1, 1, 1)
        }

        super.onTouchCancel(event);
    }

    private has_moved( pos : Vec3 ){
        if (Vec3.distance( this._begin_pos, pos ) > 10) {
            return true
        }
        return false
    }
}