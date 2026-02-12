import { director, error, JsonAsset, warn } from "cc";
import { mius } from "../../mius";
import { LanguageLabel } from "./LanguageLabel";
import { LanguageSprite } from "./LanguageSprite";
import { BaseManager } from "../BaseManager";
import { LANG_COMMON } from "../../../lang/lang_common";
import { GlobalTool } from "../tool/global_tool";

const DEFAULT_LANGUAGE = "en";

// 需要显示阿语的label，cache mode不能修改为char

export class LanguageManager extends BaseManager {
    clean(): void {

    }

    private _support: string[] = ["en", "ar", "pt", "es", "tr", "id"];        // 支持的语言

    /** 设置多语言系统支持哪些语种 */
    public set support_languages(supportLanguages: string[]) {
        this._support = supportLanguages;
    }

    /**
     * 获取支持的多语种数组
     */
     public get support_languages(): string[] {
        return this._support;
    }



    /**
     * 
     * @returns 获取保存在本地的设置或默认语种
     */
    public get_default_language(){
        let lang = GlobalTool.get_query_params_with_name("lang");
        if (lang) {
            if (lang.includes("en")) {
                lang = "en"
            }else if (lang.includes("ar")) {
                lang = "ar"
            }else if (lang.includes("pt")) {
                lang = "pt"
            }else if (lang.includes("es")) {
                lang = "es"
            }else if (lang.includes("tr")) {
                lang = "tr"
            }else if (lang.includes("id")) {
                lang = "id"
            }
        }

        if (lang == null) {
            lang = mius.storage.get_string_for_key("local_language_key");            
        }
        if (lang == null) {
            lang = DEFAULT_LANGUAGE
        }
        if (this.support_languages.indexOf(lang) < 0) {
            lang = DEFAULT_LANGUAGE;
        }
        mius.storage.set("local_language_key", lang);
        return lang;
    }


    /**
     * 获取当前语种
     */
    private _crt_lang : string = ""
    public get current_language(): string {
        return this._crt_lang;
    }
    public set current_language(lang:string){
        this._crt_lang = lang
    }

    /**已经下载的语种 */
    private _has_download_lang : string[] = []

    /**
     * 根据key获取对应语种的字符
     * @param key 
     */
    public getLangByKey(key: string): string {
        let data = LANG_COMMON.get(key)
        if (data && data[this.current_language]) {
            return data[this.current_language];
        }else {
            if (!data) {
                return key
            }
            if (!data[this.current_language]) {
                return data[DEFAULT_LANGUAGE] || key
            }
        }
        return key
    }

    public formatLangByKey(key : string, data : string){
        let str = this.getLangByKey(key)
        if (str) {
            str = str.replace(`%s`, data)
        }
        return str
    }

    /**多语言文件的路径 */
    private _lang_image_path: string = "language/image";
    set lang_image_path(value :string){this._lang_image_path = value}
    get lang_image_path(){return this._lang_image_path}

    /**
     * 改变语种，会自动下载对应的语种，下载完成回调
     * @param language 
     */
    public setLanguage(language: string, callback?: (success: boolean) => void) {
        if (!language) {
            language = DEFAULT_LANGUAGE;
        }
        language = language.toLowerCase();
        let index = this.support_languages.indexOf(language);
        if (index < 0) {
            warn("do not support language : " + language + ", change to english");
            language = DEFAULT_LANGUAGE;
        }
        if (language === this.current_language) {
            callback && callback(true);
            return;
        }

        if (this._has_download_lang.indexOf(language) >= 0) {
            this.current_language = language;
            mius.storage.set("local_language_key", language);
            this.update_all_object();
            mius.event.dispatchEvent(mius.evt.LANG_EVT.CHANGE, language);
            callback && callback(true);
            return;
        }

        this.load_language_assets(language, (err: any, lang: string) => {
            if (err) {
                error(`language [${language}] assets download failed`, err);
                callback && callback(false);
                return;
            }

            this.current_language = language;
            mius.storage.set("local_language_key", lang);
            this._has_download_lang.push(lang);
            this.update_all_object()
            mius.event.dispatchEvent(mius.evt.LANG_EVT.CHANGE, lang);
            callback && callback(true);
        });
    }


    private update_all_object(){
        let rootNodes = director.getScene()!.children;
        for (let i = 0; i < rootNodes.length; ++i) {
            // 更新所有的LanguageLabel节点
            let languagelabels = rootNodes[i].getComponentsInChildren(LanguageLabel);
            for (let j = 0; j < languagelabels.length; j++) {
                languagelabels[j].update_language();
            }
            // 更新所有的LanguageSprite节点
            let languagesprites = rootNodes[i].getComponentsInChildren(LanguageSprite);
            for (let j = 0; j < languagesprites.length; j++) {
                languagesprites[j].update_language();
            }
        }
    }


    /**
     * 下载语言包素材资源
     * 包括语言json配置和语言纹理包
     * @param lang 
     * @param callback 
     */
    private load_language_assets(lang: string, callback: Function) {
        lang = lang.toLowerCase();
        let lang_texture_path = `${this._lang_image_path}/${lang}`;
        const parts = lang_texture_path.split(':');

        if (parts.length == 2) {
            mius.res.loadDir( parts[0], parts[1], (err: any) => {
                if (err) {
                    callback(err);
                    return;
                }
                mius.log.logBusiness( `download language image assets [${lang_texture_path}] succeed!!`);
                callback(err, lang);
            })
        }else{
            mius.res.loadDir(lang_texture_path, (err: any) => {
                if (err) {
                    callback(err);
                    return;
                }
                mius.log.logBusiness( `download language image assets [${lang_texture_path}] succeed!!`);
                callback(err, lang);
            })
        }
    }


    /**
     * 释放不需要的语言包资源
     * @param lang 
     */
    public release_language_assets(lang: string) {
        lang = lang.toLowerCase();
        let langpath = `${this._lang_image_path}/${lang}`;
        const parts = langpath.split(':');
        if (parts.length == 2) {
            mius.res.releaseDir(parts[1], parts[0]);
        }else{
            mius.res.releaseDir(langpath);
        }
        mius.log.logBusiness( `release language texture assets ${langpath}` );

        mius.event.dispatchEvent(mius.evt.LANG_EVT.RELEASE_RES, lang);
    }

}