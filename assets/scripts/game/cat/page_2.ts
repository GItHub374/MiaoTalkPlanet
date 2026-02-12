import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('page_2')
export class page_2 extends Component {

    @property(Node)
    game_node:Node = null!

    @property(Node)
    mask:Node = null!

    @property(Node)
    btn:Node = null!

    @property(Node)
    view:Node = null!

    on_click_show_game(){
        this.game_node.active = true
        this.view.active = false
    }
}


