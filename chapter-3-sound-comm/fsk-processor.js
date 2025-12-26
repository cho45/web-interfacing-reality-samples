// --- FSK Mixer ---
class FskMixer extends AudioWorkletProcessor {
    constructor(options) {
        super();
        this.phase = 0;
        const { centerFreq } = options.processorOptions;
        this.phaseInc = (2 * Math.PI * centerFreq) / sampleRate;
    }

    process(inputs, outputs) {
        const input = inputs[0][0];
        const [iOut, qOut] = outputs[0];
        if (!input || !iOut || !qOut) return true;

        for (let i = 0; i < input.length; i++) {
            // 中心周波数のサイン波を掛け合わせて基底帯域に落とす
            iOut[i] = Math.cos(this.phase) * input[i];
            qOut[i] = Math.sin(this.phase) * input[i];

            this.phase += this.phaseInc;
        }
        return true;
    }
}

// --- FSK Discriminator ---
class FskDiscriminator extends AudioWorkletProcessor {
    constructor() {
        super();
        this.prevPhase = 0;
    }

    process(inputs, outputs) {
        const [iIn, qIn] = inputs[0];
        const output = outputs[0][0];
        if (!iIn || !qIn || !output) return true;

        for (let i = 0; i < iIn.length; i++) {
            const amplitude = iIn[i] ** 2 + qIn[i] ** 2;
            const currentPhase = (Math.atan2(qIn[i], iIn[i]) / Math.PI) * 2; // -2.0 〜 2.0

            // 前のサンプルとの位相差から、周波数のずれを検出する
            let deltaPhase = (this.prevPhase - currentPhase + 2) % 2;
            if (deltaPhase < 0) deltaPhase += 2;

            // 中心周波数より高ければ負、低ければ正の電圧を出力（元のロジックを維持）
            output[i] = (deltaPhase - 1) * amplitude;

            this.prevPhase = currentPhase;
        }
        return true;
    }
}

// --- FSK Decoder ---
class FskDecoder extends AudioWorkletProcessor {
    constructor(options) {
        super();
        const { baudrate, startBit = 1, stopBit = 1.5, threshold = 0.0001 } = options.processorOptions;
        
        this.baudrate = baudrate;
        this.unit = Math.round(sampleRate / baudrate);
        this.startBit = startBit;
        this.stopBit = stopBit;
        this.threshold = threshold;

        this.state = "waiting";
        this.total = 0;
        this.mark = 0;
        this.space = 0;
        this.bit = 0;
        this.byte = 0;
    }
    process(inputs) {
        const input = inputs[0][0];
        if (!input) return true;
        for (let i = 0; i < input.length; i++) {
            let data = 0;
            if (input[i] < -this.threshold) data = -1;
            else if (input[i] > this.threshold) data = 1;

            this.update(data);
        }
        return true;
    }
    update(data) {
        const states = {
            waiting: () => {
                if (data === -1) this.state = "start";
                else this.total = 0;
            },
            start: () => {
                if (data === 1) this.mark++;
                if (data === -1) this.space++;
                if ((this.unit * this.startBit) <= this.total) {
                    if (this.mark < this.space) {
                        this.mark = 0; this.space = 0;
                        this.total = 0;
                        this.state = "data";
                        this.bit = 0; this.byte = 0;
                    } else {
                        this.byte = 0; this.state = "waiting"; this.total = 0;
                    }
                }
            },
            data: () => {
                if (data === 1) this.mark++;
                if (data === -1) this.space++;
                if (this.unit <= this.total) {
                    const bit = (this.mark > this.space) ? 1 : 0;
                    this.mark = 0; this.space = 0;
                    this.byte |= (bit << this.bit++);
                    this.total = 0;
                    if (this.bit >= 8) {
                        this.bit = 0;
                        this.state = "stop";
                    }
                }
            },
            stop: () => {
                if (data === 1) this.mark++;
                if (data === -1) this.space++;
                if (this.unit * this.stopBit <= this.total) {
                    if (this.space < this.mark) {
                        this.port.postMessage(this.byte);
                    }
                    this.mark = 0; this.space = 0; this.byte = 0;
                    this.state = "waiting"; this.total = 0;
                }
            }
        };

        states[this.state]();
        if (this.state !== "waiting") this.total++;
    }
}

registerProcessor('fsk-mixer', FskMixer);
registerProcessor('fsk-discriminator', FskDiscriminator);
registerProcessor('fsk-decoder', FskDecoder);