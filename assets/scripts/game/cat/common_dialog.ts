
import { _decorator, CCInteger, Node, Label } from 'cc';
import { UIPopupComponent } from '../../core/ui/layer/UIPopupComponent';
const { ccclass, property } = _decorator;

@ccclass('common_dialog')
export class common_dialog extends UIPopupComponent {

    @property(Label)
    lab_title: Label = null!

    @property(Label)
    lab_content: Label = null!

    @property(Node)
    btn_confirm: Node = null!

    @property(Node)
    btn_cancel: Node = null!

    @property({ type: CCInteger, tooltip: "弹窗除开内容文本外的高度" })
    height_offset: number = 300;

    @property({ type: CCInteger, tooltip: "弹窗最小高度" })
    min_height: number = 550;

    onLoad(): void {
        super.onLoad()

        this.init_ui()
    }

    private init_ui() {
        this.lab_title.string = this.build_args.title || "提示"

        this.lab_content.string = this.build_args.content
        //要调用这个才会刷新size等属性
        this.lab_content.updateRenderData(true)

        let bg = this.node.getChildByName("bg")!
        let size = this.lab_content.node.getContentSize()

        let height = size.height + this.height_offset
        height = Math.max(height, this.min_height)
        bg.setHeight(height)

        this.init_button()
    }

    private init_button() {
        if (this.build_args.btn_count == 1) {
            this.btn_cancel.active = false

            this.btn_confirm.setPositionX(0)
        }

        let text1 = this.btn_confirm.getChildByName("lab_text")?.getComponent(Label)!
        text1.string = this.build_args.confirm_text || "Confirm"

        let text2 = this.btn_cancel.getChildByName("lab_text")?.getComponent(Label)!
        text2.string = this.build_args.cancel_text || "Cancel"
    }

    on_click_confirm() {
        this.hide_myself()
        if (this.build_args.confirm_callback) {
            this.build_args.confirm_callback()
        }
    }

    on_click_cancel() {
        this.hide_myself()
        if (this.build_args.cancel_callback) {
            this.build_args.cancel_callback()
        }
    }

    on_click_close() {
        this.hide_myself()
    }

}