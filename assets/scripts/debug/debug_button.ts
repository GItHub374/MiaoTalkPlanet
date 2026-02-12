
import { _decorator, Component, Node, Label, EventTouch, Vec2, v2, UITransform, v3, Vec3 } from 'cc';
import { mius } from '../core/mius';
import { UIID } from '../game/config/ui_config';
const { ccclass, property } = _decorator;
import { assetManager, Texture2D } from 'cc';
import { SpriteFrame } from 'cc';
import { ImageAsset } from 'cc';

@ccclass('debug_button')
export class debug_button extends Component {

    @property(Node)
    func_node : Node = null!;

    start () {
        this.func_node.active = false
    }

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.on_touch_start, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
        this.node.on(Node.EventType.TOUCH_END, this.on_touch_end, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.on_touch_end, this);
    }

    private on_touch_start(event: EventTouch) {

    }

    private on_touch_move(event: EventTouch) {
        let pos = event.getUILocation();
        let parent = this.node.parent;
        let transform = parent?.getComponent(UITransform);
        let move_pos = transform?.convertToNodeSpaceAR( v3(pos.x, pos.y, 0) )!;
        this.node.position = move_pos

        mius.storage.set( "debug_button_pos", move_pos, false )
    }

    private on_touch_end(event: EventTouch) {

    }

    on_click_debug(){
        this.func_node.active = !this.func_node.active
    }

    on_click_reconnect(){
        mius.socket.reconnect()
    }

    on_click_disconnect(){
        mius.socket.close()
    }

    on_click_connect(){
        // mius.socket.connect( mius.socket.connect_option! )

        let count = 0;
        assetManager.assets.forEach((asset) => {
            if (asset instanceof ImageAsset) {
                count++;
                console.log(
                    'uuid:',
                    asset.uuid,
                    'ImageAsset:',
                    asset.nativeUrl,
                    'refCount:',
                    asset.refCount
                );
            }
        });

        console.log('Total ImageAssets:', count);
    }

    on_click_show_log(){
        // mius.gui.show_debug_ui( UIID.LOG_VIEW )

        assetManager.assets.forEach((asset) => {
            if (asset instanceof ImageAsset) {
                if (asset.refCount === 0) {
                    assetManager.releaseAsset(asset);
                }
            }
        });


        // assetManager.assets.forEach((asset) => {
        //     if (asset instanceof ImageAsset) {
        //         console.log(
        //             'Texture:',
        //             asset.name,
        //             'uuid:',
        //             asset.uuid,
        //             'refCount:',
        //             asset.refCount
        //         );
        //     }
        // });

        const cache = assetManager.cacheManager!.cachedFiles;

        for (const url in cache) {
            console.log('Remote Cached File:', url);
        }


        // assetManager.assets.forEach((asset) => {
        //     if (asset instanceof Texture2D) {
        //         if (asset.nativeUrl?.startsWith('http')) {
        //             console.log(
        //                 'Remote Texture:',
        //                 asset.nativeUrl,
        //                 'refCount:',
        //                 asset.refCount
        //             );
        //         }
        //     }
        // });


    }
}