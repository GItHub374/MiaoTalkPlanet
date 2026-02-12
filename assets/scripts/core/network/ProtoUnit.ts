export interface ProtoMapObject {
    name:string,
    protocol:any
}

export class ProtoUnit {
    public convert_method_name(cmd : string){
        return "recv_msg_" + cmd.replace(/^pb\./, "");
    }

    public get_send_proto()  : ProtoMapObject[] {
        return []
    }

    public get_recv_proto()  : ProtoMapObject[] {
        return []
    }
}