package com.kamonokashi.choifuku;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * ウィジェットとWebアプリ(WebView)の間でデータを受け渡すための共有領域。
 *
 * WebView の localStorage はネイティブから読めないため、
 * ・アプリ→ウィジェット: 保存のたびに payload(JSON) を書き出す
 * ・ウィジェット→アプリ: 入力内容を pendingWrites に貯め、アプリ起動時に取り込む
 * という二方向のやり取りをここに集約する。
 */
public final class WidgetData {

    public static final String PREFS_NAME = "choifuku_widget";
    public static final String KEY_PAYLOAD = "payload";
    public static final String KEY_PENDING = "pendingWrites";

    private WidgetData() {}

    public static SharedPreferences prefs(Context context) {
        return context.getApplicationContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public static String todayKey() {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
    }

    public static JSONObject readPayload(Context context) {
        String raw = prefs(context).getString(KEY_PAYLOAD, null);
        if (raw == null) return null;
        try {
            return new JSONObject(raw);
        } catch (Exception e) {
            return null;
        }
    }

    public static void writePayload(Context context, String json) {
        prefs(context).edit().putString(KEY_PAYLOAD, json).apply();
    }

    /** payload から今日の分を取り出す。無ければ null。 */
    public static JSONObject todayEntry(JSONObject payload) {
        if (payload == null) return null;
        JSONObject days = payload.optJSONObject("days");
        if (days == null) return null;
        return days.optJSONObject(todayKey());
    }

    public static JSONArray todayItems(JSONObject payload) {
        JSONObject entry = todayEntry(payload);
        if (entry == null) return new JSONArray();
        JSONArray items = entry.optJSONArray("items");
        return items == null ? new JSONArray() : items;
    }

    // ---- テーマ ----------------------------------------------------------

    /** payload の theme から色を取り出す。payload が無い場合はライトテーマの既定値。 */
    public static int themeColor(JSONObject payload, String name, int fallback) {
        if (payload != null) {
            JSONObject theme = payload.optJSONObject("theme");
            if (theme != null) {
                int parsed = parseColor(theme.optString(name, null), Integer.MIN_VALUE);
                if (parsed != Integer.MIN_VALUE) return parsed;
            }
        }
        return fallback;
    }

    public static boolean isDark(JSONObject payload) {
        return payload != null && payload.optJSONObject("theme") != null
                && payload.optJSONObject("theme").optBoolean("dark", false);
    }

    public static int parseColor(String value, int fallback) {
        if (value == null || value.length() == 0) return fallback;
        try {
            return Color.parseColor(value);
        } catch (Exception e) {
            return fallback;
        }
    }

    /** 半透明の色を作る（完了済みカードの淡い表現などに使う）。 */
    public static int withAlpha(int color, int alpha) {
        return Color.argb(alpha, Color.red(color), Color.green(color), Color.blue(color));
    }

    // ---- ウィジェット→アプリ の書き込みキュー ----------------------------

    public static void appendPendingWrite(Context context, JSONObject entry) {
        SharedPreferences prefs = prefs(context);
        JSONArray queue;
        try {
            queue = new JSONArray(prefs.getString(KEY_PENDING, "[]"));
        } catch (Exception e) {
            queue = new JSONArray();
        }
        queue.put(entry);
        prefs.edit().putString(KEY_PENDING, queue.toString()).apply();
    }

    /** キューを返して空にする。アプリ側が取り込むときに呼ぶ。 */
    public static String takePendingWrites(Context context) {
        SharedPreferences prefs = prefs(context);
        String raw = prefs.getString(KEY_PENDING, "[]");
        prefs.edit().putString(KEY_PENDING, "[]").apply();
        return raw;
    }

    /**
     * ウィジェット表示をその場で更新するため、payload 内の該当メモも書き換えておく。
     * アプリ側の取り込みが済むまでの見た目のつなぎ。
     */
    public static void applyContentToPayload(Context context, String date, String itemKey, String content) {
        JSONObject payload = readPayload(context);
        if (payload == null) return;
        try {
            JSONObject days = payload.optJSONObject("days");
            if (days == null) return;
            JSONObject entry = days.optJSONObject(date);
            if (entry == null) return;
            JSONArray items = entry.optJSONArray("items");
            if (items == null) return;

            List<JSONObject> list = new ArrayList<>();
            for (int i = 0; i < items.length(); i += 1) {
                JSONObject item = items.optJSONObject(i);
                if (item == null) continue;
                if (itemKey.equals(item.optString("key"))) {
                    item.put("content", content);
                    item.put("complete", content.trim().length() > 0);
                }
                list.add(item);
            }

            // アプリのホームと同じ並び（未入力が上、入力済みが下、あとは時限順）に揃える
            Collections.sort(list, (a, b) -> {
                int doneA = a.optBoolean("complete", false) ? 1 : 0;
                int doneB = b.optBoolean("complete", false) ? 1 : 0;
                if (doneA != doneB) return doneA - doneB;
                return a.optInt("period", 0) - b.optInt("period", 0);
            });

            entry.put("items", new JSONArray(list));
            writePayload(context, payload.toString());
        } catch (Exception ignored) {
        }
    }

    // ---- ウィジェットの更新通知 ------------------------------------------

    public static void notifyWidgets(Context context) {
        Context app = context.getApplicationContext();
        AppWidgetManager manager = AppWidgetManager.getInstance(app);
        ComponentName component = new ComponentName(app, TodayMemoWidgetProvider.class);
        int[] ids = manager.getAppWidgetIds(component);
        if (ids == null || ids.length == 0) return;

        // ヘッダーだけを差し替える。updateAppWidget を使うと一覧のアダプタごと作り直しになり、
        // 反映が一手遅れるため、部分更新のAPIを使う。
        manager.partiallyUpdateAppWidget(ids, TodayMemoWidgetProvider.buildHeaderViews(app));
        manager.notifyAppWidgetViewDataChanged(ids, R.id.widget_memo_list);
    }
}
