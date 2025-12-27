let audioCtx = null;
let oscillator = null;
let gainNode = null;
let analyser = null;
let micSource = null;
let isOscRunning = false;
let isMicRunning = false;

const btnAudioInit = document.getElementById('btn-audio-init');
const audioStatus = document.getElementById('audio-status');
const btnOscToggle = document.getElementById('btn-osc-toggle');
const btnMicToggle = document.getElementById('btn-mic-toggle');
const micStatus = document.getElementById('mic-status');
const waveTypeSelect = document.getElementById('wave-type');
const freqSlider = document.getElementById('freq-slider');
const gainSlider = document.getElementById('gain-slider');
const freqVal = document.getElementById('freq-val');
const gainVal = document.getElementById('gain-val');

const canvasFreq = document.getElementById('canvas-freq');
const canvasTime = document.getElementById('canvas-time');
const ctxFreq = canvasFreq.getContext('2d');
const ctxTime = canvasTime.getContext('2d');

function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Analyserの設定
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    
    // GainNodeの設定
    gainNode = audioCtx.createGain();
    gainNode.gain.value = parseFloat(gainSlider.value);
    
    audioStatus.textContent = 'Status: ON';
    audioStatus.classList.add('on');
    btnAudioInit.disabled = true;

    draw();
}

btnAudioInit.addEventListener('click', initAudio);

// Oscillatorの制御
btnOscToggle.addEventListener('click', () => {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (isOscRunning) {
        oscillator.stop();
        isOscRunning = false;
        btnOscToggle.textContent = '音を鳴らす';
        btnOscToggle.classList.remove('active');
    } else {
        oscillator = audioCtx.createOscillator();
        oscillator.type = waveTypeSelect.value;
        oscillator.frequency.value = parseFloat(freqSlider.value);
        
        oscillator.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioCtx.destination);
        
        oscillator.start();
        isOscRunning = true;
        btnOscToggle.textContent = '音を止める';
        btnOscToggle.classList.add('active');
    }
});

// マイクの制御
btnMicToggle.addEventListener('click', async () => {
    if (!audioCtx) initAudio();
    
    if (isMicRunning) {
        micSource.disconnect();
        isMicRunning = false;
        btnMicToggle.classList.remove('active');
        micStatus.textContent = 'Mic: OFF';
        micStatus.classList.remove('on');
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micSource = audioCtx.createMediaStreamSource(stream);
            micSource.connect(analyser);
            isMicRunning = true;
            btnMicToggle.classList.add('active');
            micStatus.textContent = 'Mic: ON';
            micStatus.classList.add('on');
        } catch (err) {
            alert('マイクのアクセスに失敗しました: ' + err);
        }
    }
});

// スライダーの反映
freqSlider.addEventListener('input', () => {
    const val = freqSlider.value;
    freqVal.textContent = val;
    if (oscillator) oscillator.frequency.value = val;
});

gainSlider.addEventListener('input', () => {
    const val = gainSlider.value;
    gainVal.textContent = val;
    if (gainNode) gainNode.gain.value = val;
});

waveTypeSelect.addEventListener('change', () => {
    if (oscillator) oscillator.type = waveTypeSelect.value;
});

// 描画ループ
function draw() {
    requestAnimationFrame(draw);
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArrayFreq = new Uint8Array(bufferLength);
    const dataArrayTime = new Uint8Array(bufferLength);

    // 周波数データの描画
    analyser.getByteFrequencyData(dataArrayFreq);
    ctxFreq.fillStyle = 'rgb(0, 0, 0)';
    ctxFreq.fillRect(0, 0, canvasFreq.width, canvasFreq.height);
    
    const barWidth = (canvasFreq.width / bufferLength) * 2.5;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArrayFreq[i] / 255) * canvasFreq.height;
        ctxFreq.fillStyle = `hsl(${(i/bufferLength)*360}, 100%, 50%)`;
        ctxFreq.fillRect(x, canvasFreq.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }

    // 波形データの描画
    analyser.getByteTimeDomainData(dataArrayTime);
    ctxTime.fillStyle = 'rgb(0, 0, 0)';
    ctxTime.fillRect(0, 0, canvasTime.width, canvasTime.height);
    ctxTime.lineWidth = 2;
    ctxTime.strokeStyle = 'rgb(0, 255, 0)';
    ctxTime.beginPath();

    const sliceWidth = canvasTime.width / bufferLength;
    let tx = 0;
    for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayTime[i] / 128.0;
        const ty = v * canvasTime.height / 2;
        if (i === 0) ctxTime.moveTo(tx, ty);
        else ctxTime.lineTo(tx, ty);
        tx += sliceWidth;
    }
    ctxTime.lineTo(canvasTime.width, canvasTime.height / 2);
    ctxTime.stroke();
}

// キャンバスサイズの初期化
function resize() {
    canvasFreq.width = canvasFreq.clientWidth;
    canvasFreq.height = canvasFreq.clientHeight;
    canvasTime.width = canvasTime.clientWidth;
    canvasTime.height = canvasTime.clientHeight;
}
window.addEventListener('resize', resize);
resize();
