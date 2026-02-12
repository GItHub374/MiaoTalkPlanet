import { CCString, Component, error, Label, RichText, warn, _decorator } from "cc";
import { mius } from "../../mius";
import { HorizontalTextAlignment } from "cc";
import { CCBoolean } from "cc";

const { ccclass, property, menu } = _decorator;

/**
 * 多语言文案中的参数
 * 比如 "hello world %s1, %s2"
 */
@ccclass("LangLabelParams")
export class LangLabelParams {
    @property
    key: string = "";
    @property
    value: string = "";
}

@ccclass("LanguageLabel")
@menu('ui/language/LanguageLabel')
export class LanguageLabel extends Component {
    @property({
        type: LangLabelParams,
        displayName: "params"
    })
    private _params: Array<LangLabelParams> = [];

    @property({
        type: LangLabelParams,
        displayName: "params"
    })
    set params(value: Array<LangLabelParams>) {
        this._params = value;
        this._needUpdate = true;
    }
    get params(): Array<LangLabelParams> {
        return this._params || [];
    }



    @property({ serializable: true })
    private _lang_key: string = "";
    @property({ type: CCString, serializable: true })
    get langKey(): string {
        return this._lang_key || "";
    }
    set langKey(value: string) {
        this._lang_key = value;
        this._needUpdate = true;
    }

    @property({ tooltip : "阿语是否右对齐" })
    private ar_right_align: boolean = false;


    get_language_text(): string {
        let _string = mius.language.getLangByKey(this._lang_key);
        if (_string && this._params.length > 0) {
            this._params.forEach((item: LangLabelParams) => {
                _string = _string.replace(`${item.key}`, item.value)
            })
        }
        if (!_string) {
            warn("[LanguageLabel] 未找到语言标识，使用langKey替换");
            _string = this._lang_key;
        }
        return _string;
    }


    /** 更新语言 */
    update_language() {
        this._needUpdate = true;
    }



    onLoad() {
        this._needUpdate = true;
        if (!this.getComponent(Label) && !this.getComponent(RichText)) {
            error(this.node.name, this._lang_key);
            return;
        }
    }

    /**
     * 修改多语言参数，采用惰性求值策略
     * @param key 对于i18n表里面的key值
     * @param value 替换的文本
     */
    update_variable(key: string, value: string) {
        let haskey = false;
        for (let i = 0; i < this._params.length; i++) {
            let element: LangLabelParams = this._params[i];
            if (element.key === key) {
                element.value = value;
                haskey = true;
            }
        }
        if (!haskey) {
            let ii = new LangLabelParams();
            ii.key = key;
            ii.value = value;
            this._params.push(ii);
        }
        this._needUpdate = true;
    }
    private _needUpdate: boolean = false;

    update() {
        if (this._needUpdate) {
            this.update_label();
            this._needUpdate = false;
        }
    }

    update_label() {
        if (!this._lang_key) {
            return;
        }

        let spcomp: any = this.getComponent(Label);
        if (!spcomp) {
            spcomp = this.getComponent(RichText);
            if (!spcomp) {
                warn("this node does not contain Label or Richtext Component");
                return;
            }
        }

        spcomp.string = this.get_language_text();

        if (mius.language.current_language == "ar" && this.ar_right_align) {
            spcomp.horizontalAlign = HorizontalTextAlignment.RIGHT;
        }
    }
}