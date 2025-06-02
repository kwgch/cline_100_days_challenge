class MusicBoxSequencer {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentStep = 0;
        this.bpm = 120;
        this.interval = null;
        this.gridSize = { rows: 8, cols: 16 };
        this.pattern = [];
        this.currentScale = 'pentatonic';
        this.currentInstrument = 'sine';
        
        this.scales = {
            pentatonic: [0, 2, 4, 7, 9, 12, 14, 16],
            major: [0, 2, 4, 5, 7, 9, 11, 12],
            minor: [0, 2, 3, 5, 7, 8, 10, 12],
            blues: [0, 3, 5, 6, 7, 10, 12, 15],
            chromatic: [0, 1, 2, 3, 4, 5, 6, 7]
        };
        
        this.baseFrequency = 440;
        
        this.init();
    }
    
    init() {
        this.initAudio();
        this.initGrid();
        this.initControls();
        this.initPresets();
        this.updateNoteLabels();
    }
    
    initAudio() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
    }
    
    initGrid() {
        const grid = document.getElementById('sequencer-grid');
        grid.style.gridTemplateRows = `repeat(${this.gridSize.rows}, 1fr)`;
        
        this.pattern = Array(this.gridSize.rows).fill().map(() => Array(this.gridSize.cols).fill(false));
        
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => this.toggleCell(row, col));
                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.toggleCell(row, col);
                });
                
                grid.appendChild(cell);
            }
        }
    }
    
    updateNoteLabels() {
        const labelContainer = document.querySelector('.note-labels');
        labelContainer.innerHTML = '';
        
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const scale = this.scales[this.currentScale];
        
        for (let i = this.gridSize.rows - 1; i >= 0; i--) {
            const label = document.createElement('div');
            label.className = 'note-label';
            const noteIndex = scale[i] % 12;
            const octave = Math.floor(scale[i] / 12) + 4;
            label.textContent = noteNames[noteIndex] + octave;
            labelContainer.appendChild(label);
        }
    }
    
    initControls() {
        const playBtn = document.getElementById('play-btn');
        const stopBtn = document.getElementById('stop-btn');
        const clearBtn = document.getElementById('clear-btn');
        const bpmSlider = document.getElementById('bpm-slider');
        const scaleSelect = document.getElementById('scale-select');
        const instrumentSelect = document.getElementById('instrument-select');
        
        playBtn.addEventListener('click', () => this.togglePlay());
        stopBtn.addEventListener('click', () => this.stop());
        clearBtn.addEventListener('click', () => this.clearPattern());
        
        bpmSlider.addEventListener('input', (e) => {
            this.bpm = parseInt(e.target.value);
            document.getElementById('bpm-display').textContent = `BPM: ${this.bpm}`;
            if (this.isPlaying) {
                this.stop();
                this.play();
            }
        });
        
        scaleSelect.addEventListener('change', (e) => {
            this.currentScale = e.target.value;
            document.getElementById('scale-display').textContent = `Scale: ${e.target.options[e.target.selectedIndex].text}`;
            this.updateNoteLabels();
        });
        
        instrumentSelect.addEventListener('change', (e) => {
            this.currentInstrument = e.target.value;
        });
    }
    
    initPresets() {
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset;
                this.loadPreset(preset);
            });
        });
    }
    
    toggleCell(row, col) {
        this.pattern[row][col] = !this.pattern[row][col];
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.toggle('active');
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    }
    
    play() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.isPlaying = true;
        const stepDuration = 60000 / (this.bpm * 4);
        
        this.interval = setInterval(() => {
            this.playStep();
            this.movePlayhead();
            this.currentStep = (this.currentStep + 1) % this.gridSize.cols;
        }, stepDuration);
    }
    
    stop() {
        this.isPlaying = false;
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.currentStep = 0;
        this.movePlayhead();
        
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('playing');
        });
    }
    
    playStep() {
        for (let row = 0; row < this.gridSize.rows; row++) {
            if (this.pattern[row][this.currentStep]) {
                this.playNote(row);
                const cell = document.querySelector(`[data-row="${row}"][data-col="${this.currentStep}"]`);
                cell.classList.add('playing');
                setTimeout(() => cell.classList.remove('playing'), 100);
            }
        }
    }
    
    playNote(row) {
        const now = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        const scale = this.scales[this.currentScale];
        const noteIndex = this.gridSize.rows - 1 - row;
        const semitone = scale[noteIndex];
        const frequency = this.baseFrequency * Math.pow(2, (semitone - 9) / 12);
        
        oscillator.type = this.currentInstrument;
        oscillator.frequency.setValueAtTime(frequency, now);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.Q.setValueAtTime(5, now);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }
    
    movePlayhead() {
        const playhead = document.querySelector('.playhead');
        const cellWidth = document.querySelector('.grid-cell').offsetWidth + 2;
        playhead.style.transform = `translateX(${this.currentStep * cellWidth}px)`;
    }
    
    clearPattern() {
        this.pattern = Array(this.gridSize.rows).fill().map(() => Array(this.gridSize.cols).fill(false));
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('active');
        });
    }
    
    loadPreset(preset) {
        this.clearPattern();
        
        switch (preset) {
            case 'random':
                for (let col = 0; col < this.gridSize.cols; col++) {
                    if (Math.random() > 0.6) {
                        const row = Math.floor(Math.random() * this.gridSize.rows);
                        this.toggleCell(row, col);
                    }
                }
                break;
                
            case 'arpeggio':
                for (let col = 0; col < this.gridSize.cols; col++) {
                    const row = col % this.gridSize.rows;
                    this.toggleCell(row, col);
                }
                break;
                
            case 'melody':
                const melody = [7, 5, 5, 6, 4, 4, 7, 6, 5, 4, 3, 3, 2, 1, 0, 0];
                melody.forEach((note, col) => {
                    if (col < this.gridSize.cols && note < this.gridSize.rows) {
                        this.toggleCell(note, col);
                    }
                });
                break;
                
            case 'bass':
                for (let col = 0; col < this.gridSize.cols; col += 4) {
                    this.toggleCell(0, col);
                    if (col + 2 < this.gridSize.cols) {
                        this.toggleCell(2, col + 2);
                    }
                }
                break;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicBoxSequencer();
});