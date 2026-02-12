import { BaseManager } from "../core/common/BaseManager";
import { mius } from "../core/mius";
import { LayerType } from "../core/ui/layer/ui_constant";
import { WGID } from "../game/config/wg_config";
import { Node, v3, screen } from "cc";


export class debug_controller extends BaseManager {
    clean(): void {
        
    }
    
    public show_debug_button( ){
        if (!mius.app_config.is_debug_mode) {
            return
        }

        mius.gui.create_widget( WGID.DEBUG_BUTTON, (node : Node) => {
            let parent = mius.gui.get_layer_with_name( LayerType.Debug )
            if (parent) {
                node.parent = parent

                let pos = mius.storage.get_json_for_key( "debug_button_pos", null, false )
                if (pos) {
                    node.position = v3( pos.x, pos.y, 0 )
                } else {
                    node.position = v3( 0, 0, 0 )
                }
            }
        } )
    }
}