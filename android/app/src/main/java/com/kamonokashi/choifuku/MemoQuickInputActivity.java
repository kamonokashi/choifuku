package com.kamonokashi.choifuku;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import org.json.JSONObject;

/**
 * ウィジェットのメモをタップしたときに、ホーム画面の上に重ねて出る入力ボックス。
 *
 * WebView の localStorage には直接書けないため、入力内容は WidgetData のキューに積み、
 * 次にアプリを開いた（または復帰した）ときに取り込む。
 * ウィジェットの表示だけはその場で更新して、見た目のラグをなくしている。
 */
public class MemoQuickInputActivity extends Activity {

    public static final String EXTRA_DATE = "date";
    public static final String EXTRA_ITEM_KEY = "itemKey";
    public static final String EXTRA_SUBJECT_ID = "subjectId";
    public static final String EXTRA_SUBJECT_NAME = "subjectName";
    public static final String EXTRA_PERIOD_LABEL = "periodLabel";
    public static final String EXTRA_PERIOD = "period";
    public static final String EXTRA_TYPE = "type";
    public static final String EXTRA_CONTENT = "content";
    public static final String EXTRA_COLOR = "color";

    private EditText input;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_memo_quick_input);
        getWindow().setSoftInputMode(
                WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE
                        | WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);

        Intent intent = getIntent();
        JSONObject payload = WidgetData.readPayload(this);

        int surface = WidgetData.themeColor(payload, "surface", TodayMemoWidgetProvider.LIGHT_SURFACE);
        int text = WidgetData.themeColor(payload, "text", TodayMemoWidgetProvider.LIGHT_TEXT);
        int muted = WidgetData.themeColor(payload, "muted", TodayMemoWidgetProvider.LIGHT_MUTED);
        int line = WidgetData.themeColor(payload, "line", Color.parseColor("#dde3e8"));
        int accent = WidgetData.themeColor(payload, "accent", Color.parseColor("#2f80ed"));
        int onAccent = WidgetData.themeColor(payload, "onAccent", Color.WHITE);

        View card = findViewById(R.id.quick_card);
        card.setBackground(roundedRect(surface, dp(16), 0, 0));

        ImageView bar = findViewById(R.id.quick_color_bar);
        bar.setColorFilter(WidgetData.parseColor(intent.getStringExtra(EXTRA_COLOR), accent));

        TextView period = findViewById(R.id.quick_period);
        period.setText(intent.getStringExtra(EXTRA_PERIOD_LABEL));
        period.setTextColor(muted);

        TextView subject = findViewById(R.id.quick_subject);
        subject.setText(intent.getStringExtra(EXTRA_SUBJECT_NAME));
        subject.setTextColor(text);

        input = findViewById(R.id.quick_input);
        input.setTextColor(text);
        input.setHintTextColor(muted);
        input.setBackground(roundedRect(Color.TRANSPARENT, dp(10), dp(1), line));
        // アプリのメモ欄と同じで、改行はせず Enter で保存する。
        // 折り返しは残したいので、入力タイプは1行のままで表示だけ複数行にする。
        input.setSingleLine(false);
        input.setHorizontallyScrolling(false);
        input.setMaxLines(6);
        input.setImeOptions(EditorInfo.IME_ACTION_DONE);
        input.setOnEditorActionListener((view, actionId, event) -> {
            if (actionId == EditorInfo.IME_ACTION_DONE || actionId == EditorInfo.IME_ACTION_GO) {
                saveAndFinish();
                return true;
            }
            return false;
        });
        input.setOnKeyListener((view, keyCode, event) -> {
            if (keyCode == KeyEvent.KEYCODE_ENTER && event.getAction() == KeyEvent.ACTION_DOWN) {
                saveAndFinish();
                return true;
            }
            return false;
        });

        TextView hint = findViewById(R.id.quick_hint);
        hint.setTextColor(muted);
        String existing = intent.getStringExtra(EXTRA_CONTENT);
        if (!TextUtils.isEmpty(existing)) {
            input.setText(existing);
            input.setSelection(existing.length());
        }
        input.requestFocus();
        // ウィンドウが出きる前だとキーボードが出ないことがあるので、描画後にもう一度促す
        input.post(() -> {
            InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
            if (imm != null) imm.showSoftInput(input, InputMethodManager.SHOW_IMPLICIT);
        });

        TextView cancel = findViewById(R.id.quick_cancel);
        cancel.setTextColor(muted);
        cancel.setBackground(roundedRect(Color.TRANSPARENT, dp(10), dp(1), line));
        cancel.setOnClickListener(v -> finish());

        TextView save = findViewById(R.id.quick_save);
        save.setTextColor(onAccent);
        save.setBackground(roundedRect(accent, dp(10), 0, 0));
        save.setOnClickListener(v -> saveAndFinish());

        findViewById(R.id.quick_scrim).setOnClickListener(v -> finish());
    }

    private void saveAndFinish() {
        Intent intent = getIntent();
        String date = intent.getStringExtra(EXTRA_DATE);
        String itemKey = intent.getStringExtra(EXTRA_ITEM_KEY);
        String content = input.getText().toString();

        try {
            JSONObject entry = new JSONObject();
            entry.put("date", date);
            entry.put("itemKey", itemKey);
            entry.put("subjectId", intent.getStringExtra(EXTRA_SUBJECT_ID));
            entry.put("period", intent.getIntExtra(EXTRA_PERIOD, 0));
            entry.put("type", intent.getStringExtra(EXTRA_TYPE));
            entry.put("content", content);
            entry.put("savedAt", System.currentTimeMillis());
            WidgetData.appendPendingWrite(this, entry);
        } catch (Exception ignored) {
        }

        if (date != null && itemKey != null) {
            WidgetData.applyContentToPayload(this, date, itemKey, content);
        }
        WidgetData.notifyWidgets(this);
        finish();
    }

    private GradientDrawable roundedRect(int fill, int radius, int strokeWidth, int strokeColor) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setShape(GradientDrawable.RECTANGLE);
        drawable.setColor(fill);
        drawable.setCornerRadius(radius);
        if (strokeWidth > 0) drawable.setStroke(strokeWidth, strokeColor);
        return drawable;
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
