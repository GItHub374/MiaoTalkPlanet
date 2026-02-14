import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('story_chat_view')
export class story_chat_view extends Component {
    @property(Node)
    lab_name: Node = null!

    @property(Node)
    lab_contact: Node = null!

    say_func(name,text){
        this.lab_name.getComponent(Label)!.string = "【" + name + "】"
        this.lab_contact.getComponent(Label)!.string = text
    }
    
    on_click_next(){

    }
}


