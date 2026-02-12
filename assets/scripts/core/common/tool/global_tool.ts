import { Sprite, Texture2D, director, gfx, sys, Node, ImageAsset, SpriteFrame, UITransform, native, RenderTexture, view, Camera } from "cc";
import { Canvas2Image } from "./Canvas2Image";
import { JSB, PREVIEW } from 'cc/env';
import { mius } from "../../mius";

export class GlobalTool {
	
	static isAndroid = sys.os == "Android"
	static isIOS = sys.os == "iOS"
	

	/**从数组中随机选出m个元素 */
	static random_array_from_array<T>(arr: T[], m: number): T[] {
		const flattened = arr.slice();
		const result = [];
		for (let i = 0; i < m; i++) {
		const randomIndex = Math.floor(Math.random() * flattened.length);
		result.push(flattened.splice(randomIndex, 1)[0]);
		}
		return result;
	}

	/**获取浏览器url的指定参数，https://www.xxx.com?uid=xxx&name=xxx */
	static get_query_params_with_name(name:string) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substring(1).match(reg);
		if (r != null) {
			return decodeURIComponent(r[2]);
		}
		return null;
	}

	/**获取浏览器url的全部参数 */
	static get_all_query_params() {
		let params: { [key: string]: string } = {};
		const search = window.location.search.substring(1);
		const pairs = search.split('&');
		for (const pair of pairs) {
			const [key, value] = pair.split('=');
			params[key] = decodeURIComponent(value);
		}
		return params;
	}

	static get_host(){
		return window.location.host
	}

	/**判断指定的值是否是对象 */
	static is_object(value: any): boolean {
		return typeof value === 'object' && value !== null;
	}

	/**深拷贝对象 */
	static deepcopy_object<T>(obj: T): T {
		return JSON.parse(JSON.stringify(obj));
	}


	/** 
     * 转英文单位计数
     * @param value 数字
     * @param fixed 保留小数位数
     * @example
     * 12345 = 12.35K
     */
    static display_number(value: number, fixed: number = 2): string {
        var k = 1000;
        var sizes = ['', 'K', 'M', 'G'];
        if (value < k) {
            return value.toString();
        }
        else {
            var i = Math.floor(Math.log(value) / Math.log(k));
            var r = ((value / Math.pow(k, i)));
            return r.toFixed(fixed) + sizes[i];
        }
    }

	/**
     * 转美式计数字符串
     * @param value 数字
     * @example
     * 123456789 = 123,456,789
     */
    static thousand_separate_num(value: number): string {
        return value.toLocaleString();
    }


	/**
	 * 获取像素信息，可以获取某一个像素点或者一个区域像素点的信息
	 * @param texture Texture2D
	 * @param x 位置x
	 * @param y 位置y
	 * @param width 像素宽度
	 * @param height 像素高度
	 * @returns 
	 */
	static readPixels (texture:Texture2D | Sprite | Node, x = 0, y = 0, width : number = 1, height : number = 1) : Uint8Array | null {
		if (texture instanceof Node) {
			texture = texture.getComponent(Sprite)!.spriteFrame!.texture! as Texture2D;
		}else if (texture instanceof Sprite) {
			texture = texture.spriteFrame!.texture! as Texture2D;
		}

		width = width || texture.width;
		height = height || texture.height;
		const gfxTexture = texture.getGFXTexture();
		if (!gfxTexture) {
			return null;
		}
		const bufferViews: ArrayBufferView[] = [];
		const regions: gfx.BufferTextureCopy[] = [];
	
		const region0 = new gfx.BufferTextureCopy();
		region0.texOffset.x = x;
		region0.texOffset.y = y;
		region0.texExtent.width = width;
		region0.texExtent.height = height;
		regions.push(region0);
	
		const buffer = new Uint8Array(width * height * 4);
		bufferViews.push(buffer);
	
		director.root?.device.copyTextureToBuffers(gfxTexture, bufferViews, regions)
	
		return buffer;
	}


	/**
	 * 复制一个sprite的纹理到另一个sprite，只是复制节点本身，不包括子节点
	 * @param from_sprite 
	 * @param to_sprite 
	 */
	static copyTexture( from_sprite : Sprite | Node, to_sprite : Sprite | Node){
		if (from_sprite instanceof Node) {
			from_sprite = from_sprite.getComponent(Sprite)!;
		}
        let texture = from_sprite.spriteFrame?.texture! as Texture2D;
        let buffer = GlobalTool.readPixels( texture, 0, 0, texture.width, texture.height );

		let img = new ImageAsset()
        img.reset({
            _data : buffer, //或者使用 texture!.uploadData(buffer);
            width : texture.width,
            height : texture.height,
            format : Texture2D.PixelFormat.RGBA8888,
            _compressed : false
        })

		let new_tex = new Texture2D()
        new_tex.image = img
        let new_sp = new SpriteFrame()
        new_sp.texture = new_tex
        new_sp.packable = false

		if (to_sprite instanceof Node) {
			to_sprite = to_sprite.getComponent(Sprite)!;
		}
		to_sprite.spriteFrame = new_sp
        to_sprite.getComponent(UITransform)?.setContentSize( texture.width, texture.height )
	}

	/**
	 * 保存buffer到本地图片
	 * @param buffer 
	 * @param width 
	 * @param height 
	 */
	static saveBuffer2Image( buffer : Uint8Array, width : number, height : number ){
		if (sys.isBrowser) {
			let canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			let ctx = canvas.getContext('2d')!;
			let rowBytes = width * 4;
			for (let row = 0; row < height; row++) {
				let sRow = row;
				let imageData = ctx.createImageData(width, 1);
				let start = sRow * width * 4;
				for (let i = 0; i < rowBytes; i++) {
					imageData.data[i] = buffer[start + i];
				}
				ctx.putImageData(imageData, 0, row);
			}

			let canvas2image = Canvas2Image.getInstance();
			canvas2image.saveAsPNG(canvas, width, height);

		}else if (sys.isNative) {
			let filePath = native.fileUtils.getWritablePath() + 'render_to_sprite_image.png';
            //@ts-ignore
            if (native.saveImageData) {
                //@ts-ignore
                native.saveImageData(buffer, width, height, filePath).then(()=>{
					console.log("Save image data success");
                }).catch(()=>{
                    console.log("Fail to save image data");
                });
            }
		}
	}

	/**
	 * 保存sprite到本地图片
	 * @param sprite 
	 */
	static saveSprite2Image( sprite : Sprite | Node ){
		if (sprite instanceof Node) {
			sprite = sprite.getComponent(Sprite)!;
		}

		let transform = sprite.getComponent(UITransform)!
		let width = transform.width
		let height =  transform.height
		let buffer = GlobalTool.readPixels( sprite, 0, 0, width, height )!;

		GlobalTool.saveBuffer2Image( buffer, width, height )
	}

	/**
	 * 设置精灵图片
	 * @param sprite 
	 * @param image 
	 */
	static setSpriteFrame( sprite : Sprite | Node, image : string ){
		let spr : Sprite
		if (sprite instanceof Node) {
			spr = sprite.getComponent(Sprite)!;
		}else{
			spr = sprite
		}

		const parts = image.split(':');
        if (parts.length == 2) {
			let fr : SpriteFrame | null = mius.res.get( parts[1], SpriteFrame, parts[0] ) as SpriteFrame
			if (!fr) {
				mius.res.load( parts[0], parts[1], SpriteFrame, (err : Error | null, data : SpriteFrame) => {
					if (err) {
						console.error(err)
						return
					}
					spr.spriteFrame = data
				} )
			}else{
				spr.spriteFrame = fr
			}

		}else{
			let fr : SpriteFrame | null = mius.res.get( image, SpriteFrame ) as SpriteFrame
			if (!fr) {
				mius.res.load( image, SpriteFrame, (err : Error | null, data : SpriteFrame) => {
					if (err) {
						console.error(err)
						return
					}
					spr.spriteFrame = data
				} )
			}else{
				spr.spriteFrame = fr
			}
        }
	}
}