import { _decorator, Component, Sprite, color, Label, Node } from 'cc';
import { SpriteFrame, Texture2D, ImageAsset } from 'cc';
import { CAT_CONFIG } from './cat_config';
import { mius } from '../../core/mius';
import { UIID } from '../config/ui_config';
const { ccclass, property } = _decorator;

@ccclass('cat_root')
export class cat_root extends Component {

    @property(Node)
    tb_page: Node[] = []

    @property(Node)
    tb_bottom_btn: Node[] = []

    @property(Node)
    head: Node = null!

    crt_page_index: number = 0

    start(){
        this.refresh_page()
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
            btn.getChildByName("img_icon_select").active = is_select
            btn.getChildByName("img_icon").active = !is_select
            // btn.getChildByName("img_icon").getComponent(Sprite).color = is_select ? color(252, 119, 79) : color(255, 255, 255)
            btn.getChildByName("lab_text").getComponent(Label).color = is_select ? color(252, 119, 79) : color(0, 0, 0)
        }
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

    on_click_cat_game(event: Event, customEventData: string){
        const game_config = CAT_CONFIG.STORY_GAME_CONFIG.get(customEventData);
        if (!mius.gui.get_is_showing(UIID.LOAD_GAME)) {
            mius.gui.show_ui(UIID.LOAD_GAME, game_config);
        }
    }


    /** 打开系统相册 */
    pickImage(callback: (img: HTMLImageElement) => void) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";

        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => callback(img);
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        };

        document.body.appendChild(input);
        input.click();

        // 清理
        setTimeout(() => document.body.removeChild(input), 1000);
    }

    on_click_upload(){
        this.pickImage((img) => {
            const imageAsset = new ImageAsset(img);
            const texture = new Texture2D();
            texture.image = imageAsset;

            const sp = new SpriteFrame();
            sp.texture = texture;

            this.head.getComponent(Sprite).spriteFrame = sp;
        });
    }
}


