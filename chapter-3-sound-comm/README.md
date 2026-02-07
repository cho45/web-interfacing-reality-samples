# Acoustic Communication (300bps FSK Modem)

[日本語](#japanese) | [English](#english)

---

<a id="english"></a>
## English

An FSK (Frequency Shift Keying) modem implementation for data transmission via sound using the Web Audio API.

### Features

- **Communication**: 300bps FSK
- **Frequencies**: Mark (1): 1650Hz / Space (0): 1850Hz
- **Implementation**: Real-time signal processing using AudioWorklet

### How to Use

1. Open `index.html` in a browser.
2. Click **[Start Audio Context]** to enable audio.
3. **Transmitter**: Enter text and click **[TRANSMIT]** to send audio signals.
4. **Receiver**: Received data (via microphone or internal loopback) is displayed in the terminal.

---

<a id="japanese"></a>
## 日本語

Web Audio API を使用して、音でデータを送受信する FSK（Frequency Shift Keying）モデムの実装例です。

### 特徴

- **通信方式**: 300bps FSK
- **使用周波数**: Mark (1): 1650Hz / Space (0): 1850Hz
- **実装**: AudioWorklet を使用したリアルタイム信号処理

### 使い方

1. `index.html` をブラウザで開きます。
2. **[Start Audio Context]** ボタンをクリックしてオーディオ機能を有効にします。
3. **Transmitter**: テキストを入力して **[TRANSMIT]** をクリックすると、音が流れます。
4. **Receiver**: マイク入力、または内部ループバックを通じて受信したデータが、ターミナル部分に表示されます。
