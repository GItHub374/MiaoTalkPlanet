
import { _decorator, Component, Node, Sprite, Color, BlockInputEvents, CCInteger, CCBoolean, log, assert, EventHandler } from 'cc';
import { UIComponent } from './UIComponent';
const { ccclass, property } = _decorator;

/**
 * 弹窗屏蔽下层点击、点击空白地方关闭弹窗的组件
 * 在编辑器里面挂在节点上
 */
@ccclass('BlockComponent')
export class BlockComponent extends Component {

    /**
     * 黑色半透明遮罩
     */
    @property(Sprite)
    black_bg : Sprite = null!

    /**
     * 黑色遮罩透明度
     */
    @property(CCInteger)
    black_opacity : number = 150

    /**
     * 弹窗背景
     */
    @property(Node)
    dialog_bg : Node = null!

    /**
     * 点击空白地方关闭遮罩
     */
    @property(CCBoolean)
    touch_close : boolean = false

    @property({
        tooltip: "调用关闭函数，当touch_close为true时有效",
        type:EventHandler, //这一句要加上，不然在编辑器中无法正常设置，而且要设置为数组才可以正常设置，不知道是不是引擎的bug
    })
    close_func: EventHandler = new EventHandler();

    
    onLoad(){
        assert( this.black_bg != null, "black_bg in BlockComponent can not be null" )
        assert( this.dialog_bg != null, "dialog_bg in BlockComponent can not be null" )

        this.black_bg.color = new Color(0,0,0,this.black_opacity)            

        //屏蔽点击，点击不到下层的东西
        let _block = this.node.addComponent(BlockInputEvents)
        _block!.enabled = true

        //弹窗背景也加屏蔽点击，这样点击弹窗内就不会触发touch_close
        let _dialog_block = this.dialog_bg.addComponent(BlockInputEvents)
        _dialog_block!.enabled = true

        this.node.on(Node.EventType.TOUCH_END, ()=>{
            if (!this.touch_close) {
                return
            }
            this.close_func.emit([]);
        }, this)
    }

    start () {
        // [3]
    }


    public set_opacity( opacity : number ){
        this.black_bg.color = new Color(0,0,0,opacity)
    }

    public set_touch_close( _touch_close : boolean ){
        this.touch_close = _touch_close
    }

}