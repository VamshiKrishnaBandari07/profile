import { initScene } from "./scene3d.js";
import { initPhoto3D } from "./photo3d.js";
import { initGallery } from "./gallery.js";
import {
  profile,
  stats,
  skills,
  highlights,
  getAllPhotos,
  projects,
  timeline,
  achievements,
  certifications,
} from "./data.js";
import "./style.css";

const allPhotos = getAllPhotos(highlights);
const photoUrls = allPhotos.map((p) => p.src);

initScene(document.getElementById("bg-canvas"), photoUrls);
initGallery(highlights, allPhotos);

// Interactive 3D photo ring
const photoCanvas = document.getElementById("photo-3d-canvas");
if (photoCanvas) {
  initPhoto3D(photoCanvas, allPhotos, (photo) => {
    const idx = allPhotos.findIndex((p) => p.id === photo.id);
    document.getElementById("highlights")?.scrollIntoView({ behavior: "smooth" });
    if (idx >= 0) {
      document.querySelector(".lightbox")?.classList.add("lightbox--open");
      document.body.style.overflow = "hidden";
      const lb = document.getElementById("lightbox");
      if (lb) {
        lb.querySelector(".lightbox__img").src = photo.src;
        lb.querySelector(".lightbox__title").textContent = photo.title;
        lb.querySelector(".lightbox__caption").textContent = photo.caption;
        lb.querySelector(".lightbox__meta").textContent = `${photo.date} · ${photo.location}`;
        lb.querySelector(".lightbox__link").href = photo.linkedin;
        lb.querySelector(".lightbox__counter").textContent = `${idx + 1} / ${allPhotos.length}`;
      }
    }
  });
}

// ─── Nav & scroll ───
const nav = document.getElementById("nav");
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");
const progress = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
  nav.classList.toggle("nav--scrolled", window.scrollY > 40);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (progress && h > 0) progress.style.width = `${(window.scrollY / h) * 100}%`;
});

toggle?.addEventListener("click", () => links.classList.toggle("nav__links--open"));
links.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => links.classList.remove("nav__links--open"));
});

// Scroll spy
const sections = document.querySelectorAll("section[id]");
const navAnchors = links?.querySelectorAll("a[href^='#']") || [];
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navAnchors.forEach((a) => {
        a.classList.toggle("nav__link--active", a.getAttribute("href") === `#${e.target.id}`);
      });
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => spy.observe(s));

// Reveal animation
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("reveal--visible")),
  { threshold: 0.08 }
);
document
  .querySelectorAll(".section, .card, .timeline__item, .achievement, .cert-card, .skill-bar, .hero__stat")
  .forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });

// Animated stat counters
const statsEl = document.getElementById("hero-stats");
stats.forEach((s) => {
  const el = document.createElement("div");
  el.className = "hero__stat reveal";
  el.innerHTML = `<strong data-target="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</strong><span>${s.label}</span>`;
  statsEl?.appendChild(el);
});

const counterObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const strong = e.target.querySelector("strong");
      const target = +strong.dataset.target;
      const suffix = strong.dataset.suffix || "";
      let current = 0;
      const step = Math.ceil(target / 40);
      const tick = () => {
        current = Math.min(current + step, target);
        strong.textContent = current + suffix;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      counterObs.unobserve(e.target);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".hero__stat").forEach((el) => counterObs.observe(el));

// Skills bars
const skillsEl = document.getElementById("skills-bars");
skills.forEach((s) => {
  const el = document.createElement("div");
  el.className = "skill-bar reveal";
  el.innerHTML = `
    <div class="skill-bar__head"><span>${s.name}</span><span>${s.level}%</span></div>
    <div class="skill-bar__track"><div class="skill-bar__fill" data-level="${s.level}"></div></div>
  `;
  skillsEl?.appendChild(el);
});

const skillObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const fill = e.target.querySelector(".skill-bar__fill");
      fill.style.width = `${fill.dataset.level}%`;
      skillObs.unobserve(e.target);
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll(".skill-bar").forEach((el) => skillObs.observe(el));

// Achievements
const achievementsGrid = document.getElementById("achievements-grid");
achievements.forEach((a) => {
  const el = document.createElement("article");
  el.className = "achievement glass reveal";
  el.innerHTML = `
    <div class="achievement__metric">${a.metric}</div>
    <h3 class="achievement__label">${a.label}</h3>
    <p class="achievement__detail">${a.detail}</p>
  `;
  achievementsGrid?.appendChild(el);
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
  certFilters?.appendChild(btn);
});

function renderCerts(filter = "All") {
  certGrid.innerHTML = "";
  const filtered = filter === "All" ? certifications : certifications.filter((c) => c.category === filter);
  filtered.forEach((c) => {
    const el = document.createElement("article");
    el.className = "cert-card reveal";
    el.innerHTML = `
      <span class="cert-card__category">${c.category}</span>
      <h3 class="cert-card__name">${c.name}</h3>
      <p class="cert-card__issuer">${c.issuer}</p>
      <time class="cert-card__date">${c.date}</time>
      <a href="${c.link}" target="_blank" rel="noopener" class="cert-card__link">Verify →</a>
    `;
    certGrid.appendChild(el);
    observer.observe(el);
  });
}

renderCerts();

certFilters?.addEventListener("click", (e) => {
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
  el.className = "card reveal";
  const imgBlock = p.image
    ? `<div class="card__image"><img src="${p.image}" alt="${p.title}" loading="lazy" /></div>`
    : `<div class="card__image card__image--placeholder"><span>${p.stack[0]}</span></div>`;
  el.innerHTML = `
    ${imgBlock}
    <div class="card__body">
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="card__stack">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div>
      <a href="${p.link}" target="_blank" rel="noopener">Repository →</a>
    </div>
  `;
  projectsEl?.appendChild(el);
});

// Timeline
const timelineEl = document.getElementById("timeline");
timeline.forEach((t) => {
  const el = document.createElement("article");
  el.className = "timeline__item reveal";
  el.innerHTML = `
    <div class="timeline__period">${t.period}</div>
    <div class="timeline__content">
      <h3>${t.role}</h3>
      <h4>${t.org}</h4>
      <p>${t.detail}</p>
    </div>
  `;
  timelineEl?.appendChild(el);
});

// Smooth scroll
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

// Profile photo in hero
const heroPhoto = document.getElementById("hero-photo");
if (heroPhoto) {
  heroPhoto.src = profile.photo;
  heroPhoto.alt = profile.name;
}
