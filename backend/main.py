"""
Song Identifier — FastAPI backend
Accepts an audio upload and returns Shazam identification results.

Deploy to any Python host (Render, Railway, Fly.io …) then paste the
public URL into the frontend Settings panel.
"""

import os
import tempfile

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from shazamio import Shazam

app = FastAPI(title="Song Identifier API")

# Allow the GitHub Pages frontend (and localhost dev) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # tighten to your Pages URL in production
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "ok", "message": "Song Identifier API is running"}


@app.post("/identify")
async def identify(audio: UploadFile = File(...)):
    """
    Receive an audio file (webm / wav / mp3 …), run Shazam recognition,
    and return structured song metadata.
    """
    # Determine file extension from MIME type or filename
    content_type = audio.content_type or ""
    if "webm" in content_type:
        suffix = ".webm"
    elif "wav" in content_type:
        suffix = ".wav"
    elif "mp4" in content_type or "m4a" in content_type:
        suffix = ".m4a"
    elif "mpeg" in content_type or "mp3" in content_type:
        suffix = ".mp3"
    else:
        # Fall back to the uploaded filename extension
        _, ext = os.path.splitext(audio.filename or "audio.webm")
        suffix = ext or ".webm"

    # Save to a temporary file for shazamio
    tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
    try:
        contents = await audio.read()
        tmp.write(contents)
        tmp.flush()
        tmp.close()

        shazam = Shazam()
        result = await shazam.recognize(tmp.name)
    finally:
        try:
            os.unlink(tmp.name)
        except OSError:
            pass

    if not result or "track" not in result:
        return {"found": False}

    track = result["track"]

    # Extract album name from metadata sections
    album = "Unknown"
    for section in track.get("sections", []):
        for meta in section.get("metadata", []):
            if meta.get("title", "").lower() == "album":
                album = meta.get("text", "Unknown")
                break

    # Cover art (highest resolution available)
    images   = track.get("images", {})
    cover_art = images.get("coverarthq") or images.get("coverart") or ""

    return {
        "found":      True,
        "title":      track.get("title", "Unknown"),
        "artist":     track.get("subtitle", "Unknown"),
        "album":      album,
        "genre":      track.get("genres", {}).get("primary", "Unknown"),
        "shazam_url": track.get("url", ""),
        "cover_art":  cover_art,
    }
