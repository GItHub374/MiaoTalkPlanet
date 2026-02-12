
import { _decorator, Component, Node, Label, color, Sprite, SpriteFrame, UITransform, Vec2, Size } from 'cc';
import { EventComponent } from '../../core/event/EventComponent';
import { mius } from '../../core/mius';
const { ccclass, property } = _decorator;

@ccclass('signal_node')
export class signal_node extends EventComponent {

    @property(Label)
    lab_ms : Label = null!;

    @property(Sprite)
    icon : Sprite = null!;

    @property(SpriteFrame)
    signal0 : SpriteFrame = null!;

    @property(SpriteFrame)
    signal1 : SpriteFrame = null!;

    @property(SpriteFrame)
    signal2 : SpriteFrame = null!;

    @property(SpriteFrame)
    signal3 : SpriteFrame = null!;

    on_signal_brc( event : string, args : any ){
        let delay = args.delay
        if (delay < 120) {
            this.icon.spriteFrame = this.signal3
            this.lab_ms.color = color(67, 239, 98)
        }else if (delay < 600) {
            this.icon.spriteFrame = this.signal2
            this.lab_ms.color = color(255, 231, 100)
        }else{
            this.icon.spriteFrame = this.signal1
            this.lab_ms.color = color(255, 121, 122)
        }
        this.lab_ms.string = delay + "ms"
    }

    onLoad(){
        this.on_evt( mius.evt.SYS_EVT.SIGNAL_BRC, this.on_signal_brc, this )
    }
}