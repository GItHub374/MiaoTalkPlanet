// import proto from "../../../proto/proto.js"
// import { NativeTool } from "../../core/common/tool/native_tool";
// import { mius } from "../../core/mius";
// import { ProtoUnit, ProtoMapObject } from "../../core/network/ProtoUnit";
// import { UIID } from "../config/ui_config";
// import { LudoManager } from "../ludo/LudoManager";

// export class protocol_game extends ProtoUnit {

//     public get_send_proto(): ProtoMapObject[] {
//         return [
//             { name: "pb.HBC2S", protocol: proto.pb.HBC2S },
//             { name: "pb.RefreshUserInfoC2S", protocol: proto.pb.RefreshUserInfoC2S },
//             { name: "pb.GetTodayWinC2S", protocol: proto.pb.GetTodayWinC2S },

//             { name: "pb.SitDownC2S", protocol: proto.pb.SitDownC2S },
//             { name: "pb.StandUpC2S", protocol: proto.pb.StandUpC2S },
//         ]
//     }

//     public get_recv_proto(): ProtoMapObject[] {
//         return [
//             { name: "pb.HBS2C", protocol: proto.pb.HBS2C },
//             { name: "pb.UserInfoS2C", protocol: proto.pb.UserInfoS2C },
//             { name: "pb.CoinS2C", protocol: proto.pb.CoinS2C },
//             { name: "pb.RefreshUserInfoS2C", protocol: proto.pb.RefreshUserInfoS2C },
//             { name: "pb.OtherLoginS2C", protocol: proto.pb.OtherLoginS2C },
//             { name: "pb.TodayWinS2C", protocol: proto.pb.TodayWinS2C },
//             { name: "pb.GetTodayWinS2C", protocol: proto.pb.GetTodayWinS2C },

//             { name: "pb.SitDownS2C", protocol: proto.pb.SitDownS2C },
//             { name: "pb.SitDownS2A", protocol: proto.pb.SitDownS2A },
//             { name: "pb.StandUpS2C", protocol: proto.pb.StandUpS2C },
//             { name: "pb.StandUpS2A", protocol: proto.pb.StandUpS2A },
//         ]
//     }

//     /**
//      * 心跳包
//      * @param _proto 
//      * @param data 
//      */
//     public recv_msg_HBS2C(_proto: string, data: proto.pb.HBS2C) {
//         mius.log.logNet("recv_msg_" + _proto)
//         mius.heartbeat_ctr.recv_heartbeat()
//     }

//     public recv_msg_UserInfoS2C(_proto: string, data: proto.pb.UserInfoS2C) {
//         mius.log.logNet("recv_msg_" + _proto)
//         mius.log.table(data);

//         mius.user.uid = data.uid;
//         mius.user.coin = data.coin;
//         mius.user.nickname = data.name
//         mius.user.avatar = data.avatar
//         mius.user.today_win = data.todayWin

//         mius.event.dispatchEvent(mius.evt.GAME_EVT.USER_INFO, data)
//     }

//     public recv_msg_CoinS2C(_proto: string, data: proto.pb.CoinS2C) {
//         mius.log.logNet("recv_msg_" + _proto)
//         mius.log.logModel("coin balance ：" + data.coin);

//         mius.user.coin = data.coin;

//         mius.event.dispatchEvent(mius.evt.GAME_EVT.COIN_UPDATE, data)
//     }

//     public recv_msg_OtherLoginS2C(_proto: string, data: proto.pb.OtherLoginS2C) {
//         mius.log.logNet("recv_msg_" + _proto)

//         mius.event.dispatchEvent(mius.evt.GAME_EVT.OTHER_LOGIN)
//     }

//     public recv_msg_RefreshUserInfoS2C(_proto: string, data: proto.pb.RefreshUserInfoS2C) {
//         mius.log.logNet("recv_msg_" + _proto)
//         mius.log.table(data);

//         mius.user.coin = data.coin;

//         mius.event.dispatchEvent(mius.evt.GAME_EVT.INITIATIVE_COIN_UPDATE, data)
//     }

//     public recv_msg_TodayWinS2C(_proto: string, data: proto.pb.TodayWinS2C) {
//         mius.log.logNet("recv_msg_" + _proto)
//         mius.log.table(data);

//         mius.user.today_win = data.win;

