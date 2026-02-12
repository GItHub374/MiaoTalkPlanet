import { sys } from "cc";
import { PREVIEW } from "cc/env";
import { EncryptUtil } from "../encrypt/EncryptUtil";
import { md5 } from "../encrypt/Md5";
import { mius } from "../../mius";
import { BaseManager } from "../BaseManager";

export class StorageManager extends BaseManager {
    private _key: string | null = null;
    private _iv: string | null = null;
    private _uid: number = 0;

    clean(): void {
        this._uid = 0;
    }

    /**
     * 初始化密钥
     * @param key aes加密的key 
     * @param iv  aes加密的iv
     */
    init(key: string, iv: string) {
        this._key = md5(key);
        this._iv = md5(iv);
    }

    /**
     * 设置用户标识
     * @param id 
     */
    set_storage_uid(id: number) {
        this._uid = id;
    }

    /**
     * 存储
     * @param key 存储key
     * @param value 存储值
     * @param with_uid 是否带有用户标识
     * @returns 
     */
    set(key: string, value: any, with_uid : boolean = true) {
        if (null == key) {
            mius.log.logError("storage key can not be null");
            return;
        }
        let keyword = `${key}_${this._uid}`;
        if (!with_uid) {
            keyword = key;
        }

        if (!mius.app_config.is_debug_mode) {
            keyword = md5(keyword);
        }
        if (null == value) {
            mius.log.logError("storage value is null, remove element");
            this.remove(key);
            return;
        }
        if (typeof value === 'function') {
            mius.log.logError("storage value can not be function");
            return;
        }
        if (typeof value === 'object') {
            try {
                value = JSON.stringify(value);
            }
            catch (e) {
                mius.log.logError(`decode failed, str = ${value}`);
                return;
            }
        }
        else if (typeof value === 'number') {
            value = value + "";
        }
        if (!mius.app_config.is_debug_mode && null != this._key && null != this._iv) {
            try {
                value = EncryptUtil.aesEncrypt(value, this._key, this._iv);
            }
            catch (e) {
                value = null;
            }
        }
        sys.localStorage.setItem(keyword, value);
    }

    /**
     * 获取
     * @param key 获取的key
     * @param defaultValue 获取的默认值
     * @returns 
     */
    private get(_key: string, defaultValue : any = "", with_uid : boolean = true) {
        if (null == _key) {
            mius.log.logError("storage key can not be null");
            return;
        }

        let key = `${_key}_${this._uid}`;
        if (!with_uid) {
            key = _key
        }

        if (!mius.app_config.is_debug_mode) {
            key = md5(key);
        }
        let str: string | null = sys.localStorage.getItem(key);
        if (null != str && '' !== str && !mius.app_config.is_debug_mode && null != this._key && null != this._iv) {
            try {
                str = EncryptUtil.aesDecrypt(str, this._key, this._iv);
            }
            catch (e) {
                str = null;
            }
        }
        if (null == str) {
            return defaultValue;
        }
        return str;
    }

    /**获取指定关键字的字符串
     * 
     */
    get_string_for_key(key: string, default_value: string = "", with_uid : boolean = true): string {
        return this.get(key, default_value, with_uid);
    }

    /**
     * 获取指定关键字的数值
     * @param key 
     * @param default_value 
     * @returns 
     */
    get_number_for_key( key : string, default_value : number = 0, with_uid : boolean = true ) : number {
        let str = this.get(key, default_value, with_uid);
        return Number(str) || default_value;
    }

    /**
     * 获取指定关键字的布尔值
     * @param key 
     * @returns 
     */
    get_boolean_for_key( key : string, with_uid : boolean = true ) : boolean {
        let str = this.get(key, false, with_uid);
        return Boolean(str) || false;
    }

    /**
     * 获取指定关键字的json对象
     * @param key 
     * @param default_value 
     * @returns 
     */
    get_json_for_key( key : string, default_value : any = null, with_uid : boolean = true ) : any {
        var r = this.get(key, default_value, with_uid);
        return (r && JSON.parse(r)) || default_value;
    }

    /**
     * 移除某个值
     * @param key 需要移除的key 
     * @returns 
     */
    remove(key: string, with_uid : boolean = true) {
        if (null == key) {
            mius.log.logError("storage remove key can not be null");
            return;
        }

        let keyword = `${key}_${this._uid}`;
        if (!with_uid) {
            keyword = key;
        }

        if (!mius.app_config.is_debug_mode) {
            keyword = md5(keyword);
        }
        sys.localStorage.removeItem(keyword);
    }

    /**
     * 清空整个本地存储
     */
    clear() {
        sys.localStorage.clear();
    }
}