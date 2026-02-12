/**
 * 时间处理的模块
 */

import { math } from "cc";

export module TimeTool {
    /**获取当前时间戳，秒 */
    export function get_now() : number {
        return Date.parse(new Date().toString()) / 1000
    }

    /**获取当前时间戳，毫秒 */
    export function get_now_ms() : number {
        return new Date().getTime()
    }

    /**将秒数转换为时间字符串，格式为 mm:ss */
    export function int_to_mmss(num: number): string {
        const minutes = Math.floor(num / 60);
        const seconds = num % 60;
        const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${minutesStr}:${secondsStr}`;
    }

    /**将秒数转换为时间字符串，格式为 hh:mm:ss */
    export function int_to_hhmmss(num: number): string {
        const hours = Math.floor(num / 3600);
        const minutes = Math.floor((num % 3600) / 60);
        const seconds = num % 60;
        const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
        const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }

    /**把时间戳转成 yyyy/mm/dd 的格式字符串 */
    export function format_date(timestamp: number, symbol : string = "/"): string {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        return `${year}${symbol}${month}${symbol}${day}`;
    }

    /**获取当月1号，转成 yyyy/mm/dd 的格式字符串 */
    export function format_month_first_day(timestamp: number, symbol : string = "/"): string {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = "01";
        return `${year}${symbol}${month}${symbol}${day}`;
    }

    /**获取当周周一，转成 yyyy/mm/dd 的格式字符串 */
    export function get_week_monday(timestamp: number, symbol: string = "/"): string {
        const date = new Date(timestamp * 1000);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
        const monday = new Date(date.setDate(diff));
        const year = monday.getFullYear();
        const month = ("0" + (monday.getMonth() + 1)).slice(-2);
        const dayOfMonth = ("0" + monday.getDate()).slice(-2);
        return `${year}${symbol}${month}${symbol}${dayOfMonth}`;
    }

    /**把时间戳转成 hh:mm:ss 的格式字符串 */
    export function format_time(timestamp: number): string {
        const date = new Date(timestamp * 1000); 
        const hours = ("0" + date.getHours()).slice(-2); 
        const minutes = ("0" + date.getMinutes()).slice(-2); 
        const seconds = ("0" + date.getSeconds()).slice(-2); 
        return `${hours}:${minutes}:${seconds}`;
    }
    
    /**把时间戳转成 yyyy/mm/dd hh:mm 的格式字符串 */
    export function format_time_with_ymd_hm(timestamp: number): string {
        const date = new Date(timestamp * 1000); 
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const hours = ("0" + date.getHours()).slice(-2); 
        const minutes = ("0" + date.getMinutes()).slice(-2); 
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    export function get_timezone() {
        const date = new Date();
        const timezoneOffsetInMinutes = date.getTimezoneOffset();
        //我们需要取反，因为 getTimezoneOffset() 返回的值是 UTC 时区比当前时区早的分钟数
        const timezoneOffsetInHours = -timezoneOffsetInMinutes / 60;
        return timezoneOffsetInHours;
    }

    /**算出指定utc时区，当天剩余的秒数 */
    export function get_date_remaining_seconds_with_utc(utc: number = 0): number {
        // 创建一个表示当前时间的Date对象
        const now = new Date();

        // 将当前时间转换为UTC+3时区
        const offset = utc - TimeTool.get_timezone();
        const utc3Time = new Date(now.getTime() + offset * 3600 * 1000);

        // 计算当天剩余的秒数
        const secondsPassedToday = utc3Time.getHours() * 3600 + utc3Time.getMinutes() * 60 + utc3Time.getSeconds();
        const totalSecondsInDay = 24 * 3600;
        const remainingSeconds = totalSecondsInDay - secondsPassedToday;

        return remainingSeconds;
    }

    /**算出指定utc时区，当月剩余的秒数 */ 
    export function get_month_remaining_seconds_with_utc(utc: number = 0): number { 
        // 创建一个表示当前时间的Date对象
        const now = new Date();

        // 将当前时间转换为UTC+3时区
        const offset = utc - TimeTool.get_timezone();
        const utc3Time = new Date(now.getTime() + offset * 3600 * 1000);

        // 计算当月剩余的秒数
        const secondsPassedThisMonth = utc3Time.getDate() * 24 * 3600 + utc3Time.getHours() * 3600 + utc3Time.getMinutes() * 60 + utc3Time.getSeconds();
        const totalSecondsInMonth = new Date(utc3Time.getFullYear(), utc3Time.getMonth() + 1, 0).getDate() * 24 * 3600;
        const remainingSeconds = totalSecondsInMonth - secondsPassedThisMonth;

        return remainingSeconds;
    }
}