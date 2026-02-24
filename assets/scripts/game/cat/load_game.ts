import { _decorator, Label, Node, Component } from 'cc';
import { AsyncQueue, NextQueueFunc } from '../../core/common/queue/AsyncQueue';
import { mius } from '../../core/mius';
import { UIID } from '../config/ui_config';
import { UIComponent } from '../../core/ui/layer/UIComponent';

const { ccclass, property } = _decorator;

@ccclass('load_game')
export class load_game extends UIComponent {
    private _queue: AsyncQueue = new AsyncQueue();

    @property(Node)
    public progress: Node = null!;

    @property(Label)
    public lab_progress: Label = null!;

    @property(Node)
    public mask: Node = null!;

    bundle_name:string = ""
    img_path:string = ""
    show_uid:number = -1

    onLoad(): void {
        super.onLoad()
        this.bundle_name = this.build_args.bundle_name
        this.img_path = this.build_args.img_path
        this.show_uid = this.build_args.show_uid
    }

    start() {
        this.set_progress(0)
        this.load_res()
    }

    private set_progress(pro: number) {
        let total_width = this.progress.getContentSize().width;
        let show_width = total_width * pro;

        this.mask.setWidth(show_width)
        this.lab_progress.string = `${Math.floor(pro * 100)}%`
    }

    protected load_res() {
        // 加载公共资源
        this.load_assets();

        // 加载游戏内容加载进度提示界面
        this.onComplete();

        this._queue.play();
    }

    /** 加载公共资源 */
    private load_assets() {
        this._queue.push((next: NextQueueFunc, params: any) => {
            mius.bundle.loadBundle(this.bundle_name, next)
        });

        if (this.img_path != ""){
            this._queue.push((next: NextQueueFunc, params: any) => {
                mius.log.logNet("加载 " + this.bundle_name + " " + this.img_path)

                mius.res.loadDir(this.bundle_name, this.img_path, (finished: number, total: number, item: any) => {
                    var progress = finished / total * 0.6;
                    this.set_progress(progress)
                }, next);
            });
        }
    }

    /** 加载完成进入游戏内容加载界面 */
    private onComplete() {
        this._queue.completeFunc = () => {
            if (!mius.gui.get_is_showing(this.show_uid)) {
                mius.gui.show_ui(this.show_uid);
            }
            this.hide_myself()
        };
    }
}