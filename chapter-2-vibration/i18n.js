// i18n.js - Internationalization for Vibration Test
const i18n = {
	ja: {
		page_title: "Chapter 2: Vibration Test",
		title: "振動テスト",
		description: "このページでは、Vibration APIを使ってスマートフォンを振動させることができます。各ボタンをタップして、異なる振動パターンを体験してください。",
		btn_200ms: "200ms 振動",
		btn_200ms_desc: "基本的な短い振動",
		btn_pattern: "パターン振動",
		btn_pattern_desc: "200ms振動 → 100ms休止 → 200ms振動",
		btn_sos: "SOS信号",
		btn_sos_desc: "モールス信号のSOSパターン (... --- ...)",
		btn_notification: "通知パターン",
		btn_notification_desc: "短い2回の振動",
		btn_modern: "通知風",
		btn_modern_desc: "ブーブブというリズムの振動"
	},
	en: {
		page_title: "Chapter 2: Vibration Test",
		title: "Vibration Test",
		description: "This page allows you to vibrate your smartphone using the Vibration API. Tap each button to experience different vibration patterns.",
		btn_200ms: "200ms Vibration",
		btn_200ms_desc: "Basic short vibration",
		btn_pattern: "Pattern Vibration",
		btn_pattern_desc: "200ms vib → 100ms pause → 200ms vib",
		btn_sos: "SOS Signal",
		btn_sos_desc: "Morse code SOS pattern (... --- ...)",
		btn_notification: "Notification Pattern",
		btn_notification_desc: "Two short vibrations",
		btn_modern: "Modern Notification",
		btn_modern_desc: "Rhythmic buzz vibration"
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
