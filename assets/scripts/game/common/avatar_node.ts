
import { _decorator, Component, Node, Label, color, Sprite, SpriteFrame, UITransform, Vec2, Size } from 'cc';
import { assetManager } from 'cc';
import { mius } from '../../core/mius';
import { Texture2D } from 'cc';
import { ImageAsset } from 'cc';
// import { LudoManager } from '../ludo/LudoManager';
const { ccclass, property } = _decorator;

@ccclass('avatar_node')
export class avatar_node extends Component {

    @property(Sprite)
    avatar : Sprite = null!;

    private _avatar_url : string = "";

    public refresh_avatar( url : string ){
        if (this._avatar_url == url) {
            return
        }
        this._avatar_url = url

        this.download( this._avatar_url )
    }

    private download( url : string ) : void{
        if (url == undefined || url == "") {
            return;
        }

        // let tb_downloaded = LudoManager.instance.tb_downloaded
        // if (tb_downloaded[url]){
        //     this.avatar.spriteFrame = tb_downloaded[url];
        //     return;
        // }
        
        mius.log.logNet("download avatar ：" + url)
        assetManager.loadRemote( url, {ext : ".png"}, (err : any, texture : any) => {
            if (texture) {
                let asset = texture as ImageAsset

                let tex = new Texture2D();
                tex.reset({
                    width : asset.width,
                    height : asset.height,
                    format : Texture2D.PixelFormat.RGBA8888
                });
                tex.image = asset;

                let frame = new SpriteFrame();
                frame.texture = tex;
                this.avatar.spriteFrame = frame

                // tb_downloaded[url] = frame;
            }
        } )
    }
}