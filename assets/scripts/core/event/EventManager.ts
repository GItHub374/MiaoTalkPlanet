import { assert, log, warn } from "cc";
import { mius } from "../mius";
import { BaseManager } from "../common/BaseManager";

export type EventListener = (event: string, args: any) => void;

export class EventData {
    public event!: string;
    public listener!: EventListener;
    public obj: any;
}


export class EventManager extends BaseManager {
    private events: any = {};

    clean(): void {
        this.events.clean();      
    }


    /**
     * 注册全局事件
     * @param event(string)      事件名
     * @param listener(function) 处理事件的侦听器函数
     * @param thisObj(object)    侦听函数绑定的this对象
     */
    on(event: string, listener: EventListener, thisObj: object) : EventData | null {
        assert( event && listener, `EventManager register [${event}] failed, event or listener is null` )

        let list : EventData[] = this.events[event];
        if (list == null) {
            list = [];
            this.events[event] = list;
        }

        let length = list.length;
        for (let i = 0; i < length; i++) {
            let bin = list[i];
            if (bin.listener == listener && bin.obj == thisObj) {
                mius.log.logError(`EventManager event [${event}] has been registered`);
                return null
            }
        }

        let data: EventData = new EventData();
        data.event = event;
        data.listener = listener;
        data.obj = thisObj;
        list.push(data);

        return data
    }

    /**
     * 监听一次事件，事件响应后，该监听自动移除
     * @param event 
     * @param listener 
     * @param thisObj 
     */
    once(event: string, listener: EventListener, thisObj: object) {
        let _listener: any = (_event: string, _args: any) => {
            this.off(_event, _listener, thisObj);
            _listener = null;
            listener.call(thisObj, _event, _args);
        }
        return this.on(event, _listener, thisObj);
    }

    /**
     * 移除全局事件
     * @param event(string)      事件名
     * @param listener(function) 处理事件的侦听器函数
     * @param thisObj(object)    侦听函数绑定的this对象
     */
    off(event: string, listener: Function, thisObj: object) {
        let list: EventData[] = this.events[event];
        if (!list) {
            return;
        }

        let length = list.length;
        for (let i = 0; i < length; i++) {
            let bin: EventData = list[i];
            if (bin.listener == listener && bin.obj == thisObj) {
                list.splice(i, 1);
                break;
            }
        }

        if (list.length == 0) {
            delete this.events[event];
        }
    }

    /** 
     * 触发全局事件 
     * @param event(string)      事件名
     * @param arg(any)           事件参数
     */
    dispatchEvent(event: string, arg: any = null) {
        let list: EventData[] = this.events[event];
        mius.log.logBusiness("dispatch event : " + event)

        if (list != null) {
            let temp: EventData[] = list.concat();
            for (let i = 0; i < temp.length; i++) {
                let eventBin = temp[i];
                eventBin.listener.call(eventBin.obj, event, arg);
            }
        }
    }
}