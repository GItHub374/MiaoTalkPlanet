import { Component } from "cc";
import { AudioMusic } from "./AudioMusic";
import { AudioEffect } from "./AudioEffect";
import { mius } from "../../mius";
import { BaseManager } from "../BaseManager";

const LOCAL_AUDIO_STORAGE_KEY = "local_game_audio"

export class AudioManager extends BaseManager {

    private music: AudioMusic = null!;
    private _volume_music : number = 1;
    private _switch_music : boolean = true;

    private effect : AudioEffect = null!;
    private _volume_effect : number = 1;
    private _switch_effect : boolean = true;

    clean(): void {
        
    }

    /**
     * 设置背景音乐播放完成回调
     * @param callback 背景音乐播放完成回调
     */
    setMusicComplete(callback: Function | null = null) {
        this.music.onComplete = callback;
    }

    load_data_for_music_volume() {
        this.volumeMusic = Number(mius.storage.get_string_for_key("cat_music_volume", "1"))
        this.volumeEffect = Number(mius.storage.get_string_for_key("cat_effect_volume", "1"))
    }


    /**
     * 播放背景音乐
     * @param url        资源地址
     * @param loop       是否循环播放
     * @param callback   音乐加载完成事件
     */
    playMusic(url: string, loop : boolean = true, callback?: Function) {
        // if (this._switch_music) {
            this.music.load(url, callback);
            if (loop) {
                this.setMusicComplete(() => {
                    this.playMusic(url, loop, callback);
                })
            }
        // }
    }

    set_effect_volume(){
        this.effect.volume = this._volume_effect;
    }

    set_music_volume(){
        this.music.volume = this._volume_music;
    }

    /**
     * 获取背景音乐播放进度
     */
    get progressMusic(): number {
        return this.music.progress;
    }

    /**
     * 设置背景乐播放进度
     * @param value     播放进度值
     */
    set progressMusic(value: number) {
        this.music.progress = value;
    }

    /**
     * 获取背景音乐音量
     */
    get volumeMusic(): number {
        return this._volume_music;
    }
    /** 
     * 设置背景音乐音量
     * @param value     音乐音量值
     */
    set volumeMusic(value: number) {
        this._volume_music = value;
        this.music.volume = value;
        mius.storage.set("cat_music_volume", value.toString())

        mius.event.dispatchEvent(mius.evt.SYS_EVT.MUSIC_VOLUME)
    }

    /** 
     * 获取背景音乐开关值 
     */
    get switchMusic(): boolean {
        return this._switch_music;
    }
    /** 
     * 设置背景音乐开关值
     * @param value     开关值
     * 这个主题没有音量开关
     */
    set switchMusic(value: boolean) {
        this._switch_music = true;
        this.save()

        // if (value == false)
        //     this.music.stop();

        mius.event.dispatchEvent( mius.evt.SYS_EVT.MUSIC_SWITCH )
    }


    /**
     * 播放音效
     * @param url        资源地址
     */
    playEffect(url: string) {
        if (this._switch_effect) {
            this.effect.load(url);
        }
    }

    /** 
     * 获取音效音量 
     */
    get volumeEffect(): number {
        return this._volume_effect;
    }
    /**
     * 设置获取音效音量
     * @param value     音效音量值
     */
    set volumeEffect(value: number) {
        this._volume_effect = value;
        this.effect.volume = value;
        mius.storage.set("cat_effect_volume", value.toString())
        mius.event.dispatchEvent(mius.evt.SYS_EVT.EFFECT_VOLUME)
    }

    /** 
     * 获取音效开关值 
     */
    get switchEffect(): boolean {
        return this._switch_effect;
    }
    /**
     * 设置音效开关值
     * @param value     音效开关值
     */
    set switchEffect(value: boolean) {
        this._switch_effect = value;
        this.save()

        if (value == false)
            this.effect.stop();

        mius.event.dispatchEvent( mius.evt.SYS_EVT.EFFECT_SWITCH )
    }

    /** 恢复当前暂停的音乐与音效播放 */
    resumeAll() {
        if (this.music) {
            this.music.play();
            this.effect.play();
        }
    }

    /** 暂停当前音乐与音效的播放 */
    pauseAll() {
        if (this.music) {
            this.music.pause();
            this.effect.pause();
        }
    }

    /** 停止当前音乐与音效的播放 */
    stopAll() {
        this.stopMusic()
        this.stopEffect()
    }

    stopMusic(){
        if (this.music) {
            this.music.stop();
        }

    }

    stopEffect(){
        if (this.effect) {
            this.effect.stop();
        }
    }

    /** 保存音乐音效的音量、开关配置数据到本地 */
    save(){
        let data = {
            volume_music: this._volume_music,
            switch_music: this._switch_music,
            volume_effect: this._volume_effect,
            switch_effect: this._switch_effect
        }
        mius.storage.set(LOCAL_AUDIO_STORAGE_KEY, JSON.stringify(data), false);
    }

    /** 本地加载音乐音效的音量、开关配置数据并设置到游戏中 */
    load(){
        this.music = this.getComponent(AudioMusic) || this.addComponent(AudioMusic)!;
        this.effect = this.getComponent(AudioEffect) || this.addComponent(AudioEffect)!;

        // let data = mius.storage.get_json_for_key(LOCAL_AUDIO_STORAGE_KEY, null, false);
        // if (data) {
        //     this._volume_effect = data.volume_effect;
        //     this._volume_music = data.volume_music;

        //     this._switch_effect = data.switch_effect;
        //     this._switch_music = data.switch_music;
        // }

        // if (this.music) {
        //     this.volumeMusic = this._volume_music;
        //     this.volumeEffect = this._volume_effect;

        //     this.switchEffect = this._switch_effect;
        //     this.switchMusic = this._switch_music;
        // }
    }
}