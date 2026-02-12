// =============================
// game_cell.ts 单个方块脚本（2048 专用）
// 功能：数值显示 / 颜色切换 / 出生与合并动画
// =============================


import { _decorator, Component, Label, Sprite, Color, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('game_cell')
export class game_cell extends Component {


    @property(Label)
    label: Label = null!;


    @property(Sprite)
    bg: Sprite = null!;


    private _value = 0;


    /** 设置数值 */
    setValue(v: number) {
        this._value = v;
        this.label.string = v > 0 ? v.toString() : '';
        this.updateColor();
    }


    get value() {
        return this._value;
    }


    /** 根据数值更新颜色 */
    updateColor() {
        const map: Record<number, Color> = {
            2: new Color(238, 228, 218),
            4: new Color(237, 224, 200),
            8: new Color(242, 177, 121),
            16: new Color(245, 149, 99),
            32: new Color(246, 124, 95),
            64: new Color(246, 94, 59),
            128: new Color(237, 207, 114),
            256: new Color(237, 204, 97),
            512: new Color(237, 200, 80),
            1024: new Color(237, 197, 63),
            2048: new Color(237, 194, 46),
        };
        this.bg.color = map[this._value] || new Color(60, 58, 50);
        this.label.color = this._value <= 4 ? new Color(119, 110, 101) : Color.WHITE;
    }


    /** 出生动画 */
    playSpawn() {
        this.node.setScale(new Vec3(0, 0, 1));
        tween(this.node)
            .to(0.15, { scale: new Vec3(1, 1, 1) })
            .start();
    }


    /** 合并动画 */
    playMerge() {
        tween(this.node)
            .to(0.08, { scale: new Vec3(1.15, 1.15, 1) })
            .to(0.08, { scale: new Vec3(1, 1, 1) })
            .start();
    }
}