import { _decorator, Component, Node, Label } from 'cc';
import { mius } from '../../core/mius';
import { UIID } from '../config/ui_config';
const { ccclass, property } = _decorator;

@ccclass('view_test_item')
export class view_test_item extends Component {
    @property(Node)
    img_icon: Node = null!;

    @property(Label)
    lab_title: Label = null!;

    @property(Label)
    lab_des: Label = null!;

    test_id: number = 0;

    public refreshContent(idx: number, data: any) {
        this.img_icon.setSpriteFrame(data.img_path)

        this.lab_title.string = data.title

        this.lab_des.string = data.des

        this.test_id = data.test_id
    }

    on_click_item() {
        mius.gui.show_ui(UIID.TEST_MAIN, { test_id: this.test_id });
    }
}


