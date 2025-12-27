// Web Serial API を使ったMicroPython REPL通信のテスト

class MicroPythonSerial {
    constructor() {
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.readableStreamClosed = null;
        this.writableStreamClosed = null;
        this.onReceive = null;
    }

    async connect() {
        try {
            // シリアルポートを要求
            this.port = await navigator.serial.requestPort();

            // ポートを開く（MicroPythonのデフォルト設定）
            await this.port.open({
                baudRate: 115200,
                dataBits: 8,
                stopBits: 1,
                parity: 'none'
            });

            // 読み取りストリームの設定
            const textDecoder = new TextDecoderStream();
            this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
            this.reader = textDecoder.readable.getReader();

            // 書き込みストリームの設定
            const textEncoder = new TextEncoderStream();
            this.writableStreamClosed = textEncoder.readable.pipeTo(this.port.writable);
            this.writer = textEncoder.writable.getWriter();

            // 読み取りループを開始
            this.startReading();

            // Ctrl+C を送信してREPLをリセット
            await this.sendRaw('\x03');

            // Ctrl+B を送信して通常モードに（ペーストモードの場合に備えて）
            await this.sendRaw('\x02');

            return true;
        } catch (error) {
            console.error('接続エラー:', error);
            throw error;
        }
    }

    async disconnect() {
        // reader をキャンセル
        if (this.reader) {
            await this.reader.cancel();
            await this.readableStreamClosed.catch(() => {}); // エラーを無視
            this.reader = null;
        }

        // writer をクローズ
        if (this.writer) {
            await this.writer.close();
            await this.writableStreamClosed; // 完了を待つ
            this.writer = null;
        }

        // ポートをクローズ
        if (this.port) {
            await this.port.close();
            this.port = null;
        }
    }

    async startReading() {
        try {
            while (true) {
                const { value, done } = await this.reader.read();
                if (done) {
                    break;
                }
                if (this.onReceive) {
                    this.onReceive(value);
                }
            }
        } catch (error) {
            console.error('読み取りエラー:', error);
        }
    }

    async sendRaw(text) {
        if (!this.writer) {
            throw new Error('未接続');
        }
        await this.writer.write(text);
    }

    async sendCommand(command) {
        // コマンドを送信（改行付き）
        await this.sendRaw(command + '\r\n');
    }

    async sendCtrlC() {
        // Ctrl+C (0x03) を送信してプログラムを中断
        await this.sendRaw('\x03');
    }

    async sendCtrlD() {
        // Ctrl+D (0x04) を送信してソフトリブート
        await this.sendRaw('\x04');
    }

    async enterRawREPL() {
        // Ctrl+A (0x01) でRaw REPLモードに入る
        await this.sendRaw('\x01');
    }

    async exitRawREPL() {
        // Ctrl+B (0x02) でRaw REPLモードを抜ける
        await this.sendRaw('\x02');
    }

    async enterPasteMode() {
        // Ctrl+E でペーストモードに入る
        await this.sendRaw('\x05');
    }

    async exitPasteMode() {
        // Ctrl+D でペーストモードを抜けて実行
        await this.sendRaw('\x04');
    }
}

// UI制御
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const commandInput = document.getElementById('commandInput');
const sendBtn = document.getElementById('sendBtn');
const blinkBtn = document.getElementById('blinkBtn');
const tempBtn = document.getElementById('tempBtn');
const ctrlCBtn = document.getElementById('ctrlCBtn');
const ctrlDBtn = document.getElementById('ctrlDBtn');
const rawReplBtn = document.getElementById('rawReplBtn');
const clearBtn = document.getElementById('clearBtn');
const logDiv = document.getElementById('log');
const statusDiv = document.getElementById('status');

const serial = new MicroPythonSerial();

// 受信データをログに追加
serial.onReceive = (data) => {
    logDiv.textContent += data;
    logDiv.scrollTop = logDiv.scrollHeight;
};

// ステータス表示
function setStatus(message, isError = false) {
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'status error' : 'status';
}

