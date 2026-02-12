import { AudioClip, AudioSource, _decorator, error } from "cc";
import { mius } from "../../mius";
const { ccclass, menu } = _decorator;

@ccclass('AudioMusic')
export class AudioMusic extends AudioSource {
    /** 背景音乐播放完成回调 */
    onComplete: Function | null = null;

    private _progress : number = 0;

    private _url : string = null!;

    private _isPlaying : boolean = false;

    /** 获取音乐播放进度 */
    get progress() : number {
        if (this.duration > 0) {
            this._progress = this.currentTime / this.duration;
        }
        return this._progress;
    }

    /**
     * 设置音乐当前播放进度
     * @param value     进度百分比0到1之间
     */
    set progress(value : number) {
        this._progress = value;
        this.currentTime = this.duration * value;
    }


    private analyzeUrl(url: string) {
        const parts = url.split(':');
        
    }


    private _load_callback( url: string, data : AudioClip, callback? : Function ){
        if (this.playing) {
            this._isPlaying = false
            this.stop()
        }

        if (this._url) {
            mius.res.release(this._url)
        }

        this.enabled = true
        this.clip = data

        callback && callback()

        // if (mius.audio.switchMusic) {
            this.play()            
        // }

        this._url = url
    }

    /**
     * 加载音乐并播放
     * @param url          音乐资源地址，在bundle里面的 [bundlename]:[path]
     * @param callback     加载完成回调
     */
    public load(url : string, callback? : Function) {
        const parts = url.split(':');
        if (parts.length == 2) {
            mius.res.load( parts[0], parts[1], AudioClip, (err : Error | null, data : AudioClip) => {
                if (err) {
                    error(err);
                }
                this._load_callback(url, data, callback)
            } )                
        }else{
            mius.res.load( url, AudioClip, (err : Error | null, data : AudioClip) => {
                if (err) {
                    error(err);
                }
                this._load_callback(url, data, callback)
            } )    
        }
    }


    /** cc.Component 生命周期方法，验证背景音乐播放完成逻辑，建议不要主动调用 */
    update(dt: number) {
        if (this.currentTime > 0) {
            this._isPlaying = true;
        }

        if (this._isPlaying && this.playing == false) {
            this._isPlaying = false;
            this.enabled = false
            this.onComplete && this.onComplete();
        }
    }

    /** 释放当前背景音乐资源 */
    public realease() {
        if (this._url) {
            mius.res.release(this._url)
            this._url = null!
        }
    }
}