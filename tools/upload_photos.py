"""Bulk LinkedIn photo import — drop multiple photos per album folder."""

import json
import shutil
import webbrowser
from pathlib import Path

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
import uvicorn

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "public" / "assets"
GALLERY = ASSETS / "gallery"
MANIFEST = GALLERY / "manifest.json"

ALBUMS = {
    "profile": {"label": "Profile headshot", "max": 1},
    "parliament": {"label": "Parliament AI Showcase", "max": 8},
    "london-tech": {"label": "London Tech & Innovation", "max": 8},
    "frc-hackathon": {"label": "FRC & ODI Hackathon", "max": 8},
    "donorlink": {"label": "DonorLink / Healthcare AI", "max": 8},
}

LINKEDIN = "https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/recent-activity/all/"

app = FastAPI(title="LinkedIn Photo Import")

PAGE = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Import LinkedIn Photos</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #04060d; color: #eef2f8; padding: 2rem; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 1.6rem; margin-bottom: 0.35rem; }
    .sub { color: #8892a4; margin-bottom: 1.5rem; line-height: 1.6; }
    .step { background: #0a0e18; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 1.25rem; margin-bottom: 1rem; }
    .step h2 { font-size: 0.8rem; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
    .album { margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .album:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .album label { display: block; font-weight: 600; margin-bottom: 0.25rem; }
    .album small { color: #6b7280; display: block; margin-bottom: 0.5rem; font-size: 0.85rem; }
    input[type=file] { width: 100%; color: #9ca3af; padding: 0.5rem; border: 1px dashed rgba(59,130,246,0.4); border-radius: 8px; }
    .btn-row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin: 0.75rem 0; }
    .link-btn {
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      color: white; text-decoration: none; padding: 0.55rem 1rem; border-radius: 8px;
      font-size: 0.85rem; font-weight: 600;
    }
    button[type=submit] {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white; border: none; padding: 0.9rem 1.5rem; border-radius: 10px;
      font-weight: 700; cursor: pointer; width: 100%; margin-top: 1rem; font-size: 1rem;
    }
    #status { margin-top: 1rem; padding: 1rem; border-radius: 8px; display: none; line-height: 1.5; }
    #status.ok { display: block; background: #064e3b; color: #6ee7b7; }
    #status.err { display: block; background: #7f1d1d; color: #fca5a5; }
    .tip { font-size: 0.85rem; color: #8892a4; margin-top: 0.5rem; }
  </style>
</head>
<body>
  <h1>Import LinkedIn Photos → 3D Portfolio</h1>
  <p class="sub">Open LinkedIn, save photos from your posts, then drop <strong>multiple files</strong> into each album. They auto-install into your 3D gallery.</p>

  <div class="step">
    <h2>Step 1 — LinkedIn (stay logged in)</h2>
    <div class="btn-row">
      <a class="link-btn" href="https://www.linkedin.com/in/vamshi-krishna-bandari-623580212" target="_blank">Profile</a>
      <a class="link-btn" href="https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_ai-aidevelopment-aiadoption-activity-7449937731247542273-tCUW" target="_blank">Parliament</a>
      <a class="link-btn" href="https://www.linkedin.com/posts/vamshi-krishna-bandari-623580212_frchackthon-ai-fintech-activity-7443460515583934464-_NxX" target="_blank">Hackathon</a>
      <a class="link-btn" href="https://www.linkedin.com/in/vamshi-krishna-bandari-623580212/recent-activity/all/" target="_blank">All Posts</a>
    </div>
    <p class="tip">Right-click each post image → <strong>Save image as…</strong> → then upload below.</p>
  </div>

  <form id="form" class="step" enctype="multipart/form-data">
    <h2>Step 2 — Upload multiple photos per album</h2>

    <div class="album">
      <label>Profile photo</label>
      <small>1 headshot from LinkedIn profile</small>
      <input type="file" name="profile" accept="image/*" />
    </div>
    <div class="album">
      <label>Parliament / Healthcare AI</label>
      <small>All photos from Westminster showcase post(s)</small>
      <input type="file" name="parliament" accept="image/*" multiple />
    </div>
    <div class="album">
      <label>London Tech & Innovation</label>
      <small>Tech summits, networking events, London photos</small>
      <input type="file" name="london-tech" accept="image/*" multiple />
    </div>
    <div class="album">
      <label>FRC Hackathon</label>
      <small>FRC & ODI Innovation Sprint photos</small>
      <input type="file" name="frc-hackathon" accept="image/*" multiple />
    </div>
    <div class="album">
      <label>DonorLink / Projects</label>
      <small>DonorLink, KidneyX, or project screenshots</small>
      <input type="file" name="donorlink" accept="image/*" multiple />
    </div>

    <button type="submit">Install photos into 3D portfolio</button>
    <div id="status"></div>
  </form>

  <script>
    document.getElementById('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const status = document.getElementById('status');
      status.className = '';
      try {
        const res = await fetch('/import', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Import failed');
        status.className = 'ok';
        status.innerHTML = 'Installed <strong>' + data.total + '</strong> photos:<br>' +
          data.saved.map(s => '• ' + s).join('<br>') +
          '<br><br>Run: <code>npm run dev</code> to preview · then push to GitHub';
      } catch (err) {
        status.className = 'err';
        status.textContent = err.message;
      }
    });
  </script>
</body>
</html>
"""


def save_album_files(album: str, files: list[UploadFile]) -> list[str]:
    folder = GALLERY / album
    folder.mkdir(parents=True, exist_ok=True)
    saved = []
    for i, f in enumerate(files, start=1):
        if not f.filename:
            continue
        ext = Path(f.filename).suffix.lower() or ".jpg"
        if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
            ext = ".jpg"
        dest = folder / f"{i:02d}{ext}"
        with dest.open("wb") as out:
            shutil.copyfileobj(f.file, out)
        saved.append(str(dest.relative_to(ROOT)).replace("\\", "/"))
    if album == "profile" and saved:
        shutil.copy2(folder / list(folder.glob("*"))[0], ASSETS / "profile.jpg")
        gallery_profile = GALLERY / "profile" / "01.jpg"
        gallery_profile.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ASSETS / "profile.jpg", gallery_profile)
    return saved


def write_manifest() -> dict:
    manifest = {}
    for album in ALBUMS:
        folder = GALLERY / album
        if not folder.exists():
            continue
        files = sorted(
            [p.name for p in folder.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}]
        )
        if files:
            manifest[album] = files
    MANIFEST.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


@app.get("/", response_class=HTMLResponse)
async def index():
    return PAGE


@app.post("/import")
async def import_photos(
    profile: UploadFile | None = File(None),
    parliament: list[UploadFile] = File(default=[]),
    london_tech: list[UploadFile] = File(default=[], alias="london-tech"),
    frc_hackathon: list[UploadFile] = File(default=[], alias="frc-hackathon"),
    donorlink: list[UploadFile] = File(default=[]),
):
    saved = []
    if profile and profile.filename:
        saved.extend(save_album_files("profile", [profile]))
    if parliament:
        saved.extend(save_album_files("parliament", parliament))
    if london_tech:
        saved.extend(save_album_files("london-tech", london_tech))
    if frc_hackathon:
        saved.extend(save_album_files("frc-hackathon", frc_hackathon))
    if donorlink:
        saved.extend(save_album_files("donorlink", donorlink))

    if not saved:
        return JSONResponse(status_code=400, content={"detail": "No files selected — pick photos from each album"})

    manifest = write_manifest()
    return {"saved": saved, "total": len(saved), "manifest": manifest}


if __name__ == "__main__":
    GALLERY.mkdir(parents=True, exist_ok=True)
    webbrowser.open(LINKEDIN)
    webbrowser.open("http://127.0.0.1:8787")
    uvicorn.run(app, host="127.0.0.1", port=8787)
