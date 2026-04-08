'use strict';

const RECORD_DURATION_MS = 5000;

class SongIdentifier {
  constructor() {
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks   = [];
    this.analyser      = null;
    this.animFrameId   = null;

    // DOM refs
    this.recordBtn       = document.getElementById('record-btn');
    this.statusText      = document.getElementById('status-text');
    this.canvas          = document.getElementById('waveform');
    this.canvasCtx       = this.canvas.getContext('2d');
    this.countdownOverlay = document.getElementById('countdown-overlay');
    this.countdownNumber  = document.getElementById('countdown-number');
    this.resultCard      = document.getElementById('result-card');
    this.tryAgainBtn     = document.getElementById('try-again-btn');
    this.backendUrlInput = document.getElementById('backend-url');

    // Restore saved backend URL
    this.backendUrlInput.value =
      localStorage.getItem('songIdentifierBackendUrl') || 'http://localhost:8000';

    // Persist URL on change
    this.backendUrlInput.addEventListener('change', () => {
      localStorage.setItem('songIdentifierBackendUrl', this.backendUrlInput.value.trim());
    });

    this.recordBtn.addEventListener('click', () => this.start());
    this.tryAgainBtn.addEventListener('click', () => this.reset());
  }

  /* ── Public: start flow ──────────────────────────────────────────── */
  async start() {
    if (this.isRecording) return;

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch {
      this.setStatus('❌ Microphone access denied', 'error');
      return;
    }

    this.isRecording = true;
    this.recordBtn.disabled = true;
    this.resultCard.classList.add('hidden');
    this.resultCard.classList.remove('visible');
    this.tryAgainBtn.classList.add('hidden');

    // Waveform analyser
    const audioCtx = new AudioContext();
    const source   = audioCtx.createMediaStreamSource(stream);
    this.analyser  = audioCtx.createAnalyser();
    this.analyser.fftSize = 512;
    source.connect(this.analyser);

    // Countdown
    await this.showCountdown(['3', '2', '1', '🎵 Go!']);

    // Start recording
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.addEventListener('dataavailable', e => {
      if (e.data.size > 0) this.audioChunks.push(e.data);
    });
    this.mediaRecorder.addEventListener('stop', () => {
      stream.getTracks().forEach(t => t.stop());
      audioCtx.close();
      this.stopWaveform();
      const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.identify(blob);
    });

    this.mediaRecorder.start(100); // collect every 100 ms
    this.startWaveform();
    this.setStatus('🎵 Listening…', 'recording');
    this.recordBtn.classList.add('recording');

    // Countdown timer on status
    let remaining = Math.round(RECORD_DURATION_MS / 1000);
    const tick = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        this.setStatus(`🎵 Listening… ${remaining}s`, 'recording');
      } else {
        clearInterval(tick);
      }
    }, 1000);

    // Auto stop
    setTimeout(() => {
      if (this.mediaRecorder?.state !== 'inactive') this.mediaRecorder.stop();
    }, RECORD_DURATION_MS);
  }

  /* ── Countdown overlay ───────────────────────────────────────────── */
  showCountdown(steps) {
    return new Promise(resolve => {
      this.countdownOverlay.classList.remove('hidden');
      let i = 0;
      const next = () => {
        if (i >= steps.length) {
          this.countdownOverlay.classList.add('hidden');
          resolve();
          return;
        }
        this.countdownNumber.textContent = steps[i++];
        // Re-trigger animation
        this.countdownNumber.style.animation = 'none';
        void this.countdownNumber.offsetWidth;
        this.countdownNumber.style.animation = '';
        const delay = steps[i - 1] === '🎵 Go!' ? 400 : 700;
        setTimeout(next, delay);
      };
      next();
    });
  }

  /* ── Waveform drawing ────────────────────────────────────────────── */
  startWaveform() {
    this.canvas.classList.add('active');
    const buf = new Uint8Array(this.analyser.frequencyBinCount);

    const draw = () => {
      this.animFrameId = requestAnimationFrame(draw);
      this.analyser.getByteTimeDomainData(buf);

      const { width: W, height: H } = this.canvas;
      this.canvasCtx.clearRect(0, 0, W, H);

      // Gradient line
      const grad = this.canvasCtx.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0,   '#7c3aed');
      grad.addColorStop(0.5, '#ec4899');
      grad.addColorStop(1,   '#06b6d4');

      this.canvasCtx.lineWidth   = 2.5;
      this.canvasCtx.strokeStyle = grad;
      this.canvasCtx.beginPath();

      const sliceW = W / buf.length;
      let x = 0;
      for (let i = 0; i < buf.length; i++) {
        const y = (buf[i] / 128) * (H / 2);
        i === 0 ? this.canvasCtx.moveTo(x, y) : this.canvasCtx.lineTo(x, y);
        x += sliceW;
      }
      this.canvasCtx.lineTo(W, H / 2);
      this.canvasCtx.stroke();
    };

    draw();
  }

  stopWaveform() {
    cancelAnimationFrame(this.animFrameId);
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.classList.remove('active');
  }

  /* ── Song identification ─────────────────────────────────────────── */
  async identify(blob) {
    this.setStatus('🔍 Identifying song…', 'identifying');
    this.recordBtn.classList.remove('recording');

    const backendUrl = this.backendUrlInput.value.trim().replace(/\/+$/, '');
    const formData   = new FormData();
    formData.append('audio', blob, 'recording.webm');

    let data;
    try {
      const res = await fetch(`${backendUrl}/identify`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (err) {
      this.setStatus('❌ Could not reach backend — check Settings', 'error');
      this.recordBtn.disabled = false;
      this.isRecording = false;
      this.tryAgainBtn.classList.remove('hidden');
      return;
    }

    this.showResult(data);
  }

  /* ── Render result ───────────────────────────────────────────────── */
  showResult(data) {
    this.recordBtn.disabled = false;
    this.isRecording = false;
    this.tryAgainBtn.classList.remove('hidden');

    if (!data.found) {
      this.setStatus("😕 Couldn't identify it — try again!", 'error');
      return;
    }

    this.setStatus('✅ Song found!', 'success');

    document.getElementById('song-title').textContent  = data.title  || '—';
    document.getElementById('song-artist').textContent = data.artist || '—';
    document.getElementById('song-album').textContent  = data.album  || '—';
    document.getElementById('song-genre').textContent  = data.genre  || '—';

    const coverArt = document.getElementById('cover-art');
    if (data.cover_art) {
      coverArt.src = data.cover_art;
      coverArt.style.display = 'block';
    } else {
      coverArt.style.display = 'none';
    }

    const link = document.getElementById('shazam-link');
    if (data.shazam_url) {
      link.href = data.shazam_url;
      link.classList.remove('hidden');
    } else {
      link.classList.add('hidden');
    }

    this.resultCard.classList.remove('hidden');
    this.resultCard.classList.add('visible');
  }

  /* ── Reset UI ────────────────────────────────────────────────────── */
  reset() {
    this.setStatus('Press to start', 'idle');
    this.resultCard.classList.add('hidden');
    this.resultCard.classList.remove('visible');
    this.tryAgainBtn.classList.add('hidden');
    this.recordBtn.disabled = false;
    this.isRecording = false;
  }

  setStatus(text, state) {
    this.statusText.textContent = text;
    this.statusText.className   = `status ${state}`;
  }
}

document.addEventListener('DOMContentLoaded', () => new SongIdentifier());
