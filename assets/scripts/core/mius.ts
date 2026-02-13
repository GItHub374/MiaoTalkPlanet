import { LayerManager } from "./ui/layer/LayerManager";
import { EventManager } from "./event/EventManager"
import { StorageManager } from "./common/storage/StorageManager";
import { LanguageManager } from "./common/language/LanguageManager";
import { EVENT_VAR } from "../game/config/event_config";
import { HttpTool } from "./network/HttpTool";
import { TimeTool } from "./common/tool/time_tool";
import { Logger } from "./common/log/Logger";
import { AppConfig } from "./AppConfig";
import { HeartbeatController } from "./network/HeartbeatController";
import { SocketNode } from "./network/SocketNode";
import { debug_controller } from "../debug/debug_controller";
import { AudioManager } from "./common/audio/AudioManager";
import { ResLoader } from "./common/loader/ResLoader";
import { UserManager } from "../game/data/UserManager";
import { BundleManager } from "./common/bundle/BundleManager";

/**全局变量管理
 * 
 * mius.gui ： ui管理
 */
export class mius {
    /**游戏配置 */
    public static app_config : AppConfig;

    /** 界面管理 */
    public static gui : LayerManager;

    /**事件分发器 */
    public static event : EventManager;

    /**音频管理 */
    public static audio : AudioManager;

    /**本地存储 */
    public static storage : StorageManager;

    public static user : UserManager;

    /**调试 */
    public static debug_ctr : debug_controller;

    /**Http 请求 */
    public static http : HttpTool;

    /**多语言管理 */
    public static language : LanguageManager;

    public static bundle: BundleManager;

    /**Socket */
    public static socket : SocketNode;

    /**heartbeat */
    public static heartbeat_ctr : HeartbeatController;

    /**资源加载 */
    public static res : ResLoader;

    /**时间处理模块 */
    public static time = TimeTool;

    /**日志 */
    public static log = Logger;

    /**游戏事件列表 */
    public static evt = EVENT_VAR;

    public static clean_manager(){
        mius.storage.clean()
        mius.language.clean()
        mius.event.clean()
        mius.heartbeat_ctr.clean()
        mius.audio.clean()
        mius.debug_ctr.clean()
        mius.gui.clean()
        mius.event.clean()
        mius.user.clean()
        mius.bundle.clean()
    }
}