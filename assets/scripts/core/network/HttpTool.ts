import { assert, error, warn } from "cc";
import { mius } from "../mius";

export class HttpTool {
    /** 请求超时时间 ms */
    public timeout: number = 10000;

    private requesting_urls: any = {};                      // 当前请求地址集合
    private requesting_params: any = {};                 // 请求参数


    clean(){
        for (let i = 0; i < this.requesting_urls.length; i++) {
            let xhr = this.requesting_urls[i];
            xhr.abort();
        }
        this.requesting_urls = {};
        this.requesting_params = {};
    }

    /**
     * HTTP GET请求
     * 例：
     * 
     * Get
        var complete = function(response){
            LogWrap.log(response);
        }
        var error = function(response){
            LogWrap.log(response);
        }
        this.get(url, complete, error);
    */
    public get(url: string, completeCallback: Function, errorCallback: Function) {
        this.sendRequest(url, null, false, completeCallback, errorCallback)
    }
    public getWithParams(url: string, params: any, completeCallback: Function, errorCallback: Function) {
        this.sendRequest(url, params, false, completeCallback, errorCallback)
    }

    public getByArraybuffer(url: string, completeCallback: Function, errorCallback: Function) {
        this.sendRequest(url, null, false, completeCallback, errorCallback, 'arraybuffer', false);
    }
    public getWithParamsByArraybuffer(url: string, params: any, completeCallback: Function, errorCallback: Function) {
        this.sendRequest(url, params, false, completeCallback, errorCallback, 'arraybuffer', false);
    }

    /** 
     * HTTP POST请求
     * 例：
     *      
     * Post
        var param = '{"LoginCode":"donggang_dev","Password":"e10adc3949ba59abbe56e057f20f883e"}'
        var complete = function(response){
                var jsonData = JSON.parse(response);
                var data = JSON.parse(jsonData.Data);
            LogWrap.log(data.Id);
        }
        var error = function(response){
            LogWrap.log(response);
        }
        this.post(name, param, complete, error);
    */
    public post(name: string, params: any, completeCallback?: Function, errorCallback?: Function) {
        this.sendRequest(name, params, true, completeCallback, errorCallback);
    }

    /** 取消请求中的请求 */
    public abort(url: string) {
        var xhr = this.requesting_urls[url];
        if (xhr) {
            xhr.abort();
        }
    }

    /**
     * 获得字符串形式的参数
     */
    private getParamString(params: any) {
        var result = "";
        for (var name in params) {
            let data = params[name];
            if (data instanceof Object) {
                for (var key in data)
                    result += `${key}=${data[key]}&`;
            }
            else {
                result += `${name}=${data}&`;
            }
        }

        return result.substring(0, result.length - 1);
    }

    /** 
     * Http请求 
     * @param url(string)              请求地址
     * @param params(JSON)              请求参数
     * @param isPost(boolen)            是否为POST方式
     * @param callback(function)        请求成功回调
     * @param errorCallback(function)   请求失败回调
     * @param responseType(string)      响应类型
     */
    private sendRequest(url: string,
        params: any,
        isPost: boolean,
        completeCallback?: Function,
        errorCallback?: Function,
        responseType?: string,
        isOpenTimeout = true,
        timeout: number = this.timeout) {
        if (url == null || url == '') {
            mius.log.logError("http request url is null or empty");
            return;
        }

        let req_url: string, params_str: string;
        if (!url.toLocaleLowerCase().startsWith("http")) {
            mius.log.logError("http request url must start with http or https");
            return
        }

        if (params) {
            params_str = this.getParamString(params);
            if (url.indexOf("?") > -1)
                req_url = url + "&" + params_str;
            else
                req_url = url + "?" + params_str;
        }else {
            req_url = url;
        }

        if (this.requesting_urls[req_url] != null && this.requesting_params[req_url] == params_str!) {
            mius.log.logError(`http request [${url}] is in requesting, should not send repeat`);
            return;
        }

        let xhr = new XMLHttpRequest();

        // 防重复请求功能
        this.requesting_urls[req_url] = xhr;
        this.requesting_params[req_url] = params_str!;

        if (isPost) {
            xhr.open("POST", url);
        }
        else {
            xhr.open("GET", req_url);
        }
        //这句必须在open后面
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        let _event: any = {};
        _event.url = url;
        _event.params = params;

        // 请求超时
        if (isOpenTimeout) {
            xhr.timeout = timeout;
            xhr.ontimeout = () => {
                this.deleteCache(req_url);

                _event.event = mius.evt.HTTP_EVT.TIMEOUT;

                if (errorCallback) errorCallback(_event);
            }
        }

        xhr.onloadend = (a) => {
            if (xhr.status == 500) {
                this.deleteCache(req_url);

                if (errorCallback == null) return;

                _event.event = mius.evt.HTTP_EVT.NO_NETWORK;          // 断网

                if (errorCallback) errorCallback(_event);
            }
        }

        xhr.onerror = () => {
            this.deleteCache(req_url);

            if (errorCallback == null) return;

            if (xhr.readyState == 0 || xhr.readyState == 1 || xhr.status == 0) {
                _event.event = mius.evt.HTTP_EVT.NO_NETWORK;          // 断网 
            }
            else {
                _event.event = mius.evt.HTTP_EVT.UNKNOWN_ERROR;       // 未知错误
            }

            if (errorCallback) errorCallback(_event);
        };

        xhr.onprogress = (ev:ProgressEvent)=>{
            mius.log.logNet( ev.loaded + " " + ev.total + " " + ev.lengthComputable)
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;

            this.deleteCache(req_url);

            if (xhr.status == 200) {
                if (responseType == 'arraybuffer') {
                    if (completeCallback) completeCallback(xhr.response);
                }
                else {
                    let data: any = JSON.parse(xhr.response);
                    // if (data.code != null) {
                        /** 服务器错误码处理 */
                        // if (data.code == 0) {
                        //     if (completeCallback) completeCallback(data.data);
                        // }
                        // else {
                        //     if (errorCallback) errorCallback(data);
                        // }
                    // }
                    // else {
                        if (completeCallback) completeCallback(data);
                    // }
                }
            }
        };

        if (params == null || params == "") {
            xhr.send();
        }
        else {
            xhr.send(params_str!);                // 根据服务器接受数据方式做选择
        }
    }

    private deleteCache(url: string) {
        delete this.requesting_urls[url];
        delete this.requesting_params[url];
    }
}