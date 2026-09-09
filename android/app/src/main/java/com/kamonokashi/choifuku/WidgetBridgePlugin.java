package com.kamonokashi.choifuku;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;

/**
 * WebアプリからウィジェットのデータをやりとりするためのCapacitorプラグイン。
 * npmパッケージは増やさず、このAndroidプロジェクト内で完結させている。
 */
@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {

    /** アプリの状態が変わるたびに呼ばれ、ウィジェット用のデータを書き出す。 */
    @PluginMethod
    public void sync(PluginCall call) {
        String payload = call.getString("payload");
        if (payload == null) {
            call.reject("payload is required");
            return;
        }
        WidgetData.writePayload(getContext(), payload);
        WidgetData.notifyWidgets(getContext());
        call.resolve();
    }

    /** ウィジェットから書かれたメモを取り出して、キューを空にする。 */
    @PluginMethod
    public void takePendingWrites(PluginCall call) {
        String raw = WidgetData.takePendingWrites(getContext());
        JSObject result = new JSObject();
        try {
            result.put("writes", new JSONArray(raw));
        } catch (Exception e) {
            result.put("writes", new JSONArray());
        }
        call.resolve(result);
    }
}
