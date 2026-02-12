
/*
 * 网络相关接口定义
 */

import { ProtocolTransfer } from "./ProtocolTransfer";

export type NetData = (string | ArrayBufferLike | Blob | ArrayBuffer);




export interface NetConnectOptions {
    host          ?: string,     // 地址
    port          ?: number,     // 端口
    url           ?: string,     // url，与地址+端口二选一
    succ_callback ?: Function,   // 连接成功回调
}


// 协议辅助接口
export interface IProtocolHelper {
    getHeadlen(): number;                   // 返回包头长度
    getHearbeat(): NetData;                 // 返回一个心跳包
    getPackageLen(msg: NetData): number;    // 返回整个包的长度
    checkPackage(msg: NetData): boolean;    // 检查包数据是否合法
    getPackageId(msg: NetData): string;     // 返回包的id或协议类型
    getPackageData(msg:NetData):string | Uint8Array;     // 获取包除去包头后的内容
    packData(name:string, data:Uint8Array):NetData; //打包协议数据
}

// 默认字符串协议对象
export class DefStringProtocol implements IProtocolHelper {
    getHeadlen(): number {
        return 0;
    }
    getHearbeat(): NetData {
        return "";
    }
    getPackageLen(msg: NetData): number
    {
        return msg.toString().length;
    }
    checkPackage(msg: NetData): boolean {
        return true;
    }
    getPackageId(msg: NetData): string {
        return "";
    }
    getPackageData(msg: NetData): string | Uint8Array {
        return msg.toString()
    }
    packData(name: string, data: Uint8Array): NetData {
        return "";
    }
}

//协议包头名字的字符长度
let PACK_NAME_LEN = 2

//protocolbuf 协议对象
//[2]+[name]+[content]
//前两位代表接下来协议名字的长度
export class DefProtobufferHelper implements IProtocolHelper{
    getHeadlen(): number {
        return PACK_NAME_LEN;
    }
    getHearbeat(): NetData {
        return "";
    }
    getPackageLen(msg: NetData): number
    {
        return msg.toString().length;
    }
    checkPackage(msg: NetData): boolean {
        return true;
    }
    getPackageId(msg: NetData): string {
        let _data = new Uint8Array(msg as ArrayBuffer)
        let _head = _data.slice( 0, PACK_NAME_LEN )
        let _name_length = ProtocolTransfer.toUint16(_head)
        let _name = _data.slice( PACK_NAME_LEN, PACK_NAME_LEN + _name_length )
        return ProtocolTransfer.Uint8Array2string(_name);
    }

    getPackageData(msg: NetData): string | Uint8Array {
        let _data = new Uint8Array(msg as ArrayBuffer)
        let _head = _data.slice( 0, PACK_NAME_LEN )
        let _name_length = ProtocolTransfer.toUint16(_head)
        let _tmp = _data.slice( PACK_NAME_LEN + _name_length )
        return new Uint8Array(_tmp);
    }

    packData(name: string, data: Uint8Array): NetData {
        let _name_buf = ProtocolTransfer.string2Uint8Array(name)
        let _head = ProtocolTransfer.getInt16Bytes(name.length)
        let _total_len = data.length + PACK_NAME_LEN + _name_buf.length;
        let result = new Uint8Array(_total_len);
        result.set(_head, 0)
        result.set(_name_buf, PACK_NAME_LEN)
        result.set(data, PACK_NAME_LEN + _name_buf.length)
        return result;
    }
}