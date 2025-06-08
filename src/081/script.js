class VerticalSNS {
    constructor() {
        this.posts = [];
        this.initializeElements();
        this.bindEvents();
        this.loadSamplePosts();
    }

    initializeElements() {
        this.postsContainer = document.getElementById('postsContainer');
        this.postModal = document.getElementById('postModal');
        this.newPostBtn = document.getElementById('newPostBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.authorInput = document.getElementById('authorInput');
        this.postInput = document.getElementById('postInput');
    }

    bindEvents() {
        this.newPostBtn.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.submitBtn.addEventListener('click', () => this.submitPost());
        
        // モーダル外クリックで閉じる
        window.addEventListener('click', (e) => {
            if (e.target === this.postModal) {
                this.closeModal();
            }
        });

        // タッチイベントでスクロール防止
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.posts-container')) {
                return;
            }
            e.preventDefault();
        }, { passive: false });
    }

    openModal() {
        this.postModal.style.display = 'block';
        this.postInput.focus();
    }

    closeModal() {
        this.postModal.style.display = 'none';
        this.authorInput.value = '';
        this.postInput.value = '';
    }

    submitPost() {
        const author = this.authorInput.value.trim() || '名無しさん';
        const content = this.postInput.value.trim();

        if (!content) {
            alert('投稿内容を入力してください');
            return;
        }

        const post = {
            id: Date.now(),
            author: author,
            content: content,
            timestamp: new Date(),
            likes: 0
        };

        this.addPost(post);
        this.closeModal();
    }

    addPost(post) {
        this.posts.unshift(post);
        this.renderPost(post, true);
    }

    renderPost(post, isNew = false) {
        const postElement = document.createElement('article');
        postElement.className = 'post';
        if (isNew) {
            postElement.classList.add('new-post');
        }

        const timeAgo = this.getTimeAgo(post.timestamp);

        postElement.innerHTML = `
            <div class="post-header">
                <span class="post-author">${this.escapeHtml(post.author)}</span>
                <span class="post-time">${timeAgo}</span>
            </div>
            <div class="post-content">
                ${this.escapeHtml(post.content)}
            </div>
            <div class="post-footer">
                <button class="like-btn" data-id="${post.id}">
                    <span class="like-icon">♥</span>
                    <span class="like-count">${post.likes}</span>
                </button>
            </div>
        `;

        // いいねボタンのイベント
        const likeBtn = postElement.querySelector('.like-btn');
        likeBtn.addEventListener('click', () => this.toggleLike(post.id, likeBtn));

        // 新しい投稿を最初に追加
        if (isNew) {
            this.postsContainer.insertBefore(postElement, this.postsContainer.firstChild);
            // アニメーション用のクラスを少し遅れて削除
            setTimeout(() => postElement.classList.remove('new-post'), 100);
        } else {
            this.postsContainer.appendChild(postElement);
        }
    }

    toggleLike(postId, button) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const isLiked = button.classList.contains('liked');
        
        if (isLiked) {
            post.likes--;
            button.classList.remove('liked');
        } else {
            post.likes++;
            button.classList.add('liked');
        }

        const likeCount = button.querySelector('.like-count');
        likeCount.textContent = post.likes;

        // アニメーション
        button.classList.add('like-animation');
        setTimeout(() => button.classList.remove('like-animation'), 300);
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}日前`;
        if (hours > 0) return `${hours}時間前`;
        if (minutes > 0) return `${minutes}分前`;
        return 'たった今';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadSamplePosts() {
        const samplePosts = [
            {
                id: 1,
                author: '夏目漱石',
                content: '吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。',
                timestamp: new Date(Date.now() - 86400000),
                likes: 42
            },
            {
                id: 2,
                author: '紫式部',
                content: 'いづれの御時にか、女御、更衣あまたさぶらひたまひける中に、いとやむごとなき際にはあらぬが、すぐれて時めきたまふありけり。',
                timestamp: new Date(Date.now() - 3600000),
                likes: 108
            },
            {
                id: 3,
                author: '松尾芭蕉',
                content: '古池や\n蛙飛び込む\n水の音',
                timestamp: new Date(Date.now() - 7200000),
                likes: 88
            },
            {
                id: 4,
                author: '与謝野晶子',
                content: 'あゝをとうとよ、君を泣く、\n君死にたまふことなかれ、\n末に生まれし君なれば',
                timestamp: new Date(Date.now() - 10800000),
                likes: 65
            },
            {
                id: 5,
                author: '宮沢賢治',
                content: '雨ニモマケズ\n風ニモマケズ\n雪ニモ夏ノ暑サニモマケヌ\n丈夫ナカラダヲモチ',
                timestamp: new Date(Date.now() - 14400000),
                likes: 120
            }
        ];

        samplePosts.forEach(post => {
            this.posts.push(post);
            this.renderPost(post);
        });
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new VerticalSNS();
});

// モバイルでのビューポート高さ対応
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);