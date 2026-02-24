import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { StoryCmd } from './story_config';
const { ccclass, property } = _decorator;

@ccclass('story_choose_view')
export class story_choose_view extends Component {
    @property(Node)
    layout_choose: Node = null!

    @property(Node)
    tb_btn_choose: Node[] = []

    callback: Function|null = null

    options

    update_choose(options,callback) {
        this.callback = callback
        this.options = options
        for (let index = 0; index < this.tb_btn_choose.length; index++) {
            let btn_choose = this.tb_btn_choose[index]
            if (index < options.length) {
                btn_choose.active = true
                btn_choose.getChildByName("lab_text")!.getComponent(Label)!.string = options[index].text
            } else {
                btn_choose.active = false
            }
        }
    }
    
    on_click_choose(event: Event, customEventData: string) {
        let choose_index = Number(customEventData)
        this.callback(this.options[choose_index].jumpTo)
    }
}


