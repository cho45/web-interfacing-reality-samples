class SimpleSynth {
    constructor() {
        this.audioCtx = null;
        this.oscillators = new Map(); // frequency -> { osc, gain }
        this.waveform = 'sine';
    }

    // AudioContextの初期化（ユーザー操作が必要）
    init() {
        if (this.audioCtx) {
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
            return;
        }
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        document.getElementById('audio-status').textContent = 'Status: ON';
        document.getElementById('audio-status').classList.add('on');
        document.getElementById('btn-start').disabled = true;
    }

    noteOn(freq) {
        if (!this.audioCtx) this.init();
        if (!this.audioCtx) return; // init失敗
        
        // 既に同じ周波数の音が鳴っている場合は何もしない
        if (this.oscillators.has(freq)) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = this.waveform;
        osc.frequency.value = freq;

        // Envelope: Attack (0.01sで音量を上げる)
        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, this.audioCtx.currentTime + 0.01);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        this.oscillators.set(freq, { osc, gain });
        this.updateKeyVisual(freq, true);
    }

    noteOff(freq) {
        const node = this.oscillators.get(freq);
        if (!node) return;

        // noteOnですぐに再開できるようにMapからは即座に消す
        this.oscillators.delete(freq);

        const { osc, gain } = node;
        const now = this.audioCtx.currentTime;

        // Envelope: Release (0.1sで音を消す)
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.1);

        setTimeout(() => {
            osc.stop();
            osc.disconnect();
        }, 150);

        this.updateKeyVisual(freq, false);
    }

    updateKeyVisual(freq, isActive) {
        // 周波数が一致するキーを探してスタイルを変更
        const keys = document.querySelectorAll('.key');
        for (const k of keys) {
            if (Math.abs(parseFloat(k.dataset.note) - freq) < 0.1) {
                k.classList.toggle('active', isActive);
            }
        }
    }
}

const synth = new SimpleSynth();
const startBtn = document.getElementById('btn-start');
const waveTypeSelect = document.getElementById('wave-type');

startBtn.addEventListener('click', () => synth.init());
waveTypeSelect.addEventListener('change', () => {
    synth.waveform = waveTypeSelect.value;
});

// 周波数マッピング
const keyMap = {
    'a': 261.63, 'w': 277.18, 's': 293.66, 'e': 311.13, 'd': 329.63,
    'f': 349.23, 't': 369.99, 'g': 392.00, 'y': 415.30, 'h': 440.00,
    'u': 466.16, 'j': 493.88, 'k': 523.25
};

const chordMap = {
    'CM': [keyMap.a, keyMap.d, keyMap.g],
    'Dm': [keyMap.s, keyMap.f, keyMap.h],
    'Em': [keyMap.d, keyMap.g, keyMap.j],
    'FM': [keyMap.f, keyMap.h, keyMap.k],
    'GM': [keyMap.g, keyMap.j, 293.66 * 2],
    'Am': [keyMap.h, keyMap.k, 329.63 * 2]
};

// キーボード入力
window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const freq = keyMap[e.key.toLowerCase()];
    if (freq) synth.noteOn(freq);
});

window.addEventListener('keyup', (e) => {
    const freq = keyMap[e.key.toLowerCase()];
    if (freq) synth.noteOff(freq);
});

// マウス・タッチ操作の共通処理
function bindNoteEvents(element, getFreqs) {
    const down = (e) => {
        e.preventDefault();
        getFreqs().forEach(f => synth.noteOn(f));
    };
    const up = () => {
        getFreqs().forEach(f => synth.noteOff(f));
    };

    element.addEventListener('mousedown', down);
    element.addEventListener('touchstart', down, { passive: false });
    element.addEventListener('mouseup', up);
    element.addEventListener('mouseleave', up);
    element.addEventListener('touchend', up);
    element.addEventListener('touchcancel', up);
}

// 鍵盤へのバインド
document.querySelectorAll('.key').forEach(el => {
    const freq = parseFloat(el.dataset.note);
    bindNoteEvents(el, () => [freq]);
});

// コードボタンへのバインド
document.querySelectorAll('#chords button').forEach(el => {
    const freqs = chordMap[el.dataset.chord];
    bindNoteEvents(el, () => freqs);
});
