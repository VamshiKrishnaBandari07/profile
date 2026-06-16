"""CMS backend — save photos & site data directly from the portfolio editor."""

import json
import shutil
import uuid
from pathlib import Path

from fastapi import FastAPI, File, Form, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
GALLERY = PUBLIC / "assets" / "gallery"
DATA_FILE = PUBLIC / "site-data.json"

app = FastAPI(title="Portfolio CMS")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_data() -> dict:
    if DATA_FILE.exists():
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    return {"profile": {}, "about": {}, "highlights": []}


def save_data(data: dict) -> None:
    for h in data.get("highlights", []):
        if h.get("photos"):
            h["photos"] = [{**p, "src": p["src"]} for p in h["photos"] if p.get("src")]
            if h["photos"]:
                h["image"] = h["photos"][0]["src"]
    DATA_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


@app.get("/api/health")
def health():
    return {"ok": True, "mode": "cms"}


@app.get("/api/site-data")
def get_site_data():
    return load_data()


@app.put("/api/site-data")
async def put_site_data(request: Request):
    payload = await request.json()
    save_data(payload)
    return {"ok": True}


@app.post("/api/upload")
async def upload_photo(
    album: str = Form(...),
    caption: str = Form(""),
    file: UploadFile = File(...),
):
    if not album.replace("-", "").isalnum():
        return JSONResponse(status_code=400, content={"detail": "Invalid album id"})
    folder = GALLERY / album
    folder.mkdir(parents=True, exist_ok=True)
    ext = Path(file.filename or "photo.jpg").suffix.lower()
    if ext not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        ext = ".jpg"
    name = f"{uuid.uuid4().hex[:8]}{ext}"
    dest = folder / name
    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    base = "/profile/assets/gallery"
    src = f"{base}/{album}/{name}"

    if album == "profile":
        profile_dest = PUBLIC / "assets" / "profile.jpg"
        shutil.copy2(dest, profile_dest)
        data = load_data()
        data.setdefault("profile", {})["photo"] = "/profile/assets/profile.jpg"
        save_data(data)

    return {"src": src, "caption": caption or file.filename}


@app.delete("/api/photo")
def delete_photo(album: str, file: str):
    path = GALLERY / album / file
    if path.exists() and path.is_file():
        path.unlink()
        return {"ok": True}
    return JSONResponse(status_code=404, content={"detail": "Not found"})


if __name__ == "__main__":
    GALLERY.mkdir(parents=True, exist_ok=True)
    uvicorn.run(app, host="127.0.0.1", port=8788)
