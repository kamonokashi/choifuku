package com.kamonokashi.choifuku;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

/** ホーム画面の「今日のメモ」ウィジェット。 */
public class TodayMemoWidgetProvider extends AppWidgetProvider {

    static final int LIGHT_BG = Color.parseColor("#f6f8f9");
    static final int LIGHT_SURFACE = Color.parseColor("#ffffff");
    static final int LIGHT_TEXT = Color.parseColor("#1f2933");
    static final int LIGHT_MUTED = Color.parseColor("#697783");

    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            manager.updateAppWidget(appWidgetId, buildViews(context, appWidgetId));
        }
        manager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.widget_memo_list);
    }

    /** ウィジェット全体を組み立てる。一覧のアダプタも張り直すので onUpdate 用。 */
    static RemoteViews buildViews(Context context, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_today_memo);
        applyHeader(context, views);

        Intent serviceIntent = new Intent(context, TodayMemoWidgetService.class);
        serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
        // 同じ Intent と見なされてデータが更新されないのを防ぐ
        serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));
        views.setRemoteAdapter(R.id.widget_memo_list, serviceIntent);
        views.setEmptyView(R.id.widget_memo_list, R.id.widget_empty);

        Intent openApp = new Intent(context, MainActivity.class);
        openApp.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent openAppIntent = PendingIntent.getActivity(context, 0, openApp, pendingIntentFlags());
        views.setOnClickPendingIntent(R.id.widget_header, openAppIntent);
        views.setOnClickPendingIntent(R.id.widget_empty, openAppIntent);

        Intent quickInput = new Intent(context, MemoQuickInputActivity.class);
        // アプリ本体とは別のタスクで開く。CLEAR_TASK はアプリのタスクを消しかねないので使わない。
        quickInput.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        views.setPendingIntentTemplate(
                R.id.widget_memo_list,
                PendingIntent.getActivity(context, 1, quickInput, templateFlags()));

        return views;
    }

    /** ヘッダーや文言だけを差し替えるための部分更新用。一覧のアダプタには触れない。 */
    static RemoteViews buildHeaderViews(Context context) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_today_memo);
        applyHeader(context, views);
        return views;
    }

    private static void applyHeader(Context context, RemoteViews views) {
        JSONObject payload = WidgetData.readPayload(context);
        JSONObject today = WidgetData.todayEntry(payload);

        int surface = WidgetData.themeColor(payload, "bg", LIGHT_BG);
        int text = WidgetData.themeColor(payload, "text", LIGHT_TEXT);
        int muted = WidgetData.themeColor(payload, "muted", LIGHT_MUTED);

        views.setImageViewResource(R.id.widget_background, R.drawable.widget_surface);
        views.setInt(R.id.widget_background, "setColorFilter", surface);

        String dateLabel = today != null ? today.optString("dateLabel", "") : "";
        views.setTextViewText(R.id.widget_date, dateLabel.length() > 0 ? dateLabel : "今日");
        views.setTextColor(R.id.widget_date, text);

        JSONArray items = WidgetData.todayItems(payload);
        int done = 0;
        for (int i = 0; i < items.length(); i += 1) {
            JSONObject item = items.optJSONObject(i);
            if (item != null && item.optBoolean("complete", false)) done += 1;
        }
        views.setTextViewText(R.id.widget_progress, items.length() > 0 ? done + " / " + items.length() : "");
        views.setTextColor(R.id.widget_progress, muted);

        String status = today != null ? today.optString("status", "") : "";
        if (status.length() > 0 && items.length() > 0) {
            views.setViewVisibility(R.id.widget_status, View.VISIBLE);
            views.setTextViewText(R.id.widget_status, status);
            views.setTextColor(R.id.widget_status, muted);
        } else {
            views.setViewVisibility(R.id.widget_status, View.GONE);
        }

        String emptyText;
        if (payload == null) {
            emptyText = "アプリを開いて時間割を設定してください";
        } else if (today == null) {
            emptyText = "アプリを開くと最新の予定に更新されます";
        } else {
            emptyText = status.length() > 0 ? status : today.optString("emptyText", "授業メモはありません");
        }
        views.setTextViewText(R.id.widget_empty, emptyText);
        views.setTextColor(R.id.widget_empty, muted);
    }

    static int pendingIntentFlags() {
        return PendingIntent.FLAG_IMMUTABLE;
    }

    /**
     * 一覧の各行はテンプレートに fill-in intent を差し込むため、
     * PendingIntent は書き換え可能でなければならない。
     */
    static int templateFlags() {
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            flags |= PendingIntent.FLAG_MUTABLE;
        }
        return flags;
    }
}
