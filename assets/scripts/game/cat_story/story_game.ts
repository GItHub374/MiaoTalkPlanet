import { _decorator, Component, Node } from 'cc';
import { story_manager } from './story_manager';
import { StoryCmd } from './story_config';
import { story_chat_view } from './story_chat_view';
import { story_choose_view } from './story_choose_view';
import { mius } from '../../core/mius';
import { UIID } from '../config/ui_config';
import { UIComponent } from '../../core/ui/layer/UIComponent';
const { ccclass, property } = _decorator;

@ccclass('story_game')
export class story_game extends UIComponent {
    @property(Node)
    node_main: Node = null!

    @property(Node)
    node_chat: Node = null!

    @property(Node)
    node_bg: Node = null!
    
    @property(Node)
    node_choose: Node = null!

    @property(story_manager)
    story_manager: story_manager = null!


    add_listener() {
        this.on_evt(mius.evt.STORY_EVT.QUIT_GAME, this.hide_myself, this)
    }

    /** 是否等待中（对话 / 选择） */
    private _waiting: boolean = false;
    start() {
        // mius.res.loadDir("story", "images", () => {
            this.show_game_view()
        // });
    }

    show_main_view(){
        this.node_main.active = true
        this.node_chat.active = false
        this.node_choose.active = false
    }

    show_game_view(){
        this.node_main.active = false
        this.node_chat.active = false
        this.node_choose.active = false
        this.story_manager.load_json("scripts/story_game_config", () => {
            this.next_step()
        })
    }

    next_step() {
        let cmd = this.story_manager.get_next()
        console.log("next_step", cmd)
        this.execute_cmd(cmd)
    }

    execute_cmd(cmd: StoryCmd) {
        // label 本身不执行
        console.log(cmd)
        if (cmd.jumpFlag && !cmd.cmd) {
            this.next_step();
            return;
        }

        // 条件判断
        if (cmd.if && !this.story_manager._checkCondition(cmd.if)) {
            this.next_step();
            return;
        }

        switch (cmd.cmd) {
            case 'say':
                this._waiting = true;
                console.log('say',cmd.name, cmd.text)
                this.deal_chat_cmd(cmd.name, cmd.text)
                // DialogueUI.show(cmd.name, cmd.text, () => {
                //     this._waiting = false;
                //     this.next_step();
                // });
                break;

            case 'bg':
                // BackgroundManager.set(cmd.name);
                console.log('bg', cmd.name)
                this.deal_bg_cmd(cmd.name)
                this.next_step();
                break;

            case 'bgm':
                // AudioManager.playBGM(cmd.name);
                console.log('bgm', cmd.name)
                this.next_step();
                break;

            case 'choice':
                this._waiting = true;
                this.deal_choose_cmd(cmd.options)
                // ChoiceUI.show(cmd.options, (jumpLabel: string) => {
                //     this._waiting = false;
                //     this.story_manager.jump(jumpLabel);
                // });
                break;

            case 'jump':
                this.deal_jump_cmd(cmd.jumpTo)
                break;

            case 'set':
                this.story_manager._setFlags(cmd.set!);
                this.next_step();
                break;

            case 'exit':
                this.deal_exit_cmd()
                break;

            default:
                this.next_step();
                break;
        }
    }

    deal_chat_cmd(name,contact){
        this.node_chat.active = true
        this.node_chat.getComponent(story_chat_view)!.say_func(name, contact)
    }

    deal_bg_cmd(name){
        this.node_bg.active = true
        this.node_bg.setSpriteFrame(name)
    }

    deal_choose_cmd(options){
        this.node_choose.active = true
        this.node_choose.getComponent(story_choose_view)!.update_choose(options, this.choose_callback.bind(this))
    }

    deal_exit_cmd(){
        this.show_main_view()
    }

    deal_jump_cmd(jumpLabel: string){
        console.log("deal_jump_cmd", jumpLabel)
        this.story_manager.jump(jumpLabel);
        this.next_step();
    }

    choose_callback(jumpLabel: string){
        this.node_choose.active = false
        this.deal_jump_cmd(jumpLabel);
    }

    on_click_next() {
        this.next_step()
    }

    on_click_start(){
        this.show_game_view()
    }

    on_click_setting(){
        mius.gui.show_ui(UIID.STORY_SETTING);
    }
}



