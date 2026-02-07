// i18n.js - Internationalization for Simple Synthesizer
const i18n = {
	ja: {
		page_title: "Simple Synth - JavaScriptから現実世界に干渉する7の方法",
		nav_back: "サンプル一覧に戻る",
		subtitle: "Web Audio API によるポリフォニック・シンセサイザー",
		btn_start: "AudioContext 開始",
		wave_label: "波形:",
		wave_sine: "サイン波 (Sine)",
		wave_square: "矩形波 (Square)",
		wave_sawtooth: "のこぎり波 (Sawtooth)",
		wave_triangle: "三角波 (Triangle)",
		keyboard_hint: "PCキーボードで演奏できます：",
		white_keys: "白鍵",
		black_keys: "黒鍵",
		note_C: "ド",
		note_Cs: "ド#",
		note_D: "レ",
		note_Ds: "レ#",
		note_E: "ミ",
		note_F: "ファ",
		note_Fs: "ファ#",
		note_G: "ソ",
		note_Gs: "ソ#",
		note_A: "ラ",
		note_As: "ラ#",
		note_B: "シ",
		chord_CM: "CM (ドミソ)",
		chord_Dm: "Dm (レファラ)",
		chord_Em: "Em (ミソシ)",
		chord_FM: "FM (ファラド)",
		chord_GM: "GM (ソシレ)",
		chord_Am: "Am (ラドミ)",
		explanation_title: "仕組みの解説",
		polyphonic_desc: "ポリフォニック: 同時に複数のオシレーターを制御することで和音を実現しています。",
		envelope_desc: "エンベロープ (ADSR): 音の出始めと終わりに滑らかな音量変化（Ramp）を加えることで、クリックノイズを防いでいます。"
	},
	en: {
		page_title: "Simple Synth - 7 Ways to Interact with the Real World from JavaScript",
		nav_back: "Back to Samples",
		subtitle: "Polyphonic Synthesizer with Web Audio API",
		btn_start: "Start AudioContext",
		wave_label: "Waveform:",
		wave_sine: "Sine Wave",
		wave_square: "Square Wave",
		wave_sawtooth: "Sawtooth Wave",
		wave_triangle: "Triangle Wave",
		keyboard_hint: "Play with PC keyboard:",
		white_keys: "White keys",
		black_keys: "Black keys",
		note_C: "C",
		note_Cs: "C#",
		note_D: "D",
		note_Ds: "D#",
		note_E: "E",
		note_F: "F",
		note_Fs: "F#",
		note_G: "G",
		note_Gs: "G#",
		note_A: "A",
		note_As: "A#",
		note_B: "B",
		chord_CM: "CM (C-E-G)",
		chord_Dm: "Dm (D-F-A)",
		chord_Em: "Em (E-G-B)",
		chord_FM: "FM (F-A-C)",
		chord_GM: "GM (G-B-D)",
		chord_Am: "Am (A-C-E)",
		explanation_title: "How It Works",
		polyphonic_desc: "Polyphonic: Chords are achieved by controlling multiple oscillators simultaneously.",
		envelope_desc: "Envelope (ADSR): Smooth volume changes (Ramp) at the start and end of notes prevent click noise."
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
