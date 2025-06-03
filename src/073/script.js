class KanbanGame {
    constructor() {
        this.completedTasks = 0;
        this.targetTasks = 10;
        this.taskId = 0;
        this.gameActive = true;
        this.taskSpawnInterval = null;
        this.confettiParticles = [];
        this.draggedElement = null;
        
        // タッチ操作用の変数
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchElement = null;
        this.isDragging = false;
        
        this.taskTemplates = [
            "ユーザー登録機能の実装",
            "データベース設計の見直し",
            "APIドキュメントの更新",
            "バグ修正: ログイン画面",
            "パフォーマンス改善",
            "セキュリティ監査",
            "UI/UXの改善",
            "テストケースの追加",
            "コードレビュー",
            "デプロイメント準備",
            "ドキュメント整備",
            "リファクタリング",
            "新機能の企画",
            "品質保証テスト",
            "システム監視設定"
        ];
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.setupDropZones();
        this.startGame();
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        document.getElementById('newGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.startGame());
    }
    
    setupDropZones() {
        const columns = ['todo-list', 'doing-list', 'done-list'];
        
        columns.forEach(columnId => {
            const column = document.getElementById(columnId);
            
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                column.classList.add('drag-over');
            });
            
            column.addEventListener('dragleave', (e) => {
                if (!column.contains(e.relatedTarget)) {
                    column.classList.remove('drag-over');
                }
            });
            
            column.addEventListener('drop', (e) => {
                e.preventDefault();
                column.classList.remove('drag-over');
                this.handleDrop(e, columnId);
            });
        });
    }
    
    addDragListeners(task) {
        // マウス用ドラッグイベント
        task.addEventListener('dragstart', (e) => {
            this.draggedElement = task;
            task.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        task.addEventListener('dragend', (e) => {
            task.classList.remove('dragging');
            this.draggedElement = null;
        });
        
        // タッチ用イベント
        task.addEventListener('touchstart', (e) => {
            if (!this.gameActive) return;
            
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            this.touchElement = task;
            this.isDragging = false;
            
            // 長押し判定用のタイマー
            this.longPressTimer = setTimeout(() => {
                this.isDragging = true;
                task.classList.add('dragging');
                navigator.vibrate && navigator.vibrate(50); // バイブレーション
            }, 200);
            
            e.preventDefault();
        });
        
        task.addEventListener('touchmove', (e) => {
            if (!this.touchElement || !this.gameActive) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;
            
            // 移動距離が一定以上の場合、ドラッグ開始
            if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                clearTimeout(this.longPressTimer);
                if (!this.isDragging) {
                    this.isDragging = true;
                    task.classList.add('dragging');
                }
            }
            
            if (this.isDragging) {
                // タスクを指に追従させる
                task.style.position = 'fixed';
                task.style.left = touch.clientX - 50 + 'px';
                task.style.top = touch.clientY - 25 + 'px';
                task.style.zIndex = '1000';
                task.style.pointerEvents = 'none';
                
                // ドロップゾーンのハイライト
                this.updateDropZoneHighlight(touch.clientX, touch.clientY);
            }
            
            e.preventDefault();
        });
        
        task.addEventListener('touchend', (e) => {
            clearTimeout(this.longPressTimer);
            
            if (this.isDragging && this.touchElement) {
                const touch = e.changedTouches[0];
                const dropTarget = this.getDropTarget(touch.clientX, touch.clientY);
                
                if (dropTarget) {
                    this.handleTouchDrop(this.touchElement, dropTarget);
                }
                
                // スタイルをリセット
                this.touchElement.style.position = '';
                this.touchElement.style.left = '';
                this.touchElement.style.top = '';
                this.touchElement.style.zIndex = '';
                this.touchElement.style.pointerEvents = '';
                this.touchElement.classList.remove('dragging');
                
                // ドロップゾーンハイライトをクリア
                this.clearDropZoneHighlight();
            }
            
            this.touchElement = null;
            this.isDragging = false;
            e.preventDefault();
        });
        
        // クリック操作（フォールバック）
        task.addEventListener('click', (e) => {
            if (!this.isDragging && this.gameActive) {
                this.handleClick(task);
            }
        });
    }
    
    updateDropZoneHighlight(x, y) {
        // 全てのドロップゾーンハイライトをクリア
        this.clearDropZoneHighlight();
        
        // 指の位置にあるドロップゾーンをハイライト
        const element = document.elementFromPoint(x, y);
        if (element) {
            const taskList = element.closest('.task-list');
            if (taskList) {
                taskList.classList.add('drag-over');
            }
        }
    }
    
    clearDropZoneHighlight() {
        document.querySelectorAll('.task-list').forEach(list => {
            list.classList.remove('drag-over');
        });
    }
    
    getDropTarget(x, y) {
        const element = document.elementFromPoint(x, y);
        if (element) {
            const taskList = element.closest('.task-list');
            return taskList ? taskList.id : null;
        }
        return null;
    }
    
    handleTouchDrop(task, targetColumnId) {
        const sourceColumnId = task.parentElement.id;
        
        if (this.isValidMove(sourceColumnId, targetColumnId)) {
            const targetColumn = document.getElementById(targetColumnId);
            this.moveTaskToColumn(task, targetColumn, targetColumnId);
        }
    }
    
    handleClick(task) {
        const parentId = task.parentElement.id;
        
        if (parentId === 'todo-list') {
            const doingList = document.getElementById('doing-list');
            this.moveTaskToColumn(task, doingList, 'doing-list');
        } else if (parentId === 'doing-list') {
            const doneList = document.getElementById('done-list');
            this.moveTaskToColumn(task, doneList, 'done-list');
        }
    }
    
    handleDrop(e, targetColumnId) {
        if (!this.draggedElement || !this.gameActive) return;
        
        const sourceColumnId = this.draggedElement.parentElement.id;
        const targetColumn = document.getElementById(targetColumnId);
        
        // ドロップ可能な移動かチェック
        if (this.isValidMove(sourceColumnId, targetColumnId)) {
            this.moveTaskToColumn(this.draggedElement, targetColumn, targetColumnId);
        }
    }
    
    isValidMove(sourceColumnId, targetColumnId) {
        // TODO -> DOING, DOING -> DONE のみ許可
        if (sourceColumnId === 'todo-list' && targetColumnId === 'doing-list') return true;
        if (sourceColumnId === 'doing-list' && targetColumnId === 'done-list') return true;
        return false;
    }
    
    moveTaskToColumn(task, targetColumn, targetColumnId) {
        // アニメーション効果
        task.classList.add('moving');
        
        setTimeout(() => {
            // タスクを移動
            task.classList.remove('moving');
            
            // 前のステータスクラスを削除
            task.classList.remove('doing', 'done');
            
            // 新しいステータスクラスを追加
            if (targetColumnId === 'doing-list') {
                task.classList.add('doing');
            } else if (targetColumnId === 'done-list') {
                task.classList.add('done');
                
                // 完了数を更新
                this.completedTasks++;
                document.getElementById('completedCount').textContent = this.completedTasks;
                
                // クリア条件チェック
                if (this.completedTasks >= this.targetTasks) {
                    this.gameComplete();
                }
            }
            
            targetColumn.appendChild(task);
        }, 300);
    }
    
    startGame() {
        this.gameActive = true;
        this.completedTasks = 0;
        this.taskId = 0;
        
        // UI更新
        document.getElementById('completedCount').textContent = this.completedTasks;
        document.getElementById('targetCount').textContent = this.targetTasks;
        document.getElementById('clear-screen').classList.add('hidden');
        
        // タスクリストをクリア
        document.getElementById('todo-list').innerHTML = '';
        document.getElementById('doing-list').innerHTML = '';
        document.getElementById('done-list').innerHTML = '';
        
        // 紙吹雪をクリア
        this.confettiParticles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // タスクの定期生成を開始
        this.startTaskSpawning();
        
        // 初期タスクを3つ生成
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.spawnTask(), i * 500);
        }
    }
    
    startTaskSpawning() {
        if (this.taskSpawnInterval) {
            clearInterval(this.taskSpawnInterval);
        }
        
        this.taskSpawnInterval = setInterval(() => {
            if (this.gameActive && document.getElementById('todo-list').children.length < 5) {
                this.spawnTask();
            }
        }, 2000 + Math.random() * 3000); // 2-5秒間隔でランダム生成
    }
    
    spawnTask() {
        const todoList = document.getElementById('todo-list');
        const task = document.createElement('div');
        task.className = 'task';
        task.dataset.id = this.taskId++;
        task.draggable = true;
        
        const randomTask = this.taskTemplates[Math.floor(Math.random() * this.taskTemplates.length)];
        task.textContent = randomTask;
        
        // ドラッグイベントリスナーを追加
        this.addDragListeners(task);
        
        todoList.appendChild(task);
        
        // アニメーション効果
        setTimeout(() => {
            task.style.opacity = '1';
            task.style.transform = 'translateX(0)';
        }, 10);
    }
    
    removeTask(taskElement) {
        taskElement.classList.add('fade-out');
        setTimeout(() => {
            if (taskElement.parentElement) {
                taskElement.parentElement.removeChild(taskElement);
            }
        }, 500);
    }
    
    gameComplete() {
        this.gameActive = false;
        
        // タスク生成を停止
        if (this.taskSpawnInterval) {
            clearInterval(this.taskSpawnInterval);
        }
        
        // 紙吹雪アニメーション開始
        this.startConfetti();
        
        // クリア画面表示
        setTimeout(() => {
            document.getElementById('clear-screen').classList.remove('hidden');
        }, 1000);
    }
    
    startConfetti() {
        // 紙吹雪パーティクルを生成
        for (let i = 0; i < 100; i++) {
            this.confettiParticles.push({
                x: Math.random() * this.canvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                color: this.getRandomColor(),
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }
        
        this.animateConfetti();
    }
    
    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animateConfetti() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const particle = this.confettiParticles[i];
            
            // パーティクルの位置を更新
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            
            // 重力効果
            particle.vy += 0.1;
            
            // パーティクルを描画
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation * Math.PI / 180);
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            this.ctx.restore();
            
            // 画面外に出たパーティクルを削除
            if (particle.y > this.canvas.height + 10) {
                this.confettiParticles.splice(i, 1);
            }
        }
        
        // アニメーション継続
        if (this.confettiParticles.length > 0) {
            requestAnimationFrame(() => this.animateConfetti());
        }
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    new KanbanGame();
});
