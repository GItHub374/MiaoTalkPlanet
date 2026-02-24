import { _decorator, Component, Node } from 'cc';
import { mius } from '../../core/mius';
import { UIComponent } from '../../core/ui/layer/UIComponent';
const { ccclass, property } = _decorator;

@ccclass('story_setting')
export class story_setting extends UIComponent {

    on_click_quit_game() {
        mius.event.dispatchEvent(mius.evt.STORY_EVT.QUIT_GAME)
        this.hide_myself()
    }
}


