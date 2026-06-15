import { initScene } from "./scene3d.js";
import { highlights, projects, timeline } from "./data.js";
import "./style.css";

// 3D background
initScene(document.getElementById("bg-canvas"));

// Nav scroll + mobile
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

// Intersection observer for reveal
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("reveal--visible")),
  { threshold: 0.12 }
);
document.querySelectorAll(".section, .gallery__item, .card, .timeline__item").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

// Highlights gallery
const gallery = document.getElementById("gallery");
highlights.forEach((h, i) => {
  const el = document.createElement("article");
  el.className = "gallery__item";
  el.style.animationDelay = `${i * 0.1}s`;
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
