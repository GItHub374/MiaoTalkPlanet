import { _decorator, Component, resources, AudioClip, AudioSource, Node } from 'cc';
import { CAT_CONFIG } from './cat_config';
import { mius } from '../../core/mius';
import { UIID } from '../config/ui_config';
import { Sprite } from 'cc';
import { color } from 'cc';
import { Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('cat_root')
export class cat_root extends Component {

    @property(Node)
    tb_page: Node[] = []

    @property(Node)
    tb_bottom_btn: Node[] = []

    crt_page_index: number = 0

    start(){
        this.refresh_page()
    }

    play_audio_cat(event: Event, customEventData: string) {
        let voice_index = Number(customEventData)

        let bundle_cat = mius.bundle.getBundle("cat")
        let comp = this.getComponent(AudioSource)
        comp.pause();
        let path = CAT_CONFIG.VOICE_CONFIG[voice_index].voice
        bundle_cat.load(path, AudioClip, (err, clip) => {
            if (err) {
                console.error(err);
                return;
            }
            comp.clip = clip;
            comp.play();

            const duration = clip.getDuration() + 0.05

            this.scheduleOnce(() => {
                // onFinished && onFinished();
                console.log("play_audio_cat finish")
            }, duration);

        });
    }

    stop_audio() {
        let comp = this.getComponent(AudioSource)
        comp.stop();
    }

    refresh_page(){
        console.log("on_click_switch_page", this.crt_page_index)
        for (let index = 0; index < this.tb_page.length; index++) {
            const page = this.tb_page[index];
            page.active = index == this.crt_page_index
        }
        for (let index = 0; index < this.tb_bottom_btn.length; index++) {
            const btn = this.tb_bottom_btn[index];
            let is_select = index == this.crt_page_index
            btn.getChildByName("select").active = is_select
            btn.getChildByName("img_icon").getComponent(Sprite).color = is_select ? color(252, 119, 79) : color(255, 255, 255)
            btn.getChildByName("lab_text").getComponent(Label).color = is_select ? color(252, 119, 79) : color(0, 0, 0)
        }
    }

    on_click_game(event: Event, customEventData: string) {
        let game_index = Number(customEventData)
        mius.gui.show_ui(CAT_CONFIG.GAME_CONFIG[game_index].game_id);
    }

    on_click_test(event: Event, customEventData: string) {
        let game_index = Number(customEventData)
        mius.gui.show_ui(UIID.TEST_UI);
    }

    on_click_switch_page(event: Event, customEventData: string) {
        let page_index = Number(customEventData)
        console.log("on_click_switch_page", page_index)
        this.crt_page_index = page_index
        this.refresh_page()
    }

    on_click_cat_game(){
        if (!mius.gui.get_is_showing(UIID.STORY_MAIN)) {
            mius.gui.show_ui(UIID.STORY_MAIN);
        }
    }
}


