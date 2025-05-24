document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('WebGLを初期化できません。ブラウザが対応していない可能性があります。');
        return;
    }

    // キャンバスのサイズをウィンドウに合わせる
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // シェーダーの読み込みとコンパイル
    async function loadShader(url, type) {
        const response = await fetch(url);
        const source = await response.text();
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('シェーダーのコンパイルエラー:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    async function initShaders() {
        const vertexShader = await loadShader('vertexShader.glsl', gl.VERTEX_SHADER);
        const fragmentShader = await loadShader('fragmentShader.glsl', gl.FRAGMENT_SHADER);

        if (!vertexShader || !fragmentShader) return null;

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error('シェーダープログラムのリンクエラー:', gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    initShaders().then(shaderProgram => {
        if (!shaderProgram) return;

        gl.useProgram(shaderProgram);

        // 頂点バッファの作成
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
            -1.0,  1.0,
             1.0,  1.0,
            -1.0, -1.0,
             1.0, -1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_position');
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttributeLocation);

        // uniform変数のロケーションを取得
        const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'u_resolution');
        const timeUniformLocation = gl.getUniformLocation(shaderProgram, 'u_time');

        let startTime = Date.now();

        function drawScene() {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // uniform変数の値を設定
            gl.uniform2f(resolutionUniformLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);
            gl.uniform1f(timeUniformLocation, (Date.now() - startTime) * 0.001);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            requestAnimationFrame(drawScene);
        }

        requestAnimationFrame(drawScene);
    });
});
