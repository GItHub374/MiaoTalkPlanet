import { UITransform } from "cc";
import { Sprite } from "cc";
import { SpriteFrame } from "cc";
import { Size } from "cc";
import { Vec3 } from "cc";
import { Node } from "cc";
import { mius } from "../../mius";
import { Color } from "cc";
import { tween } from "cc";
import { Button } from "cc";
import { EventHandler } from "cc";
import { color } from "cc";
import { Label } from "cc";

declare module "cc" {
    interface Node {
        setPositionX( x : number ) : void;
        setPositionY( y : number ) : void;
        getContentSize() : Size;
        setContentSize( size : Size) : void;
        setWidth( width : number ) : void;
        setHeight( height : number ) : void;
        setSpriteFrame( path : string ) : void;

        setOpacity( opacity : number ) : void;
        addClickHandler(target: Node, comp_callback_name: string, custom_data?: string): void;

        fadeIn( duration : number ) : void;
        fadeOut( duration : number ) : void;

        set_button_enabled( enabled : boolean ) : void;
    }
}

Node.prototype.setPositionX = function( x : number ){
    let position = this.position
    this.position = new Vec3( x, position.y, 0 )
}

Node.prototype.setPositionY = function( y : number ){
    let position = this.position
    this.position = new Vec3( position.x, y, 0 )
}

Node.prototype.getContentSize = function(){
    let transform = this.getComponent( UITransform )
    if (transform != null) {
        return new Size( transform.width, transform.height )
    }else {
        return new Size( 0, 0 )
    }
}

Node.prototype.setContentSize = function( size : Size){
    let transform = this.getComponent( UITransform )
    if (transform != null) {
        transform.setContentSize( size )
    }
}

Node.prototype.setWidth = function (width:number) {
    let size = this.getContentSize()
    this.setContentSize( new Size(width, size.height) )
}

Node.prototype.setHeight = function (height:number) {
    let size = this.getContentSize()
    this.setContentSize( new Size(size.width, height) )
}

Node.prototype.set_button_enabled = function (enabled:boolean) {
    let btn : Button | null = this.getComponent( Button )
    if (btn == null) {
        mius.log.logView("node does not have Button Component!!")
        return
    }

    btn!.interactable = enabled
    this.getComponent(Sprite)!.color = enabled ? color(255, 255, 255) : color(125, 125, 125)
    if (this.getComponentInChildren(Label)) {
        this.getComponentInChildren(Label)!.color = enabled ? color(255, 255, 255) : color(200, 200, 200)
    }
}

Node.prototype.setSpriteFrame = function (image:string) {
    let spr : Sprite = this.getComponent( Sprite ) || this.addComponent( Sprite )
    if (spr == null) {
        mius.log.logView( "node does not have Sprite Component!!" )
        return
    }

    if (!image.includes("/spriteFrame")) {
        image += "/spriteFrame";
    }

    const parts = image.split(':');
    if (parts.length == 2) {
        let fr : SpriteFrame | null = mius.res.get( parts[1], SpriteFrame, parts[0] ) as SpriteFrame
        if (!fr) {
            mius.res.load( parts[0], parts[1], SpriteFrame, (err : Error | null, data : SpriteFrame) => {
                if (err) {
                    console.error(err)
                    return
                }
                spr!.spriteFrame = data
            } )
        }else{
            spr.spriteFrame = fr
        }

    }else{
        let fr : SpriteFrame | null = mius.res.get( image, SpriteFrame ) as SpriteFrame
        if (!fr) {
            mius.res.load( image, SpriteFrame, (err : Error | null, data : SpriteFrame) => {
                if (err) {
                    console.error(err)
                    return
                }
                spr!.spriteFrame = data
            } )
        }else{
            spr.spriteFrame = fr
        }
    }
}

Node.prototype.addClickHandler = function (target: Node, comp_callback_name: string, custom_data?: string) {
    let comp = this.getComponent(Button) || this.addComponent(Button)
    const clickEventHandler = new EventHandler();
    clickEventHandler.target = target; // 这个 node 节点是你的事件处理代码组件所属的节点

    const parts = comp_callback_name.split(':');
    if (parts.length != 2) {
        mius.log.logError("Invalid comp_callback_name: " + comp_callback_name)
        return
    }

    clickEventHandler.component = parts[0];// 这个是脚本类名
    clickEventHandler.handler = parts[1];

    if (custom_data) {
        clickEventHandler.customEventData = custom_data;
    }
    comp.clickEvents.push(clickEventHandler);
}

Node.prototype.setOpacity = function (opacity:number) {
    let spr : Sprite | null = this.getComponent( Sprite )
    if (spr == null) {
        mius.log.logView( "node does not have Sprite Component!!" )
        return
    }

    spr.color = new Color(spr.color.r, spr.color.g, spr.color.b, opacity)
}

Node.prototype.fadeIn = function (duration:number) {
    let spr : Sprite | null = this.getComponent( Sprite )
    if (spr == null) {
        mius.log.logView( "node does not have Sprite Component!!" )
        return
    }
    tween(spr).to( duration, {color:new Color(spr.color.r, spr.color.g, spr.color.b, 255)} ).start()
}

Node.prototype.fadeOut = function (duration:number) {
    let spr : Sprite | null = this.getComponent( Sprite )
    if (spr == null) {
        mius.log.logView( "node does not have Sprite Component!!" )
        return
    }
    tween(spr).to( duration, {color:new Color(spr.color.r, spr.color.g, spr.color.b, 0)} ).start()
}