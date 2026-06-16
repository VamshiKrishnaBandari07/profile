import { initScene } from "./scene3d.js";
import { initPhoto3D } from "./photo3d.js";
import { initGallery } from "./gallery.js";
import { initAdmin } from "./admin.js";
import { loadSiteData, getAllPhotos, normalizeHighlights, photoCount } from "./store.js";
import {
  stats as defaultStats,
  skills,
  achievements,
  certifications,
  projects,
  timeline,
} from "./data.js";
import "./style.css";

let sceneCtx = null;
let photo3dCtx = null;
let galleryRefresh = null;

async function bootstrap() {
  const raw = await loadSiteData();
  const highlights = normalizeHighlights(raw.highlights || []);
  const profile = raw.profile || {};
  const about = raw.about || {};
  let allPhotos = getAllPhotos(highlights);

  applyProfile(profile);
  applyAbout(about);
  applyBadges(profile.badges || []);

  const stats = [
    { value: 13, suffix: "+", label: "AI Certifications" },
    { value: photoCount(highlights), suffix: "", label: "Photos & Moments" },
    { value: 40, suffix: "%", label: "Data Integrity Gain" },
    { value: highlights.length, suffix: "", label: "Event Albums" },
  ];

  refreshVisuals(highlights, allPhotos);
  renderStaticSections(stats);

  initAdmin({ profile, about, highlights }, (data, saved) => {
    const h = normalizeHighlights(data.highlights);
    const photos = getAllPhotos(h);
    applyProfile(data.profile);
    applyAbout(data.about);
    applyBadges(data.profile.badges || []);
    refreshVisuals(h, photos);
    if (saved) setTimeout(() => location.reload(), 600);
  });

  initPageUX();
}

function applyProfile(p) {
  const heroPhoto = document.getElementById("hero-photo");
  if (heroPhoto && p.photo) {
    heroPhoto.src = p.photo;
    heroPhoto.alt = p.name || "";
  }
  const title = document.querySelector(".hero__title");
  if (title && p.name) {
    const parts = p.name.split(" ");
    const last = parts.pop();
    title.innerHTML = `${parts.join(" ")} <em>${last}</em>`;
  }
  const sub = document.querySelector(".hero__subtitle");
  if (sub && p.tagline) sub.textContent = p.tagline;
  const eyebrow = document.querySelector(".hero__eyebrow");
  if (eyebrow && p.title) eyebrow.textContent = p.title;
}

function applyAbout(about) {
  const lead = document.querySelector(".about__lead");
  if (lead && about.lead) lead.textContent = about.lead;
  const grid = document.querySelector(".about__text");
  if (grid && about.paragraphs?.length) {
    grid.querySelectorAll("p:not(.about__lead)").forEach((el, i) => {
      if (about.paragraphs[i]) el.textContent = about.paragraphs[i];
    });
  }
}

function applyBadges(badges) {
  const wrap = document.querySelector(".hero__badges");
  if (!wrap || !badges.length) return;
  wrap.innerHTML = badges.map((b) => `<span class="hero__badge">${b}</span>`).join("");
}

function refreshVisuals(highlights, allPhotos) {
  const urls = allPhotos.map((p) => p.src);
  initScene(document.getElementById("bg-canvas"), urls);

  document.getElementById("photo-filters") && (document.getElementById("photo-filters").innerHTML = "");
  document.getElementById("spotlight") && (document.getElementById("spotlight").innerHTML = "");
  document.getElementById("photo-wall") && (document.getElementById("photo-wall").innerHTML = "");
  document.getElementById("filmstrip") && (document.getElementById("filmstrip").innerHTML = "");

  galleryRefresh = initGallery(highlights, allPhotos);

  const photoCanvas = document.getElementById("photo-3d-canvas");
  if (photoCanvas) {
    initPhoto3D(photoCanvas, allPhotos, openLightboxForPhoto);
  }
}

function openLightboxForPhoto(photo) {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.add("lightbox--open");
  document.body.style.overflow = "hidden";
  lb.querySelector(".lightbox__img").src = photo.src;
  lb.querySelector(".lightbox__title").textContent = photo.title;
  lb.querySelector(".lightbox__caption").textContent = photo.caption;
  lb.querySelector(".lightbox__meta").textContent = `${photo.date} · ${photo.location}`;
  lb.querySelector(".lightbox__link").href = photo.linkedin;
}

