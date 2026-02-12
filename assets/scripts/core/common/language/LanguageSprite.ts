import { CCString, Component, Size, Sprite, SpriteFrame, UITransform, _decorator } from "cc";
import { mius } from "../../mius";

const { ccclass, property, menu } = _decorator;

@ccclass("LanguageSprite")
@menu('ui/language/LanguageSprite')
export class LanguageSprite extends Component {
    @property({ serializable: true, tooltip: "文件名"})
    private _langKey: string = "";
    @property({ type: CCString, serializable: true })
    get langKey(): string {
        return this._langKey || "";
    }
    set langKey(value: string) {
        this._langKey = value;
        this.update_sprite();
    }

    @property({
        tooltip: "是否设置为图片原始资源大小"
    })
    private isRawSize: boolean = true;

    start() {
        this.update_sprite();
    }

    /** 更新语言 */
    update_language() {
        this.update_sprite(); 
    }

    private update_sprite() {
        // 获取语言标记
        let lang_path = mius.language.lang_image_path
        let path = `${lang_path}/${mius.language.current_language}/${this.langKey}/spriteFrame`;
        let res: SpriteFrame | null = null;

        const parts = path.split(':');
        if (parts.length == 2) {
            res = mius.res.get(parts[1], SpriteFrame, parts[0]);               
        }else{
            res = mius.res.get(path, SpriteFrame);
        }
        if (!res) {
            mius.log.logBusiness(`language sprite ${path} not exist`);
        }
        else {
            let spcomp: Sprite = this.getComponent(Sprite)!;
            spcomp.spriteFrame = res;

            /** 修改节点为原始图片资源大小 */
            if (this.isRawSize) {
                //@ts-ignore
                let rawSize = res._originalSize as Size;
                spcomp.getComponent(UITransform)?.setContentSize(rawSize);
            }
        }
    }
}