import { Component, EventTouch, Node, _decorator, Button, EventHandler, log } from "cc";
import { TimeTool } from "../../common/tool/time_tool";

const { ccclass, property, menu } = _decorator;

@ccclass("ButtonBase")
@menu('ui/button/ButtonBase')
export default class ButtonBase extends Component {
    @property({
        tooltip: "是否只能触发一次"
    })
    private once: boolean = false;

    @property({
        tooltip: "每次触发间隔，毫秒"
    })
    private interval: number = 500;

    private _touch_count = 0;

    private _touch_timestamp = 0;

    @property({
        tooltip: "触发事件",
        type:EventHandler, //这一句要加上，不然在编辑器中无法正常设置
    })
    clickEvents: EventHandler[] = [];

    onLoad() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchtStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    /** 触摸开始 */
    protected onTouchtStart(event: EventTouch) { }

    /** 触摸结束 */
    protected onTouchEnd(event: EventTouch) {
        if (this.once) {
            if (this._touch_count > 0) {
                event.propagationStopped = true;
                return;
            }
            this._touch_count++;
        }

        event.propagationStopped = true;

        // 防连点500毫秒出发一次事件
        let _ts = TimeTool.get_now_ms()
        if (this._touch_timestamp && _ts - this._touch_timestamp < this.interval) {
            
        }
        else {
            this._touch_end_func()
        }
    }

    protected onTouchCancel(event:EventTouch){
        event.propagationStopped = true;

        // 防连点500毫秒出发一次事件
        let _ts = TimeTool.get_now_ms()
        if (this._touch_timestamp && _ts - this._touch_timestamp < this.interval) {
            
        }
        else {
            this._touch_timestamp = _ts;
        }
    }

    protected _touch_end_func(){
        this._touch_timestamp = TimeTool.get_now_ms();
        this.emit_event()
    }

    protected emit_event(){
        this.clickEvents.forEach(handler => {
            handler.emit([handler.customEventData])
        });
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchtStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
}
