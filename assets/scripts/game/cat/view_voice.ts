import {_decorator,AudioClip,AudioSource,Component,instantiate,Label,Layout,Node,Prefab} from 'cc';
import { mius } from '../../core/mius';
import { CAT_CONFIG } from './cat_config';
import { Button } from 'cc';
import { UITransform } from 'cc';
import { color } from 'cc';
import { v2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('view_voice')
export class view_voice extends Component {

    @property(Prefab)
    buttonPrefab: Prefab = null!;
    
    @property(Node)
    content:Node = null!

    crt_playing_audio: string = ""

    _currentLayout: Node | null = null;

    start(){
        this.init_content()
    }

    init_content() {
        this._currentLayout = null;
        for (let i = 0; i < CAT_CONFIG.VOICE_VIEW_CONFIG.length; i++) {
            const item = CAT_CONFIG.VOICE_VIEW_CONFIG[i];
            switch (item.type) {
                case CAT_CONFIG.CONTENT_TYPE.TITLE:
                    this.createTitle(item.text!);
                    this._currentLayout = null;
                    break;

                case CAT_CONFIG.CONTENT_TYPE.VOICE:
                    if (!this._currentLayout) {
                        this._currentLayout = this.createVoiceLayout();
                    }
                    this.createVoiceButton(this._currentLayout, item.img_path!, item.voice_path!, item.text!);
                    break;
            }
        }
    }

    private createTitle(text: string) {
        const node = new Node();
        let comp = node.addComponent(UITransform);
        comp.anchorPoint = v2(0,0.5)
        const label = node.addComponent(Label);
        label.string = text;
        label.fontSize = 36;
        label.color = color(0,0,0)
        this.content.addChild(node);
        node.setPositionX(-305)
    }

    private createVoiceLayout(): Node {
        const node = new Node();
        const uiTrans = node.addComponent(UITransform);
        uiTrans.setContentSize(610, 0);   // 设置宽度，高度自动撑开
        uiTrans.anchorPoint = v2(0, 0.5)

        const layout = node.addComponent(Layout);
        layout.type = Layout.Type.GRID;           // ⭐ 改成 GRID
        layout.startAxis = Layout.AxisDirection.HORIZONTAL;
        layout.resizeMode = Layout.ResizeMode.CONTAINER;
        layout.spacingX = 90;
        layout.spacingY = 20;
        layout.constraint = Layout.Constraint.FIXED_COL; // ⭐ 固定列数
        layout.constraintNum = 3;                            // ⭐ 每行3个
        this.content.addChild(node);
        layout.updateLayout();
        return node;
    }

    private createVoiceButton(parent: Node, imgPath: string, voicePath: string, text: string) {
        const btnNode = instantiate(this.buttonPrefab);
        parent.addChild(btnNode);
        btnNode.getChildByName("img").setSpriteFrame(imgPath)

        const lab_text = btnNode.getChildByName("lab_text").getComponent(Label);
        lab_text.string = text

        // 点击播放声音
        btnNode.on(Button.EventType.CLICK, () => {
            if (this.crt_playing_audio == voicePath) {
                this.stop_audio()
                this.crt_playing_audio = ""
            } else {
                this.crt_playing_audio = voicePath
                this.play_audio_cat(voicePath);
            }
        });
    }

    play_audio_cat(audio_path: string) {
        let bundle_cat = mius.bundle.getBundle("cat")
        let comp = this.getComponent(AudioSource)
        comp.pause();
        bundle_cat.load(audio_path, AudioClip, (err, clip) => {
            if (err) {
                console.error(err);
                return;
            }
            comp.clip = clip;
            comp.play();
            const duration = clip.getDuration() + 0.05
            this.scheduleOnce(() => {
                this.crt_playing_audio = ""
            }, duration);
        });
    }

    stop_audio() {
        let comp = this.getComponent(AudioSource)
        comp.stop();
        this.unscheduleAllCallbacks()
    }
}