// 接続
connectBtn.addEventListener('click', async () => {
    try {
        setStatus('接続中...');
        await serial.connect();
        setStatus('接続完了');

        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
        commandInput.disabled = false;
        sendBtn.disabled = false;
        blinkBtn.disabled = false;
        tempBtn.disabled = false;
        ctrlCBtn.disabled = false;
        ctrlDBtn.disabled = false;
        rawReplBtn.disabled = false;
    } catch (error) {
        setStatus(`接続エラー: ${error.message}`, true);
    }
});

// 切断
disconnectBtn.addEventListener('click', async () => {
    try {
        await serial.disconnect();
        setStatus('切断しました');

        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
        commandInput.disabled = true;
        sendBtn.disabled = true;
        blinkBtn.disabled = true;
        tempBtn.disabled = true;
        ctrlCBtn.disabled = true;
        ctrlDBtn.disabled = true;
        rawReplBtn.disabled = true;
    } catch (error) {
        setStatus(`切断エラー: ${error.message}`, true);
    }
});

// コマンド送信
async function sendCommand() {
    const command = commandInput.value;
    if (!command) return;

    try {
        await serial.sendCommand(command);
        commandInput.value = '';
    } catch (error) {
        setStatus(`送信エラー: ${error.message}`, true);
    }
}

sendBtn.addEventListener('click', sendCommand);
commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendCommand();
    }
});

// Lチカ実行
blinkBtn.addEventListener('click', async () => {
    try {
        // ペーストモードで複数行のコードを送信
        await serial.enterPasteMode();

        // 少し待つ
        await new Promise(resolve => setTimeout(resolve, 100));

        const code = `import machine
import time

led = machine.Pin(25, machine.Pin.OUT)

for i in range(5):
    led.on()
    time.sleep(0.2)
    led.off()
    time.sleep(0.2)

print("Blink completed!")
`;

        await serial.sendRaw(code);

        // 少し待ってからCtrl+Dで実行
        await new Promise(resolve => setTimeout(resolve, 100));
        await serial.exitPasteMode();

    } catch (error) {
        setStatus(`エラー: ${error.message}`, true);
    }
});

// 温度センサー読み取り
tempBtn.addEventListener('click', async () => {
    try {
        await serial.enterPasteMode();
        await new Promise(resolve => setTimeout(resolve, 100));

        const code = `import machine

sensor_temp = machine.ADC(4)
conversion_factor = 3.3 / (65535)
reading = sensor_temp.read_u16() * conversion_factor
temperature = 27 - (reading - 0.706) / 0.001721

print(f"Temperature: {temperature:.2f} °C")
`;

        await serial.sendRaw(code);
        await new Promise(resolve => setTimeout(resolve, 100));
        await serial.exitPasteMode();

    } catch (error) {
        setStatus(`エラー: ${error.message}`, true);
    }
});

// Ctrl+C送信
ctrlCBtn.addEventListener('click', async () => {
    try {
        await serial.sendCtrlC();
        setStatus('Ctrl+C 送信 (プログラム中断)');
    } catch (error) {
        setStatus(`エラー: ${error.message}`, true);
    }
});

// Ctrl+D送信
ctrlDBtn.addEventListener('click', async () => {
    try {
        await serial.sendCtrlD();
        setStatus('Ctrl+D 送信 (ソフトリブート)');
    } catch (error) {
        setStatus(`エラー: ${error.message}`, true);
    }
});

// Raw REPLモード切り替え
let isRawREPL = false;
rawReplBtn.addEventListener('click', async () => {
    try {
        if (isRawREPL) {
            await serial.exitRawREPL();
            setStatus('通常REPLモードに戻りました');
            rawReplBtn.textContent = 'Raw REPLモード';
            isRawREPL = false;
        } else {
            await serial.enterRawREPL();
            setStatus('Raw REPLモードに入りました');
            rawReplBtn.textContent = '通常REPLモード';
            isRawREPL = true;
        }
    } catch (error) {
        setStatus(`エラー: ${error.message}`, true);
    }
});

// ログクリア
clearBtn.addEventListener('click', () => {
    logDiv.textContent = '';
});
