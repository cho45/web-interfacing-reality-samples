// i18n.js - Internationalization for QR Code Generator
const i18n = {
	ja: {
		page_title: "QRコード生成 - JavaScriptから現実世界に干渉する7の方法",
		nav_back: "サンプル一覧に戻る",
		title: "QRコード生成",
		description: "入力したテキストをQRコード（物理的な光のパターン）として画面に出力します。",
		label_input: "テキストを入力:",
		btn_generate: "QRコード生成"
	},
	en: {
		page_title: "QR Code Generator - 7 Ways to Interact with the Real World from JavaScript",
		nav_back: "Back to Samples",
		title: "QR Code Generator",
		description: "Display the input text as a QR code (a physical light pattern) on the screen.",
		label_input: "Enter text:",
		btn_generate: "Generate QR Code"
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
