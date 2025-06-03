class PasswordStrengthVisualizer {
    constructor() {
        this.passwordInput = document.getElementById('passwordInput');
        this.toggleButton = document.getElementById('togglePassword');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthLabel = document.getElementById('strengthLabel');
        this.canvas = document.getElementById('visualCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.securityTip = document.getElementById('securityTip');
        
        this.particles = [];
        this.animationId = null;
        
        this.setupCanvas();
        this.bindEvents();
        this.updateVisualization('');
    }

    setupCanvas() {
        this.canvas.width = 400;
        this.canvas.height = 200;
        
        // Adjust for mobile
        if (window.innerWidth < 480) {
            this.canvas.width = 300;
            this.canvas.height = 150;
        }
    }

    bindEvents() {
        this.passwordInput.addEventListener('input', (e) => {
            this.updateVisualization(e.target.value);
        });

        this.toggleButton.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Prevent zoom on mobile
        this.passwordInput.addEventListener('touchstart', (e) => {
            e.target.style.fontSize = '16px';
        });
    }

    togglePasswordVisibility() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        this.toggleButton.classList.toggle('password-visible');
    }

    calculateStrength(password) {
        let strength = 0;
        const criteria = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };

        // Update criteria UI
        Object.keys(criteria).forEach(key => {
            const element = document.querySelector(`[data-criterion="${key}"]`);
            if (criteria[key]) {
                element.classList.add('met');
                element.querySelector('.check-icon').textContent = '✓';
                strength++;
            } else {
                element.classList.remove('met');
                element.querySelector('.check-icon').textContent = '✗';
            }
        });

        // Additional strength points
        if (password.length >= 12) strength++;
        if (password.length >= 16) strength++;
        
        // Check for common patterns (deduct points)
        if (/(.)\1{2,}/.test(password)) strength--; // Repeated characters
        if (/12345|password|qwerty/i.test(password)) strength -= 2; // Common patterns

        return Math.max(0, Math.min(strength, 7));
    }

    updateVisualization(password) {
        const strength = this.calculateStrength(password);
        this.updateStrengthMeter(strength, password.length);
        this.updateTips(strength, password.length);
        this.animateCanvas(strength, password.length);
    }

    updateStrengthMeter(strength, length) {
        const percentage = length === 0 ? 0 : Math.min((strength / 7) * 100, 100);
        this.strengthFill.style.width = percentage + '%';
        
        // Remove all strength classes
        this.strengthFill.className = 'strength-fill';
        
        // Add appropriate class and update label
        if (length === 0) {
            this.strengthLabel.textContent = '強度: なし';
        } else if (strength <= 1) {
            this.strengthFill.classList.add('strength-weak');
            this.strengthLabel.textContent = '強度: 弱い';
        } else if (strength <= 2) {
            this.strengthFill.classList.add('strength-fair');
            this.strengthLabel.textContent = '強度: 普通';
        } else if (strength <= 4) {
            this.strengthFill.classList.add('strength-good');
            this.strengthLabel.textContent = '強度: 良い';
        } else if (strength <= 5) {
            this.strengthFill.classList.add('strength-strong');
            this.strengthLabel.textContent = '強度: 強い';
        } else {
            this.strengthFill.classList.add('strength-very-strong');
            this.strengthLabel.textContent = '強度: 非常に強い';
        }
    }

    updateTips(strength, length) {
        const tips = {
            0: 'パスワードを入力して、強度を確認しましょう。',
            1: 'もっと長いパスワードを使用し、文字の種類を増やしてください。',
            2: '大文字、小文字、数字、特殊文字を組み合わせてください。',
            3: 'よくできています！さらに文字を追加すると、より安全になります。',
            4: '良いパスワードです！12文字以上にするとさらに安全です。',
            5: '素晴らしい！このパスワードは十分に強力です。',
            6: '優秀！非常に強力なパスワードです。',
            7: '完璧！最高レベルのセキュリティです。'
        };

        this.securityTip.textContent = tips[Math.min(strength, 7)];
    }

    animateCanvas(strength, length) {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (length === 0) {
            this.drawEmptyState();
            return;
        }

        // Create particles based on strength
        this.createParticles(strength);
        this.animate();
    }

    drawEmptyState() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = '#999';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('パスワードの強度を視覚化', centerX, centerY);
        this.ctx.restore();
    }

    createParticles(strength) {
        this.particles = [];
        const particleCount = 10 + strength * 15;
        const colors = this.getColorsByStrength(strength);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * (1 + strength * 0.3),
                vy: (Math.random() - 0.5) * (1 + strength * 0.3),
                radius: 2 + Math.random() * (strength * 0.5),
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 0.5 + Math.random() * 0.5
            });
        }
    }

    getColorsByStrength(strength) {
        const colorSets = [
            ['#ff4757', '#ff6348'], // Weak
            ['#ffa502', '#ff7675'], // Fair
            ['#feca57', '#ff9ff3'], // Good
            ['#32ff7e', '#7bed9f'], // Strong
            ['#18dcff', '#7d5fff'], // Very strong
            ['#00d2d3', '#54a0ff'], // Excellent
            ['#5f27cd', '#00d2d3']  // Perfect
        ];
        
        return colorSets[Math.min(strength, colorSets.length - 1)];
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.drawConnections();
        
        // Update and draw particles
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off walls
            if (particle.x < particle.radius || particle.x > this.canvas.width - particle.radius) {
                particle.vx *= -1;
            }
            if (particle.y < particle.radius || particle.y > this.canvas.height - particle.radius) {
                particle.vy *= -1;
            }
            
            // Draw particle
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            this.ctx.restore();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        const maxDistance = 80;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    this.ctx.save();
                    this.ctx.globalAlpha = opacity;
                    this.ctx.strokeStyle = this.particles[i].color;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordStrengthVisualizer();
});