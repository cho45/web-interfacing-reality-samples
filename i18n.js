// i18n.js - Internationalization for Sample App Index
const i18n = {
	ja: {
		page_title: "JavaScriptから現実世界に干渉する7の方法 - Samples",
		main_title: "JavaScriptから現実世界に干渉する7の方法",
		subtitle: "サンプルアプリケーション集",

		ch1_qr_title: "光 - QRコード生成 (QR Code)",
		ch1_qr_desc: "入力したテキストをQRコードとして表示する、光の空間パターンによるデータ伝送。",

		ch1_comm_title: "光 - 画面光通信 (Morse Code via OOK)",
		ch1_comm_desc: "画面の明滅を光源として使い、カメラでデコードする光通信プロトタイプ。",

		ch2_vib_title: "振動 - 触覚フィードバック (Vibration API)",
		ch2_vib_desc: "Vibration API を使用して、物理的な振動パターンを制御するデモ。",

		ch2_gamepad_title: "振動 - ゲームコントローラー (Gamepad API)",
		ch2_gamepad_desc: "Gamepad API を使用して、コントローラーの状態取得と振動制御を行うデモ。",

		ch3_basics_title: "音 - 基本波形と可視化 (Web Audio API)",
		ch3_basics_desc: "オシレーターによる音の生成と、AnalyserNode を使用したリアルタイム可視化。",

		ch3_synth_title: "音 - シンセサイザー (Polyphonic Synth)",
		ch3_synth_desc: "PCキーボードで演奏可能なポリフォニック・シンセサイザーの実装。",

		ch3_comm_title: "音 - 音響通信 (300bps FSK Modem)",
		ch3_comm_desc: "Web Audio API と AudioWorklet を使用した、音によるデータ送受信モデム。",

		ch4_hid_title: "HID - レポートデバッガ (HID Debugger)",
		ch4_hid_desc: "WebHID API を使用して、デバイスから送られる生のバイナリデータを可視化。",

		ch6_serial_title: "シリアル - MicroPython Web Serial",
		ch6_serial_desc: "Web Serial API を通じて、ブラウザからマイコン(Raspberry Pi Pico)を直接操作。"
	},
	en: {
		page_title: "7 Ways to Interact with the Real World from JavaScript - Samples",
		main_title: "7 Ways to Interact with the Real World from JavaScript",
		subtitle: "Sample Applications",

		ch1_qr_title: "Light - QR Code Generator",
		ch1_qr_desc: "Display input text as a QR code, data transmission via spatial light patterns.",

		ch1_comm_title: "Light - Screen Light Communication (Morse Code via OOK)",
		ch1_comm_desc: "Light communication prototype using screen flashing as a light source, decoded by camera.",

		ch2_vib_title: "Vibration - Haptic Feedback (Vibration API)",
		ch2_vib_desc: "Demo controlling physical vibration patterns using the Vibration API.",

		ch2_gamepad_title: "Vibration - Game Controller (Gamepad API)",
		ch2_gamepad_desc: "Demo for reading controller state and controlling vibration using the Gamepad API.",

		ch3_basics_title: "Sound - Basic Waveforms and Visualization (Web Audio API)",
		ch3_basics_desc: "Sound generation with oscillators and real-time visualization using AnalyserNode.",

		ch3_synth_title: "Sound - Synthesizer (Polyphonic Synth)",
		ch3_synth_desc: "Implementation of a polyphonic synthesizer playable with a PC keyboard.",

		ch3_comm_title: "Sound - Acoustic Communication (300bps FSK Modem)",
		ch3_comm_desc: "Data transmission/reception modem via sound using Web Audio API and AudioWorklet.",

		ch4_hid_title: "HID - Report Debugger",
		ch4_hid_desc: "Visualize raw binary data sent from devices using the WebHID API.",

		ch6_serial_title: "Serial - MicroPython Web Serial",
		ch6_serial_desc: "Directly control a microcontroller (Raspberry Pi Pico) from the browser via Web Serial API."
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
