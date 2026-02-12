import { assert, BlockInputEvents, isValid, Layers, warn } from "cc";
import { UI_VAR } from "./ui_constant";
import { LayerUI } from "./LayerUI";
import { BlockComponent } from "./BlockComponent";

/*
 * Popup层，调用add显示，可以显示暗色背景
 * 允许同时弹出多个窗口
 */
export class LayerPopUp extends LayerUI {
    /**
     * 当前显示的popup的数组
     */
    protected array_popup : string[] = [];

    protected black!: BlockInputEvents;

    constructor(name: string) {
        super(name);
        this.init_block();
    }

    private init_block() {
        this.layer = Layers.Enum.UI_2D;
        this.black = this.addComponent(BlockInputEvents);
        this.black.enabled = false;
    }

    /**
     * 添加一个预制件节点到PopUp层容器中，该方法将返回一个唯一uuid来标识该操作节点
     * @param config 界面config
     * @param params     传给组件onAdded、onRemoved方法的参数。
     */
    add(config: UI_VAR.UI_CONFIG, params: any): string {
        let prefabPath = config.prefab
        let uiid = config.uiid!
        let muid = this.get_ui_unique_id(uiid, prefabPath);
        let attributes = this.ui_node_attributes.get(muid);

        if (attributes && attributes.valid) {
            warn(`LayerPopup add ui [${uiid} - ${prefabPath}] has been added`);
            return "";
        }
        this.black.enabled = true;

        if (attributes == null) {
            attributes = new UI_VAR.NODE_ATTRIBUTE();
            attributes.ui_key = muid;
            attributes.prefabPath = prefabPath;
            attributes.params = params || {};
            attributes.valid = true;
            attributes.uiid = uiid;
            attributes.bundle = config.bundle;

            this.ui_node_attributes.set(muid, attributes);
        }

        this.load(attributes)

        if (muid != "") {
            this.array_popup.push(muid);
            this.only_show_top_popup_black()
        }

        return muid;
    }

    /**
     * 激活节点，并调用 UIDelegateComponent.add， 可覆盖重写
     * @param attribute : UI_VAR.NODE_ATTRIBUTE
     */
    protected active_node(attribute: UI_VAR.NODE_ATTRIBUTE) {
        let node = super.active_node(attribute);

        assert( node.getComponent(BlockComponent) != null, "LayerPopup add popup failed, BlockComponent has not been set" )

        this.only_show_top_popup_black()
        return node
    }

    remove_by_uiid(_uiid:number, destroy: boolean): string {
        let _muid = super.remove_by_uiid(_uiid, destroy);
        this.remove_from_array(_muid);
        this.only_show_top_popup_black()
        return _muid;
    }

    /**
     * 多个popup同时显示，只有最上面那个显示黑色遮罩
     */
    protected only_show_top_popup_black(){
        let length = this.array_popup.length
        if (length <= 0) {
            return
        }
        let is_top_one = true
        for (let i = length-1; i >= 0; i--) {
            let muid = this.array_popup[i];
            let node = this.get_node_by_muid(muid)
            let attr = this.ui_node_attributes.get(muid)
            if (node && isValid(node) && attr && attr.valid) {
                let comp = node.getComponent(BlockComponent)!
                let opacity = comp.black_opacity!
                if (opacity == 0) {
                    continue
                }
                if (is_top_one) {
                    comp.set_opacity( opacity )
                    is_top_one = false
                }else{
                    comp.set_opacity( 0 )
                }
            }else{
                continue
            }
        }
    }

    protected remove_from_array(muid:string){
        let idx = this.array_popup.indexOf(muid);
        if (idx == -1) {
            return;
        }
        this.array_popup.splice(idx, 1);
        //popup层是空的就不再屏蔽触摸
        if (this.array_popup.length == 0) {
            this.black.enabled = false;
        }else{
            this.black.enabled = true;
        }
    }

    clear(destroy: boolean = true) {
        super.clear(destroy)
        this.black.enabled = false;
    }
}