import { _decorator, Component, resources, AudioClip, AudioSource } from 'cc';
import { CAT_CONFIG } from './cat_config';
import { mius } from '../../core/mius';
import { UIID } from '../config/ui_config';
const { ccclass, property } = _decorator;

@ccclass('cat_root')
export class cat_root extends Component {
    
    play_audio_cat(event: Event, customEventData: string) {
        let comp = this.getComponent(AudioSource)
        comp.pause();
        let voice_index = Number(customEventData)
        let path = CAT_CONFIG.VOICE_CONFIG[voice_index].voice
        resources.load(path, AudioClip, (err, clip) => {
            if (err) {
                console.error(err);
                return;
            }
            comp.clip = clip;
            comp.play();
        });
    }

    stop_audio(){
        let comp = this.getComponent(AudioSource)
        comp.pause();
    }

    on_click_game(event: Event, customEventData: string) {
        let game_index = Number(customEventData)
        mius.gui.show_ui(CAT_CONFIG.GAME_CONFIG[game_index].game_id);
    }

    on_click_test(event: Event, customEventData: string) {
        let game_index = Number(customEventData)
        mius.gui.show_ui(UIID.TEST_UI);
    }
}


