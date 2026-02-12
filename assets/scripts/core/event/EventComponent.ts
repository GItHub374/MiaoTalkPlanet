/*
 * 事件对象基类，继承该类将拥有发送和接送事件的能力
 */


import { Component } from "cc";
import { mius } from "../mius";
import { EventData, EventListener } from "./EventManager";


export class EventComponent extends Component {
    private events: any = {};

    /**
     * 注册全局事件
     * @param event(string)      事件名
     * @param listener(function) 处理事件的侦听器函数
     * @param thisObj(object)    侦听函数绑定的this对象
     */
    public on_evt(event: string, listener: EventListener, thisObj: any) {
        let list: EventData[] = this.events[event];
        if (list == null) {
            list = [];
            this.events[event] = list;
        }
        let data: EventData = new EventData();
        data.event = event;

        let _listener: any = (_event: string, _args: any) => {
            //当一个节点销毁后，该节点就处于无效状态，可以通过 isValid 判断当前节点是否已经被销毁。
            if (!this.isValid) {
                this.clean_events()
                return;
            }
            listener.call(thisObj, _event, _args);
        }

        data.listener = _listener;
        data.obj = thisObj;
        list.push(data);

        mius.event.on(event, _listener, thisObj);
    }


    /**
     * 监听一次事件，事件响应后，该监听自动移除
     * @param event(string)      事件名
     * @param listener(function) 处理事件的侦听器函数
     * @param thisObj(object)    侦听函数绑定的this对象
     */
    public once_evt(event: string, listener: EventListener, thisObj: object) {
        let _listener: any = (_event: string, _args: any) => {
            this.off_evt(event);
            _listener = null;
            listener.call(thisObj, _event, _args);
        }
        this.on_evt(event, _listener, thisObj);
    }


    /**
     * 移除全局事件
     * @param event(string)      事件名
     * @param listener(function) 处理事件的侦听器函数
     * @param thisObj(object)    侦听函数绑定的this对象
     */
    public off_evt(event: string) {
        let ebs: EventData[] = this.events[event];
        if (!ebs) {
            return;
        }
        for (let eb of ebs) {
            mius.event.off(event, eb.listener, eb.obj);
        }
        delete this.events[event];
    }

    /** 
     * 触发全局事件 
     * @param event(string)      事件名
     * @param arg(Array)         事件参数
     */
    public dispatchEvent(event: string, arg: any = null) {
        mius.event.dispatchEvent(event, arg);
    }


    clean_events(){
        for (let event in this.events) {
            this.off_evt(event);
        }
        this.events = {}
    }

    /**
     * 销毁事件对象
     */
    public onDestroy() {
        this.clean_events()
    }

    public onDisable(){
        this.clean_events()
    }
}