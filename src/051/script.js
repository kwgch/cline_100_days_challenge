document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const generateButton = document.getElementById('generateButton');
    const canvas = document.getElementById('magicCircleCanvas');
    const ctx = canvas.getContext('2d');

    // Canvasの解像度を設定 (CSSでの表示サイズとは別に内部解像度を指定)
    const canvasSize = 300;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    let animationFrameId = null;
    let currentRotation = 0;
    let isAnimating = false;    let currentMagicCircleData = null; // 現在描画されている魔法陣のデータを保持

    // 魔法陣の描画に必要なデータを生成する関数
    function prepareMagicCircleData(text) {
        const data = {};
        data.text = text; // 元のテキストも保持しておく


        // パラメータの導出
        data.numPoints = Math.max(3, Math.min(10, text.length || 3));
        data.radius = canvasSize * 0.4;
        data.centerX = canvas.width / 2;
        data.centerY = canvas.height / 2;

        let colorSeed = 0;
        for (let i = 0; i < text.length; i++) {
            colorSeed = (colorSeed + text.charCodeAt(i) * (i + 1)) % 0xFFFFFF;
        }
        if (text.length === 0) {
            colorSeed = 0xAAAAAA;
        }
        data.colorSeed = colorSeed;
        const lineColor = '#' + colorSeed.toString(16).padStart(6, '0');

        data.baseLineWidth = Math.max(1, (colorSeed % 3) + 1);
        data.numVariations = Math.max(1, (colorSeed % 4));

        data.colors = [
            lineColor,
            '#' + ((colorSeed * 17) % 0xFFFFFF).toString(16).padStart(6, '0'),
            '#' + ((colorSeed * 31) % 0xFFFFFF).toString(16).padStart(6, '0'),
            '#' + ((colorSeed * 53) % 0xFFFFFF).toString(16).padStart(6, '0')
        ];
        
        data.outerRingRadius = data.radius;
        data.symbolRingOuterRadius = data.radius * 0.95;
        data.symbolRingInnerRadius = data.radius * 0.75;
        data.coreRadius = data.radius * 0.7;
        
        return data;
    }
    
    // 魔法陣を実際に描画する関数 (データと進行度に基づいて)
    function drawMagicCircle(data, progress = 1) { // progressのデフォルトは1 (完成状態)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const { 
            text, numPoints, radius, centerX, centerY, colorSeed, 
            baseLineWidth, numVariations, colors,
            outerRingRadius, symbolRingOuterRadius, symbolRingInnerRadius, coreRadius 
        } = data;
        
        const initialAlpha = ctx.globalAlpha; // 元のアルファ値を保持

        // 発光効果 (完成後のアニメーション時のみ)
        if (isAnimating && progress >= 1) {
            const glowColor = colors[1 % colors.length];
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 15 + (Math.sin(Date.now() / 300) * 5);
        } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }

        ctx.save();
        // 回転 (完成後のアニメーション時のみ)
        if (isAnimating && progress >= 1) {
            ctx.translate(centerX, centerY);
            ctx.rotate(currentRotation);
            ctx.translate(-centerX, -centerY);
        }

        // 描画要素ごとの進行度チェックとアルファ設定
        function applyProgressiveAlpha(elementProgressStart, elementDuration = 0.3) {
            if (progress < elementProgressStart) return 0; // まだ描画しない
            const localProgress = Math.min(1, (progress - elementProgressStart) / elementDuration);
            ctx.globalAlpha = initialAlpha * localProgress;
            return localProgress; // 描画した場合は1 (または途中の値)
        }

        // 1. 二重円 (文字リングの境界)
        if (applyProgressiveAlpha(0.0, 0.2) > 0) { // 0.0から0.2秒かけて表示
            ctx.strokeStyle = colors[0 % colors.length];
            ctx.lineWidth = baseLineWidth;
            ctx.beginPath();
            ctx.arc(centerX, centerY, symbolRingOuterRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.globalAlpha = initialAlpha; // アルファをリセット

        if (applyProgressiveAlpha(0.1, 0.2) > 0) { // 少し遅れて開始
            ctx.strokeStyle = colors[1 % colors.length];
            ctx.lineWidth = baseLineWidth * 0.75 > 0.5 ? baseLineWidth * 0.75 : 0.5;
            ctx.beginPath();
            ctx.arc(centerX, centerY, symbolRingInnerRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.globalAlpha = initialAlpha;
        
        if (numVariations > 1 && applyProgressiveAlpha(0.15, 0.2) > 0) {
            ctx.strokeStyle = colors[2 % colors.length];
            ctx.lineWidth = baseLineWidth * 0.5 > 0.5 ? baseLineWidth * 0.5 : 0.5;
            ctx.beginPath();
            ctx.arc(centerX, centerY, outerRingRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.globalAlpha = initialAlpha;


        // 2. 古代文字風シンボル (0.3から0.6秒かけて表示)
        if (text.length > 0 && progress >= 0.25) { // 少し早めに準備開始
            const symbolDisplayOverallProgress = Math.min(1, (progress - 0.25) / 0.4); // 0.25-0.65でシンボル全体表示

            const symbolPlacementRadius = (symbolRingOuterRadius + symbolRingInnerRadius) / 2;
            const symbolSize = (symbolRingOuterRadius - symbolRingInnerRadius) * 0.4;
            ctx.strokeStyle = colors[3 % colors.length];
            const displayPoints = Math.min(numPoints, text.length * 2 + 3);

            for (let i = 0; i < displayPoints; i++) {
                // シンボルごとの表示タイミングをずらす
                const symbolProgressStartRatio = (i / displayPoints) * 0.8; // シンボル群の中でいつから表示開始するか (0-0.8)
                if (symbolDisplayOverallProgress < symbolProgressStartRatio) continue;
                
                const localSymbolProgress = Math.min(1, (symbolDisplayOverallProgress - symbolProgressStartRatio) / 0.2); // 各シンボルは20%の期間で表示
                
                ctx.globalAlpha = initialAlpha * localSymbolProgress;
                if (ctx.globalAlpha <= 0) { //完全に透明なら描画スキップ
                    ctx.globalAlpha = initialAlpha; 
                    continue;
                }


                const char = text[i % text.length];
                const charCode = char.charCodeAt(0) + i;
                const angle = (i / displayPoints) * Math.PI * 2 - Math.PI / 2;
                const x = centerX + symbolPlacementRadius * Math.cos(angle);
                const y = centerY + symbolPlacementRadius * Math.sin(angle);
                drawAncientSymbol(ctx, charCode, x, y, symbolSize, angle, baseLineWidth);
                ctx.globalAlpha = initialAlpha; // 各シンボル描画後にリセット
            }
        }
        ctx.globalAlpha = initialAlpha; // シンボル群描画後にリセット

        // --- 中央コアの幾何学図形 (0.5秒から表示開始) ---
        const coreProgressStart = 0.5;
        if (progress >= coreProgressStart) {
            const coreDisplayOverallProgress = Math.min(1, (progress - coreProgressStart) / (1.0 - coreProgressStart));

            const corePatternRadius = coreRadius * 0.8;
            const corePoints = [];
            const numCorePoints = Math.max(3, Math.min(8, (colorSeed % 6) + 3));
            for (let i = 0; i < numCorePoints; i++) {
                const angle = (i / numCorePoints) * Math.PI * 2 - Math.PI / 2;
                corePoints.push({
                    x: centerX + corePatternRadius * Math.cos(angle),
                    y: centerY + corePatternRadius * Math.sin(angle)
                });
            }
            
            if (applyProgressiveAlpha(coreProgressStart, 0.2) > 0) {
                ctx.strokeStyle = colors[1 % colors.length];
                ctx.lineWidth = baseLineWidth;
                ctx.beginPath();
                corePoints.forEach((p, i) => {
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.closePath();
                ctx.stroke();
            }
            ctx.globalAlpha = initialAlpha;

            if (numCorePoints >= 4 && applyProgressiveAlpha(coreProgressStart + 0.05, 0.2) > 0) { // 少しタイミング調整
                ctx.strokeStyle = colors[2 % colors.length];
                ctx.lineWidth = baseLineWidth - 0.5 > 0 ? baseLineWidth - 0.5 : 0.5;
                ctx.beginPath();
                const step = Math.floor(numCorePoints / 2);
                for (let i = 0; i < numCorePoints; i++) {
                    const p1 = corePoints[i];
                    const p2 = corePoints[(i + step) % numCorePoints];
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                }
                ctx.stroke();
            }
            ctx.globalAlpha = initialAlpha;
            
            if (numVariations > 2 && applyProgressiveAlpha(coreProgressStart + 0.1, 0.2) > 0){ //タイミング調整
                ctx.strokeStyle = colors[0 % colors.length];
                ctx.lineWidth = baseLineWidth / 2 > 0.5 ? baseLineWidth / 2 : 0.5;
                ctx.beginPath();
                corePoints.forEach(p => {
                    ctx.moveTo(centerX, centerY);
                    ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();
            }
            ctx.globalAlpha = initialAlpha;

            if (numVariations > 1 && applyProgressiveAlpha(coreProgressStart + 0.15, 0.2) > 0) { //タイミング調整
                corePoints.forEach((p, i) => {
                    ctx.fillStyle = colors[(i + 2) % colors.length];
                    ctx.beginPath();
                    // 点のサイズも進行度で変化
                    ctx.arc(p.x, p.y, baseLineWidth * 1.2 * Math.min(1, (coreDisplayOverallProgress - 0.3)/0.7), 0, Math.PI * 2); 
                    ctx.fill();
                });
            }
            ctx.globalAlpha = initialAlpha;

            if (text.length > 3 && numVariations > 1 && applyProgressiveAlpha(coreProgressStart + 0.2, 0.3) > 0) { //タイミング調整
                const numRects = (colorSeed % 2) + 1;
                // 四角形のサイズも進行度で変化
                const rectSize = corePatternRadius * 0.4 * Math.min(1, (coreDisplayOverallProgress - 0.4)/0.6); 
                for (let i = 0; i < numRects; i++) {
                    ctx.save();
                    ctx.translate(centerX, centerY); 
                    ctx.rotate( (Math.PI / (numRects * 3)) * i + (colorSeed / 9000000) + (isAnimating && progress >=1 ? currentRotation * 0.5 : 0) );
                    ctx.strokeStyle = colors[(i + 1) % colors.length];
                    ctx.lineWidth = baseLineWidth * 0.8 > 0.5 ? baseLineWidth * 0.8 : 0.5;
                    ctx.strokeRect(-rectSize / 2, -rectSize / 2, rectSize, rectSize);
                    ctx.restore();
                }
            }
            ctx.globalAlpha = initialAlpha;
        }
        ctx.restore(); 
    }


    function drawAncientSymbol(ctx, seed, cx, cy, size, rotation, baseLineWidth) {
        const originalAlpha = ctx.globalAlpha; // drawMagicCircleで設定されたアルファを保持
        ctx.lineWidth = Math.max(0.5, baseLineWidth / 2.5);
        // drawAncientSymbol内でglobalAlphaを再設定しないように注意
        // 呼び出し元で設定されたalphaが適用される

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation + Math.PI / 2); 

        const numLines = (seed % 3) + 2; 
        const segmentLength = size * 0.7;

        ctx.beginPath();
        for (let i = 0; i < numLines; i++) {
            const angleOffset = (seed * (i * 13 + 7)) % (Math.PI * 2); 
            const startX = ( (seed * (i+1) * 3) % (size/2) ) - size/4; 
            const startY = ( (seed * (i+1) * 5) % (size/2) ) - size/4; 
            
            const endX = startX + segmentLength * Math.cos( (Math.PI / numLines) * i * 1.5 + angleOffset + (seed % 100)/100.0 * Math.PI ); 
            const endY = startY + segmentLength * Math.sin( (Math.PI / numLines) * i * 1.5 + angleOffset + (seed % 100)/100.0 * Math.PI );
            
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
        }
        ctx.stroke();
        ctx.restore();
        ctx.globalAlpha = originalAlpha; // 念のため戻す
    }

    let drawingAnimationId = null; // 生成演出用のアニメーションID

    function startDrawingAnimation() {
        if (!currentMagicCircleData) return;
        stopAnimationLoop(); // 完成後アニメーションを停止
        if (drawingAnimationId) cancelAnimationFrame(drawingAnimationId);

        let startTime = null;
        const duration = 2500; // 2.5秒で生成

        function animateDrawing(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(1, elapsed / duration);

            drawMagicCircle(currentMagicCircleData, progress); // 進行度を渡して描画

            if (progress < 1) {
                drawingAnimationId = requestAnimationFrame(animateDrawing);
            } else {
                drawingAnimationId = null;
                startAnimationLoop(); // 生成完了後、回転・発光アニメーション開始
            }
        }
        drawingAnimationId = requestAnimationFrame(animateDrawing);
    }


    function startAnimationLoop() { // 完成後の回転・発光アニメーション
        if (!currentMagicCircleData) return;
        if (drawingAnimationId) { // 生成アニメーションが動いていたら何もしない
            return;
        }
        stopAnimationLoop(); //念のため既存の完成後アニメーションを停止

        isAnimating = true;
        function animate() {
            currentRotation += 0.005; 
            drawMagicCircle(currentMagicCircleData, 1); // progress=1で完成状態を描画
            animationFrameId = requestAnimationFrame(animate);
        }
        animationFrameId = requestAnimationFrame(animate);
    }

    function stopAnimationLoop() { // 完成後アニメーションの停止
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        isAnimating = false;
        // currentRotation はリセットせず、停止した角度を保持しても良いが、今回はリセット
        // currentRotation = 0; 
        // アニメーション停止時は影を消すために再描画 (progress=1で)
        if (currentMagicCircleData) {
             // isAnimatingをfalseにしてから描画することで影が消える
            drawMagicCircle(currentMagicCircleData, 1);
        }
    }
    
    generateButton.addEventListener('click', () => {
        if (drawingAnimationId) cancelAnimationFrame(drawingAnimationId); // 既存の生成アニメーションをキャンセル
        stopAnimationLoop(); // 既存の完成後アニメーションも停止

        const text = inputText.value;
        currentMagicCircleData = prepareMagicCircleData(text);
        startDrawingAnimation(); // 生成アニメーションを開始
    });

    // 初期表示
    ctx.fillStyle = "#0a0a10"; // 背景色に合わせる
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.fillStyle = "#555";
    ctx.font = "16px 'Segoe UI'";
    ctx.fillText("文字を入力して魔法陣を生成", canvas.width / 2, canvas.height / 2);
});
