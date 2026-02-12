import { error, instantiate, Node, Prefab } from "cc";
import { UI_VAR } from "./ui_constant";
import { UIDelegateComponent } from "./UIDelegateComponent";
import { LayerUI } from "./LayerUI";
import { mius } from "../../mius";
import { UIID } from "../../../game/config/ui_config";

export class LayerToast extends LayerUI {
    /**
     * 显示toast
     * @param content 文本表示
     */
    show(content: string, time : number = 0): void {
        var attribute = new UI_VAR.NODE_ATTRIBUTE();
        
        let config = mius.gui.get_config_by_uiid(UIID.Toast);
        attribute.ui_key = this.get_ui_unique_id( config.uiid!, config.prefab);
        attribute.prefabPath = config.prefab;
        attribute.params = { content: content, time : time };
        attribute.valid = true;
        attribute.uiid = config.uiid!;
        attribute.bundle = config.bundle;

        this.ui_node_attributes.set(attribute.ui_key, attribute);
        this.load(attribute);
    }

    protected load(attribute: UI_VAR.NODE_ATTRIBUTE) {
        let load_callback = (err: Error | null, res: Prefab) => {
            if (err) {
                error(err);
            }

            let childNode: Node = instantiate(res);
            attribute.node = childNode;

            let comp: UIDelegateComponent = childNode.addComponent(UIDelegateComponent);
            comp.ui_attribute = attribute;

            this.active_node(attribute);
        }
        // 获取预制件资源
        if (attribute.bundle != null && attribute.bundle != "") {
            mius.res.load(attribute.bundle, attribute.prefabPath, load_callback);
        }else{
            mius.res.load(attribute.prefabPath, load_callback);
        }
    }
}