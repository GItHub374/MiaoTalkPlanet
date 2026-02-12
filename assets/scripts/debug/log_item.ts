
import { _decorator, Component, Node, Label, color, Sprite } from 'cc';
import { mius } from '../core/mius';
import { UIID } from '../game/config/ui_config';
import { TableViewItem } from '../core/ui/TableView';
const { ccclass, property } = _decorator;

@ccclass('log_item')
export class log_item extends TableViewItem {

    @property(Label)
    lab_text : Label = null!;

    start () {

    }

    protected onLoad(): void {

    }


    refreshContent(idx: number, data: any): void {
        let spr = this.node.getComponent( Sprite )!
        if (idx % 2 == 0) {
            spr.color = color( 131, 221, 214, 255 )
            
        }else{
            spr.color = color( 255, 255, 255, 255 )
        }
        this.lab_text.string = data
    }
}