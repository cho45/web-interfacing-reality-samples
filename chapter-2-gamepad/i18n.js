// i18n.js - Internationalization for Gamepad API Demo
const i18n = {
	ja: {
		page_title: "Gamepad - JavaScriptから現実世界に干渉する7の方法",
		nav_back: "サンプル一覧に戻る",
		subtitle: "ゲームコントローラーの状態取得と振動フィードバック",
		status_title: "接続状態",
		no_gamepad: "コントローラーが接続されていません。ボタンを押すと認識されます。",
		left_stick: "左スティック",
		right_stick: "右スティック",
		buttons: "ボタン",
		vibration_title: "振動テスト",
		vibration_desc: "接続中のコントローラーに振動エフェクトを送信します。",
		btn_200ms: "200ms (中強度)",
		btn_strong: "500ms (強モーターのみ)",
		btn_weak: "500ms (弱モーターのみ)",
		btn_max: "1s (最大強度)"
	},
	en: {
		page_title: "Gamepad - 7 Ways to Interact with the Real World from JavaScript",
		nav_back: "Back to Samples",
		subtitle: "Gamepad state reading and vibration feedback",
		status_title: "Connection Status",
		no_gamepad: "No controller connected. Press a button to be recognized.",
		left_stick: "Left Stick",
		right_stick: "Right Stick",
		buttons: "Buttons",
		vibration_title: "Vibration Test",
		vibration_desc: "Send vibration effects to the connected controller.",
		btn_200ms: "200ms (Medium)",
		btn_strong: "500ms (Strong motor only)",
		btn_weak: "500ms (Weak motor only)",
		btn_max: "1s (Max intensity)"
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
}

document.addEventListener('DOMContentLoaded', applyTranslations);