//         mius.event.dispatchEvent(mius.evt.GAME_EVT.TODAY_WIN, data)
//     }

//     public recv_msg_GetTodayWinS2C(_proto: string, data: proto.pb.GetTodayWinS2C) {
//         mius.log.logNet("recv_msg_" + _proto)
//         mius.log.table(data);

//         mius.user.today_win = data.win;

//         mius.event.dispatchEvent(mius.evt.GAME_EVT.TODAY_WIN, data)
//     }

//     public recv_msg_SitDownS2C(_proto: string, data: proto.pb.SitDownS2C) {
//         mius.log.logNet("recv_msg_" + _proto)
//         mius.log.table(data);

//         if (data.code == proto.pb.RetCode.SITDOWNS2C_FAIL) {
//             mius.gui.show_toast(mius.language.getLangByKey("GMAE_FAILED"))
//         } else if (data.code == proto.pb.RetCode.SITDOWNS2C_KICK_COOLDOWN) {
//             let leftSeconds = data.leftSeconds || 1;
//             mius.gui.show_toast(mius.language.formatLangByKey("GAME_LUDO_TIPS2", leftSeconds.toString()))
//         } else if (data.code == proto.pb.RetCode.SITDOWNS2C_NOT_EMPTY) {
//             mius.gui.show_toast(mius.language.getLangByKey("GMAE_FAILED"))
//         } else if (data.code == proto.pb.RetCode.SITDOWNS2C_ALREADY_SIT) {
//             mius.gui.show_toast(mius.language.getLangByKey("GAME_LUDO_TIPS5"))
//         } else if (data.code == proto.pb.RetCode.SITDOWNS2C_GAME_STARTED) {
//             mius.gui.show_toast(mius.language.getLangByKey("GMAE_FAILED"))
//         } else if (data.code == proto.pb.RetCode.SITDOWNS2C_MONEY_NOT_ENOUGH) {
//             // mius.gui.show_toast(mius.language.getLangByKey("GAME_ROULETTE_BALANCE_TIPS1"))
//             mius.gui.show_popup(UIID.LUDO_NOTICE_POPUP, {
//                 btn_count: 2,
//                 content: mius.language.getLangByKey("GAME_ROULETTE_BALANCE_TIPS1"),
//                 cancel_text: mius.language.getLangByKey("GAME_ROULETTE_CANCEL"),
//                 confirm_text: mius.language.getLangByKey("GAME_ROULETTE_RECHARGE"),
//                 confirm_callback: () => { NativeTool.call_native_func("openChargePage") },
//             })
//         } else if (data.code == proto.pb.RetCode.RET_CODE_SUCC) {
//             mius.socket.send_protocol("pb.LudoReadyC2S")
//             mius.event.dispatchEvent(mius.evt.GAME_EVT.SIT_DOWN_RSP, data)
//         }
//     }

//     public recv_msg_SitDownS2A(_proto: string, data: proto.pb.SitDownS2A) {
//         mius.log.logNet("recv_msg_" + _proto)
//         mius.log.table(data);

//         LudoManager.instance.update_one_seat_info(data);
//         mius.event.dispatchEvent(mius.evt.GAME_EVT.SIT_DOWN_BRC, data)
//     }

//     public recv_msg_StandUpS2C(_proto: string, data: proto.pb.StandUpS2C) {
//         mius.log.logNet("recv_msg_" + _proto)
//         mius.log.table(data);

//         if (data.code == proto.pb.RetCode.STANDUPS2C_FAIL) {
//             mius.gui.show_toast(mius.language.getLangByKey("GMAE_FAILED"))
//         } else if (data.code == proto.pb.RetCode.STANDUPS2C_GAME_STARTED) {
//             mius.gui.show_toast(mius.language.getLangByKey("GMAE_FAILED"))
//         }

//         mius.event.dispatchEvent(mius.evt.GAME_EVT.STAND_UP_RSP, data)
//     }

//     public recv_msg_StandUpS2A(_proto: string, data: proto.pb.StandUpS2A) {
//         mius.log.logNet("recv_msg_" + _proto)
//         mius.log.table(data);

//         LudoManager.instance.reset_seat_info(data.seatId);
//         mius.event.dispatchEvent(mius.evt.GAME_EVT.STAND_UP_BRC, data)
//     }
// }