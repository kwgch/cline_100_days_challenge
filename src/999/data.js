/**
 * データと計算ロジックを管理するファイル
 */

// 用語解説データ
const termExplanations = {
    "power-law": "二つの量の間に「y = ax^b」という関係が成り立つ法則。bは指数と呼ばれる。",
    "taylors-law": "平均(M)と分散(V)の間に「V = aM^b」という関係が成り立つべき乗則。多くの生物個体群で観測される。",
    "synchronization": "複数の振動子が相互作用によって同じリズムで振動する現象。",
    "exponent": "べき乗則「y = ax^b」におけるb。TLでは通常1から2の間の値をとる。",
    "waveform-proportionality": "複数の時系列の波形が互いに定数倍の関係になる強い同期状態。"
};

// サンプルデータ: テイラーの法則プロット用
const sampleData = {
    // 非同期状態のデータ
    async: {
        // 時系列データ
        timeSeries: generateTimeSeriesData(0),
        // テイラーの法則プロット用データ
        taylorPoints: [
            { mean: 10, variance: 12 },
            { mean: 15, variance: 14 },
            { mean: 20, variance: 25 },
            { mean: 25, variance: 22 },
            { mean: 30, variance: 35 },
            { mean: 35, variance: 30 },
            { mean: 40, variance: 50 },
            { mean: 45, variance: 40 },
            { mean: 50, variance: 60 },
            { mean: 55, variance: 45 },
            { mean: 60, variance: 70 },
            { mean: 65, variance: 55 },
            { mean: 70, variance: 90 },
            { mean: 75, variance: 65 },
            { mean: 80, variance: 100 }
        ]
    },
    
    // 同期状態のデータ（波形比例性ではない）
    sync: {
        // 時系列データ
        timeSeries: generateTimeSeriesData(50),
        // テイラーの法則プロット用データ
        taylorPoints: [
            { mean: 10, variance: 15 },
            { mean: 15, variance: 25 },
            { mean: 20, variance: 35 },
            { mean: 25, variance: 45 },
            { mean: 30, variance: 55 },
            { mean: 35, variance: 65 },
            { mean: 40, variance: 75 },
            { mean: 45, variance: 85 },
            { mean: 50, variance: 95 },
            { mean: 55, variance: 105 },
            { mean: 60, variance: 115 },
            { mean: 65, variance: 125 },
            { mean: 70, variance: 135 },
            { mean: 75, variance: 145 },
            { mean: 80, variance: 155 }
        ]
    },
    
    // 強い同期状態のデータ（波形比例性）
    strongSync: {
        // 時系列データ
        timeSeries: generateTimeSeriesData(100),
        // テイラーの法則プロット用データ
        taylorPoints: [
            { mean: 10, variance: 100 },
            { mean: 15, variance: 225 },
            { mean: 20, variance: 400 },
            { mean: 25, variance: 625 },
            { mean: 30, variance: 900 },
            { mean: 35, variance: 1225 },
            { mean: 40, variance: 1600 },
            { mean: 45, variance: 2025 },
            { mean: 50, variance: 2500 },
            { mean: 55, variance: 3025 },
            { mean: 60, variance: 3600 },
            { mean: 65, variance: 4225 },
            { mean: 70, variance: 4900 },
            { mean: 75, variance: 5625 },
            { mean: 80, variance: 6400 }
        ]
    }
};

/**
 * 結合強度に応じた時系列データを生成する関数
 * @param {number} couplingStrength - 結合の強さ (0-100)
 * @returns {Array} - 時系列データの配列
 */
function generateTimeSeriesData(couplingStrength) {
    const N = 200; // データ点数
    const x = Array.from({length: N}, (_, i) => i);
    const numSeries = 3; // 時系列の数
    const series = [];
    
    // 基準となる時系列を生成
    const baseSeries = [];
    for (let i = 0; i < N; i++) {
        // 基本的な振動に少しノイズを加える
        baseSeries.push(
            5 * Math.sin(i * 0.1) + 
            2 * Math.sin(i * 0.05) + 
            Math.random() * 0.5
        );
    }
    
    // 基準時系列を追加
    series.push({
        name: 'Series 1',
        x: x,
        y: baseSeries,
        type: 'scatter',
        mode: 'lines',
        line: { color: 'rgba(58, 110, 165, 1)', width: 2 }
    });
    
    // 他の時系列を生成
    for (let s = 1; s < numSeries; s++) {
        const ySeries = [];
        
        // 結合強度に基づいて位相差と振幅比を調整
        const phaseShift = (1 - couplingStrength / 100) * Math.PI * 0.5; // 結合が強いほど位相差0
        const amplitudeRatio = 1 + s * (0.5 + couplingStrength / 100); // 結合が強いほど一定の比率に
        const noiseLevel = Math.max(0.1, 1 - couplingStrength / 100); // 結合が強いほどノイズ小
        
        for (let i = 0; i < N; i++) {
            if (couplingStrength > 80) {
                // 強い同期状態（波形比例性）: 基準時系列の定数倍に近い形
                ySeries.push(baseSeries[i] * amplitudeRatio + Math.random() * 0.2 * noiseLevel);
            } else if (couplingStrength > 40) {
                // 中程度の同期状態: 位相が揃い始める
                ySeries.push(
                    amplitudeRatio * Math.sin(i * 0.1 + phaseShift * 0.3) + 
                    amplitudeRatio * 0.4 * Math.sin(i * 0.05 + phaseShift * 0.5) + 
                    Math.random() * noiseLevel
                );
            } else {
                // 弱い同期状態（非同期）: 独立した振動
                ySeries.push(
                    amplitudeRatio * Math.sin(i * 0.1 + phaseShift) + 
                    amplitudeRatio * 0.4 * Math.sin(i * 0.05 + phaseShift * 2) + 
                    Math.random() * 2 * noiseLevel
                );
            }
        }
        
        // 色を変えて時系列を追加
        const colors = ['rgba(255, 107, 107, 1)', 'rgba(46, 204, 113, 1)'];
        series.push({
            name: `Series ${s+1}`,
            x: x,
            y: ySeries,
            type: 'scatter',
            mode: 'lines',
            line: { color: colors[s-1], width: 2 }
        });
    }
    
    return series;
}

