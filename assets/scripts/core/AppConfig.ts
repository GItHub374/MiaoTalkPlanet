import { game, JsonAsset } from "cc";
import { mius } from "./mius";
import { PUBLISH_ENV } from "../env";

/** 游戏配置静态访问类
 * 在这里加载配置，等待配置完再调用Main.run进入游戏
 */
export class AppConfig {

    /**存储密钥 */
    private storage_key : string = "hello";
    private storage_iv : string = "world";

    /**proto package */
    private _proto_package : string = "pb.";
    get proto_package() : string {
        return this._proto_package
    }

    /** 是否是测试版本 */
    public get is_debug_mode() : boolean {
        return PUBLISH_ENV == "DEBUG" // "PRODUCTION"
    }

    public get is_print_log() : boolean {
        return this.is_debug_mode;
    }
    

    /** 客户端版本号配置 */
    get version(): string {
        return this._data["config"]["version"];
    }


    /** 本地存储内容加密 key */
    get storageKey(): string {
        return this.storage_key;
    }
    /** 本地存储内容加密 iv */
    get storageIV(): string {
        return this.storage_iv;
    }


    /** Http 服务器地址 */
    get httpServer(): string {
        return this._data.config.httpServer;
    }
    /** Http 请求超时时间 */
    get httpTimeout(): number {
        return this._data.config.httpTimeout;
    }


    private _data: any = null;

    public load(callback: Function) {
        //resources文件夹下面的app_config.json
        let config_name = "app_config";
        mius.res.load(config_name, JsonAsset, () => {
            var config : JsonAsset = mius.res.get(config_name)!;

            //freeze 是冻结这个对象，防止修改，只读
            this._data = Object.freeze(config.json);

            callback();
        })
    }
}