function renderStaticSections(stats) {
  const statsEl = document.getElementById("hero-stats");
  if (statsEl) {
    statsEl.innerHTML = "";
    stats.forEach((s) => {
      const el = document.createElement("div");
      el.className = "hero__stat reveal reveal--visible";
      el.innerHTML = `<strong>${s.value}${s.suffix}</strong><span>${s.label}</span>`;
      statsEl.appendChild(el);
    });
  }

  const skillsEl = document.getElementById("skills-bars");
  if (skillsEl && !skillsEl.children.length) {
    skills.forEach((s) => {
      const el = document.createElement("div");
      el.className = "skill-bar reveal";
      el.innerHTML = `
        <div class="skill-bar__head"><span>${s.name}</span><span>${s.level}%</span></div>
        <div class="skill-bar__track"><div class="skill-bar__fill" style="width:${s.level}%"></div></div>`;
      skillsEl.appendChild(el);
    });
  }

  const achievementsGrid = document.getElementById("achievements-grid");
  if (achievementsGrid && !achievementsGrid.children.length) {
    achievements.forEach((a) => {
      const el = document.createElement("article");
      el.className = "achievement glass reveal";
      el.innerHTML = `<div class="achievement__metric">${a.metric}</div><h3>${a.label}</h3><p>${a.detail}</p>`;
      achievementsGrid.appendChild(el);
    });
  }

  renderCerts();
  renderProjects();
  renderTimeline();
}

function renderCerts(filter = "All") {
  const certGrid = document.getElementById("certifications");
  const certFilters = document.getElementById("cert-filters");
  if (!certGrid) return;
  if (certFilters && !certFilters.children.length) {
    ["All", ...new Set(certifications.map((c) => c.category))].forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = `cert-filter${cat === "All" ? " cert-filter--active" : ""}`;
      btn.textContent = cat;
      btn.dataset.filter = cat;
      certFilters.appendChild(btn);
    });
    certFilters.addEventListener("click", (e) => {
      const btn = e.target.closest(".cert-filter");
      if (!btn) return;
      certFilters.querySelectorAll(".cert-filter").forEach((b) => b.classList.remove("cert-filter--active"));
      btn.classList.add("cert-filter--active");
      renderCerts(btn.dataset.filter);
    });
  }
  certGrid.innerHTML = "";
  const filtered = filter === "All" ? certifications : certifications.filter((c) => c.category === filter);
  filtered.forEach((c) => {
    const el = document.createElement("article");
    el.className = "cert-card reveal";
    el.innerHTML = `
      <span class="cert-card__category">${c.category}</span>
      <h3>${c.name}</h3>
      <p class="cert-card__issuer">${c.issuer}</p>
      <time>${c.date}</time>
      <a href="${c.link}" target="_blank" rel="noopener">Verify →</a>`;
    certGrid.appendChild(el);
  });
}

function renderProjects() {
  const el = document.getElementById("projects");
  if (!el || el.children.length) return;
  projects.forEach((p) => {
    const card = document.createElement("article");
    card.className = "card card--project reveal";
    const imgBlock = p.image
      ? `<div class="card__image"><img src="${p.image}" alt="${p.title}" loading="lazy" /></div>`
      : `<div class="card__image card__image--placeholder"><span>${(p.category || p.stack[0]).split("·")[0].trim()}</span></div>`;
    card.innerHTML = `
      ${imgBlock}
      <div class="card__body">
        <div class="card__meta">
          <span class="card__category">${p.category || "Project"}</span>
          <time class="card__period">${p.period || ""}</time>
        </div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="card__stack">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div>
        <a href="${p.link}" target="_blank" rel="noopener">${p.link.includes("linkedin") ? "View on LinkedIn →" : "View project →"}</a>
      </div>`;
    el.appendChild(card);
  });
}

function renderTimeline() {
  const el = document.getElementById("timeline");
  if (!el || el.children.length) return;
  timeline.forEach((t) => {
    const item = document.createElement("article");
    item.className = "timeline__item reveal";
    item.innerHTML = `
      <div class="timeline__period">${t.period}</div>
      <div class="timeline__content"><h3>${t.role}</h3><h4>${t.org}</h4><p>${t.detail}</p></div>`;
    el.appendChild(item);
  });
}

function initPageUX() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  const progress = document.getElementById("scroll-progress");

  window.addEventListener("scroll", () => {
    nav?.classList.toggle("nav--scrolled", window.scrollY > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && h > 0) progress.style.width = `${(window.scrollY / h) * 100}%`;
  });

  toggle?.addEventListener("click", () => links?.classList.toggle("nav__links--open"));
  links?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => links?.classList.remove("nav__links--open")));

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth" }); }
    });
  });

  const lb = document.getElementById("lightbox");
  lb?.querySelector(".lightbox__close")?.addEventListener("click", () => {
    lb.classList.remove("lightbox--open");
    document.body.style.overflow = "";
  });
  lb?.addEventListener("click", (e) => { if (e.target === lb) { lb.classList.remove("lightbox--open"); document.body.style.overflow = ""; } });
}

bootstrap();
