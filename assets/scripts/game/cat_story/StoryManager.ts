import { _decorator, Component } from 'cc';
import { StoryCmd } from './story_config';
const { ccclass } = _decorator;

@ccclass('StoryManager')
export class StoryManager extends Component {

    /** 剧本 */
    private _script: StoryCmd[] = [];
    /** 当前执行索引 */
    private _index: number = 0;
    /** label → index 映射 */
    private _labelMap: Map<string, number> = new Map();
    /** 标记变量 */
    private _flags: Map<string, any> = new Map();
    /** 是否等待中（对话 / 选择） */
    private _waiting: boolean = false;

    /* ================== 加载 ================== */

    public loadScript(script: StoryCmd[]) {
        this._script = script;
        this._index = 0;
        this._flags.clear();
        this._buildLabelMap();
        this.next();
    }

    private _buildLabelMap() {
        this._labelMap.clear();
        this._script.forEach((cmd, index) => {
            if (cmd.label) {
                this._labelMap.set(cmd.label, index);
            }
        });
    }

    /* ================== 主流程 ================== */

    public next() {
        if (this._waiting) return;
        if (this._index >= this._script.length) return;

        const cmd = this._script[this._index++];
        this._execute(cmd);
    }

    private _execute(cmd: StoryCmd) {
        // label 本身不执行
        if (cmd.label && !cmd.cmd) {
            this.next();
            return;
        }

        // 条件判断
        if (cmd.if && !this._checkCondition(cmd.if)) {
            this.next();
            return;
        }

        switch (cmd.cmd) {

            case 'say':
                this._waiting = true;
                // DialogueUI.show(cmd.name, cmd.text, () => {
                //     this._waiting = false;
                //     this.next();
                // });
                break;

            case 'bg':
                // BackgroundManager.set(cmd.name);
                this.next();
                break;

            case 'bgm':
                // AudioManager.playBGM(cmd.name);
                this.next();
                break;

            case 'choice':
                this._waiting = true;
                // ChoiceUI.show(cmd.options, (jumpLabel: string) => {
                //     this._waiting = false;
                //     this.jump(jumpLabel);
                // });
                break;

            case 'jump':
                this.jump(cmd.jump!);
                break;

            case 'set':
                this._setFlags(cmd.set!);
                this.next();
                break;

            default:
                this.next();
                break;
        }
    }

    /* ================== 跳转 ================== */

    public jump(label: string) {
        const idx = this._labelMap.get(label);
        if (idx === undefined) {
            console.error(`[StoryManager] label not found: ${label}`);
            return;
        }
        this._index = idx + 1;
        this.next();
    }

    /* ================== Flag / Condition ================== */

    private _setFlags(data: { [key: string]: any }) {
        Object.keys(data).forEach(key => {
            this._flags.set(key, data[key]);
        });
    }

    private _checkCondition(cond: string): boolean {
        // 简单条件解析：flag == value
        // 示例："like >= 5"
        try {
            const keys = Array.from(this._flags.keys());
            const values = keys.map(k => this._flags.get(k));
            // eslint-disable-next-line no-new-func
            const fn = new Function(...keys, `return ${cond}`);
            return !!fn(...values);
        } catch (e) {
            console.error('Condition error:', cond);
            return false;
        }
    }

    // TODO:later
    /* ================== 存档 / 读档 ================== */

    // public getSaveData() {
    //     return {
    //         index: this._index,
    //         flags: Object.fromEntries(this._flags)
    //     };
    // }

    // public loadSaveData(data: any) {
    //     this._index = data.index;
    //     this._flags = new Map(Object.entries(data.flags));
    //     this.next();
    // }
}