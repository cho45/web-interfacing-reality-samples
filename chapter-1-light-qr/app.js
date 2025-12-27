function generateQR() {
  const text = document.getElementById('text').value;
  const container = document.getElementById('qrcode');

  // QRコードオブジェクトを生成
  // 第一引数: QRコードのバージョン（0=自動選択）
  // 第二引数: 誤り訂正レベル（L=7%, M=15%, Q=25%, H=30%）
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();

  // Canvasで描画
  const cellSize = 8; // 1セルのピクセルサイズ
  const margin = 4;   // 余白(セル数)
  const moduleCount = qr.getModuleCount();
  const size = (moduleCount + margin * 2) * cellSize;

  // Canvas要素を作成
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // 背景を白で塗りつぶす
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, size, size);

  // QRコードのセルを描画
  ctx.fillStyle = 'black';
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qr.isDark(row, col)) {
        const x = (col + margin) * cellSize;
        const y = (row + margin) * cellSize;
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }

  // 既存のQRコードを置き換え
  container.innerHTML = '';
  container.appendChild(canvas);
}

// 初期表示
generateQR();
