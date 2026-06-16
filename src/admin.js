import { cmsAvailable, saveSiteData, uploadPhoto, photoCount } from "./store.js";
import "./admin.css";

let siteData = null;
let onRefresh = null;

export function initAdmin(data, refreshCallback) {
  siteData = data;
  onRefresh = refreshCallback;

  const fab = document.createElement("button");
  fab.className = "admin-fab";
  fab.type = "button";
  fab.innerHTML = "✎ Edit";
  fab.title = "Edit portfolio";
  document.body.appendChild(fab);

  const panel = document.createElement("div");
  panel.className = "admin-panel";
  panel.innerHTML = `
    <div class="admin-panel__head">
      <h2>Portfolio Editor</h2>
      <button type="button" class="admin-panel__close" aria-label="Close">×</button>
    </div>
    <div class="admin-panel__status" id="admin-status"></div>
    <div class="admin-panel__tabs">
      <button type="button" class="admin-tab admin-tab--active" data-tab="photos">Photos</button>
      <button type="button" class="admin-tab" data-tab="profile">Profile</button>
      <button type="button" class="admin-tab" data-tab="albums">Albums</button>
    </div>
    <div class="admin-panel__body" id="admin-body"></div>
    <div class="admin-panel__foot">
      <button type="button" class="admin-save" id="admin-save">Save & publish</button>
    </div>`;
  document.body.appendChild(panel);

  fab.addEventListener("click", () => {
    panel.classList.add("admin-panel--open");
    renderTab("photos");
    updateStatus();
  });
  panel.querySelector(".admin-panel__close").addEventListener("click", () => panel.classList.remove("admin-panel--open"));
  panel.querySelectorAll(".admin-tab").forEach((t) =>
    t.addEventListener("click", () => {
      panel.querySelectorAll(".admin-tab").forEach((b) => b.classList.remove("admin-tab--active"));
      t.classList.add("admin-tab--active");
      renderTab(t.dataset.tab);
    })
  );
  panel.querySelector("#admin-save").addEventListener("click", handleSave);
}

async function updateStatus() {
  const el = document.getElementById("admin-status");
  if (!el) return;
  const online = await cmsAvailable();
  el.className = `admin-panel__status ${online ? "admin-panel__status--ok" : "admin-panel__status--warn"}`;
  el.textContent = online
    ? "✓ Editor connected — changes save directly to your site files"
    : "⚠ Run start.bat for live saving · Preview-only mode";
}

function renderTab(tab) {
  const body = document.getElementById("admin-body");
  if (!body) return;
  if (tab === "photos") body.innerHTML = renderPhotosTab();
  if (tab === "profile") body.innerHTML = renderProfileTab();
  if (tab === "albums") body.innerHTML = renderAlbumsTab();
  bindTabEvents(tab);
}

function renderPhotosTab() {
  return siteData.highlights
    .map(
      (album) => `
    <div class="admin-album" data-id="${album.id}">
      <div class="admin-album__head">
        <strong>${album.title}</strong>
        <span>${album.photos?.length || 0} photos</span>
      </div>
      <div class="admin-drop" data-album="${album.id}">
        <input type="file" accept="image/*" multiple data-album="${album.id}" hidden />
        <p>Drop photos here or click to browse</p>
      </div>
      <div class="admin-photos" data-album="${album.id}">
        ${(album.photos || [])
          .map(
            (p, i) => `
          <div class="admin-photo" data-album="${album.id}" data-i="${i}">
            <img src="${p.src}" alt="" />
            <input type="text" value="${escapeHtml(p.caption || "")}" placeholder="Caption" data-cap />
            <button type="button" data-del aria-label="Remove">×</button>
          </div>`
          )
          .join("")}
      </div>
    </div>`
    )
    .join("");
}

function renderProfileTab() {
  const p = siteData.profile;
  return `
    <label class="admin-field">Name<input type="text" id="adm-name" value="${escapeHtml(p.name || "")}" /></label>
    <label class="admin-field">Tagline<textarea id="adm-tagline" rows="2">${escapeHtml(p.tagline || "")}</textarea></label>
    <label class="admin-field">Profile photo
      <div class="admin-drop admin-drop--sm" data-album="profile">
        <input type="file" accept="image/*" data-album="profile" hidden />
        <p>Click to change headshot</p>
      </div>
      <img class="admin-profile-preview" src="${p.photo}" alt="" />
    </label>`;
}

