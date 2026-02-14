import { UIOpacity } from 'cc';
import { easing } from 'cc';
import { tween } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('story_main_view')
export class story_main_view extends Component {
    @property(Node)
    tb_btn: Node[] = []

    start() {
        this.show_btn_ani()
    }

    show_btn_ani() {
        for (let index = 0; index < this.tb_btn.length; index++) {
            const btn = this.tb_btn[index];
            tween(btn.getComponent(UIOpacity))
                .to(0, { opacity: 0 })
                .delay(0.2 * index) // 延迟执行
                .to(0.1, {
                    opacity: 255 // 目标透明度：完全不透明
                }, {
                    easing: easing.smooth // 缓动曲线（让动画更自然）
                })
                .start(); // 启动动画
        }
    }
}



