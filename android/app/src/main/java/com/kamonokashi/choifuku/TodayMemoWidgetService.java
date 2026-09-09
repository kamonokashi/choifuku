package com.kamonokashi.choifuku;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.view.View;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import org.json.JSONArray;
import org.json.JSONObject;

/** ウィジェットの一覧（スクロール部分）にメモ行を供給する。 */
public class TodayMemoWidgetService extends RemoteViewsService {

    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new MemoFactory(getApplicationContext());
    }

    static class MemoFactory implements RemoteViewsFactory {

        private final Context context;
        private JSONObject payload;
        private JSONArray items = new JSONArray();

        MemoFactory(Context context) {
            this.context = context;
        }

        @Override
        public void onCreate() {
            reload();
        }

        @Override
        public void onDataSetChanged() {
            reload();
        }

        private void reload() {
            payload = WidgetData.readPayload(context);
            items = WidgetData.todayItems(payload);
        }

        @Override
        public void onDestroy() {
            items = new JSONArray();
        }

        @Override
        public int getCount() {
            return items.length();
        }

        @Override
        public RemoteViews getViewAt(int position) {
            JSONObject item = items.optJSONObject(position);
            RemoteViews row = new RemoteViews(context.getPackageName(), R.layout.widget_memo_item);
            if (item == null) return row;

            boolean complete = item.optBoolean("complete", false);
            String content = item.optString("content", "");

            int surface = WidgetData.themeColor(payload, "surface", TodayMemoWidgetProvider.LIGHT_SURFACE);
            int surfaceMuted = WidgetData.themeColor(payload, "surfaceMuted", Color.parseColor("#f1f3f5"));
            int text = WidgetData.themeColor(payload, "text", TodayMemoWidgetProvider.LIGHT_TEXT);
            int muted = WidgetData.themeColor(payload, "muted", TodayMemoWidgetProvider.LIGHT_MUTED);
            int accent = WidgetData.themeColor(payload, "accent", Color.parseColor("#2f80ed"));
            int onAccent = WidgetData.themeColor(payload, "onAccent", Color.WHITE);
            int doneEmptyBg = WidgetData.themeColor(payload, "doneEmptyBg", Color.parseColor("#e8edf1"));
            int doneEmptyFg = WidgetData.themeColor(payload, "doneEmptyFg", Color.parseColor("#9aa7b2"));

            // カード（入力済みはアプリと同じく淡い背景）
            row.setImageViewResource(R.id.item_background, R.drawable.widget_card);
            row.setInt(R.id.item_background, "setColorFilter", complete ? surfaceMuted : surface);

            // 科目カラーの縦バー
            row.setImageViewResource(R.id.item_color_bar, R.drawable.widget_color_bar);
            row.setInt(R.id.item_color_bar, "setColorFilter",
                    WidgetData.parseColor(item.optString("color", null), accent));

            row.setTextViewText(R.id.item_period, item.optString("periodLabel", ""));
            row.setTextColor(R.id.item_period, muted);
            row.setTextViewText(R.id.item_subject, item.optString("subjectName", ""));
            row.setTextColor(R.id.item_subject, text);

            if (content.trim().length() > 0) {
                row.setTextViewText(R.id.item_memo, content);
                row.setTextColor(R.id.item_memo, text);
            } else {
                row.setTextViewText(R.id.item_memo, "今日覚えたことをメモ");
                row.setTextColor(R.id.item_memo, muted);
            }

            // 完了マーク（アプリの丸いチェックボタンに合わせる）
            row.setImageViewResource(R.id.item_done_circle, R.drawable.widget_circle);
            row.setInt(R.id.item_done_circle, "setColorFilter", complete ? accent : doneEmptyBg);
            row.setImageViewResource(R.id.item_done_check, R.drawable.widget_check);
            row.setInt(R.id.item_done_check, "setColorFilter", complete ? onAccent : doneEmptyFg);

            // タップしたらこのメモの入力ボックスを開く
            Intent fillIn = new Intent();
            fillIn.putExtra(MemoQuickInputActivity.EXTRA_DATE, WidgetData.todayKey());
            fillIn.putExtra(MemoQuickInputActivity.EXTRA_ITEM_KEY, item.optString("key", ""));
            fillIn.putExtra(MemoQuickInputActivity.EXTRA_SUBJECT_ID, item.optString("subjectId", ""));
            fillIn.putExtra(MemoQuickInputActivity.EXTRA_SUBJECT_NAME, item.optString("subjectName", ""));
            fillIn.putExtra(MemoQuickInputActivity.EXTRA_PERIOD_LABEL, item.optString("periodLabel", ""));
            fillIn.putExtra(MemoQuickInputActivity.EXTRA_PERIOD, item.optInt("period", 0));
            fillIn.putExtra(MemoQuickInputActivity.EXTRA_TYPE, item.optString("type", "lesson"));
            fillIn.putExtra(MemoQuickInputActivity.EXTRA_CONTENT, content);
            fillIn.putExtra(MemoQuickInputActivity.EXTRA_COLOR, item.optString("color", ""));
            row.setOnClickFillInIntent(R.id.item_root, fillIn);

            row.setViewVisibility(R.id.item_root, View.VISIBLE);
            return row;
        }

        @Override
        public RemoteViews getLoadingView() {
            return null;
        }

        @Override
        public int getViewTypeCount() {
            return 1;
        }

        @Override
        public long getItemId(int position) {
            JSONObject item = items.optJSONObject(position);
            return item == null ? position : item.optString("key", String.valueOf(position)).hashCode();
        }

        @Override
        public boolean hasStableIds() {
            return true;
        }
    }
}
