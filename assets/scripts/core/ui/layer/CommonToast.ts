import { Animation, Label, _decorator, Component, UITransform } from "cc";
import { UIComponent } from "./UIComponent";
import { mius } from "../../mius";
import { TimeTool } from "../../common/tool/time_tool";
// import { LanguageLabel } from "../language/LanguageLabel";

const { ccclass, property } = _decorator;

@ccclass('CommonToast')
export class CommonToast extends UIComponent {
    @property(Label)
    private lab_content: Label | null = null;

    @property(Animation)
    private animation: Animation | null = null;

    private _timer : NodeJS.Timer | null = null
    private _tick : number = 0

    onLoad() {
        super.onLoad();
        // if (this.animation)
        //     this.animation.on(Animation.EventType.FINISHED, this.onFinished, this);
    }

    start(){
        if (this.build_args.time && this.build_args.time > 0) {
            this._tick = TimeTool.get_now()
            this.start_countdown()
        }else{
            this.refresh_content( this.build_args.content )
        }
    }

    private start_countdown(){
        this._timer = setInterval(() => {
            this.refresh_timer_content()
        }, 1000)

        this.refresh_timer_content()
    }

    private refresh_timer_content(){
        let now = TimeTool.get_now()
        let diff = now - this._tick
        let cd = this.build_args.time - diff
        cd = Math.max(0, cd)
        let content = `${this.build_args.content}\n(${cd})`
        this.refresh_content( content )

        if (cd <= 0) {
            clearInterval(this._timer!)
            this._timer = null
            this.node.destroy()
        }
    }

    private refresh_content(content : string){
        this.lab_content!.string = content
        this.lab_content!.updateRenderData(true)

        let size = this.lab_content!.node.getContentSize()
        let height = Math.max( 80, size.height + 40 )
        
        this.node.setHeight( height )
    }


    // private onFinished() {
    //     this.node.destroy();
    // }

    private on_ani_finish(){
        if (this.build_args.time && this.build_args.time > 0) {
            
        }else{
            this.node.destroy();
        }
    }
}