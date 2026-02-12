import { _decorator, Component, Sprite, SpriteFrame, resources, assetManager, CCString } from 'cc';
const { ccclass, property, requireComponent} = _decorator;
import { GIFCache } from "./GIF";
import { mius } from '../../mius';

/**
 * Web、WechatMiniGame 平台需要在项目设置关闭 CLEANUP_IMAGE_CACHE 才能显示正常
 * Android、Windows、iOS、macOS 平台需要在项目设置开启 CLEANUP_IMAGE_CACHE 才能显示正常
 * 开启: CLEANUP_IMAGE_CACHE，菜单栏 项目->项目设置->全局变量(Macro Config)->CLEANUP_IMAGE_CACHE 勾选
 * 关闭: CLEANUP_IMAGE_CACHE，菜单栏 项目->项目设置->全局变量(Macro Config)->CLEANUP_IMAGE_CACHE 去掉勾选
 */


@ccclass('CCGIF')
@requireComponent(Sprite)
export class CCGIF extends Component {
    @property
    path: string = '';
    public set file_path(_path : string){
        this.path = _path;
    }
    
    private delays = [];
    private gif_spr: Sprite = null!;
    private frames: SpriteFrame[] = [];

    onLoad() {
        this.gif_spr = this.node.getComponent(Sprite)!;
    }

    load( play_after_load : boolean | Function ) {
        GIFCache.getInstance();

        let callback = (err : Error, data: any) => {
            if (err) {
                mius.log.logError(err, 'load native gif error');
                return;
            }

            this.delays = data._nativeAsset.delays.map((v: number) => v / 100);
            this.frames = data._nativeAsset.spriteFrames;

            if ( typeof play_after_load === 'function' ) {
               play_after_load()

            }else if (typeof play_after_load === 'boolean' && play_after_load) {
                this.play(true);
            }
        }

        const parts = this.path.split(':');
        if (parts.length === 2) {
            mius.res.load( parts[0], parts[1], callback )
        }else{
            mius.res.load( this.path, callback );
        }
    }

    public loadUrl(url:string) {
        GIFCache.getInstance();

        assetManager.loadAny({ url: url }, (err, data: any) => {
            if (err) {
                mius.log.logError(err, 'load remote gif error');
                return;
            }
            this.delays = data.delays.map((v: number) => v / 100);
            this.frames = data.spriteFrames;
            this.play(true);
        })

    }



    private frameIdx = 0;

    /**
     * 播放Gif
     * @param loop 是否循环
     * @param playNext 是否播放下一个
     * @returns void
     */
    public play(loop = false, playNext = false) {
        if (!playNext) {
            this.stop();
        }
        if (this.frames.length) {
            if (this.frameIdx >= this.frames.length) {
                this.frameIdx = 0;
                if (!loop) {
                    return;
                }
            }
            this.gif_spr.spriteFrame = this.frames[this.frameIdx];
            // console.log(this.gif_spr, '11111')
            this.scheduleOnce(() => {
                this.play(loop, true);
            }, this.delays[this.frameIdx]);
            this.frameIdx++;
        }
    }

    public stop() {
        this.frameIdx = 0;
        this.unscheduleAllCallbacks();
    }
}



