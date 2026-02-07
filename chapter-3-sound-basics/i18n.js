// i18n.js - Internationalization for Sound Basics
const i18n = {
	ja: {
		page_title: "Sound Basics - JavaScriptから現実世界に干渉する7の方法",
		nav_back: "サンプル一覧に戻る",
		subtitle: "Web Audio API による波形生成とリアルタイム可視化",
		btn_audio_init: "AudioContext 開始",
		browser_note: "※ ブラウザの制限により、音を出すにはユーザー操作（クリック）が必要です。",
		osc_title: "Oscillator (発振器)",
		wave_label: "波形",
		wave_sine: "サイン波 (Sine)",
		wave_square: "矩形波 (Square)",
		wave_sawtooth: "のこぎり波 (Sawtooth)",
		wave_triangle: "三角波 (Triangle)",
		btn_play: "音を鳴らす",
		freq_label: "周波数",
		gain_label: "音量",
		vis_title: "Visualizer (可視化)",
		btn_mic: "マイク入力に切り替え",
		fft_label: "周波数スペクトラム (FFT)",
		time_label: "波形 (タイムドメイン)"
	},
	en: {
		page_title: "Sound Basics - 7 Ways to Interact with the Real World from JavaScript",
		nav_back: "Back to Samples",
		subtitle: "Waveform generation and real-time visualization with Web Audio API",
		btn_audio_init: "Start AudioContext",
		browser_note: "Due to browser restrictions, user interaction (click) is required to play sound.",
		osc_title: "Oscillator",
		wave_label: "Waveform",
		wave_sine: "Sine Wave",
		wave_square: "Square Wave",
		wave_sawtooth: "Sawtooth Wave",
		wave_triangle: "Triangle Wave",
		btn_play: "Play Sound",
		freq_label: "Frequency",
		gain_label: "Volume",
		vis_title: "Visualizer",
		btn_mic: "Switch to Mic Input",
		fft_label: "Frequency Spectrum (FFT)",
		time_label: "Waveform (Time Domain)"
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
