import { Camera, Component, ResolutionPolicy, screen, UITransform, view, _decorator, Size, Canvas, math } from "cc";
import { mius } from "../mius";

const { ccclass, menu } = _decorator;

/** 屏幕适配组件
 * 作为组件添加到界面上，在Root.init里面添加
 */
@ccclass('GUI')
export class GUI extends Component {
    /** 界面层矩形信息组件 */
    public transform!: UITransform;
    /** 游戏二维摄像机 */
    public camera!: Camera;
    /** 是否为竖屏显示 */
    public portrait!: boolean;

    /** 竖屏设计尺寸 */
    private portrait_design_size: math.Size = null!;
    /** 横屏设计尺寸 */
    private landscape_design_size: math.Size = null!;

    onLoad() {
        this.init();
    }

    /** 初始化引擎 */
    protected init() {
        this.transform = this.getComponent(UITransform)!;
        this.camera = this.getComponentInChildren(Camera)!;

        if (view.getDesignResolutionSize().width > view.getDesignResolutionSize().height) {
            this.landscape_design_size = view.getDesignResolutionSize();
            this.portrait_design_size = new math.Size(this.landscape_design_size.height, this.landscape_design_size.width);
        }
        else {
            this.portrait_design_size = view.getDesignResolutionSize();
            this.landscape_design_size = new math.Size(this.portrait_design_size.height, this.portrait_design_size.width);
        }

        this.resize();
    }

    public resize() {
        let design_size;
        if (view.getDesignResolutionSize().width > view.getDesignResolutionSize().height) {
            design_size = this.landscape_design_size;
        }
        else {
            design_size = this.portrait_design_size
        }

        var framesize = screen.windowSize;
        var rw = framesize.width;
        var rh = framesize.height;
        var finalW = rw;
        var finalH = rh;

        let scaleX = rw / design_size.width;
        let scaleY = rh / design_size.height;

        if ((rw / rh) >= (design_size.width / design_size.height)) {
            // 如果更宽，则用定高
            finalW = rw / scaleY;
            finalH = rh / scaleY;
            this.portrait = false;
        }
        else {
            // 如果更短，则用定宽
            finalW = rw / scaleX;
            finalH = rh / scaleX;
            this.portrait = true;
        }

        // 手工修改canvas和设计分辨率，这样反复调用也能生效。
        view.setDesignResolutionSize(finalW, finalH, ResolutionPolicy.NO_BORDER);
        this.transform!.width = finalW;
        this.transform!.height = finalH;

        mius.log.logView(design_size, "设计尺寸");
        mius.log.logView(framesize, "屏幕尺寸");
    }
}