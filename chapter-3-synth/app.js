// MIDI番号から周波数への変換 (A4 = 440Hz = MIDI 69)
function midiToFrequency(midiNote) {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
}

class SimpleSynth extends EventTarget {
    constructor() {
        super();
        this.audioCtx = null;
        this.oscillators = new Map(); // midiNote -> { osc, gain }
        this.waveform = 'sine';
    }

    // AudioContextの初期化（ユーザー操作が必要）
    init() {
        if (this.audioCtx) {
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
            return;
        }
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.dispatchEvent(new CustomEvent('initialized'));
    }

    noteOn(midiNote) {
        if (!this.audioCtx) this.init();
        if (!this.audioCtx) return; // init失敗

        // 既に同じノートが鳴っている場合は何もしない
        if (this.oscillators.has(midiNote)) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = this.waveform;
        osc.frequency.value = midiToFrequency(midiNote);

        // Envelope: Attack (0.01sで音量を上げる)
        gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, this.audioCtx.currentTime + 0.01);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        this.oscillators.set(midiNote, { osc, gain });
        this.dispatchEvent(new CustomEvent('noteon', { detail: { midiNote } }));
    }

    noteOff(midiNote) {
        const node = this.oscillators.get(midiNote);
        if (!node) return;

        // noteOnですぐに再開できるようにMapからは即座に消す
        this.oscillators.delete(midiNote);

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

        this.dispatchEvent(new CustomEvent('noteoff', { detail: { midiNote } }));
    }
}

const synth = new SimpleSynth();
const startBtn = document.getElementById('btn-start');
const waveTypeSelect = document.getElementById('wave-type');

// SimpleSynthからのイベントをリスニングしてUI更新
synth.addEventListener('initialized', () => {
    document.getElementById('audio-status').textContent = 'Status: ON';
    document.getElementById('audio-status').classList.add('on');
    startBtn.disabled = true;
});

synth.addEventListener('noteon', (e) => {
    updateKeyVisual(e.detail.midiNote, true);
});

synth.addEventListener('noteoff', (e) => {
    updateKeyVisual(e.detail.midiNote, false);
});

function updateKeyVisual(midiNote, isActive) {
    // MIDI番号が一致するキーを探してスタイルを変更
    const keys = document.querySelectorAll('.key');
    for (const k of keys) {
        if (parseInt(k.dataset.note) === midiNote) {
            k.classList.toggle('active', isActive);
        }
    }
}

startBtn.addEventListener('click', () => synth.init());
waveTypeSelect.addEventListener('change', () => {
    synth.waveform = waveTypeSelect.value;
});

// MIDI番号マッピング (C4=60を基準とした1オクターブ)
const keyMap = {
    'a': 60,  // C4
    'w': 61,  // C#4
    's': 62,  // D4
    'e': 63,  // D#4
    'd': 64,  // E4
    'f': 65,  // F4
    't': 66,  // F#4
    'g': 67,  // G4
    'y': 68,  // G#4
    'h': 69,  // A4 (440Hz)
    'u': 70,  // A#4
    'j': 71,  // B4
    'k': 72   // C5
};

const chordMap = {
    'CM': [60, 64, 67],  // C, E, G
    'Dm': [62, 65, 69],  // D, F, A
    'Em': [64, 67, 71],  // E, G, B
    'FM': [65, 69, 72],  // F, A, C
    'GM': [67, 71, 74],  // G, B, D
    'Am': [69, 72, 76]   // A, C, E
};

// キーボード入力
window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const midiNote = keyMap[e.key.toLowerCase()];
    if (midiNote !== undefined) synth.noteOn(midiNote);
});

window.addEventListener('keyup', (e) => {
    const midiNote = keyMap[e.key.toLowerCase()];
    if (midiNote !== undefined) synth.noteOff(midiNote);
});

// マウス・タッチ操作の共通処理
function bindNoteEvents(element, getMidiNotes) {
    const down = (e) => {
        e.preventDefault();
        getMidiNotes().forEach(note => synth.noteOn(note));
    };
    const up = () => {
        getMidiNotes().forEach(note => synth.noteOff(note));
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
    const midiNote = parseInt(el.dataset.note);
    bindNoteEvents(el, () => [midiNote]);
});

// コードボタンへのバインド
document.querySelectorAll('#chords button').forEach(el => {
    const midiNotes = chordMap[el.dataset.chord];
    bindNoteEvents(el, () => midiNotes);
});
