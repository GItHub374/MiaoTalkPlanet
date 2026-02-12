export class ProtocolTransfer {
    constructor() {
        
    }

    /**
     * 字符串转Uint8Array
     * @param str 
     * @returns 
     */
    public static string2Uint8Array(str : string) : Uint8Array {
        let _len = str.length
        let buf = new ArrayBuffer(_len)
        var bufView = new Uint8Array(buf);
        for (var i = 0; i < _len; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return bufView
    }

    /**
     * Uint8Array转字符串
     * @param buf 
     * @returns 
     */
    public static Uint8Array2string( buf : Uint8Array ) : string {
        return String.fromCharCode.apply(null, new Uint8Array(buf))
    }


    //构建一个视图，把字节数组写到缓存中，索引从0开始，大端字节序
    private static getView(bytes : any) {
        var view = new DataView(new ArrayBuffer(bytes.length));
        for (var i = 0; i < bytes.length; i++) {
            view.setUint8(i, bytes[i]);
        }
        return view;
    }

    //将字节数组转成有符号的8位整型，大端字节序
    public static toInt8(bytes : any) {
        return ProtocolTransfer.getView(bytes).getInt8(0);
    }
    //将字节数组转成无符号的8位整型，大端字节序
    public static toUint8(bytes : any) {
        return ProtocolTransfer.getView(bytes).getUint8(0);
    }
    //将字节数组转成有符号的16位整型，大端字节序
    public static toInt16(bytes : any) {
        return ProtocolTransfer.getView(bytes).getInt16(0);
    }
    //将字节数组转成无符号的16位整型，大端字节序
    public static toUint16(bytes:any) {
        return ProtocolTransfer.getView(bytes).getUint16(0);
    }
    //将字节数组转成有符号的32位整型，大端字节序
    public static toInt32(bytes : any) {
        return ProtocolTransfer.getView(bytes).getInt32(0);
    }
    //将字节数组转成无符号的32位整型，大端字节序
    public static toUint32(bytes : any) {
        return ProtocolTransfer.getView(bytes).getUint32(0);
    }
    //将字节数组转成32位浮点型，大端字节序
    public static toFloat32(bytes : any) {
        return ProtocolTransfer.getView(bytes).getFloat32(0);
    }
    //将字节数组转成64位浮点型，大端字节序
    public static toFloat64(bytes : any) {
        return ProtocolTransfer.getView(bytes).getFloat64(0);
    }

    //将数值写入到视图中，获得其字节数组，大端字节序
    private static getUint8Array(len : number, setNum : Function) {
        var buffer = new ArrayBuffer(len);  //指定字节长度
        setNum(new DataView(buffer));  //根据不同的类型调用不同的函数来写入数值
        return new Uint8Array(buffer); //创建一个字节数组，从缓存中拿取数据
    }
    //得到一个8位有符号整型的字节数组，大端字节序
    public static getInt8Bytes(num : number) {
        return ProtocolTransfer.getUint8Array(1, function (view : any) { view.setInt8(0, num); })
    }
    //得到一个8位无符号整型的字节数组，大端字节序
    public static getUint8Bytes(num : number) {
        return ProtocolTransfer.getUint8Array(1, function (view : any) { view.setUint8(0, num); })
    }
    //得到一个16位有符号整型的字节数组，大端字节序
    public static getInt16Bytes(num : number) {
        return ProtocolTransfer.getUint8Array(2, function (view : any) { view.setInt16(0, num); })
    }
    //得到一个16位无符号整型的字节数组，大端字节序
    public static getUint16Bytes(num : number) {
        return ProtocolTransfer.getUint8Array(2, function (view : any) { view.setUint16(0, num); })
    }
    //得到一个32位有符号整型的字节数组，大端字节序
    public static getInt32Bytes(num : number) {
        return ProtocolTransfer.getUint8Array(4, function (view : any) { view.setInt32(0, num); })
    }
    //得到一个32位无符号整型的字节数组，大端字节序
    public static getUint32Bytes(num : number) {
        return ProtocolTransfer.getUint8Array(4, function (view : any) { view.setUint32(0, num); })
    }
    //得到一个32位浮点型的字节数组，大端字节序
    public static getFloat32Bytes(num : number) {
        return ProtocolTransfer.getUint8Array(4, function (view : any) { view.setFloat32(0, num); })
    }
    //得到一个64位浮点型的字节数组，大端字节序
    public static getFloat64Bytes(num : number) {
        return ProtocolTransfer.getUint8Array(8, function (view : any) { view.setFloat64(0, num); })
    }
}