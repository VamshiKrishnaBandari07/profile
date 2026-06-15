"""Local photo upload server — saves LinkedIn photos to portfolio assets."""

import shutil
import webbrowser
from pathlib import Path

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "public" / "assets"
HIGHLIGHTS = ASSETS / "highlights"

SLOTS = {
    "profile": ASSETS / "profile.jpg",
    "parliament": HIGHLIGHTS / "parliament.jpg",
    "london-tech": HIGHLIGHTS / "london-tech.jpg",
    "frc-hackathon": HIGHLIGHTS / "frc-hackathon.jpg",
    "donorlink": HIGHLIGHTS / "donorlink.jpg",
}

LINKEDIN_POSTS = {
    "parliament": "https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_ai-aidevelopment-aiadoption-activity-7449937731247542273-tCUW",
    "frc-hackathon": "https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_frchackthon-ai-fintech-activity-7443460515583934464-_NxX",
    "profile": "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212",
    "all-posts": "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/recent-activity/all/",
}

app = FastAPI(title="DonorLink Photo Upload")

UPLOAD_PAGE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Upload LinkedIn Photos</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0a0f1a; color: #e8edf5; padding: 2rem; max-width: 720px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    p { color: #8b95a8; margin-bottom: 1.5rem; line-height: 1.6; }
    .step { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }
    .step h2 { font-size: 0.85rem; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; }
    .slot { margin-bottom: 1.25rem; }
    .slot label { display: block; font-weight: 600; margin-bottom: 0.35rem; }
    .slot small { color: #6b7280; display: block; margin-bottom: 0.5rem; }
    input[type=file] { width: 100%; color: #9ca3af; }
    .preview { margin-top: 0.5rem; max-width: 200px; border-radius: 8px; display: none; }
    button, .link-btn {
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px;
      font-weight: 600; cursor: pointer; width: 100%; margin-top: 1rem; font-size: 1rem;
    }
    .link-btn { display: inline-block; text-align: center; text-decoration: none; margin: 0.25rem 0.25rem 0.25rem 0; width: auto; padding: 0.5rem 1rem; font-size: 0.85rem; }
    .links { margin: 0.75rem 0; }
    #status { margin-top: 1rem; padding: 1rem; border-radius: 8px; display: none; }
    #status.ok { display: block; background: #064e3b; color: #6ee7b7; }
    #status.err { display: block; background: #7f1d1d; color: #fca5a5; }
  </style>
</head>
<body>
  <h1>Upload Your Real LinkedIn Photos</h1>
  <p>LinkedIn blocks automatic downloads. Save each photo from your posts, then upload here — files go directly into your portfolio.</p>

  <div class="step">
    <h2>Step 1 — Open LinkedIn</h2>
    <div class="links">
      <a class="link-btn" href="https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_ai-aidevelopment-aiadoption-activity-7449937731247542273-tCUW" target="_blank">Parliament Post</a>
      <a class="link-btn" href="https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_frchackthon-ai-fintech-activity-7443460515583934464-_NxX" target="_blank">FRC Hackathon</a>
      <a class="link-btn" href="https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/recent-activity/all/" target="_blank">All Posts</a>
      <a class="link-btn" href="https://www.linkedin.com/in/vamshi-krishna-bandari-623580212" target="_blank">Profile Photo</a>
    </div>
    <p style="font-size:0.85rem;margin:0">Right-click each image → <strong>Save image as…</strong></p>
  </div>

  <form id="form" class="step">
    <h2>Step 2 — Upload saved photos</h2>

    <div class="slot">
      <label>Profile photo → profile.jpg</label>
      <small>Your headshot from LinkedIn profile</small>
      <input type="file" name="profile" accept="image/*" data-preview="prev-profile" />
      <img id="prev-profile" class="preview" />
    </div>

    <div class="slot">
      <label>Parliament AI Showcase → parliament.jpg</label>
      <small>Photo from Westminster / Parliamentary Showcase post</small>
      <input type="file" name="parliament" accept="image/*" data-preview="prev-parliament" />
      <img id="prev-parliament" class="preview" />
    </div>

    <div class="slot">
      <label>London Tech / Innovation event → london-tech.jpg</label>
      <small>London Tech Summit or innovation event photo</small>
      <input type="file" name="london-tech" accept="image/*" data-preview="prev-london" />
      <img id="prev-london" class="preview" />
    </div>

    <div class="slot">
      <label>FRC Hackathon → frc-hackathon.jpg</label>
      <small>FRC & ODI Innovation Sprint photo</small>
      <input type="file" name="frc-hackathon" accept="image/*" data-preview="prev-frc" />
      <img id="prev-frc" class="preview" />
    </div>

    <div class="slot">
      <label>DonorLink project → donorlink.jpg</label>
      <small>Screenshot of DonorLink app or project</small>
      <input type="file" name="donorlink" accept="image/*" data-preview="prev-donor" />
      <img id="prev-donor" class="preview" />
    </div>

    <button type="submit">Save all photos to portfolio</button>
    <div id="status"></div>
  </form>

  <script>
    document.querySelectorAll('input[type=file]').forEach(inp => {
      inp.addEventListener('change', () => {
        const img = document.getElementById(inp.dataset.preview);
        if (inp.files[0]) {
          img.src = URL.createObjectURL(inp.files[0]);
          img.style.display = 'block';
        }
      });
    });

    document.getElementById('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const status = document.getElementById('status');
      status.className = '';
      status.style.display = 'none';
      try {
        const res = await fetch('/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (res.ok) {
          status.className = 'ok';
          status.textContent = 'Saved: ' + data.saved.join(', ') + '. Now run: git add public/assets && git commit -m \"Add real LinkedIn photos\" && git push';
        } else {
          throw new Error(data.detail || 'Upload failed');
        }
      } catch (err) {
        status.className = 'err';
        status.textContent = err.message;
      }
      status.style.display = 'block';
    });
  </script>
</body>
</html>
"""


@app.get("/", response_class=HTMLResponse)
async def index():
    return UPLOAD_PAGE


@app.post("/upload")
async def upload(
    profile: UploadFile | None = File(None),
    parliament: UploadFile | None = File(None),
    london_tech: UploadFile | None = File(None, alias="london-tech"),
    frc_hackathon: UploadFile | None = File(None, alias="frc-hackathon"),
    donorlink: UploadFile | None = File(None),
):
    saved = []
    mapping = {
        "profile": profile,
        "parliament": parliament,
        "london-tech": london_tech,
        "frc-hackathon": frc_hackathon,
        "donorlink": donorlink,
    }
    for slot, file in mapping.items():
        if file and file.filename:
            dest = SLOTS[slot]
            dest.parent.mkdir(parents=True, exist_ok=True)
            with dest.open("wb") as f:
                shutil.copyfileobj(file.file, f)
            saved.append(dest.name if slot == "profile" else f"highlights/{dest.name}")
    if not saved:
        return JSONResponse(status_code=400, content={"detail": "No files selected"})
    return {"saved": saved}


if __name__ == "__main__":
    ASSETS.mkdir(parents=True, exist_ok=True)
    HIGHLIGHTS.mkdir(parents=True, exist_ok=True)
    webbrowser.open("http://127.0.0.1:8787")
    uvicorn.run(app, host="127.0.0.1", port=8787)
