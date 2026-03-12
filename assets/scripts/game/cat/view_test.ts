import { _decorator, Component, Node } from 'cc';
import { TableView } from '../../core/ui/TableView';
import { Size } from 'cc';
import { view_test_item } from './view_test_item';
const { ccclass, property } = _decorator;

@ccclass('view_text')
export class view_text extends Component {
    @property(TableView)
    tableview: TableView = null!;

    start() {
        this.tableview.reloadData([])

        let data = [
            { img_path: "cat:images/test/img_draw", title: "喵格测试·基础版（12）题", des:"喵格测试·基础版",test_id:1},
            { img_path: "cat:images/test/img_rest", title: "喵格测试·进阶版（13）题", des:"喵格测试·基础版",test_id:2},
            { img_path: "cat:images/test/img_sleep", title: "喵格测试·超级版（14）题", des:"喵格测试·基础版",test_id:3},
            { img_path: "cat:images/test/img_sleep", title: "喵格测试·超级版（14）题", des:"喵格测试·基础版",test_id:4},
            { img_path: "cat:images/test/img_sleep", title: "喵格测试·超级版（14）题", des:"喵格测试·基础版",test_id:5},
            { img_path: "cat:images/test/img_sleep", title: "喵格测试·超级版（14）题", des:"喵格测试·基础版",test_id:6},
            { img_path: "cat:images/test/img_draw", title: "喵格测试·终极版（15）题", des:"喵格测试·基础版",test_id:7}
        ]
        this.tableview.reloadData(data, true)
    }

    table_cell_size(idx: number): Size {
        return new Size(610, 140)
    }

    table_cell_update(node: Node, idx: number, data: any) {
        let comp = node.getComponent(view_test_item)!
        comp.refreshContent(idx, data)
    }
}


