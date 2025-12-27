const status = document.getElementById('status');

function checkSupport() {
    if (!('vibrate' in navigator)) {
        status.textContent = '⚠️ このブラウザはVibration APIに対応していません';
        document.querySelectorAll('button').forEach(btn => btn.disabled = true);
        return false;
    }
    return true;
}

function showStatus(message) {
    status.textContent = message;
    setTimeout(() => {
        status.textContent = '';
    }, 2000);
}

function vibrate200() {
    if (!checkSupport()) return;
    navigator.vibrate(200);
    showStatus('✓ 200ms振動を実行しました');
}

function vibratePattern() {
    if (!checkSupport()) return;
    navigator.vibrate([200, 100, 200]);
    showStatus('✓ パターン振動を実行しました');
}

function vibrateSOS() {
    if (!checkSupport()) return;
    // SOS Prosign: ...---... (連続した単一の符号、文字間隔なし)
    // ドット=100ms, ダッシュ=300ms, シンボル間=100ms
    const pattern = [
        // S (...)
        100, 100, 100, 100, 100,
        // シンボル間隔(SとOの間)
        100,
        // O (---)
        300, 100, 300, 100, 300,
        // シンボル間隔(OとSの間)
        100,
        // S (...)
        100, 100, 100, 100, 100
    ];
    navigator.vibrate(pattern);
    showStatus('✓ SOS信号を送信しました');
}

function vibrateNotification() {
    if (!checkSupport()) return;
    navigator.vibrate([50, 50, 50]);
    showStatus('✓ 通知パターンを実行しました');
}

function vibrateModern() {
    if (!checkSupport()) return;
    // 通知風: ブーブブ (200ms振動 -> 100ms休止 -> 50ms振動 -> 50ms休止 -> 50ms振動)
    navigator.vibrate([200, 100, 50, 50, 50]);
    showStatus('✓ 通知風パターンを実行しました');
}

// 初期チェック
checkSupport();
