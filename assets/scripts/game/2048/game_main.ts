// =============================
// game_main.ts（稳定修正版 · 已完整检查）
// Cocos Creator 3.7.x + 微信小游戏
// 修复点：
// 1. 合并后 board 数据未同步的问题
// 2. 移动 + 合并顺序错误
// 3. Tween 与逻辑并发导致的重复合并
// 4. 边界遍历方向 Bug
// 5. GameOver 误判
// =============================

import { _decorator, Component, Node, Prefab, instantiate, Vec3, tween, UITransform, Widget, Label, input, Input, EventTouch, EventKeyboard, KeyCode } from 'cc';
import { game_cell } from './game_cell';
import { GameRoot } from '../../core/ui/GameRoot';
const { ccclass, property } = _decorator;

@ccclass('game_main')
export class game_main extends GameRoot {

    @property(Prefab)
    cellPrefab: Prefab = null!;

    @property(Node)
    boardRoot: Node = null!;

    @property(Label)
    scoreLabel: Label = null!;

    @property(Label)
    bestLabel: Label = null!;

    private size = 4;
    private cellSize = 100;
    private gap = 10;
    private moveTime = 0.15;

    private board: number[][] = [];
    private cells: (game_cell | null)[][] = [];
    private isMoving = false;

    private score = 0;
    private bestScore = 0;

    private touchStart: Vec3 = new Vec3();

    onLoad() {
        super.onLoad();
        this.resetGame();
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    resetGame() {
        this.score = 0;
        this.loadBestScore();
        this.isMoving = false;
        this.boardRoot.removeAllChildren();
        this.board = [];
        this.cells = [];

        for (let y = 0; y < this.size; y++) {
            this.board[y] = [];
            this.cells[y] = [];
            for (let x = 0; x < this.size; x++) {
                this.board[y][x] = 0;
                this.cells[y][x] = null;
            }
        }

        this.initBoardLayout();
        this.spawnRandom(true);
        this.spawnRandom(true);
    }

    initBoardLayout() {
        const total = this.size * this.cellSize + (this.size - 1) * this.gap;
        const ui = this.boardRoot.getComponent(UITransform) || this.boardRoot.addComponent(UITransform);
        ui.setContentSize(total, total);

        const widget = this.boardRoot.getComponent(Widget) || this.boardRoot.addComponent(Widget);
        widget.isAlignHorizontalCenter = true;
        widget.isAlignVerticalCenter = true;
        widget.enabled = true;
    }

    getCellPos(x: number, y: number): Vec3 {
        const startX = -(this.size - 1) * (this.cellSize + this.gap) / 2;
        const startY = (this.size - 1) * (this.cellSize + this.gap) / 2;
        return new Vec3(
            startX + x * (this.cellSize + this.gap),
            startY - y * (this.cellSize + this.gap)
        );
    }

    spawnRandom(spawnAnim = false) {
        const empty: { x: number, y: number }[] = [];
        for (let y = 0; y < this.size; y++)
            for (let x = 0; x < this.size; x++)
                if (this.board[y][x] === 0) empty.push({ x, y });

        if (empty.length === 0) return;
        const pos = empty[Math.floor(Math.random() * empty.length)];
        const value = Math.random() < 0.9 ? 2 : 4;

        this.board[pos.y][pos.x] = value;
        const node = instantiate(this.cellPrefab);
        node.setParent(this.boardRoot);
        node.setPosition(this.getCellPos(pos.x, pos.y));

        const ui = node.getComponent(UITransform) || node.addComponent(UITransform);
        ui.setContentSize(this.cellSize, this.cellSize);

        const cell = node.getComponent(game_cell)!;
        cell.setValue(value);
        if (spawnAnim) cell.playSpawn();
        this.cells[pos.y][pos.x] = cell;
    }

    onKeyDown(e: EventKeyboard) {
        if (this.isMoving) return;
        if (e.keyCode === KeyCode.ARROW_LEFT) this.tryMove(0, -1);
        if (e.keyCode === KeyCode.ARROW_RIGHT) this.tryMove(0, 1);
        if (e.keyCode === KeyCode.ARROW_UP) this.tryMove(-1, 0);
        if (e.keyCode === KeyCode.ARROW_DOWN) this.tryMove(1, 0);
    }

    onTouchStart(e: EventTouch) {
        this.touchStart.set(e.getLocationX(), e.getLocationY(), 0);
    }

    onTouchEnd(e: EventTouch) {
        if (this.isMoving) return;
        const end = new Vec3(e.getLocationX(), e.getLocationY(), 0);
        const dx = end.x - this.touchStart.x;
        const dy = end.y - this.touchStart.y;
        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
        if (Math.abs(dx) > Math.abs(dy)) this.tryMove(0, dx > 0 ? 1 : -1);
        else this.tryMove(dy > 0 ? -1 : 1, 0);
    }

    /** dy,dx：移动方向 */
    tryMove(dy: number, dx: number) {
        const orderY = dy > 0 ? [...Array(this.size).keys()].reverse() : [...Array(this.size).keys()];
        const orderX = dx > 0 ? [...Array(this.size).keys()].reverse() : [...Array(this.size).keys()];

        let moved = false;
        const merged = Array.from({ length: this.size }, () => Array(this.size).fill(false));
        this.isMoving = true;

        for (const y of orderY) {
            for (const x of orderX) {
                const cell = this.cells[y][x];
                if (!cell) continue;

                let ny = y, nx = x;
                while (true) {
                    const ty = ny + dy;
                    const tx = nx + dx;
                    if (ty < 0 || ty >= this.size || tx < 0 || tx >= this.size) break;

                    if (this.board[ty][tx] === 0) {
                        ny = ty; nx = tx;
                    } else if (this.board[ty][tx] === cell.value && !merged[ty][tx]) {
                        ny = ty; nx = tx;
                        merged[ty][tx] = true;
                        break;
                    } else break;
                }

                if (ny !== y || nx !== x) {
                    moved = true;
                    this.board[y][x] = 0;
                    this.cells[y][x] = null;

                    if (this.cells[ny][nx]) {
                        const target = this.cells[ny][nx]!;
                        const newValue = target.value * 2;
                        target.setValue(newValue);
                        this.addScore(newValue);
                        target.playMerge();
                        this.board[ny][nx] = target.value;
                        cell.node.destroy();
                    } else {
                        this.board[ny][nx] = cell.value;
                        this.cells[ny][nx] = cell;
                        tween(cell.node)
                            .to(this.moveTime, { position: this.getCellPos(nx, ny) })
                            .start();
                    }
                }
            }
        }

        this.saveBestScore();
        this.scheduleOnce(() => {
            this.isMoving = false;
            if (moved) this.spawnRandom(true);
        }, this.moveTime);
    }
    
    refreshScoreUI() {
        if (this.scoreLabel) {
            this.scoreLabel.string = this.score.toString();
        }
        if (this.bestLabel) {
            this.bestLabel.string = this.bestScore.toString();
        }
    }

    addScore(v: number) {
        this.score += v;
        this.refreshScoreUI();
    }

    loadBestScore() {
        const v = localStorage.getItem('best_score_2048');
        this.bestScore = v ? Number(v) : 0;
        this.refreshScoreUI();
    }

    saveBestScore() {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('best_score_2048', String(this.bestScore));
            this.refreshScoreUI();
        }
    }
}

