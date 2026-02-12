import { IProtocolHelper, NetData, DefProtobufferHelper, NetConnectOptions } from "./SocketInterface";
import { mius } from "../mius";
import { Component, assert, director, macro, warn } from "cc";
import { HeartbeatController } from "./HeartbeatController";
import { ProtoUnit } from "./ProtoUnit";
// import { protocol_game } from "../../game/protobuf/protocol_game";
// import { protocol_ludo } from "../../game/ludo/protocol_ludo";



/**
 * socket节点当前状态
 */
export enum SOCKET_NODE_STATE {
    CLOSED     = 0,   // 已关闭
    CONNECTING,       // 连接中
    WORKING   ,       // 可传输数据
}

/**网络遮罩key */
let NET_MASK_KEY = "WEBSOCKET_CONNECT"

/**客户端主动断开链接的code，在onclose回调中 */
let CLIENT_CLOSE_CODE = 4444;

/**客户端主动断开链接并需要重连的code */
let CLIENT_RECONNECT_CODE = 4445;



export class SocketNode extends Component {
    private static _instance: SocketNode;
    public static get instance(): SocketNode {
        if (!this._instance) {
            this._instance = new SocketNode();
        }
        return this._instance;
    }

    /**
     * 接收协议的映射
     */
    private _recv_protocol_map : {[key:string]:any} = {};

    /**
     * 发送协议的映射
     */
    private _send_protocol_map : {[key:string]:any} = {};

    /**
     * 协议单元
     */
    private _protocol_units : ProtoUnit[] = [];

    /**
     * 数据包的解析对象
     */
    protected _protobuf_helper: DefProtobufferHelper | null = null;

    /**
     * websocket对象 
     */
    private _websocket: WebSocket | null = null;

    /**
     * 连接参数
     */
    protected _connect_option: NetConnectOptions | null = null;
    get connect_option() {return this._connect_option;}
    

    /**是否等待重连 */
    private _is_wait_reconnect: boolean = false;
    /**等待重连的计时 */
    private _wait_reconnect_time : number = 0;
    /**当前重连尝试次数 */
    private _try_reconnect_num : number = 0;
    /**尝试重连的间隔 */
    private _reconnect_interval : number = 3;

    /**节点当前状态 */
    protected _state: SOCKET_NODE_STATE = SOCKET_NODE_STATE.CLOSED;




    constructor(){
        super();

        this._protobuf_helper = new DefProtobufferHelper();
    }


    /**
     * 初始化websocket
     * @param options 
     * @returns 
     */
    private init_socket(options: any) {
        if (this._websocket) {
            if (this._websocket.readyState === WebSocket.CONNECTING) {
                mius.log.logNet("websocket connecting, wait for a moment...")
                return false;
            }
        }

        let url = null;
        if(options.url) {
            url = options.url;
        } else {
            url = `${options.protocol}://${options.ip}:${options.port}`;    
        }
        mius.log.logNet("websocket url = "+url)
        this._websocket = new WebSocket(url);
        this._websocket.binaryType = "arraybuffer";
        this._websocket.onmessage = (event) => {
            this.onMessage(event.data);
        };
        this._websocket.onopen = (event) => {this.onConnected(event);}
        this._websocket.onerror = (event) => {this.onError(event)};
        this._websocket.onclose = (event) => {this.onClosed(event)};
        // this._websocket.onclose = this.onClosed;//这种写法中，回调函数中的 this 值将会是事件的触发者，而不是类的实例。
        return true;
    }

    /**
     * 发起连接
     * @param options 
     * @returns 
     */
    public connect(options: NetConnectOptions): boolean {
        if (this._state == SOCKET_NODE_STATE.CLOSED) {
            this._state = SOCKET_NODE_STATE.CONNECTING;
            if (!this.init_socket(options)) {
                return false;
            }
            this._connect_option = options;
            //显示遮罩，不自动移除
            mius.gui.show_mask( {key : NET_MASK_KEY, show_sec : 0} )

            this._try_reconnect_num += 1

            //开一个定时器，检测重连状态
            this.schedule( this.net_update, 0.01, macro.REPEAT_FOREVER, 0 )
            return true;
        }
        return false;
    }

    private net_update(dt? : number){
        if (this._state == SOCKET_NODE_STATE.CLOSED) {
            //如果在断线状态，等待重连
            if (this._is_wait_reconnect) {
                this._wait_reconnect_time += dt!;
                if (this._wait_reconnect_time >= this._reconnect_interval) {
                    this._is_wait_reconnect = false
                    this._wait_reconnect_time = 0
                    this.connect(this._connect_option!);
                }
            }

        }else if (this._state == SOCKET_NODE_STATE.CONNECTING) {

        }

    }






    /*************************** websocket 状态处理 begin ********************** */
    /**
     * 网络连接成功
     * @param event 
     */
    protected onConnected(event : any) {
        mius.log.logNet("SocketNode onConnected!")

        mius.gui.remove_mask( NET_MASK_KEY )

        this._state = SOCKET_NODE_STATE.WORKING;

        //清空重连状态
        this._is_wait_reconnect = false
        this._wait_reconnect_time = 0
        this._try_reconnect_num = 0

        //链接成功之后注册协议
        this.register_protocol( [
            // new protocol_game(),
            // new protocol_ludo(),
        ] )

        if (this._connect_option && this._connect_option.succ_callback) {
            this._connect_option.succ_callback()
        }

        mius.heartbeat_ctr.start_heartbeat_timer()

        mius.event.dispatchEvent( mius.evt.WS_EVT.CONNECTED )

        mius.log.logNet("SocketNode onConnected! state =" + this._state);
    }

