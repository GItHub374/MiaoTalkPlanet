import { AudioClip, AudioSource, error, _decorator } from 'cc';
import { mius } from '../../mius';
const { ccclass, menu } = _decorator;


@ccclass('AudioEffect')
export class AudioEffect extends AudioSource {
    private effects: Map<string, AudioClip> = new Map<string, AudioClip>();

    private _load_callback( url : string, data : AudioClip, callback? : Function ){
        this.effects.set(url, data);
        if (mius.audio.switchEffect) {
            this.playOneShot(data, this.volume);            
        }
        callback && callback();
    }

    /**
     * 加载音效并播放
     * @param url           音效资源地址
     * @param callback      资源加载完成并开始播放回调
     */
    load(url: string, callback?: Function) {
        const parts = url.split(':');
        if (parts.length == 2) {
            mius.res.load(parts[0], parts[1], AudioClip, (err: Error | null, data: AudioClip) => {
                if (err) {
                    error(err);
                }
                this._load_callback(url, data, callback);
            });
        }else{
            mius.res.load(url, AudioClip, (err: Error | null, data: AudioClip) => {
                if (err) {
                    error(err);
                }
                this._load_callback(url, data, callback);
            });
        }
    }

    /** 释放所有已使用过的音效资源 */
    release() {
        for (let key in this.effects) {
            mius.res.release(key);
        }
        this.effects.clear();
    }
}