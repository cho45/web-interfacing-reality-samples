# JavaScriptから現実世界に干渉する7の方法 - サンプルアプリケーション集

本書で紹介している Web API を活用した、ブラウザとハードウェアを連携させるサンプルコード集です。

## 各章のサンプル

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