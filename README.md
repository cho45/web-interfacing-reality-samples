# 7 Ways to Interact with the Real World from JavaScript - Sample Applications

[日本語](#japanese) | [English](#english)

---

<a id="english"></a>
## English

A collection of sample code demonstrating browser-hardware integration using Web APIs introduced in this book.

### Chapter 1: Light
- **[QR Code Generator](./chapter-1-light-qr/)**
  - Display input text as a QR code, data transmission via spatial light patterns.
- **[Screen Light Communication (Morse Code via OOK)](./chapter-1-light-comm/)**
  - Light communication prototype using screen flashing as a light source, decoded by camera.

### Chapter 2: Vibration
- **[Haptic Feedback (Vibration API)](./chapter-2-vibration/)**
  - Demo controlling physical vibration patterns using the Vibration API.
- **[Game Controller (Gamepad API)](./chapter-2-gamepad/)**
  - Demo for reading controller state and controlling vibration using the Gamepad API.

### Chapter 3: Sound
- **[Basic Waveforms and Visualization (Web Audio API)](./chapter-3-sound-basics/)**
  - Sound generation with oscillators and real-time visualization using AnalyserNode.
- **[Synthesizer (Polyphonic Synth)](./chapter-3-synth/)**
  - Implementation of a polyphonic synthesizer playable with a PC keyboard.
- **[Acoustic Communication (300bps FSK Modem)](./chapter-3-sound-comm/)**
  - Data transmission/reception modem via sound using Web Audio API and AudioWorklet.

### Chapter 4: HID
- **[Report Debugger (HID Debugger)](./chapter-4-hid/)**
  - Visualize raw binary data sent from devices using the WebHID API.

### Chapter 6: Serial
- **[MicroPython Web Serial](./chapter-6-serial/micropython/)**
  - Directly control a microcontroller (Raspberry Pi Pico) from the browser via Web Serial API.

### Language Switching

Each sample supports both Japanese and English. Add `?lang=en` or `?lang=ja` to the URL to switch languages, or it will auto-detect based on your browser settings.

---

<a id="japanese"></a>
## 日本語

本書で紹介している Web API を活用した、ブラウザとハードウェアを連携させるサンプルコード集です。

### Chapter 1: 光
- **[QRコード生成 (QR Code)](./chapter-1-light-qr/)**
  - 入力したテキストをQRコードとして表示する、光の空間パターンによるデータ伝送。
- **[画面光通信 (Morse Code via OOK)](./chapter-1-light-comm/)**
  - 画面の明滅を光源として使い、カメラでデコードする光通信プロトタイプ。

### Chapter 2: 振動
- **[触覚フィードバック (Vibration API)](./chapter-2-vibration/)**
  - Vibration API を使用して、物理的な振動パターンを制御するデモ。
- **[ゲームコントローラー (Gamepad API)](./chapter-2-gamepad/)**
  - Gamepad API を使用して、コントローラーの状態取得と振動制御を行うデモ。

### Chapter 3: 音
- **[基本波形と可視化 (Web Audio API)](./chapter-3-sound-basics/)**
  - オシレーターによる音の生成と、AnalyserNode を使用したリアルタイム可視化。
- **[シンセサイザー (Polyphonic Synth)](./chapter-3-synth/)**
  - PCキーボードで演奏可能なポリフォニック・シンセサイザーの実装。
- **[音響通信 (300bps FSK Modem)](./chapter-3-sound-comm/)**
  - Web Audio API と AudioWorklet を使用した、音によるデータ送受信モデム。

### Chapter 4: HID
- **[レポートデバッガ (HID Debugger)](./chapter-4-hid/)**
  - WebHID API を使用して、デバイスから送られる生のバイナリデータを可視化。

### Chapter 6: シリアル
- **[MicroPython Web Serial](./chapter-6-serial/micropython/)**
  - Web Serial API を通じて、ブラウザからマイコン(Raspberry Pi Pico)を直接操作。

### 言語切り替え

各サンプルは日本語・英語の両方に対応しています。URLに `?lang=ja` または `?lang=en` を追加するか、ブラウザの言語設定に応じて自動判定されます。