    /**
     * 接收到一个完整的消息包
     * @param msg 
     * @returns 
     */
    protected onMessage(msg : any): void {
        // mius.log.logNet(`SocketNode onMessage status = ` + this._state);

        // 触发消息执行
        let _rp = this._protobuf_helper!.getPackageId(msg);
        mius.log.logNet(`SocketNode onMessage _rp = ` + _rp);

        if (!_rp.startsWith(mius.app_config.proto_package)) {
            mius.log.logNet("SocketNode onMessage _rp = " + _rp + " is not in proto_package = " + mius.app_config.proto_package);
            return;
        }

        let _data = this._protobuf_helper!.getPackageData(msg);
        this.recv_protocol( _rp, _data )
    }

    /**
     * 连接发生错误
     * @param event 
     */
    protected onError(event : any) {
        mius.log.logError(event);
        mius.log.logNet( "websocket status = " + this._websocket?.readyState )
        this._state = SOCKET_NODE_STATE.CLOSED;

        //等待重连
        this._is_wait_reconnect = true
        this._wait_reconnect_time = 0
        this._reconnect_interval = this._try_reconnect_num == 0 ? 0 : 3;
    }

    /**
     * 关闭连接
     * @param event 
     * @returns 
     */
    protected onClosed(event : any) {
        this.clearTimer();
        this._state = SOCKET_NODE_STATE.CLOSED;

        if (!event) {
            return
        }

        //无论是服务器还是客户端调用 WebSocket.close() 方法，只要连接干净地关闭，wasClean 都将为 true。
        mius.log.logNet("SocketNode onClose，wasClean = " + event?.wasClean + " code = " + event?.code + " reason = " + event?.reason);

        mius.event.dispatchEvent( mius.evt.WS_EVT.CLOSED )

        let _code = event.code
        let _wasclean = event.wasClean

        if (_code == CLIENT_CLOSE_CODE) {
         
            
        }else if (_code == CLIENT_RECONNECT_CODE) {
            this.connect(this._connect_option!);

        }else{
            //其他情况，可能是服务端断开
            if (_wasclean) {
                this.connect(this._connect_option!);
                
            }else{
                //非正常断开
                this._is_wait_reconnect = true
                this._wait_reconnect_time = 0
                this._reconnect_interval = this._try_reconnect_num == 0 ? 0 : 3;
            }
        }
    }

    /*************************** websocket 状态处理 end ********************** */



















    /**
     * 关闭socket，清空缓存和当前状态
     * 客户端主动关闭连接，code默认为 CLIENT_CLOSE_CODE
     */
    public close(code : number = CLIENT_CLOSE_CODE, reason?: string) {
        this.clearTimer();

        mius.gui.remove_mask( NET_MASK_KEY )

        if (this._websocket) {
            this._websocket.close(code, reason);
        } else {
            this.onClosed(null)
        }
    }

    /**主动断线重连 */
    public reconnect() {
        this.close(CLIENT_RECONNECT_CODE);
    }


    private send(buf: NetData): number {
        if (this._state == SOCKET_NODE_STATE.WORKING) {
            if (this._websocket && this._websocket.readyState == WebSocket.OPEN) {
                this._websocket.send(buf);
                return 1;
            }
            return -1;

        } else {
            mius.log.logError("SocketNode request error! current state is " + this._state);
            return -1;
        }
    }

    private pack(name:string, data:Uint8Array):NetData{
        return this._protobuf_helper?.packData( name, data )!
    }



    /**
     * 发送协议
     * @param protocol_name 
     * @param params 
     * @returns 
     */
    public send_protocol( protocol_name: string, params:any | null = null ) : number{
        let _proto = this._send_protocol_map[protocol_name]
        if (_proto == null) {
            warn("does not exist this send protocol: "+protocol_name);
            return -1
        }

        let msg = _proto.create( params )
        let obj = _proto.encode( msg );
        let text = obj.finish();
        mius.log.logNet("send_protocol : "+protocol_name)
        return this.send( this.pack( protocol_name, text ) )
    }

    /**接收协议 */
    public recv_protocol(cmd: string, data: any){
        let _proto : any = this._recv_protocol_map[cmd]
        assert(_proto != null, "does not register this cmd listener :"+cmd)

        let decode_data: any;

        for (let i = 0; i < this._protocol_units.length; i++) {
            let unit = this._protocol_units[i];
            let method_name = unit.convert_method_name( cmd )
            if (typeof unit[method_name as keyof ProtoUnit] === "function") {
                decode_data = _proto.decode(data);
                (unit[method_name as keyof ProtoUnit] as Function)(cmd, decode_data);
            }
        }
    }
    

    /**
     * 注册协议，在连接成功后调用
     */
    private register_protocol(_units: ProtoUnit[] = []) {
        this._protocol_units = _units;

        for (let i = 0; i < _units.length; i++) {
            let unit = _units[i];

            let send_proto = unit.get_send_proto();
            for (let j = 0; j < send_proto.length; j++) {
                let _sp = send_proto[j];
                let _send = this._send_protocol_map[_sp.name]
                if (!_send) {
                    this._send_protocol_map[_sp.name] = _sp.protocol
                }
            }

            let recv_proto = unit.get_recv_proto();
            for (let j = 0; j < recv_proto.length; j++) {
                let _rp = recv_proto[j];
                let _recv = this._recv_protocol_map[_rp.name]
                if (!_recv) {
                    this._recv_protocol_map[_rp.name] = _rp.protocol
                }
            }
        }    
    }



    protected clearTimer() {
        mius.heartbeat_ctr.stop_heartbeat_timer();
    }
}