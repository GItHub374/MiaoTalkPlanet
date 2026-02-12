import { Component, director, game, Game, log, Node, view, _decorator } from "cc";
import { UIComponent } from "./layer/UIComponent";

const { ccclass, property } = _decorator;

@ccclass('GameRoot')
export class GameRoot extends UIComponent {


    // @property({
    //     type: Node,
    //     tooltip: "界面层"
    // })
    // gui: Node | null = null;

    // onLoad() {
    //     //在web平台，这两个事件不会百分百触发，取决于浏览器的回调行为
    //     game.on(Game.EVENT_HIDE, this.on_background, this);
    //     game.on(Game.EVENT_SHOW, this.on_foreground, this);
        
    //     this.init();
    // }

    // protected init() {

    // }

    // update(dt: number) {
    // }

    // /** 加载完引擎配置文件后执行 */
    // protected run() {

    // }


    // /**进入后台 */
    // protected on_background() {
    //     mius.log.trace("on_background")
    //     mius.event.dispatchEvent(mius.evt.SYS_EVT.BACKGROUND)
    // }

    // /**进入前台 */
    // protected on_foreground() {
    //     mius.log.trace("on_foreground")
    //     mius.event.dispatchEvent(mius.evt.SYS_EVT.FOREGROUND)
    // }
}
