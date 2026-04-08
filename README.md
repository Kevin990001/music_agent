# 🎵 Song Identifier Agent

Sing, hum, or whistle a tune — this app will tell you what song it is.

Built with **Claude AI** + **Shazam** for song recognition, available as both a CLI tool and a web app.

---

## How It Works

1. Record a few seconds of yourself singing or humming
2. Audio is sent to Shazam's recognition service
3. Claude presents the result with title, artist, album, and genre

---

## Project Structure

```
├── song_agent.py        # CLI agent (Claude + mic recording)
├── requirements.txt     # CLI dependencies
├── frontend/
│   ├── index.html       # Web app UI
│   ├── style.css        # Styling
│   └── app.js           # Recording + API logic
├── backend/
│   ├── main.py          # FastAPI server (wraps Shazam)
│   └── requirements.txt # Backend dependencies
└── .github/
    └── workflows/
        └── deploy-pages.yml  # Auto-deploys frontend to GitHub Pages
```

---

## CLI Usage

### 1. Install dependencies

```bash
brew install portaudio   # macOS — needed for sounddevice
pip install -r requirements.txt
```

### 2. Set your API key

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Run

```bash
python song_agent.py
```

---

## Web App

The frontend is deployed on **GitHub Pages** and talks to a FastAPI backend.

### Live site

```
https://kevin990001.github.io/music_agent/
```

### Run the backend locally

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Then open the web app, click **⚙️ Backend settings**, and enter `http://localhost:8000`.

### Deploy the backend (free)

1. Create a free account at [Render.com](https://render.com)
2. New Web Service → connect your repo → set root to `backend/`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Copy the public URL into the frontend Settings panel

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI orchestration | [Claude API](https://anthropic.com) (`claude-opus-4-6`) |
| Song recognition | [Shazam](https://shazam.com) via `shazamio` |
| CLI audio recording | `sounddevice` + `wave` |
| Web audio recording | Browser `MediaRecorder` API |
| Backend | FastAPI |
| Frontend hosting | GitHub Pages |
| CI/CD | GitHub Actions |
