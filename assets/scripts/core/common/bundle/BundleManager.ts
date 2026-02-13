import {
    _decorator,
    assetManager,
    AssetManager
} from 'cc';
import { BaseManager } from '../BaseManager';

const { ccclass } = _decorator;

@ccclass('BundleManager')
export class BundleManager extends BaseManager {
    clean(): void {
    }

    private static _instance: BundleManager;
    public static get instance(): BundleManager {
        return this._instance;
    }

    /** 已加载的 bundle 缓存 */
    private _bundles: Map<string, AssetManager.Bundle> = new Map();


    onLoad() {
        if (BundleManager._instance) {
            this.destroy();
            return;
        }
        BundleManager._instance = this;

        // 如果你需要跨场景：
        // director.addPersistRootNode(this.node);
    }

    /* ================== 加载 ================== */

    /**
     * 加载单个 Bundle
     */
    public loadBundle(
        bundleName: string,
        onComplete?: (bundle: AssetManager.Bundle | null) => void
    ) {
        // 已加载，直接返回
        if (this._bundles.has(bundleName)) {
            onComplete?.(this._bundles.get(bundleName)!);
            return;
        }

        assetManager.loadBundle(bundleName, (err, bundle) => {
            if (err || !bundle) {
                console.error(`[BundleManager] loadBundle failed: ${bundleName}`, err);
                onComplete?.(null);
                return;
            }

            this._bundles.set(bundleName, bundle);
            onComplete?.(bundle);
        });
    }

    /**
     * 是否已加载
     */
    public hasBundle(bundleName: string): boolean {
        return this._bundles.has(bundleName);
    }

    /**
     * 获取 Bundle
     */
    public getBundle(bundleName: string): AssetManager.Bundle | null {
        return this._bundles.get(bundleName) || null;
    }

    /* ================== 卸载 ================== */

    /**
     * 卸载单个 Bundle
     * @param releaseAssets 是否释放 bundle 内资源（慎用）
     */
    public unloadBundle(
        bundleName: string,
        releaseAssets: boolean = true
    ) {
        const bundle = this._bundles.get(bundleName);
        if (!bundle) {
            console.warn(`[BundleManager] bundle not found: ${bundleName}`);
            return;
        }

        if (releaseAssets) {
            // 释放 bundle 内所有已加载资源
            bundle.releaseAll();
        }

        assetManager.removeBundle(bundle);
        this._bundles.delete(bundleName);
    }
}