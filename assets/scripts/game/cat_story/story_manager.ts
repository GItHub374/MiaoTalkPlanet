import { _decorator, Component } from 'cc';
import { StoryCmd } from './story_config';
import { mius } from '../../core/mius';
import { JsonAsset } from 'cc';
const { ccclass } = _decorator;

@ccclass('story_manager')
export class story_manager extends Component {

    /** 剧本 */
    private _script: StoryCmd[] = [];
    /** 当前执行索引 */
    private _index: number = 0;
    /** label → index 映射 */
    private jump_map: Map<string, number> = new Map();
    /** 标记变量 */
    private _flags: Map<string, any> = new Map();
    /** 是否等待中（对话 / 选择） */
    private _waiting: boolean = false;

    /* ================== 加载 ================== */
    load_json( path: string, completeFunc ) {
        const bundle = mius.bundle.getBundle('story');
        if (!bundle) {
            console.error('story bundle not loaded');
            return;
        }

        bundle.load(path, JsonAsset, (err, asset) => {
            if (err || !asset) {
                console.error('load story json failed', err, path);
                return;
            }

            try {
                this.loadScript(asset.json as StoryCmd[])
                completeFunc()
            } catch (e) {
                console.error('JSON parse error', e);
            }
        });
    }

    public loadScript(script: StoryCmd[]) {
        this._script = script;
        this._index = 0;
        this._flags.clear();
        this._buildLabelMap();
        // this.next();
    }

    private _buildLabelMap() {
        this.jump_map.clear();
        this._script.forEach((cmd, index) => {
            if (cmd.jumpFlag) {
                this.jump_map.set(cmd.jumpFlag, index);
            }
        });
    }

    /* ================== 主流程 ================== */

    get_next() {
        if (this._waiting) return;
        if (this._index >= this._script.length) return;

        const cmd = this._script[this._index++];
        return cmd
    }

    public jump(label: string) {
        const idx = this.jump_map.get(label);
        if (idx === undefined) {
            console.error(`[story_manager] label not found: ${label}`);
            return;
        }
        this._index = idx;
    }

    /* ================== Flag / Condition ================== */

    _setFlags(data: { [key: string]: any }) {
        console.log("zjjjj debug _setFlags 1111", data, this._flags)
        Object.keys(data).forEach(key => {
            this._flags.set(key, data[key]);
            console.log("zjjjj debug ", key, this._flags, this._flags.get(key), data[key])
        });
        
    }

    _checkCondition(cond: { [key: string]: any }): boolean {
        // 简单条件解析：flag == value
        // 示例："like >= 5"
        try {
            let is_jump = true
            Object.keys(cond).forEach(key => {
                let value = cond[key]
                console.log("zjjjj debug ", key, this._flags,this._flags.get(key),value)
                if (this._flags.get(key) < value){
                    is_jump = false
                }
            });
            return is_jump

            // for (const [key, value] of Object.entries(cond)) {
            //     console.log(key, value);
            // }

            // for (let index = 0; index < cond.length; index++) {
            //     const element = cond[index];
                
            // }
            // const keys = Array.from(this._flags.keys());
            // const values = keys.map(k => this._flags.get(k));
            // // eslint-disable-next-line no-new-func
            // const fn = new Function(...keys, `return ${cond}`);
            // return !!fn(...values);
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