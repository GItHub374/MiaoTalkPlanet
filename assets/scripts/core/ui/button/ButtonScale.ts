import { Animation, AnimationClip, EventTouch, Vec3, _decorator } from "cc";
import ButtonBase from "./ButtonBase";

const { ccclass, property, menu } = _decorator;

@ccclass("ButtonScale")
@menu('ui/button/ButtonScale')
export default class ButtonScale extends ButtonBase {
    @property({
        tooltip: "是否开启"
    })
    private disabledEffect: boolean = false;

    protected onTouchtStart(event: EventTouch) {
        if (!this.disabledEffect) {
            this.node.scale = new Vec3(0.95, 0.95, 1)
        }
    }

    protected onTouchEnd(event: EventTouch) {
        if (!this.disabledEffect) {
            this.node.scale = new Vec3(1, 1, 1)
        }

        super.onTouchEnd(event);
    }

    protected onTouchCancel(event: EventTouch) {
        if (!this.disabledEffect) {
            this.node.scale = new Vec3(1, 1, 1)
        }

        super.onTouchCancel(event);
    }
}