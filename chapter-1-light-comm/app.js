// --- Constants & Config ---
const CONFIG = {
    DEFAULT_UNIT_TIME: 100, // ms
    DEFAULT_THRESHOLD: 128,
    CAMERA_CONSTRAINTS: {
        video: { 
            facingMode: "environment",
            width: { ideal: 640 },
            height: { ideal: 480 }
        }
    },
    SAMPLE_SIZE: 20 // px
};

/**
 * 送信機クラス: テキストをモールス信号に変換し、画面を明滅させる
 */
class LightTransmitter {
    /**
     * @param {HTMLElement} displayEl 点滅させる表示要素
     * @param {HTMLElement} statusEl 状態表示テキスト要素
     */
    constructor(displayEl, statusEl) {
        this.displayEl = displayEl;
        this.statusEl = statusEl;
        this.encoder = new MorseEncoder();
        this.isTransmitting = false;
        this.unitTime = CONFIG.DEFAULT_UNIT_TIME;
    }

    /**
     * @param {number} speed Unit time in ms
     */
    setSpeed(speed) {
        this.unitTime = speed;
    }

    /**
     * テキストを送信する
     * @param {string} text 
     */
    async transmit(text) {
        if (this.isTransmitting) return;
        if (!text) return;

        this.isTransmitting = true;
        this.statusEl.textContent = "ENCODING...";

        try {
            const sequence = this.encoder.encode(text);
            this.statusEl.textContent = "TRANSMITTING...";
            
            for (const step of sequence) {
                this.setDisplay(step.state);
                await this.wait(step.duration * this.unitTime);
            }
        } finally {
            this.setDisplay(false);
            this.statusEl.textContent = "IDLE";
            this.isTransmitting = false;
        }
    }

    setDisplay(isOn) {
        if (isOn) {
            this.displayEl.classList.remove('display-off');
            this.displayEl.classList.add('display-on');
        } else {
            this.displayEl.classList.remove('display-on');
            this.displayEl.classList.add('display-off');
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * グラフ描画クラス: 信号レベルを可視化する
 */
class SignalGraph {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.data = new Array(300).fill(0);
    }

    /**
     * 新しい値をグラフに追加して再描画
     * @param {number} value 現在の輝度値 (0-255)
     * @param {number} threshold 現在の閾値 (0-255)
     */
    update(value, threshold) {
        this.data.shift();
        this.data.push(value);
        this.draw(threshold);
    }

    draw(threshold) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);

        // Draw threshold line
        const thY = h - (threshold / 255 * h);
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'red';
        this.ctx.moveTo(0, thY);
        this.ctx.lineTo(w, thY);
        this.ctx.stroke();

        // Draw signal
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#0f0';
        this.ctx.lineWidth = 2;
        
        const stepX = w / this.data.length;
        
        for (let i = 0; i < this.data.length; i++) {
            const x = i * stepX;
            const y = h - (this.data[i] / 255 * h);
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();
    }
}

/**
 * 受信機クラス: カメラ映像から輝度を読み取り、信号を復号する
 */
class LightReceiver {
    /**
     * @param {HTMLVideoElement} videoEl 
     * @param {HTMLCanvasElement} canvasEl 
     * @param {object} uiCallbacks UI更新用コールバック
     */
    constructor(videoEl, canvasEl, uiCallbacks) {
        this.video = videoEl;
        this.canvas = canvasEl;
        this.ctx = canvasEl.getContext('2d');
        this.decoder = new MorseDecoder();
        
        this.uiCallbacks = uiCallbacks; 
        
        this.threshold = CONFIG.DEFAULT_THRESHOLD;
        this.unitTime = CONFIG.DEFAULT_UNIT_TIME;
        this.isCameraRunning = false;
        
        // Signal State
        this.lastState = false; 
        this.stateStartTime = 0;
    }

    setThreshold(val) {
        this.threshold = val;
    }

    setSpeed(val) {
        this.unitTime = val;
    }

