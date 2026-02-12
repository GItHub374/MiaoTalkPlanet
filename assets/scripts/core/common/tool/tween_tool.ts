import { tween, Node } from "cc";

export module TweenTool {
    export const REPEAT_TAG = 888

    export function do_action_repeat( target : Node, func : Function, delay : number, run_now : boolean = false ){
        let t = tween(target)

        if (run_now) {
            t.call(func)
            .delay(delay)
            .union()
        }else {
            t.delay(delay)
            .call(func)
            .union()
        }

        t.tag( REPEAT_TAG )
        .repeatForever()
        .start()
    }

    export function do_action_delay( target : Node, func : Function, delay : number ){
        tween(target)
        .delay(delay)
        .call(func)
        .start()
    }
}