function renderAlbumsTab() {
  return `
    <button type="button" class="admin-add-album" id="adm-new-album">+ New album</button>
    ${siteData.highlights
      .map(
        (a, i) => `
      <div class="admin-album-edit" data-i="${i}">
        <label>Title<input type="text" data-f="title" value="${escapeHtml(a.title)}" /></label>
        <label>Category<input type="text" data-f="category" value="${escapeHtml(a.category)}" /></label>
        <label>Location<input type="text" data-f="location" value="${escapeHtml(a.location)}" /></label>
        <label>Date<input type="text" data-f="date" value="${escapeHtml(a.date)}" /></label>
        <label>Description<textarea data-f="excerpt" rows="2">${escapeHtml(a.excerpt || "")}</textarea></label>
        <button type="button" class="admin-del-album" data-i="${i}">Delete album</button>
      </div>`
      )
      .join("")}`;
}

function bindTabEvents(tab) {
  document.querySelectorAll(".admin-drop").forEach((zone) => {
    const album = zone.dataset.album;
    const input = zone.querySelector("input[type=file]");
    zone.addEventListener("click", () => input?.click());
    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("admin-drop--hover"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("admin-drop--hover"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("admin-drop--hover");
      handleFiles(album, [...e.dataTransfer.files]);
    });
    input?.addEventListener("change", () => handleFiles(album, [...input.files]));
  });

  document.querySelectorAll(".admin-photo [data-del]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".admin-photo");
      const album = siteData.highlights.find((h) => h.id === wrap.dataset.album);
      album.photos.splice(+wrap.dataset.i, 1);
      renderTab("photos");
    });
  });

  document.querySelectorAll(".admin-photo [data-cap]").forEach((inp) => {
    inp.addEventListener("input", () => {
      const wrap = inp.closest(".admin-photo");
      const album = siteData.highlights.find((h) => h.id === wrap.dataset.album);
      if (album?.photos[+wrap.dataset.i]) album.photos[+wrap.dataset.i].caption = inp.value;
    });
  });

  if (tab === "profile") {
    document.getElementById("adm-name")?.addEventListener("input", (e) => { siteData.profile.name = e.target.value; });
    document.getElementById("adm-tagline")?.addEventListener("input", (e) => { siteData.profile.tagline = e.target.value; });
  }

  if (tab === "albums") {
    document.querySelectorAll(".admin-album-edit").forEach((el) => {
      const i = +el.dataset.i;
      el.querySelectorAll("[data-f]").forEach((inp) => {
        inp.addEventListener("input", () => { siteData.highlights[i][inp.dataset.f] = inp.value; });
      });
    });
    document.getElementById("adm-new-album")?.addEventListener("click", () => {
      siteData.highlights.push({
        id: `album-${Date.now()}`,
        title: "New Event",
        location: "London, UK",
        date: "2026",
        category: "Event",
        featured: false,
        excerpt: "",
        tags: [],
        linkedin: siteData.profile.linkedin,
        photos: [],
      });
      renderTab("albums");
    });
    document.querySelectorAll(".admin-del-album").forEach((btn) => {
      btn.addEventListener("click", () => {
        siteData.highlights.splice(+btn.dataset.i, 1);
        renderTab("albums");
      });
    });
  }
}

async function handleFiles(albumId, files) {
  const album = siteData.highlights.find((h) => h.id === albumId) || siteData.highlights[0];
  if (albumId === "profile") {
    const file = files[0];
    if (!file) return;
    try {
      const res = await uploadPhoto("profile", file, "Profile");
      siteData.profile.photo = res.src.includes("profile.jpg") ? "/profile/assets/profile.jpg" : res.src;
    } catch {
      siteData.profile.photo = URL.createObjectURL(file);
    }
    document.querySelector(".admin-profile-preview")?.setAttribute("src", siteData.profile.photo);
    document.getElementById("hero-photo")?.setAttribute("src", siteData.profile.photo);
    return;
  }

  if (!album) return;
  album.photos = album.photos || [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    try {
      const res = await uploadPhoto(album.id, file, file.name);
      album.photos.push({ src: res.src, caption: res.caption || "" });
    } catch {
      album.photos.push({ src: URL.createObjectURL(file), caption: file.name, _blob: true });
    }
  }
  if (album.photos.length) album.image = album.photos[0].src;
  renderTab("photos");
  onRefresh?.(siteData);
}

async function handleSave() {
  const btn = document.getElementById("admin-save");
  btn.textContent = "Saving…";
  btn.disabled = true;
  try {
    await saveSiteData(siteData);
    btn.textContent = "Saved ✓";
    setTimeout(() => { btn.textContent = "Save & publish"; btn.disabled = false; onRefresh?.(siteData, true); }, 800);
  } catch (e) {
    btn.textContent = "Save failed";
    alert(e.message + "\n\nRun start.bat then open http://localhost:5173/profile/");
    btn.disabled = false;
    setTimeout(() => { btn.textContent = "Save & publish"; }, 2000);
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export function getEditableData() {
  return siteData;
}
