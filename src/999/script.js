/**
 * インタラクティブ解説アプリケーションのメインスクリプト
 */

// DOMが完全に読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    // グローバル変数
    let currentCouplingStrength = 0;
    
    // 初期化関数
    function initialize() {
        // テイラーの法則プロットの初期化（非同期状態）
        initTaylorPlot();
        
        // 同期現象セクションの初期化
        initSynchronizationSection();
        
        // イベントリスナーの設定
        setupEventListeners();
        
        // 用語解説ツールチップの設定
        setupTooltips();
        
        // タッチイベント最適化
        optimizeTouchEvents();
    }
    
    /**
     * テイラーの法則プロットの初期化
     */
    function initTaylorPlot() {
        const taylorPlotElement = document.getElementById('tl-plot-taylor');
        const plotData = createTaylorPlotData(sampleData.async.taylorPoints);
        const layout = createTaylorPlotLayout();
        
        Plotly.newPlot(taylorPlotElement, plotData, layout, {
            responsive: true,
            displayModeBar: false
        });
    }
    
    /**
     * 同期現象セクションの初期化
     */
    function initSynchronizationSection() {
        // 時系列プロットの初期化
        const timeSeriesPlotElement = document.getElementById('timeseries-plot');
        const timeSeriesData = generateTimeSeriesData(currentCouplingStrength);
        const timeSeriesLayout = createTimeSeriesPlotLayout();
        
        Plotly.newPlot(timeSeriesPlotElement, timeSeriesData, timeSeriesLayout, {
            responsive: true,
            displayModeBar: false
        });
        
        // 同期セクションのテイラーの法則プロットの初期化
        const syncTaylorPlotElement = document.getElementById('tl-plot-sync');
        const taylorPoints = generateTaylorPoints(currentCouplingStrength);
        const taylorPlotData = createTaylorPlotData(taylorPoints);
        const taylorPlotLayout = createTaylorPlotLayout();
        
        Plotly.newPlot(syncTaylorPlotElement, taylorPlotData, taylorPlotLayout, {
            responsive: true,
            displayModeBar: false
        });
        
        // 結合強度の表示を更新
        document.getElementById('coupling-strength-value').textContent = currentCouplingStrength;
    }
    
    /**
     * イベントリスナーの設定
     */
    function setupEventListeners() {
        // テイラーの法則セクションのボタン
        document.getElementById('btn-async-data').addEventListener('click', function() {
            updateTaylorPlot('async');
        });
        
        document.getElementById('btn-sync-data').addEventListener('click', function() {
            updateTaylorPlot('sync');
        });
        
        document.getElementById('btn-strong-sync-data').addEventListener('click', function() {
            updateTaylorPlot('strongSync');
        });
        
        // 結合強度スライダー
        const slider = document.getElementById('coupling-strength-slider');
        slider.addEventListener('input', function() {
            currentCouplingStrength = parseInt(this.value);
            document.getElementById('coupling-strength-value').textContent = currentCouplingStrength;
            updateSynchronizationPlots();
        });
        
        // ウィンドウリサイズ時のグラフ再描画
        window.addEventListener('resize', function() {
            // すべてのプロットを再描画
            const taylorPlotElement = document.getElementById('tl-plot-taylor');
            const timeSeriesPlotElement = document.getElementById('timeseries-plot');
            const syncTaylorPlotElement = document.getElementById('tl-plot-sync');
            
            Plotly.relayout(taylorPlotElement, {});
            Plotly.relayout(timeSeriesPlotElement, {});
            Plotly.relayout(syncTaylorPlotElement, {});
        });
    }
    
    /**
     * テイラーの法則プロットを更新する関数
     * @param {string} dataType - データタイプ ('async', 'sync', 'strongSync')
     */
    function updateTaylorPlot(dataType) {
        const taylorPlotElement = document.getElementById('tl-plot-taylor');
        const plotData = createTaylorPlotData(sampleData[dataType].taylorPoints);
        
        Plotly.react(taylorPlotElement, plotData, createTaylorPlotLayout(), {
            responsive: true,
            displayModeBar: false
        });
        
        // ボタンのアクティブ状態を更新
        const buttons = document.querySelectorAll('#taylors-law-section .control-button');
        buttons.forEach(button => button.classList.remove('active'));
        
        // クリックされたボタンをアクティブに
        let buttonId;
        switch(dataType) {
            case 'async':
                buttonId = 'btn-async-data';
                break;
            case 'sync':
                buttonId = 'btn-sync-data';
                break;
            case 'strongSync':
                buttonId = 'btn-strong-sync-data';
                break;
        }
        document.getElementById(buttonId).classList.add('active');
    }
    
    /**
     * 同期現象セクションのプロットを更新する関数
     */
    function updateSynchronizationPlots() {
        // 時系列プロットの更新
        const timeSeriesPlotElement = document.getElementById('timeseries-plot');
        const timeSeriesData = generateTimeSeriesData(currentCouplingStrength);
        
        Plotly.react(timeSeriesPlotElement, timeSeriesData, createTimeSeriesPlotLayout(), {
            responsive: true,
            displayModeBar: false
        });
        
        // テイラーの法則プロットの更新
        const syncTaylorPlotElement = document.getElementById('tl-plot-sync');
        const taylorPoints = generateTaylorPoints(currentCouplingStrength);
        const taylorPlotData = createTaylorPlotData(taylorPoints);
        
        Plotly.react(syncTaylorPlotElement, taylorPlotData, createTaylorPlotLayout(), {
            responsive: true,
            displayModeBar: false
        });
    }
    
    /**
     * 用語解説ツールチップの設定
     */
    function setupTooltips() {
        const tooltipContainer = document.getElementById('tooltip-container');
        const glossaryTerms = document.querySelectorAll('.glossary dt');
        
        glossaryTerms.forEach(term => {
            term.addEventListener('mouseenter', function(e) {
                const termKey = this.getAttribute('data-term-key');
                const explanation = termExplanations[termKey];
                
                if (explanation) {
                    tooltipContainer.textContent = explanation;
                    tooltipContainer.classList.remove('tooltip-hidden');
                    
                    // ツールチップの位置を設定
                    const rect = this.getBoundingClientRect();
                    tooltipContainer.style.left = `${rect.left}px`;
                    tooltipContainer.style.top = `${rect.bottom + 5}px`;
                }
            });
            
            term.addEventListener('mouseleave', function() {
                tooltipContainer.classList.add('tooltip-hidden');
            });
            
            // タッチデバイス用
            term.addEventListener('touchstart', function(e) {
                e.preventDefault(); // デフォルトのタッチイベントを防止
                
                const termKey = this.getAttribute('data-term-key');
                const explanation = termExplanations[termKey];
                
                if (explanation) {
                    // すでに表示されている場合は非表示に
                    if (tooltipContainer.textContent === explanation && 
                        !tooltipContainer.classList.contains('tooltip-hidden')) {
                        tooltipContainer.classList.add('tooltip-hidden');
                    } else {
                        // 新しい説明を表示
                        tooltipContainer.textContent = explanation;
                        tooltipContainer.classList.remove('tooltip-hidden');
                        
                        // ツールチップの位置を設定
                        const rect = this.getBoundingClientRect();
                        tooltipContainer.style.left = `${rect.left}px`;
                        tooltipContainer.style.top = `${rect.bottom + 5}px`;
                    }
                }
            });
        });
        
        // ツールチップ以外の場所をタップしたら非表示にする
        document.addEventListener('touchstart', function(e) {
            if (!e.target.closest('.glossary dt') && !tooltipContainer.classList.contains('tooltip-hidden')) {
                tooltipContainer.classList.add('tooltip-hidden');
            }
        });
    }
    
    /**
     * タッチイベントの最適化
     * スマホでタップしたときに画面が動かないようにする
     */
    function optimizeTouchEvents() {
        // プロットコンテナのタッチイベント
        const plotContainers = document.querySelectorAll('.plot-container');
        plotContainers.forEach(container => {
            container.addEventListener('touchstart', function(e) {
                e.preventDefault(); // デフォルトのタッチイベントを防止
            }, { passive: false });
            
            container.addEventListener('touchmove', function(e) {
                e.preventDefault(); // デフォルトのタッチイベントを防止
            }, { passive: false });
        });
        
        // スライダーのタッチイベント
        const slider = document.getElementById('coupling-strength-slider');
        slider.addEventListener('touchmove', function(e) {
            e.stopPropagation(); // イベントの伝播を停止
        }, { passive: true });
    }
    
    // アプリケーションの初期化
    initialize();
});
