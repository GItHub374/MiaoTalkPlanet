import { _decorator, Component, Node } from 'cc';
import { TableView } from '../../core/ui/TableView';
import { Size } from 'cc';
import { view_game_item } from './view_game_item';
const { ccclass, property } = _decorator;

@ccclass('view_game')
export class view_game extends Component {
    @property(TableView)
    tableview: TableView = null!;

    start() {
        this.tableview.reloadData([])

        let data = [
            { img_path: "cat:images/game/img_cat_day", title: "猫的一天", unlock_point: 1, game_id: 1, is_lock: true },
            { img_path: "cat:images/game/img_cat_play", title: "旧巷猫语", unlock_point: 2, game_id: 2, is_lock: true },
            { img_path: "cat:images/game/img_meet", title: "末日穿越", unlock_point: 3, game_id: 3, is_lock: true },
            { img_path: "cat:images/game/img_cat_day", title: "猫的一天", unlock_point: 4, game_id: 4, is_lock: true },
            { img_path: "cat:images/game/img_cat_play", title: "旧巷猫语", unlock_point: 5, game_id: 5, is_lock: true },
            { img_path: "cat:images/game/img_meet", title: "末日穿越", unlock_point: 6, game_id: 6, is_lock: true },
            { img_path: "cat:images/game/img_cat_day", title: "猫的一天", unlock_point: 7, game_id: 7, is_lock: true },
            { img_path: "cat:images/game/img_cat_play", title: "旧巷猫语", unlock_point: 8, game_id: 8, is_lock: true },
            { img_path: "cat:images/game/img_meet", title: "末日穿越", unlock_point: 9, game_id: 9, is_lock: true }
        ]
        let player_data = [1,2,3,5]
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if(player_data.indexOf(element.game_id) != -1){
                element.is_lock = false
            }
        }
        this.tableview.reloadData(data, true)
    }

    table_cell_size(idx: number): Size {
        return new Size(610, 210)
    }

    table_cell_update(node: Node, idx: number, data: any) {
        let comp = node.getComponent(view_game_item)!
        comp.refreshContent(idx, data)
    }
}


