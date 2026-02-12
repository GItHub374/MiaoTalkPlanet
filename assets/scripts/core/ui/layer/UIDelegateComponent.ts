import { Component, Node, _decorator } from "cc";
import { UI_VAR } from "./ui_constant";

const { ccclass } = _decorator;

/** UI 添加/删除事件触发组件 */
@ccclass('UIDelegateComponent')
export class UIDelegateComponent extends Component {
    private _ui_attribute: UI_VAR.NODE_ATTRIBUTE | null = null;
    
    public get ui_attribute() : UI_VAR.NODE_ATTRIBUTE | null {
        return this._ui_attribute; 
    }
    public set ui_attribute(v : UI_VAR.NODE_ATTRIBUTE | null) {
        this._ui_attribute = v;
    }

    add() {
        let attribute = this.ui_attribute!;

        // 触发节点添加到父节点后的事件
        this.applyComponentsFunction(this.node, "onAdded", attribute.params);
    }

    /** 删除节点，该方法只能调用一次，将会触发onBeforeRemoved回调 */
    remove(destroy: boolean) {
        let attribute = this.ui_attribute!;

        if (attribute.valid) {
            // 触发节点被移除之前的事件
            this.applyComponentsFunction(this.node, "onBeforeRemove", attribute.params);

            this._removed(attribute, destroy);
        }
    }

    /** 窗口组件中触发移除事件与释放窗口对象 */
    private _removed(attribute: UI_VAR.NODE_ATTRIBUTE, destroy: boolean) {
        attribute.valid = false;

        // 触发节点被移除之后的事件
        this.applyComponentsFunction(this.node, "onRemoved", attribute.params);

        if (destroy)
            this.node.destroy();
        else
            this.node.removeFromParent();
    }

    onDestroy() {
        this.ui_attribute = null;
    }

    /**
     * 调用挂在节点node上面的组件的方法funcName
     * @param node
     * @param funName 
     * @param params 
     */
    protected applyComponentsFunction(node: Node, funName: string, params: any) {
        for (let i = 0; i < node.components.length; i++) {
            let component: any = node.components[i];
            let func = component[funName];
            if (func) {
                func.call(component, params);
            }
        }
    }
}