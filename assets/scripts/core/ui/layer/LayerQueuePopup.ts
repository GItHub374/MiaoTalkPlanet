import { UI_VAR } from "./ui_constant";
import { LayerPopUp } from "./LayerPopup";

/*
 * QueuePopup 层
 * 该层的节点将一次只显示一个，删除以后会自动从队列当中取一个弹窗，直到队列为空
 */
export class LayerQueuePopup extends LayerPopUp {
    private _queue: Array<UI_VAR.NODE_ATTRIBUTE> = [];
    private _current: UI_VAR.NODE_ATTRIBUTE | null = null;

    add(config: UI_VAR.UI_CONFIG, params?: any): string {
        this.black.enabled = true;

        let prefabPath = config.prefab
        var muid = this.get_ui_unique_id( config.uiid!, prefabPath);
        var attribute = this.ui_node_attributes.get(muid);
        if (attribute == null) {
            attribute = new UI_VAR.NODE_ATTRIBUTE();
            attribute.ui_key = muid;
            attribute.prefabPath = prefabPath;
            attribute.params = params || {};
            attribute.uiid = config.uiid!;
            attribute.valid = true;
            attribute.bundle = config.bundle;

            this.ui_node_attributes.set(attribute.ui_key, attribute);
        }

        if (this._current && this._current.valid) {
            this._queue.push(attribute);
        }
        else {
            this._current = attribute;
            this.load(attribute);
        }

        return muid;
    }

    private next() {
        if (this._queue.length > 0) {
            this._current = this._queue.shift()!;
            if (this._current.node) {
                this.active_node(this._current);
            }
            else {
                this.load(this._current);
            }
            this.black.enabled = true
        }else{
            this.black.enabled = false
            this._current = null
        }
    }

    remove_by_uiid(_uiid:number, destroy: boolean): string {
        let _muid = super.remove_by_uiid(_uiid, destroy);
        this.next()
        return _muid;
    }

    protected remove_from_array(muid: string): void {
        //覆盖父类的，不能删
    }

    protected only_show_top_popup_black(){
        //覆盖父类的，不能删
    }

    clear(destroy: boolean) {
        this._queue = [];
        this._current = null;

        //要放在后面
        super.clear(destroy)        
    }
}