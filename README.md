# Academic Audience Simulator (MVP)

A lightweight, fun prototype that simulates five audience members for short (≤10 minute) academic talks.

## Features

- Five audience personas with live reaction states.
- 10-minute session timer with start/pause/reset controls.
- Optional interruptions toggle.
- Academic-style question generation on demand.

## Quick start

```bash
cd app
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## Notes

- The live transcript box is optional; adding clarity cues like "in summary" or uncertainty cues like "maybe" will influence reactions.
- This is a front-end-only prototype and uses simple heuristics rather than AI models.