    async start() {
        if (this.isCameraRunning) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia(CONFIG.CAMERA_CONSTRAINTS);
            this.video.srcObject = stream;
            this.isCameraRunning = true;
            
            this.video.addEventListener('play', () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.loop();
            });

        } catch (err) {
            console.error("Camera Error:", err);
            alert("Camera access denied or error: " + err.name);
        }
    }

    loop() {
        if (!this.isCameraRunning) return;

        // 1. Draw video frame
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        // 2. Sample brightness from center
        const { brightness, centerX, centerY, size } = this.sampleBrightness();
        this.uiCallbacks.onBrightness(brightness);

        // 3. Process Signal
        this.processSignal(brightness);

        // 4. Visualize Sampling Area
        this.drawOverlay(centerX, centerY, size, brightness > this.threshold);

        requestAnimationFrame(() => this.loop());
    }

    sampleBrightness() {
        const size = CONFIG.SAMPLE_SIZE;
        const centerX = Math.floor(this.canvas.width / 2);
        const centerY = Math.floor(this.canvas.height / 2);
        
        const frameData = this.ctx.getImageData(centerX - size/2, centerY - size/2, size, size);
        const data = frameData.data;
        
        let total = 0;
        for (let i = 0; i < data.length; i += 4) {
            total += (data[i] + data[i+1] + data[i+2]) / 3;
        }
        return { 
            brightness: total / (data.length / 4),
            centerX, centerY, size
        };
    }

    drawOverlay(cx, cy, size, isOn) {
        this.ctx.strokeStyle = '#0f0';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(cx - size/2, cy - size/2, size, size);

        if (isOn) {
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            this.ctx.fillRect(cx - size/2, cy - size/2, size, size);
        }
    }

    processSignal(brightness) {
        const currentState = brightness > this.threshold;
        const now = performance.now();

        if (currentState !== this.lastState) {
            // State Changed
            const durationMs = now - this.stateStartTime;
            const durationUnits = durationMs / this.unitTime;
            
            if (this.stateStartTime !== 0) {
                const char = this.decoder.push(this.lastState, durationUnits);
                
                // Visualization callback
                const sym = this.lastState ? (durationUnits > 2 ? '-' : '.') : ' ';
                this.uiCallbacks.onSignalState(char, sym);
            }

            this.lastState = currentState;
            this.stateStartTime = now;
        } else {
            // State Continuing... Watchdog for long silence
            const durationMs = now - this.stateStartTime;
            const durationUnits = durationMs / this.unitTime;

            if (!currentState && durationUnits > 7.5 && this.decoder.buffer.length > 0) {
                const char = this.decoder.flush();
                if (char) {
                    this.uiCallbacks.onSignalState(char, ' ');
                }
            }
        }
    }
}

// --- Main Application Entry ---
class App {
    constructor() {
        this.initTransmitter();
        this.initReceiver();
    }

    initTransmitter() {
        const transmitter = new LightTransmitter(
            document.getElementById('transmitter-display'),
            document.getElementById('transmit-status')
        );

        document.getElementById('speed-range').addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            document.getElementById('speed-val').textContent = val;
            transmitter.setSpeed(val);
        });

        document.getElementById('btn-transmit').addEventListener('click', async (e) => {
            e.target.disabled = true;
            const text = document.getElementById('input-text').value;
            await transmitter.transmit(text);
            e.target.disabled = false;
        });
    }

    initReceiver() {
        const brightnessEl = document.getElementById('brightness-level');
        const decodedEl = document.getElementById('decoded-text');
        const debugSignalEl = document.getElementById('debug-signal');
        const thresholdRange = document.getElementById('threshold-range');
        const thresholdVal = document.getElementById('threshold-val');
        const rxSpeedRange = document.getElementById('rx-speed-range');
        const rxSpeedVal = document.getElementById('rx-speed-val');

        const graph = new SignalGraph(document.getElementById('signal-graph'));

        const receiver = new LightReceiver(
            document.getElementById('camera-feed'),
            document.getElementById('processing-canvas'),
            {
                onBrightness: (val) => {
                    brightnessEl.textContent = Math.floor(val);
                    graph.update(val, receiver.threshold);
                },
                onSignalState: (char, symbol) => {
                    if (char) {
                        decodedEl.textContent += char;
                        debugSignalEl.textContent += ' '; 
                        decodedEl.scrollLeft = decodedEl.scrollWidth;
                    } else if (symbol && symbol !== ' ') {
                        debugSignalEl.textContent += symbol;
                    }
                }
            }
        );

        thresholdRange.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            thresholdVal.textContent = val;
            receiver.setThreshold(val);
        });

        rxSpeedRange.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            rxSpeedVal.textContent = val;
            receiver.setSpeed(val);
        });

        document.getElementById('btn-camera').addEventListener('click', (e) => {
            e.target.disabled = true;
            receiver.start();
        });
    }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
    new App();
});