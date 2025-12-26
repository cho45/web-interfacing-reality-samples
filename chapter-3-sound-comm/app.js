class FskApp {
    constructor() {
        this.config = { mark: 1650, space: 1850, baud: 300 };
        this.ui = {
            start: document.getElementById('btn-start'),
            tx: document.getElementById('btn-transmit'),
            input: document.getElementById('input-text'),
            out: document.getElementById('decoded-text'),
            status: document.getElementById('audio-status'),
            canvas: document.getElementById('visualizer')
        };
        this.ctx = null;
        this.analyser = null;
        this.encoder = new TextEncoder();
        this.textDecoder = new TextDecoder();

        this.ui.start.addEventListener('click', () => this.init());
        this.ui.tx.addEventListener('click', () => this.transmit(this.ui.input.value));
    }

    async init() {
        if (this.ctx) return;
        
        this.ctx = new AudioContext();
        await this.ctx.audioWorklet.addModule('fsk-processor.js');

        this._setupReceiver();

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = this.ctx.createMediaStreamSource(stream);
            source.connect(this.inputGain);
        } catch (e) {
            console.warn("Mic access denied, loopback only.");
        }

        const { start, tx, status } = this.ui;
        start.disabled = true;
        tx.disabled = false;
        status.textContent = "Status: ON";
        status.classList.add('active');

        this.draw();
    }

    _setupReceiver() {
        const { mark, space, baud } = this.config;
        const centerFreq = (mark + space) / 2;

        const preFilter = this.ctx.createBiquadFilter();
        preFilter.type = 'bandpass';
        preFilter.frequency.value = centerFreq;
        preFilter.Q.value = 1;

        const mixer = new AudioWorkletNode(this.ctx, 'fsk-mixer', {
            outputChannelCount: [2], processorOptions: { centerFreq }
        });

        const splitter = this.ctx.createChannelSplitter(2);
        const merger = this.ctx.createChannelMerger(2);
        mixer.connect(splitter);
        for (let i = 0; i < 2; i++) {
            const lpf = this.ctx.createBiquadFilter();
            lpf.type = 'lowpass';
            lpf.frequency.value = baud;
            splitter.connect(lpf, i);
            lpf.connect(merger, 0, i);
        }

        const disc = new AudioWorkletNode(this.ctx, 'fsk-discriminator');
        const postLpf = this.ctx.createBiquadFilter();
        postLpf.type = 'lowpass';
        postLpf.frequency.value = baud;

        const decoderNode = new AudioWorkletNode(this.ctx, 'fsk-decoder', {
            processorOptions: { baudrate: baud }
        });

        decoderNode.port.onmessage = (e) => {
            // 1バイトずつデコードし、マルチバイト文字の途中の場合はバッファリングする
            const char = this.textDecoder.decode(new Uint8Array([e.data]), { stream: true });
            this.ui.out.textContent += char;
            this.ui.out.scrollTop = this.ui.out.scrollHeight;
        };

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        postLpf.connect(this.analyser);

        preFilter.connect(mixer);
        merger.connect(disc);
        disc.connect(postLpf);
        postLpf.connect(decoderNode);

        this.inputGain = this.ctx.createGain();
        this.inputGain.connect(preFilter);
    }

    transmit(text) {
        this.ui.out.textContent = ""; // 送信開始時に受信表示をクリア
        const { sampleRate, destination } = this.ctx;
        const { mark, space, baud } = this.config;
        
        const bytes = this.encoder.encode(text);
        const unit = sampleRate / baud;
        const bitsPerByte = 1 + 8 + 1.5;
        const wait = 30;
        
        const buffer = this.ctx.createBuffer(1, (bytes.length * bitsPerByte * unit) + (wait * 2 * unit), sampleRate);
        const data = buffer.getChannelData(0);
        
        let pos = 0;
        let phase = 0;
        const mInc = 2 * Math.PI * mark / sampleRate;
        const sInc = 2 * Math.PI * space / sampleRate;

        const sendBit = (bit, len) => {
            const inc = bit ? mInc : sInc;
            const samples = len * unit;
            for (let i = 0; i < samples; i++) {
                phase += inc;
                data[pos++] = Math.sin(phase);
            }
        };

        sendBit(1, wait);
        for (const byte of bytes) {
            sendBit(0, 1); // Start
            for (let i = 0; i < 8; i++) sendBit((byte & (1 << i)) ? 1 : 0, 1);
            sendBit(1, 1.5); // Stop
        }
        sendBit(1, wait);

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.connect(this.inputGain); 
        source.start(0);
    }

    draw() {
        const canvas = this.ui.canvas;
        const ctx = canvas.getContext('2d');
        const buffer = new Uint8Array(this.analyser.frequencyBinCount);
        
        const render = () => {
            requestAnimationFrame(render);
            this.analyser.getByteTimeDomainData(buffer);
            
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#00f';
            ctx.beginPath();
            const sliceWidth = canvas.width / buffer.length;
            let x = 0;
            for (let i = 0; i < buffer.length; i++) {
                const v = buffer[i] / 128.0;
                const y = v * canvas.height / 2;
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        };
        render();
    }
}
new FskApp();
