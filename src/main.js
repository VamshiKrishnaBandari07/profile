import { initScene } from "./scene3d.js";
import { highlights, projects, timeline, achievements, certifications } from "./data.js";
import "./style.css";

initScene(document.getElementById("bg-canvas"));

const nav = document.getElementById("nav");
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");

window.addEventListener("scroll", () => {
  nav.classList.toggle("nav--scrolled", window.scrollY > 40);
});

toggle?.addEventListener("click", () => links.classList.toggle("nav__links--open"));
links.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => links.classList.remove("nav__links--open"));
});

const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("reveal--visible")),
  { threshold: 0.1 }
);
document
  .querySelectorAll(".section, .gallery__item, .card, .timeline__item, .achievement, .cert-card")
  .forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });

// Achievements
const achievementsGrid = document.getElementById("achievements-grid");
achievements.forEach((a) => {
  const el = document.createElement("article");
  el.className = "achievement glass";
  el.innerHTML = `
    <div class="achievement__metric">${a.metric}</div>
    <h3 class="achievement__label">${a.label}</h3>
    <p class="achievement__detail">${a.detail}</p>
  `;
  achievementsGrid.appendChild(el);
});

// Highlights gallery
const gallery = document.getElementById("gallery");
highlights.forEach((h, i) => {
  const el = document.createElement("article");
  el.className = "gallery__item";
  el.style.animationDelay = `${i * 0.08}s`;
  el.innerHTML = `
    <div class="gallery__image-wrap">
      <img src="${h.image}" alt="${h.title}" loading="lazy"
        onerror="this.src='${h.fallback}'" />
      <span class="gallery__badge">${h.category}</span>
    </div>
    <div class="gallery__body">
      <time>${h.date} · ${h.location}</time>
      <h3>${h.title}</h3>
      <p>${h.excerpt}</p>
      <div class="gallery__tags">${h.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      <a href="${h.linkedin}" target="_blank" rel="noopener" class="gallery__link">View on LinkedIn →</a>
    </div>
  `;
  gallery.appendChild(el);
});

// Certifications
const certGrid = document.getElementById("certifications");
const certFilters = document.getElementById("cert-filters");
const categories = ["All", ...new Set(certifications.map((c) => c.category))];

categories.forEach((cat) => {
  const btn = document.createElement("button");
  btn.className = `cert-filter${cat === "All" ? " cert-filter--active" : ""}`;
  btn.textContent = cat;
  btn.dataset.filter = cat;
  certFilters.appendChild(btn);
});

function renderCerts(filter = "All") {
  certGrid.innerHTML = "";
  const filtered = filter === "All" ? certifications : certifications.filter((c) => c.category === filter);
  filtered.forEach((c) => {
    const el = document.createElement("article");
    el.className = "cert-card";
    el.innerHTML = `
      <span class="cert-card__category">${c.category}</span>
      <h3 class="cert-card__name">${c.name}</h3>
      <p class="cert-card__issuer">${c.issuer}</p>
      <time class="cert-card__date">${c.date}</time>
      <a href="${c.link}" target="_blank" rel="noopener" class="cert-card__link">Verify →</a>
    `;
    certGrid.appendChild(el);
  });
}

renderCerts();

certFilters.addEventListener("click", (e) => {
  const btn = e.target.closest(".cert-filter");
  if (!btn) return;
  certFilters.querySelectorAll(".cert-filter").forEach((b) => b.classList.remove("cert-filter--active"));
  btn.classList.add("cert-filter--active");
  renderCerts(btn.dataset.filter);
});

// Projects
const projectsEl = document.getElementById("projects");
projects.forEach((p) => {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <h3>${p.title}</h3>
    <p>${p.desc}</p>
    <div class="card__stack">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div>
    <a href="${p.link}" target="_blank" rel="noopener">Repository →</a>
  `;
  projectsEl.appendChild(el);
});

// Timeline
const timelineEl = document.getElementById("timeline");
timeline.forEach((t) => {
  const el = document.createElement("article");
  el.className = "timeline__item";
  el.innerHTML = `
    <div class="timeline__period">${t.period}</div>
    <div class="timeline__content">
      <h3>${t.role}</h3>
      <h4>${t.org}</h4>
      <p>${t.detail}</p>
    </div>
  `;
  timelineEl.appendChild(el);
});

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#") return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
