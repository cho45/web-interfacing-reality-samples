// i18n.js - Internationalization for HID Debugger
const i18n = {
	ja: {
		page_title: "HID Debugger - JavaScriptから現実世界に干渉する7の方法",
		nav_back: "サンプル一覧に戻る",
		subtitle: "WebHID API を使用したデバイス生データの可視化",
		btn_connect: "HID デバイスを選択",
		input_reports: "Input Reports",
		reports_desc: "デバイスを操作すると、受信したバイナリデータがリアルタイムに表示されます。",
		waiting: "Waiting for connection..."
	},
	en: {
		page_title: "HID Debugger - 7 Ways to Interact with the Real World from JavaScript",
		nav_back: "Back to Samples",
		subtitle: "Raw device data visualization with WebHID API",
		btn_connect: "Select HID Device",
		input_reports: "Input Reports",
		reports_desc: "When you operate the device, received binary data is displayed in real-time.",
		waiting: "Waiting for connection..."
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