/**
 * 結合強度に応じたテイラーの法則プロット用データを生成する関数
 * @param {number} couplingStrength - 結合の強さ (0-100)
 * @returns {Array} - テイラーの法則プロット用データ
 */
function generateTaylorPoints(couplingStrength) {
    const numPoints = 15;
    const points = [];
    
    // 結合強度に応じて指数を調整（0→ランダム、100→指数2）
    let exponent;
    if (couplingStrength < 30) {
        // 非同期: ランダムなばらつき
        exponent = 0; // 実際には使用せず、ランダムなばらつきを生成
    } else if (couplingStrength < 70) {
        // 中程度の同期: 指数1〜2の間
        exponent = 1 + (couplingStrength - 30) / 40;
    } else {
        // 強い同期: 指数2に近づく
        exponent = 2 - (100 - couplingStrength) / 100 * 0.1;
    }
    
    // データポイントを生成
    for (let i = 0; i < numPoints; i++) {
        const mean = 10 + i * 5; // 10から80まで5刻み
        let variance;
        
        if (couplingStrength < 30) {
            // 非同期: ランダムなばらつき
            const randomFactor = 0.5 + Math.random();
            variance = mean * randomFactor + Math.random() * 20;
        } else {
            // 同期: べき乗則に従う
            variance = Math.pow(mean, exponent) * (0.9 + Math.random() * 0.2);
        }
        
        points.push({ mean, variance });
    }
    
    return points;
}

/**
 * テイラーの法則プロット用のPlotlyデータを生成する関数
 * @param {Array} points - テイラーの法則プロット用データ
 * @returns {Array} - Plotly用のデータ
 */
function createTaylorPlotData(points) {
    // 両対数変換
    const logPoints = points.map(p => ({
        logMean: Math.log10(p.mean),
        logVariance: Math.log10(p.variance)
    }));
    
    // 散布図データ
    const scatterData = {
        x: logPoints.map(p => p.logMean),
        y: logPoints.map(p => p.logVariance),
        mode: 'markers',
        type: 'scatter',
        name: 'データ点',
        marker: {
            size: 10,
            color: 'rgba(58, 110, 165, 0.8)',
            line: {
                color: 'rgba(58, 110, 165, 1)',
                width: 1
            }
        }
    };
    
    // 補助線1: 指数1の線
    const minX = Math.min(...logPoints.map(p => p.logMean));
    const maxX = Math.max(...logPoints.map(p => p.logMean));
    const line1 = {
        x: [minX, maxX],
        y: [minX, maxX], // 傾き1の線
        mode: 'lines',
        type: 'scatter',
        name: 'b = 1',
        line: {
            color: 'rgba(255, 107, 107, 0.7)',
            width: 2,
            dash: 'dash'
        }
    };
    
    // 補助線2: 指数2の線
    const line2 = {
        x: [minX, maxX],
        y: [minX * 2, maxX * 2], // 傾き2の線
        mode: 'lines',
        type: 'scatter',
        name: 'b = 2',
        line: {
            color: 'rgba(46, 204, 113, 0.7)',
            width: 2,
            dash: 'dash'
        }
    };
    
    return [scatterData, line1, line2];
}

/**
 * テイラーの法則プロットのレイアウトを生成する関数
 * @returns {Object} - Plotly用のレイアウト
 */
function createTaylorPlotLayout() {
    return {
        title: 'テイラーの法則プロット',
        xaxis: {
            title: 'log(平均M)',
            zeroline: false
        },
        yaxis: {
            title: 'log(分散V)',
            zeroline: false
        },
        margin: { t: 50, l: 60, r: 30, b: 60 },
        hovermode: 'closest',
        showlegend: true,
        legend: {
            x: 0,
            y: 1,
            orientation: 'h'
        }
    };
}

/**
 * 時系列プロットのレイアウトを生成する関数
 * @returns {Object} - Plotly用のレイアウト
 */
function createTimeSeriesPlotLayout() {
    return {
        title: '時系列データ',
        xaxis: {
            title: '時間',
            zeroline: false
        },
        yaxis: {
            title: '値',
            zeroline: false
        },
        margin: { t: 50, l: 60, r: 30, b: 60 },
        hovermode: 'closest',
        showlegend: true,
        legend: {
            x: 0,
            y: 1,
            orientation: 'h'
        }
    };
}
