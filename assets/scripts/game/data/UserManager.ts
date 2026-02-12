import { BaseManager } from "../../core/common/BaseManager";
import { GlobalTool } from "../../core/common/tool/global_tool";
import { mius } from "../../core/mius";

export class UserManager extends BaseManager {
    constructor() {
        super()

        //从url中获取参数
        let uid = GlobalTool.get_query_params_with_name("uid");
        if (uid && parseInt(uid)) {
            this._uid = parseInt(uid);
        }

        let token = GlobalTool.get_query_params_with_name("token");
        if (token) {
            this.token = token;
        }

        let room_id = GlobalTool.get_query_params_with_name("roomid");
        if (room_id && parseInt(room_id)) {
            this.room_id = parseInt(room_id);
        }

        let lang = GlobalTool.get_query_params_with_name("lang");
        if (lang) {
            this.lang = lang;
        }

        let test_host = GlobalTool.get_query_params_with_name("test_host");
        if (test_host) {
            this.test_host = test_host;
        }

        let limit_play_level = GlobalTool.get_query_params_with_name("gameLevel");
        if (limit_play_level && parseInt(limit_play_level)) {
            this.limit_play_level = parseInt(limit_play_level);
        }

        let partition = GlobalTool.get_query_params_with_name("partition");
        if (partition) {
            this.region_id = partition;
        }

        mius.log.logModel("链接参数：" + "uid:" + this.uid + " token:" + this.token + " room_id:" + this.room_id + " lang:" + this.lang)
    }

    private _lang : string = "en-US";
    set lang(value: string) {this._lang = value;}
    get lang() {return this._lang;}

    private _room_id : number = 0;
    set room_id(value: number) {this._room_id = value;}
    get room_id() {return this._room_id;}

    private _token : string = ""
    set token(value: string) {this._token = value;}
    get token() {return this._token;}

    private _test_host : string = ""
    set test_host(value: string) {this._test_host = value;}
    get test_host() {return this._test_host;}

    private _region_id : string = "";
    set region_id(value: string) {this._region_id = value;}
    get region_id() {return this._region_id;}

    private _uid: number = 0;
    set uid(value: number) {
        this._uid = value;
        mius.storage.set_storage_uid(value);
    }
    get uid() {return this._uid;}

    private _coin: number = 0;
    set coin(value: number) {this._coin = value;}
    get coin() {return this._coin;}

    private _nickname : string = ""
    set nickname(value: string) {this._name = value;}
    get nickname() {return this._name;}

    private _avatar : string = ""
    set avatar(value: string) {this._avatar = value;}
    get avatar() {return this._avatar;}

    private _today_win : number = 0;
    set today_win(value: number) {this._today_win = value;}
    get today_win() {return this._today_win;}

    private _limit_play_level : number = 5;
    set limit_play_level(value: number) {this._limit_play_level = value;}
    get limit_play_level() {return this._limit_play_level;}

    clean(): void {
        this._uid = 0;
        this._coin = 0;
    }
}