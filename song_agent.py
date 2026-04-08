#!/usr/bin/env python3
"""
Song Identifier Agent
Records a few seconds of the user singing/humming and identifies the song
using Shazam, with Claude orchestrating the conversation.
"""

import asyncio
import json
import os
import tempfile
import time

import wave

import anthropic
import numpy as np
import sounddevice as sd
from shazamio import Shazam

# ── Audio settings ────────────────────────────────────────────────────────────
SAMPLE_RATE = 44100   # Hz
CHANNELS = 1          # mono is enough for recognition
DEFAULT_DURATION = 5  # seconds

# ── Claude client ─────────────────────────────────────────────────────────────
client = anthropic.Anthropic()

# ── Tool definitions ──────────────────────────────────────────────────────────
TOOLS = [
    {
        "name": "record_audio",
        "description": (
            "Records audio from the user's microphone for a given number of seconds. "
            "Returns the path to the saved WAV file."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "duration_seconds": {
                    "type": "number",
                    "description": "How many seconds to record (default: 5, max: 15).",
                }
            },
            "required": [],
        },
    },
    {
        "name": "identify_song",
        "description": (
            "Sends a WAV file to Shazam's music-recognition service and returns "
            "the identified song title, artist, album, genre, and a link."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "file_path": {
                    "type": "string",
                    "description": "Absolute path to the WAV file to identify.",
                }
            },
            "required": ["file_path"],
        },
    },
]

# ── Tool implementations ──────────────────────────────────────────────────────

def record_audio(duration_seconds: float = DEFAULT_DURATION) -> dict:
    """Record from the default microphone, save to a temp WAV, return its path."""
    duration_seconds = min(max(float(duration_seconds), 1), 15)

    print(f"\n🎤  Get ready — recording for {duration_seconds:.0f} seconds…")
    for countdown in range(3, 0, -1):
        print(f"    {countdown}…")
        time.sleep(0.6)
    print("    GO! 🎵  Sing or hum now!\n")

    audio = sd.rec(
        frames=int(duration_seconds * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=CHANNELS,
        dtype=np.int16,
    )
    sd.wait()  # block until recording is done
    print("✅  Recording finished!\n")

    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    tmp.close()
    with wave.open(tmp.name, "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(2)  # int16 = 2 bytes
        wf.setframerate(SAMPLE_RATE)
        wf.writeframes(audio.tobytes())

    return {"file_path": tmp.name, "duration_seconds": duration_seconds}


async def _shazam_recognize(file_path: str) -> dict:
    shazam = Shazam()
    return await shazam.recognize(file_path)


def identify_song(file_path: str) -> dict:
    """Run Shazam recognition on a WAV file and return structured results."""
    if not os.path.isfile(file_path):
        return {"found": False, "error": f"File not found: {file_path}"}

    try:
        result = asyncio.run(_shazam_recognize(file_path))
    except Exception as exc:
        return {"found": False, "error": str(exc)}
    finally:
        # Clean up the temp file regardless of outcome
        try:
            os.unlink(file_path)
        except OSError:
            pass

    if not result or "track" not in result:
        return {"found": False, "message": "Shazam could not identify the song."}

    track = result["track"]

    # Extract album from metadata section when available
    album = "Unknown"
    for section in track.get("sections", []):
        for meta in section.get("metadata", []):
            if meta.get("title", "").lower() == "album":
                album = meta.get("text", "Unknown")
                break

    return {
        "found": True,
        "title": track.get("title", "Unknown"),
        "artist": track.get("subtitle", "Unknown"),
        "album": album,
        "genre": track.get("genres", {}).get("primary", "Unknown"),
        "shazam_url": track.get("url", ""),
    }


def execute_tool(name: str, tool_input: dict) -> str:
    """Dispatch a tool call and return a JSON string result."""
    if name == "record_audio":
        result = record_audio(tool_input.get("duration_seconds", DEFAULT_DURATION))
    elif name == "identify_song":
        result = identify_song(tool_input["file_path"])
    else:
        result = {"error": f"Unknown tool: {name}"}
    return json.dumps(result)


# ── Agent loop ────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are an enthusiastic song-identification assistant called SongBot.

Your workflow whenever a user wants to identify a song:
1. Tell the user to get ready, then call record_audio (default 5 seconds).
2. Pass the returned file_path directly to identify_song.
3. If a song was found, present the result in a friendly format:
   🎵  "<title>" by <artist>
   📀  Album: <album>  |  Genre: <genre>
   🔗  <shazam_url>
4. If nothing was found, encourage the user to try again (perhaps louder or
   with more of the melody) and offer to record again.

Always be upbeat and supportive. Keep responses concise."""


def run_agent():
    print("=" * 50)
    print("   🎵  Song Identifier — powered by Claude + Shazam")
    print("=" * 50)
    print("Hum, sing, or whistle a tune and I'll tell you what it is!")
    print("Type  'quit'  or  'exit'  to stop.\n")

    messages: list[dict] = []

    # Seed the conversation so Claude immediately offers to start
    user_input = input("You: ").strip()
    if user_input.lower() in ("quit", "exit"):
        return

    messages.append({"role": "user", "content": user_input})

    while True:
        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
        )

        # Append the full assistant response (content blocks) to history
        messages.append({"role": "assistant", "content": response.content})

        # Print any text blocks the assistant produced before tool calls
        for block in response.content:
            if block.type == "text" and block.text.strip():
                print(f"\nSongBot: {block.text}\n")

        if response.stop_reason == "tool_use":
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    print(f"[Tool: {block.name}]")
                    result_str = execute_tool(block.name, block.input)
                    tool_results.append(
                        {
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result_str,
                        }
                    )

            messages.append({"role": "user", "content": tool_results})
            # Loop back so Claude can react to the tool results

        elif response.stop_reason == "end_turn":
            # Ask if the user wants to try another song
            print()
            user_input = input("You: ").strip()
            if not user_input or user_input.lower() in ("quit", "exit", "no", "nope"):
                print("\nSongBot: Thanks for using Song Identifier! 🎵 Goodbye!\n")
                break
            messages.append({"role": "user", "content": user_input})

        else:
            # Unexpected stop reason — just break
            break


if __name__ == "__main__":
    run_agent()
