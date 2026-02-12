
import { _decorator, Component, Node, Mask, Mat4, Vec2, Vec3, v2, UITransform, ccenum, Sprite, Graphics } from 'cc';
const { ccclass, property } = _decorator;

const _worldMatrix = new Mat4();
const _vec2_temp = new Vec2();
const _mat4_temp = new Mat4();

/**
 * 自定义多边形遮罩
 * 类型要选择 GRAPHICS_RECT
 */

@ccclass('MaskPlus')
export class MaskPlus extends Mask {

    @property([Vec2])
    _polygon: Vec2[] = [];

    @property({ type: [Vec2] })
    get polygon() {
        return this._polygon;
    }
    set polygon(value: Vec2[]) {
        this._polygon = value;

        this._updateGraphics();
    }

    @property({override: true})
    get type() {
        return this._type;
    }

    set type(value) {
        if (this._type === value) {
            return;
        }
        this._type = value;

        if (this._type !== Mask.Type.SPRITE_STENCIL) {
            if (this._sprite) {
                this.node.removeComponent(Sprite);
                this._sprite._destroyImmediate();
                this._sprite = null;
            }
            this._changeRenderType();
            this._updateGraphics();
        } else {
            if (this._graphics) {
                this._graphics.clear();
                this.node.removeComponent(Graphics);
                this._graphics._destroyImmediate();
                this._graphics = null;
            }
            this._changeRenderType();
        }
    }

    private _changeRenderType () {
        const isGraphics = (this._type !== Mask.Type.SPRITE_STENCIL);
        if (isGraphics) {
            this._createGraphics();
        } else {
            this._createSprite();
        }
    }

    _getNodeRect() {
        let width = this.node.getComponent(UITransform)!.width;
        let height = this.node.getComponent(UITransform)!.height;
        let x = -width * this.node.getComponent(UITransform)!.anchorPoint.x;
        let y = -height * this.node.getComponent(UITransform)!.anchorPoint.y;
        return [x, y, width, height];
    }

    _updateGraphics() {
        if (!this._graphics || (this._type !== Mask.Type.GRAPHICS_RECT && this._type !== Mask.Type.GRAPHICS_ELLIPSE)) {
            return;
        }

        const uiTrans = this.node._uiProps.uiTransformComp!;
        const graphics = this._graphics;
        // Share render data with graphics content
        graphics.clear();

        const size = uiTrans.contentSize;
        const width = size.width;
        const height = size.height;
        const ap = uiTrans.anchorPoint;
        const x = -width * ap.x;
        const y = -height * ap.y;
        if (this._type === Mask.Type.GRAPHICS_RECT) {
            if (this._polygon.length > 0) {
                this._polygon = this._polygon || [];
                if (this._polygon.length === 0) this._polygon.push(v2(0, 0));
                graphics.moveTo(this._polygon[0].x, this._polygon[0].y);
                for (let i = 1; i < this._polygon.length; i++) {
                    graphics.lineTo(this._polygon[i].x, this._polygon[i].y);
                }
                graphics.lineTo(this._polygon[0].x, this._polygon[0].y);
                graphics.close();
            }else{
                graphics.rect(x, y, width, height);
            }

        } else if (this._type === Mask.Type.GRAPHICS_ELLIPSE) {
            const center = new Vec3(x + width / 2, y + height / 2, 0);
            const radius = new Vec3(width / 2, height / 2, 0);
            const points = _calculateCircle(center, radius, this._segments);
            for (let i = 0; i < points.length; ++i) {
                const point = points[i];
                if (i === 0) {
                    graphics.moveTo(point.x, point.y);
                } else {
                    graphics.lineTo(point.x, point.y);
                }
            }
            graphics.close();
        }

        graphics.fill();
    }

    isHit(cameraPt: Vec2) {
        const uiTrans = this.node._uiProps.uiTransformComp!;
        const size = uiTrans.contentSize;
        const w = size.width;
        const h = size.height;
        const testPt = _vec2_temp;

        this.node.getWorldMatrix(_worldMatrix);
        Mat4.invert(_mat4_temp, _worldMatrix);
        Vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        const ap = uiTrans.anchorPoint;
        testPt.x += ap.x * w;
        testPt.y += ap.y * h;

        let result = false;
        if (this.type === Mask.Type.GRAPHICS_STENCIL) {
            result = testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h;
        } else if (this.type === Mask.Type.GRAPHICS_ELLIPSE) {
            const rx = w / 2;
            const ry = h / 2;
            const px = testPt.x - 0.5 * w;
            const py = testPt.y - 0.5 * h;
            result = px * px / (rx * rx) + py * py / (ry * ry) < 1;
        }
        else if (this.type === Mask.Type.GRAPHICS_RECT) {
            if (this._polygon.length === 0) {
                result = testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h;
            }else{
                const px = testPt.x - 0.5 * w;
                const py = testPt.y - 0.5 * h;
                result = _isInPolygon(v2(px, py), this.polygon);
            }
        }

        if (this._inverted) {
            result = !result;
        }

        return result;
    }
}

const _circlePoints: Vec3[] = [];
function _calculateCircle(center: Vec3, radius: Vec3, segments: number) {
    _circlePoints.length = 0;
    const anglePerStep = Math.PI * 2 / segments;
    for (let step = 0; step < segments; ++step) {
        _circlePoints.push(new Vec3(radius.x * Math.cos(anglePerStep * step) + center.x,
            radius.y * Math.sin(anglePerStep * step) + center.y));
    }

    return _circlePoints;
}

function _isInPolygon(checkPoint: Vec2, polygonPoints: Vec2[]) {
    var counter = 0;
    var i;
    var xinters;
    var p1, p2;
    var pointCount = polygonPoints.length;
    p1 = polygonPoints[0];

    for (i = 1; i <= pointCount; i++) {
        p2 = polygonPoints[i % pointCount];
        if (
            checkPoint.x > Math.min(p1.x, p2.x) &&
            checkPoint.x <= Math.max(p1.x, p2.x)
        ) {
            if (checkPoint.y <= Math.max(p1.y, p2.y)) {
                if (p1.x != p2.x) {
                    xinters = (checkPoint.x - p1.x) * (p2.y - p1.y) / (p2.x - p1.x) + p1.y;
                    if (p1.y == p2.y || checkPoint.y <= xinters) {
                        counter++;
                    }
                }
            }
        }
        p1 = p2;
    }
    if (counter % 2 == 0) {
        return false;
    } else {
        return true;
    }
}
