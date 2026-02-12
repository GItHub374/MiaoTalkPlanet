import { Component, macro } from "cc";
import { mius } from "../mius";
import { BaseManager } from "../common/BaseManager";
import { TimeTool } from "../common/tool/time_tool";


export class HeartbeatController extends BaseManager {
    clean(){
        this.stop_heartbeat_timer()
        this._wait_heartbeat_rsp_timer = null
        this._no_heartbeat_rsp_count = 0
    }

    /**
     * 等待心跳返回定时器
     */
    private _wait_heartbeat_rsp_timer: any = null;

    /**
     * 连续收不到心跳返回的次数
     */
    private _no_heartbeat_rsp_count: number = 0;

    private _send_tick : number = 0;

    /**
     * 启动心跳定时器
     */
    public start_heartbeat_timer() {
        this.stop_heartbeat_timer();

        //6秒发送一次心跳
        this.schedule( this.heartbeat_call, 6, macro.REPEAT_FOREVER, 0 )
    }

    private heartbeat_call(){
        mius.log.logNet("heartbeat_call send Hearbeat")
        //发送心跳
        mius.socket.send_protocol( "pb.HBC2S" )

        this._send_tick = TimeTool.get_now_ms()

        //等待心跳返回
        this._wait_heartbeat_rsp_timer = setTimeout( ()=>{
            this._no_heartbeat_rsp_count++;
            mius.log.logNet("wait heartbeat count = " + this._no_heartbeat_rsp_count)
            if (this._no_heartbeat_rsp_count >= 3) {
                //连续三次收不到心跳返回,就断线重连
                this.process_netbreak()
            }
        }, 5700 )
    }

    /**
     * 处理网络断开
     */
    private process_netbreak(){
        this._no_heartbeat_rsp_count = 0
        this.stop_heartbeat_timer()

        mius.log.logNet("收不到心跳,需要断线重连")        
        mius.socket.reconnect()
    }

    /**
     * 停止心跳定时器
     */
    public stop_heartbeat_timer(){
        this.unschedule(this.heartbeat_call);

        if (this._wait_heartbeat_rsp_timer) {
            clearTimeout( this._wait_heartbeat_rsp_timer )            
        }
    }

    /**
     * 接收到心跳返回
     */
    public recv_heartbeat(){
        this._no_heartbeat_rsp_count = 0
        if (this._wait_heartbeat_rsp_timer) {
            clearTimeout( this._wait_heartbeat_rsp_timer )
        }

        let now = TimeTool.get_now_ms()
        let diff = now - this._send_tick
        mius.event.dispatchEvent( mius.evt.SYS_EVT.SIGNAL_BRC, {delay : diff} )

        this._send_tick = 0
    }
}