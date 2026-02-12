
import { _decorator, Component, Node, UITransform, director, Size, Label, Color, Vec3 } from 'cc';
import { UIComponent } from '../core/ui/layer/UIComponent';
import { mius } from '../core/mius';
import { TableView } from '../core/ui/TableView';
import { WGID } from '../game/config/wg_config';
import { log_item } from './log_item';

const { ccclass, property } = _decorator;

@ccclass('log_view')
export class log_view extends UIComponent {
    onLoad(){
        //继承 UIComponent 的都需要调用父类的onLoad
        super.onLoad();
    }

    @property(TableView)
    tableview : TableView = null!;

    private _logs : string[] = []

    start () {
        this._logs = mius.log.get_logs_record()
        this.tableview.reloadData( this._logs )
        this.tableview.scrollToBottom()
    }

    public table_cell_size( idx : number ) : Size{
        return new Size( 750, 100 )
    }

    public table_cell_update( node : Node, idx : number, data : any ){
        let comp = node.getComponent(log_item)!
        comp.refreshContent( idx, data )
    }

    on_click_close(){
        this.hide_myself()
    }
}
