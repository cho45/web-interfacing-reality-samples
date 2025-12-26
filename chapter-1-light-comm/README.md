# Chapter 1: 画面光通信 (Morse Code via OOK)

画面全体の明滅（On-Off Keying）を使ってモールス信号を送信し、カメラで読み取るプロトタイプです。

## 使い方

1. `index.html` をブラウザで開きます（カメラ使用のため HTTPS または localhost 環境が必要です）。
2. **Sender**: テキストを入力して TRANSMIT を押すと、画面が点滅して信号を送信します。
3. **Receiver**: 「Start Camera」を押し、点滅している画面をカメラ中央のガイドに捉えると、モールス信号がデコードされます。