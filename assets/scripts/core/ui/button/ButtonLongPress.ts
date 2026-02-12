import { EventTouch, _decorator, log } from "cc";
import ButtonScale from "./ButtonScale";

const { ccclass, property, menu } = _decorator;

@ccclass("ButtonLongPress")
@menu('ui/button/ButtonLongPress')
export class ButtonLongPress extends ButtonScale {
    @property({
        tooltip: "长按时间，秒"
    })
    time: number = 1;

    protected _touch_time = 0;

    //是否触发了
    protected _is_triggle: boolean = true;

    private _event : EventTouch = null!;

    onLoad() {
        this._is_triggle = false;
        super.onLoad();
    }

    /** 触摸开始 */
    onTouchtStart(event: EventTouch) {
        this._event = event;
        this._touch_time = 0;
        super.onTouchtStart(event);
    }

    /** 触摸结束 */
    onTouchEnd(event: EventTouch) {
        if (this._touch_time > this.time) {
            event.propagationStopped = true;
        }
        this._touch_time = 0;
        this.stop_touch_long()

        super.onTouchEnd(event);
    }

    /** 触摸结束 */
    onTouchCancel(event: EventTouch) {
        if (this._touch_time > this.time) {
            event.propagationStopped = true;
        }
        this._touch_time = 0;
        this.stop_touch_long()

        super.onTouchCancel(event);
    }

    protected _touch_end_func(){
        //overwrite
    }

    stop_touch_long() {
        this._event = null!;
        this._is_triggle = false;
    }

    /** 引擎更新事件 */
    update(dt: number) {
        if (this._event && !this._is_triggle) {
            this._touch_time += dt;

            if (this._touch_time >= this.time) {
                this._is_triggle = true;
                this.emit_event()
                this.stop_touch_long();
            }
        }
    }
}
