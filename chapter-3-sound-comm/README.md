# Chapter 3: 音響通信 (300bps FSK Modem)

Web Audio API を使用して、音でデータを送受信する FSK（Frequency Shift Keying）モデムの実装例です。

## 特徴

- **通信方式**: 300bps FSK
- **使用周波数**: Mark (1): 1650Hz / Space (0): 1850Hz
- **実装**: AudioWorklet を使用したリアルタイム信号処理

## 使い方

1. `index.html` をブラウザで開きます。
2. **[Start Audio Context]** ボタンをクリックしてオーディオ機能を有効にします。
3. **Transmitter**: テキストを入力して **[TRANSMIT]** をクリックすると、音が流れます。
4. **Receiver**: マイク入力、または内部ループバックを通じて受信したデータが、ターミナル部分に表示されます。