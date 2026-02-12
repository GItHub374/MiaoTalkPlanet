import { HTML5, JSB } from "cc/env";
import { GlobalTool } from "./global_tool";
import { mius } from "../../mius";

/**
 * 用来和原生平台交互
 * 
 * 安卓设置
 * 首先，你需要在你的 Android 代码中创建一个类，这个类的方法可以被 JavaScript 调用。例如：
 * public class JavaScriptInterface {
        private WebView mWebView;

        public JavaScriptInterface(WebView webView) {
            mWebView = webView;
        }

        @JavascriptInterface
        public void callAndroidMethod(String param) {
            // 这里是你的代码
        }
    }

    然后，你需要在 WebView 初始化时，将这个类的实例添加到 WebView 中：
    webView.addJavascriptInterface(new JavaScriptInterface(webView), "Android");

    最后，你就可以在你的 H5 页面中通过 window.Android.callAndroidMethod(param) 来调用 Android 的接口了。例如：
    if (window.Android) {
        window.Android.callAndroidMethod('param');
    }
    请注意，@JavascriptInterface 注解是必须的，它告诉 WebView 这个方法可以被 JavaScript 调用。同时，你需要确保你的 WebView 允许 JavaScript 执行，你可以通过 webView.getSettings().setJavaScriptEnabled(true); 来设置。


    iOS设置
    在 iOS 中，你可以使用 WKUserContentController 和 WKScriptMessageHandler 来让 WebView 中的 H5 页面调用 iOS 的接口。

    首先，你需要创建一个遵循 WKScriptMessageHandler 协议的类，这个类将处理从 H5 页面发送过来的消息。例如：

    import WebKit

    class MyScriptMessageHandler: NSObject, WKScriptMessageHandler {
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "myHandler" {
                print("Received message from JavaScript: \(message.body)")
                // 在这里处理消息
            }
        }
    }
    然后，你需要在创建 WKWebView 时，将这个类的实例添加到 WKUserContentController 中：
    let contentController = WKUserContentController()
    let scriptMessageHandler = MyScriptMessageHandler()
    contentController.add(scriptMessageHandler, name: "myHandler")

    let config = WKWebViewConfiguration()
    config.userContentController = contentController

    let webView = WKWebView(frame: .zero, configuration: config)

    最后，你就可以在你的 H5 页面中通过 window.webkit.messageHandlers.myHandler.postMessage(message) 来发送消息到 iOS 了。
    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.myHandler) {
        window.webkit.messageHandlers.myHandler.postMessage('Hello, iOS!');
    }
    请注意，你需要确保你的 WKWebView 允许 JavaScript 执行，你可以通过 webView.configuration.preferences.javaScriptEnabled = true 来设置。
 */
export module NativeTool {
    /**
     * 调用原生方法
     * @param method_name 方法名
     * @param params 参数
     * @returns 
     */
    export function call_native_func( method_name : string, params : string = ""){
        mius.log.logBusiness("call_native_func: " + method_name + " params: " + params)
        if (!HTML5) {
            return
        }
        if (GlobalTool.isIOS) {
            window.webkit.messageHandlers[method_name].postMessage(params);
            
        }else if (GlobalTool.isAndroid) {
            if (window.LingxianAndroid) {
                if (method_name == "closeGame") {
                    window.LingxianAndroid.closeGame();            
                            
                }else if (method_name == "openChargePage") {
                    //安卓换成pay接口
                    window.LingxianAndroid.pay();
                }
            }
        }
    }
}

//给app端调用的接口，iOS和安卓都可以
//直接加到window对象上
declare global {
    interface Window {
        updateCoin: (args: string) => void;

        webkit: any;

        LingxianAndroid: any;
    }
}

window.updateCoin = function(args: string) {
    mius.event.dispatchEvent(mius.evt.GAME_EVT.APP_UPDATE_COIN, args);
};