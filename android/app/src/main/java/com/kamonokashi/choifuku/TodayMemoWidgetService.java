package com.kamonokashi.choifuku;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.view.View;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** ウィジェットの一覧（スクロール部分）にメモ行を供給する。 */
public class TodayMemoWidgetService extends RemoteViewsService {

    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new MemoFactory(getApplicationContext());
    }

    static class MemoFactory implements RemoteViewsFactory {

        /** 一覧の1行。メモか、「入力済み」の見出し（item が null）のどちらか。 */
        private static final class Row {
            final JSONObject item;
            Row(JSONObject item) {
                this.item = item;
            }
        }

        private static final long DONE_HEADER_ID = "__done_header__".hashCode();

        private final Context context;
        private JSONObject payload;
        private final List<Row> rows = new ArrayList<>();
        private int doneCount = 0;
        // 一覧を読み込んだ日。タップで書く日付はこれに揃える。
        // 表示のたびに今日を取り直すと、日付をまたいだとき前日の一覧に今日の日付で書いてしまう。
        private String itemsDate = WidgetData.todayKey();

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
            itemsDate = WidgetData.todayKey();
            payload = WidgetData.readPayload(context);
            JSONArray items = WidgetData.todayItems(payload);

            List<JSONObject> pending = new ArrayList<>();
            List<JSONObject> done = new ArrayList<>();
            for (int i = 0; i < items.length(); i += 1) {
                JSONObject item = items.optJSONObject(i);
                if (item == null) continue;
                if (item.optBoolean("complete", false)) done.add(item);
                else pending.add(item);
            }
            Collections.sort(pending, (a, b) -> a.optInt("period", 0) - b.optInt("period", 0));
            Collections.sort(done, (a, b) -> a.optInt("period", 0) - b.optInt("period", 0));

            rows.clear();
            for (JSONObject item : pending) rows.add(new Row(item));
            // 入力済みがあるときだけ、境目に見出しを入れて別のまとまりに見せる
            if (!done.isEmpty()) rows.add(new Row(null));
            for (JSONObject item : done) rows.add(new Row(item));
            doneCount = done.size();
        }

        @Override
        public void onDestroy() {
            rows.clear();
        }

        @Override
        public int getCount() {
            return rows.size();
        }

        @Override
        public RemoteViews getViewAt(int position) {
            if (position < 0 || position >= rows.size()) {
                return new RemoteViews(context.getPackageName(), R.layout.widget_memo_item);
            }
            JSONObject item = rows.get(position).item;
            if (item == null) return buildDoneHeader();

            RemoteViews row = new RemoteViews(context.getPackageName(), R.layout.widget_memo_item);

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
            fillIn.putExtra(MemoQuickInputActivity.EXTRA_DATE, itemsDate);
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

        private RemoteViews buildDoneHeader() {
            RemoteViews header = new RemoteViews(context.getPackageName(), R.layout.widget_section_header);
            int muted = WidgetData.themeColor(payload, "muted", TodayMemoWidgetProvider.LIGHT_MUTED);
            // 背景の線色だと淡すぎて境目に見えないので、文字色を薄めて使う
            header.setInt(R.id.section_line, "setColorFilter", WidgetData.withAlpha(muted, 110));
            header.setTextColor(R.id.section_title, muted);
            header.setTextColor(R.id.section_count, muted);
            header.setTextViewText(R.id.section_count, doneCount + "件");
            return header;
        }

        @Override
        public RemoteViews getLoadingView() {
            return null;
        }

        @Override
        public int getViewTypeCount() {
            return 2;
        }

        @Override
        public long getItemId(int position) {
            if (position < 0 || position >= rows.size()) return position;
            JSONObject item = rows.get(position).item;
            if (item == null) return DONE_HEADER_ID;
            return item.optString("key", String.valueOf(position)).hashCode();
        }

        @Override
        public boolean hasStableIds() {
            return true;
        }
    }
}
