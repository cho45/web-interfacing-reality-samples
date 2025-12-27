let gamepadIndex = null;

window.addEventListener('gamepadconnected', (e) => {
    console.log('Gamepad connected:', e.gamepad.id);
    gamepadIndex = e.gamepad.index;
    document.getElementById('no-gamepad').style.display = 'none';
    document.getElementById('gamepad-display').style.display = 'block';
    
    // ボタンインジケータの生成
    const btnContainer = document.getElementById('buttons-display');
    btnContainer.innerHTML = '';
    for (let i = 0; i < e.gamepad.buttons.length; i++) {
        const div = document.createElement('div');
        div.className = 'btn-indicator';
        div.id = `btn-${i}`;
        div.textContent = i;
        btnContainer.appendChild(div);
    }

    requestAnimationFrame(gameLoop);
});

window.addEventListener('gamepaddisconnected', (e) => {
    console.log('Gamepad disconnected:', e.gamepad.id);
    if (gamepadIndex === e.gamepad.index) {
        gamepadIndex = null;
        document.getElementById('no-gamepad').style.display = 'block';
        document.getElementById('gamepad-display').style.display = 'none';
    }
});

function gameLoop() {
    if (gamepadIndex === null) return;

    const gamepad = navigator.getGamepads()[gamepadIndex];
    if (!gamepad) return;

    // 情報の更新
    document.getElementById('info-text').textContent = 
        `ID: ${gamepad.id}\nIndex: ${gamepad.index}\nMapping: ${gamepad.mapping}`;

    // スティックの更新
    updateAxis('axis-0-1', gamepad.axes[0], gamepad.axes[1]);
    updateAxis('axis-2-3', gamepad.axes[2], gamepad.axes[3]);

    // ボタンの更新
    gamepad.buttons.forEach((button, i) => {
        const el = document.getElementById(`btn-${i}`);
        if (el) {
            if (button.pressed) {
                el.classList.add('pressed');
            } else {
                el.classList.remove('pressed');
            }
        }
    });

    requestAnimationFrame(gameLoop);
}

function updateAxis(id, x, y) {
    const dot = document.getElementById(id);
    // -1.0 ~ 1.0 を 0% ~ 100% に変換
    const left = (x + 1) * 50;
    const top = (y + 1) * 50;
    dot.style.left = `${left}%`;
    dot.style.top = `${top}%`;
}

async function playVibration(duration, strong, weak) {
    if (gamepadIndex === null) return;
    const gamepad = navigator.getGamepads()[gamepadIndex];
    
    if (gamepad && gamepad.vibrationActuator) {
        try {
            await gamepad.vibrationActuator.playEffect('dual-rumble', {
                startDelay: 0,
                duration: duration,
                strongMagnitude: strong,
                weakMagnitude: weak
            });
        } catch (e) {
            console.error('Vibration failed', e);
        }
    } else {
        alert('このコントローラーは振動をサポートしていないか、ブラウザが対応していません。');
    }
}
