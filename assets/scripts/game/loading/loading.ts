import { _decorator, Label, Prefab, Node, director, view, tween } from 'cc';
import { AsyncQueue, NextQueueFunc } from '../../core/common/queue/AsyncQueue';
import { ResLoader } from '../../core/common/loader/ResLoader';
import { mius } from '../../core/mius';
import { Root } from '../../core/Root';
import { AudioManager } from '../../core/common/audio/AudioManager';
import { StorageManager } from '../../core/common/storage/StorageManager';
import { LayerManager } from '../../core/ui/layer/LayerManager';
import { HttpTool } from '../../core/network/HttpTool';
import { SocketNode } from '../../core/network/SocketNode';
import { GUI } from '../../core/ui/GUI';
import { LanguageManager } from '../../core/common/language/LanguageManager';
import { debug_controller } from '../../debug/debug_controller';
import { EventManager } from '../../core/event/EventManager';
import { UserManager } from '../data/UserManager';
import { HeartbeatController } from '../../core/network/HeartbeatController';
import { AppConfig } from '../../core/AppConfig';
import { VERSION } from '../../version';
import { UIID } from '../config/ui_config';
import { BundleManager } from '../../core/common/bundle/BundleManager';

const { ccclass, property } = _decorator;

/**
 * 这个脚本挂在 loading.scene 的 root 节点下面，随游戏启动
 */

@ccclass('loading')
export class loading extends Root {
    private _queue: AsyncQueue = new AsyncQueue();

    @property(Node)
    public loading: Node = null!;

    @property(Node)
    public progress: Node = null!;

    @property(Node)
    public data_node: Node = null!;

    @property(Label)
    public lab_progress: Label = null!;

    @property(Label)
    public lab_version: Label = null!;

    @property(Node)
    public mask: Node = null!;

    start() {
        // if (DEBUG) 
        // profiler.showStats();

        //常驻节点
        director.addPersistRootNode(this.data_node);

        this.set_progress(0)

        this.lab_version.string = `v${VERSION}-${mius.app_config.is_debug_mode ? "1" : "0"}`;
    }

    protected init() {
        super.init();

        mius.app_config = new AppConfig();

        mius.res = new ResLoader();

        mius.user = this.data_node.getComponent(UserManager) || this.data_node.addComponent(UserManager)!;

        //事件系统
        mius.event = this.data_node.getComponent(EventManager) || this.data_node.addComponent(EventManager)!;

        mius.bundle = this.data_node.getComponent(BundleManager) || this.data_node.addComponent(BundleManager)!;

        mius.storage = this.data_node.getComponent(StorageManager) || this.data_node.addComponent(StorageManager)!;
        //配置存储密钥
        mius.storage.init(mius.app_config.storageKey, mius.app_config.storageIV);

        mius.audio = this.data_node.getComponent(AudioManager) || this.data_node.addComponent(AudioManager)!;
        //获取音频设置
        mius.audio.load()

        //多语言
        mius.language = this.data_node.getComponent(LanguageManager) || this.data_node.addComponent(LanguageManager)!;
        mius.language.lang_image_path = "cat:language"

        mius.debug_ctr = this.data_node.getComponent(debug_controller) || this.data_node.addComponent(debug_controller)!;

        //日志设置
        if (!mius.app_config.is_print_log) {
            mius.log.setTags(0)
        }

        mius.gui = this.data_node.getComponent(LayerManager) || this.data_node.addComponent(LayerManager)
        //根节点
        mius.gui.init(this.gui!);
        // 游戏尺寸修改事件
        var c_gui = this.gui?.addComponent(GUI)!;
        view.setResizeCallback(() => {
            c_gui.resize();
        });

        mius.http = new HttpTool();

        mius.socket = new SocketNode();

        mius.heartbeat_ctr = this.data_node.getComponent(HeartbeatController) || this.data_node.addComponent(HeartbeatController)!


        // 加载游戏配置
        mius.app_config.load(this.run.bind(this))
    }

    protected run() {
        // mius.debug_ctr.show_debug_button()

        // 加载公共资源
        this.load_assets();

        // 加载游戏内容加载进度提示界面
        this.onComplete();

        this._queue.play();
    }

    private set_progress(pro: number) {
        let total_width = this.progress.getContentSize().width;
        let show_width = total_width * pro;

        this.mask.setWidth(show_width)
        this.lab_progress.string = `${Math.floor(pro * 100)}%`
    }

    /** 加载公共资源 */
    private load_assets() {
        this._queue.push((next: NextQueueFunc, params: any) => {
            // 设置默认语言
            let lang = mius.language.get_default_language()

            // 加载语言包资源
            mius.language.setLanguage(lang, next);
        });

        this._queue.push((next: NextQueueFunc, params: any) => {
            mius.log.logNet("加载resources")

            mius.bundle.loadBundle("cat", next)
            // mius.res.loadDir("resources", null, next);
        });

        this._queue.push((next: NextQueueFunc, params: any) => {
            mius.log.logNet("加载 cat images")

            mius.res.loadDir("cat", "images", (finished: number, total: number, item: any) => {
                var progress = finished / total * 0.6;
                this.set_progress(progress)
            }, next);
        });

        this._queue.push((next: NextQueueFunc, params: any) => {
            mius.log.logNet("加载 cat prefab")

            mius.res.load("cat", "prefab/lobby", (err: Error | null, res: Prefab) => {
                this.set_progress(0.9)
            }, next);
        });
    }

    /** 加载完成进入游戏内容加载界面 */
    private onComplete() {
        this._queue.completeFunc = () => {

            if (!mius.gui.get_is_showing(UIID.LOBBY_UI)) {
                mius.gui.show_ui(UIID.LOBBY_UI);
                // mius.bundle.loadBundle("story")
                // mius.gui.show_ui(UIID.STORY_MAIN);
            }
            // let uid = mius.user.uid;
            // let token = mius.user.token
            // let room_id = mius.user.room_id
            // let region_id = mius.user.region_id

            // if (BUILD) {
            //     let ip = GlobalTool.get_host()
            //     ip = "wss://" + ip

            //     if (mius.user.test_host != "") {
            //         ip = "ws://" + mius.user.test_host
            //     }

            //     let url = `${ip}/${region_id}?uid=${uid}&token=${token}&roomId=${room_id}`
            //     mius.socket.connect({
            //         url: url,
            //         succ_callback: this.on_connect_callback.bind(this)
            //     })
            // } else {
            //     let ip = "192.168.0.205";
            //     let port = 10680;
            //     if (uid == 0) {
            //         uid = 9009
            //     }
            //     token = "123456"
            //     room_id = 9009
            //     let url = `ws://${ip}:${port}/${region_id}?uid=${uid}&token=${token}&roomId=${room_id}`
            //     mius.socket.connect({
            //         url: url,
            //         succ_callback: this.on_connect_callback.bind(this)
            //     })
            // }
        };
    }

    on_connect_callback() {
        // mius.gui.show_toast( "成功连接服务器" )
        // this.loading.active = false;
    }
}


/**
 * 设置背景透明
 * 1、在项目设置->宏配置中，勾选ENABLE_TRANSPARENT_CANVAS
 * 2、在canavas的相机中设置clear color的透明度为0
 * 3、在打包后的文件夹中，找到css文件，注释掉 background-color: #333; 这一行
 */

/**
 * 关于协议
 * 当前小游戏用到的协议写在 proto/config.txt 里面，这样只转换了需要的协议，避免太多
 */