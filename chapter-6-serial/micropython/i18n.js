// i18n.js - Internationalization for MicroPython Web Serial
const i18n = {
	ja: {
		page_title: "MicroPython Web Serial Test",
		status_disconnected: "未接続",
		btn_connect: "接続",
		btn_disconnect: "切断",
		cmd_title: "コマンド送信",
		cmd_placeholder: "MicroPythonコマンドを入力 (例: print('Hello'))",
		btn_send: "送信",
		btn_blink: "Lチカ実行",
		btn_temp: "温度センサー読み取り",
		ctrl_title: "制御文字送信",
		btn_ctrl_c: "Ctrl+C (中断)",
		btn_ctrl_d: "Ctrl+D (リブート)",
		btn_raw_repl: "Raw REPLモード",
		btn_clear: "ログクリア",
		log_title: "受信ログ",
		verify_title: "検証項目",
		verify_1: "REPLのプロンプト (>>>) が受信できるか",
		verify_2: "コマンド送信後にレスポンスが受信できるか",
		verify_3: "REPLの出力とデータを区別できるか",
		verify_4: "エラーメッセージが正しく表示されるか",
		verify_5: "制御文字（Ctrl+C, Ctrl+D）が機能するか",
		verify_6: "Raw REPLモードでクリーンな出力が得られるか",
		ctrl_chars_title: "MicroPython REPLの制御文字",
		ctrl_1: "\\x03 (Ctrl+C): 実行中のプログラムを中断",
		ctrl_2: "\\x01 (Ctrl+A): Raw REPLモードに入る",
		ctrl_3: "\\x02 (Ctrl+B): 通常REPLモードに戻る",
		ctrl_4: "\\x04 (Ctrl+D): ソフトリブート / ペーストモード終了",
		ctrl_5: "\\x05 (Ctrl+E): ペーストモードに入る",
		usage_title: "使い方",
		usage_1: "Raspberry Pi PicoにMicroPython uf2を書き込む",
		usage_2: "「接続」ボタンをクリックしてシリアルポートを選択",
		usage_3: "REPLプロンプトが表示されることを確認",
		usage_4: "コマンドを送信して動作確認"
	},
	en: {
		page_title: "MicroPython Web Serial Test",
		status_disconnected: "Disconnected",
		btn_connect: "Connect",
		btn_disconnect: "Disconnect",
		cmd_title: "Send Command",
		cmd_placeholder: "Enter MicroPython command (e.g., print('Hello'))",
		btn_send: "Send",
		btn_blink: "Run LED Blink",
		btn_temp: "Read Temperature",
		ctrl_title: "Send Control Characters",
		btn_ctrl_c: "Ctrl+C (Interrupt)",
		btn_ctrl_d: "Ctrl+D (Reboot)",
		btn_raw_repl: "Raw REPL Mode",
		btn_clear: "Clear Log",
		log_title: "Receive Log",
		verify_title: "Verification Items",
		verify_1: "Can receive REPL prompt (>>>)",
		verify_2: "Can receive response after sending command",
		verify_3: "Can distinguish REPL output from data",
		verify_4: "Error messages display correctly",
		verify_5: "Control characters (Ctrl+C, Ctrl+D) work",
		verify_6: "Clean output in Raw REPL mode",
		ctrl_chars_title: "MicroPython REPL Control Characters",
		ctrl_1: "\\x03 (Ctrl+C): Interrupt running program",
		ctrl_2: "\\x01 (Ctrl+A): Enter Raw REPL mode",
		ctrl_3: "\\x02 (Ctrl+B): Return to normal REPL mode",
		ctrl_4: "\\x04 (Ctrl+D): Soft reboot / Exit paste mode",
		ctrl_5: "\\x05 (Ctrl+E): Enter paste mode",
		usage_title: "How to Use",
		usage_1: "Write MicroPython uf2 to Raspberry Pi Pico",
		usage_2: "Click 'Connect' button to select serial port",
		usage_3: "Confirm REPL prompt appears",
		usage_4: "Send commands to verify operation"
	}
};

function getLang() {
	const params = new URLSearchParams(location.search);
	if (params.has('lang')) return params.get('lang');
	return navigator.language.startsWith('ja') ? 'ja' : 'en';
}

function t(key) {
	const lang = getLang();
	return i18n[lang]?.[key] || i18n['en'][key] || key;
}

function applyTranslations() {
	document.documentElement.lang = getLang();
	document.title = t('page_title');

	document.querySelectorAll('[data-i18n]').forEach(el => {
		el.textContent = t(el.dataset.i18n);
	});
	document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
		el.placeholder = t(el.dataset.i18nPlaceholder);
	});
}

document.addEventListener('DOMContentLoaded', applyTranslations);
