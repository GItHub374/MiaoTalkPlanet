import { _decorator, Component, Node, Label } from 'cc';
import { mius } from '../../core/mius';
import { UIID } from '../config/ui_config';
import { CAT_CONFIG } from './cat_config';
const { ccclass, property } = _decorator;

@ccclass('view_game_item')
export class view_game_item extends Component {
    @property(Node)
    img_bg: Node = null!;

    @property(Label)
    lab_title: Label = null!;

    @property(Node)
    node_mask: Node = null!;

    @property(Label)
    lab_lock: Label = null!;

    game_id: number = 0;

    unlock_point: number = 0;

    is_lock:boolean = false

    public refreshContent(idx: number, data: any) {
        this.unlock_point = data.unlock_point
        this.game_id = data.game_id
        this.is_lock = data.is_lock

        this.img_bg.setSpriteFrame(data.img_path)

        this.lab_title.string = data.title

        this.lab_lock.string = "解锁需要 " + this.unlock_point + " 积分"


        this.node_mask.active = this.is_lock
    }

    deal_click_comfirm(){
        if (mius.user.points < this.unlock_point){
            mius.gui.show_toast(mius.language.getLangByKey("积分不足"))
            return
        }
        mius.gui.show_toast(mius.language.getLangByKey("成功解锁"))
    }

    on_click_item() {
        console.log(this.game_id)
        if (this.is_lock){

            mius.gui.show_popup(UIID.COMMON_DIALOG, {
                btn_count: 2,
                content: "是否使用" + this.unlock_point + "积分解锁",
                cancel_text: "取消",
                confirm_text: "确认",
                confirm_callback: () => { this.deal_click_comfirm() },
            })
            return
        }
        // const game_config = CAT_CONFIG.STORY_GAME_CONFIG.get(this.game_id);
        const game_config = CAT_CONFIG.STORY_GAME_CONFIG.get("cat_day");
        mius.gui.show_ui(UIID.LOAD_GAME, game_config);
    }
}


