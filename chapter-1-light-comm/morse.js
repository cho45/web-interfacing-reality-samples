const MORSE_TABLE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ' ': ' ' // Space
};

const REVERSE_TABLE = Object.entries(MORSE_TABLE).reduce((acc, [char, code]) => {
    acc[code] = char;
    return acc;
}, {});

class MorseEncoder {
    constructor() {
    }

    /**
     * テキストをON/OFFのタイミング配列に変換する
     * @param {string} text 
     * @returns {Array<{state: boolean, duration: number}>} durations in units
     */
    encode(text) {
        const sequence = [];
        const upperText = text.toUpperCase();

        for (let i = 0; i < upperText.length; i++) {
            const char = upperText[i];
            const code = MORSE_TABLE[char];

            if (code === undefined) {
                // Unknown char, ignore or treat as space
                continue; 
            }

            if (code === ' ') {
                // Word gap (7 units)
                // 直前の文字間ギャップ(3 units)が既に追加されているはずなので、
                // それを延長するか、追加で4 units足すか。
                // ここではシンプルに常にギャップを追加するロジックにする。
                
                // 直前のOFFがあれば、それを延長する処理がきれいだが、
                // 簡易実装として、もし直前がOFFなら足し合わせる。
                this._addOff(sequence, 7);
            } else {
                // 文字コードの処理
                // 前の文字との間に文字間ギャップ(3 units)が必要
                // ただし、シーケンスの最初は不要
                if (sequence.length > 0 && sequence[sequence.length-1].state === false) {
                     // 既にOFFが入っている(文字内ギャップ1 or 語間ギャップ7)
                     // 文字間ギャップは3なので、直前が1なら3に延長、7ならそのまま
                     const last = sequence[sequence.length - 1];
                     if (last.duration < 3) last.duration = 3;
                } else if (sequence.length > 0) {
                    this._addOff(sequence, 3);
                }

                for (let j = 0; j < code.length; j++) {
                    const symbol = code[j];
                    if (j > 0) {
                        // 要素間ギャップ (1 unit)
                        this._addOff(sequence, 1);
                    }

                    if (symbol === '.') {
                        this._addOn(sequence, 1);
                    } else if (symbol === '-') {
                        this._addOn(sequence, 3);
                    }
                }
            }
        }
        
        // 最後はOFFで終わるように
        this._addOff(sequence, 7);

        return sequence;
    }

    _addOn(seq, duration) {
        seq.push({ state: true, duration });
    }

    _addOff(seq, duration) {
        // 直前がOFFなら結合する
        if (seq.length > 0 && seq[seq.length - 1].state === false) {
            seq[seq.length - 1].duration = Math.max(seq[seq.length - 1].duration, duration);
        } else {
            seq.push({ state: false, duration });
        }
    }
}

class MorseDecoder {
    constructor() {
        this.buffer = ''; // 蓄積された . -
        this.result = ''; // 確定した文字列
    }

    /**
     * ON/OFFの継続時間からシンボルを判定して蓄積する
     * @param {boolean} state 
     * @param {number} durationUnits 継続時間（単位時間換算）
     * @returns {string|null} 新しくデコードされた文字があれば返す
     */
    push(state, durationUnits) {
        // 許容誤差範囲（±0.5程度と仮定）
        // Dot: 0.5 - 1.5 -> 1
        // Dash: 2.5 - 3.5 -> 3
        
        // 簡易的な量子化
        let units;
        if (durationUnits < 0.5) return null; // ノイズ
        else if (durationUnits < 2.0) units = 1;
        else if (durationUnits < 5.0) units = 3; // 3付近
        else units = 7; // 7以上

        if (state) { // ON
            if (units === 1) {
                this.buffer += '.';
                return null;
            } else if (units === 3) {
                this.buffer += '-';
                return null;
            }
        } else { // OFF
            if (units === 1) {
                // 要素間ギャップ: 何もしない
                return null;
            } else if (units === 3) {
                // 文字間ギャップ: バッファをデコード
                return this._flushBuffer();
            } else if (units === 7) {
                // 語間ギャップ: スペース
                const char = this._flushBuffer();
                return char ? char + ' ' : ' ';
            }
        }
        return null;
    }

    _flushBuffer() {
        if (this.buffer.length === 0) return null;
        const char = REVERSE_TABLE[this.buffer];
        this.buffer = '';
        return char || '?';
    }

    /**
     * バッファに残っている信号を強制的にデコードする（タイムアウト用）
     */
    flush() {
        return this._flushBuffer();
    }
}
