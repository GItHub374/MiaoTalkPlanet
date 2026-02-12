/*
 * UI基础层，允许添加多个预制件节点
 * add          : 添加一个预制件节点到层容器中，该方法将返回一个唯一uuid来标识该操作Node节点。
 * delete       : 根据uuid删除Node节点，如果节点还在队列中也会被删除, 删除节点可以用gui.delete(node)或this.node.destroy()
 * deleteByUuid : 根据预制件路径删除，预制件如在队列中也会被删除，如果该预制件存在多个也会一起删除。
 * get          : 根据uuid获取Node节点，如果节点不存在或者预制件还在队列中，则返回null 。
 * getByUuid    : 根据预制件路径获取当前显示的该预制件的所有Node节点数组。
 * has          : 判断当前层是否包含 uuid或预制件路径对应的Node节点。
 * find         : 判断当前层是否包含 uuid或预制件路径对应的Node节点。
 * size         : 当前层上显示的所有Node节点数。
 * clear        : 清除所有Node节点，队列当中未创建的任务也会被清除。
 */
import { error, instantiate, isValid, Node, Prefab, view, warn, Widget } from "cc";
import { UI_VAR } from "./ui_constant";
import { UIDelegateComponent } from "./UIDelegateComponent";
import { mius } from "../../mius";
import { UIID } from "../../../game/config/ui_config";

export class LayerUI extends Node {
    protected ui_node_attributes: Map<string, UI_VAR.NODE_ATTRIBUTE> = new Map<string, UI_VAR.NODE_ATTRIBUTE>();

    /**
     * UI基础层，允许添加多个预制件节点
     * @param name 该层名
     */
    constructor(name: string) {
        super(name);

        var widget: Widget = this.addComponent(Widget);
        widget.isAlignLeft = widget.isAlignRight = widget.isAlignTop = widget.isAlignBottom = true;
        widget.left = widget.right = widget.top = widget.bottom = 0;
        widget.alignMode = Widget.AlignMode.ON_WINDOW_RESIZE;
        widget.enabled = true;
    }

    /** 
     * 构造一个唯一标识UUID
     * @param uiid  UIID枚举
     * @param prefab  预制件路径
    */
    protected get_ui_unique_id( uiid:number, prefab: string): string {
        var _uuid = `${this.name}_${uiid}_${prefab}`;
        //在这个正则表达式中，/ 是正则表达式的开始和结束标记，\/ 是要匹配的字符，g 是全局匹配的标记，表示要替换 _uuid 中的所有斜线
        return _uuid.replace(/\//g, "_");
    }

    /**
     * 添加一个预制件节点到层容器中，该方法将返回一个唯一`uuid`来标识该操作节点
     * @param config    UI_VAR.UI_CONFIG from ui_config
     * @param params     自定义参数
     */
    add(config: UI_VAR.UI_CONFIG, params?: any): string {
        let prefabPath = config.prefab
        let uiid = config.uiid!
        let muid = this.get_ui_unique_id(uiid, prefabPath);
        let attributes = this.ui_node_attributes.get(muid);

        if (attributes && attributes.valid) {
            warn(`LayerUI add ui [${uiid} - ${prefabPath}] has been added`);
            return "";
        }

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

        return muid;
    }

    protected load(attribute: UI_VAR.NODE_ATTRIBUTE) {
        var attr: UI_VAR.NODE_ATTRIBUTE = this.ui_node_attributes.get(attribute.ui_key)!;
        if (attr && attr.node) {
            this.active_node(attr);
        }
        else {
            // 获取预制件资源
            let load_callback = (err: Error | null, res: Prefab) => {
                if (err) {
                    error(err);
                }

                // 如果节点已经被删除了，就不再创建，可能是在加载过程中被删除了
                if (!attribute.valid) {
                    return
                }

                let childNode: Node = instantiate(res);
                attribute.node = childNode;

                let comp: UIDelegateComponent = childNode.addComponent(UIDelegateComponent);
                comp.ui_attribute = attribute;

                this.active_node(attribute);
            }

            if (attribute.bundle != null && attribute.bundle != "") {
                mius.res.load(attribute.bundle, attribute.prefabPath, load_callback);
            }else{
                mius.res.load(attribute.prefabPath, load_callback);
            }
        }
    }

    /**
     * 激活节点，并调用 UIDelegateComponent.add， 可覆盖重写
     * @param attribute : UI_VAR.NODE_ATTRIBUTE
     */
    protected active_node(attribute: UI_VAR.NODE_ATTRIBUTE) {
        attribute.valid = true;
        let childNode: Node = attribute!.node!;
        let comp: UIDelegateComponent = childNode.getComponent(UIDelegateComponent)!;
        childNode.parent = this;
        comp!.add();

        return childNode;
    }


    /**
     * 根据uiid删除，预制件如在队列中也会被删除
     * @param uiid 
     */
    //TODO:测试同时加载两个相同prefab的节点，然后删除其中一个
    remove_by_uiid(_uiid:number, destroy: boolean): string {
        for (const [key, attr] of this.ui_node_attributes) {
            if (attr.uiid === _uiid) {
                this.ui_node_attributes.delete(attr.ui_key); //需要清掉信息，不然重新打开界面的时候数据不会刷新
                if (attr.node) {
                    let comp = attr.node.getComponent(UIDelegateComponent);
                    if (comp) {
                        comp.remove(destroy);
                    }                    
                }
                attr.valid = false; //这一句要放在remove后面
                return attr.ui_key
            }
        }
        return "";
    }

    /**
     * 根据muid获取节点，如果节点不存在或者还在队列中，则返回null 
     * @param muid 
     */
    get_node_by_muid(muid: string): Node | null {
        let children_comp = this.get_all_valid_node();
        for (let comp of children_comp) {
            if (comp.ui_attribute && comp.ui_attribute.ui_key === muid) {
                return comp.node;
            }
        }
        return null;
    }

    /**
     * 根据预制件路径获取当前显示的该预制件的所有Node节点数组。
     * @param prefabPath 
     */
    get_node_by_prefab(prefabPath: string): Array<Node> {
        let arr: Array<Node> = [];
        let children = this.get_all_valid_node();
        for (let comp of children) {
            if (comp.ui_attribute!.prefabPath === prefabPath) {
                arr.push(comp.node);
            }
        }
        return arr;
    }

    /**
     * 判断 uiid 对应的Node节点是否正在显示
     * @param uiid uiid
     */
    get_is_showing(uiid: number): boolean {
        let children = this.get_all_valid_node();
        for (let comp of children) {
            if (comp.ui_attribute!.uiid === uiid) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取当前有效可见的全部节点
     */
    protected get_all_valid_node(): Array<UIDelegateComponent> {
        let result: Array<UIDelegateComponent> = [];
        let children = this.children;
        for (let i = 0; i < children.length; i++) {
            let comp = children[i].getComponent(UIDelegateComponent);
            if (comp && comp.ui_attribute && comp.ui_attribute.valid && isValid(comp)) {
                result.push(comp);
            }
        }
        return result;
    }

    /** 层节点数量 */
    get_node_count(): number {
        return this.children.length;
    }

    /** 清除所有节点，加载队列当中的也删除 */
    clear(is_destroy: boolean = true): void {
        this.ui_node_attributes.forEach((value: UI_VAR.NODE_ATTRIBUTE, key: string) => {
            this.remove_by_uiid(value.uiid!, is_destroy);
            value.valid = false;
        });
        this.ui_node_attributes.clear();
    }
}