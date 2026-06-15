/** Advanced photo gallery — bento grid, spotlight, lightbox */

export function initGallery(highlights) {
  const spotlight = document.getElementById("spotlight");
  const bento = document.getElementById("bento-gallery");
  const filmstrip = document.getElementById("filmstrip");
  const filters = document.getElementById("photo-filters");
  const lightbox = document.getElementById("lightbox");

  if (!bento) return;

  const categories = ["All", ...new Set(highlights.map((h) => h.category))];
  let activeFilter = "All";
  let lightboxIndex = 0;
  let filtered = [...highlights];

  // Filter pills
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = `photo-filter${cat === "All" ? " photo-filter--active" : ""}`;
    btn.textContent = cat;
    btn.dataset.filter = cat;
    filters?.appendChild(btn);
  });

  filters?.addEventListener("click", (e) => {
    const btn = e.target.closest(".photo-filter");
    if (!btn) return;
    filters.querySelectorAll(".photo-filter").forEach((b) => b.classList.remove("photo-filter--active"));
    btn.classList.add("photo-filter--active");
    activeFilter = btn.dataset.filter;
    render();
  });

  function getFiltered() {
    return activeFilter === "All" ? highlights : highlights.filter((h) => h.category === activeFilter);
  }

  function renderSpotlight(item, index) {
    if (!spotlight) return;
    spotlight.innerHTML = `
      <div class="spotlight__visual" data-index="${index}">
        <img src="${item.image}" alt="${item.title}" onerror="this.src='${item.fallback}'" />
        <div class="spotlight__overlay">
          <span class="spotlight__category">${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.excerpt}</p>
          <div class="spotlight__meta">
            <time>${item.date} · ${item.location}</time>
            <a href="${item.linkedin}" target="_blank" rel="noopener">View on LinkedIn →</a>
          </div>
        </div>
        <button class="spotlight__expand" aria-label="Expand photo">⤢</button>
      </div>
      <div class="spotlight__thumbs" id="spotlight-thumbs"></div>
    `;

    const thumbs = spotlight.querySelector("#spotlight-thumbs");
    filtered.forEach((h, i) => {
      const t = document.createElement("button");
      t.className = `spotlight__thumb${i === index ? " spotlight__thumb--active" : ""}`;
      t.innerHTML = `<img src="${h.image}" alt="" onerror="this.src='${h.fallback}'" /><span>${h.category}</span>`;
      t.addEventListener("click", () => renderSpotlight(h, i));
      thumbs.appendChild(t);
    });

    spotlight.querySelector(".spotlight__visual")?.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      openLightbox(index);
    });
    spotlight.querySelector(".spotlight__expand")?.addEventListener("click", () => openLightbox(index));
  }

  function renderBento() {
    bento.innerHTML = "";
    filtered.forEach((h, i) => {
      const el = document.createElement("article");
      el.className = `bento__item bento__item--${h.bento} reveal`;
      el.dataset.index = i;
      el.innerHTML = `
        <div class="bento__image">
          <img src="${h.image}" alt="${h.title}" loading="lazy" onerror="this.src='${h.fallback}'" />
          <div class="bento__shine"></div>
        </div>
        <div class="bento__content">
          <span class="bento__badge">${h.category}</span>
          <h3>${h.title}</h3>
          <p>${h.excerpt}</p>
          <div class="bento__footer">
            <time>${h.date}</time>
            <div class="bento__tags">${h.tags.map((t) => `<span>${t}</span>`).join("")}</div>
          </div>
          <a href="${h.linkedin}" target="_blank" rel="noopener" class="bento__link">LinkedIn →</a>
        </div>
        <button class="bento__zoom" aria-label="View full size">⤢</button>
      `;

      el.querySelector(".bento__zoom")?.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(i);
      });
      el.addEventListener("click", (e) => {
        if (e.target.closest("a") || e.target.closest(".bento__zoom")) return;
        renderSpotlight(h, i);
        spotlight?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });

      bento.appendChild(el);
    });

    document.querySelectorAll(".bento__item.reveal").forEach((el) => {
      if (!el.classList.contains("reveal--visible")) {
        const obs = new IntersectionObserver(
          (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("reveal--visible")),
          { threshold: 0.08 }
        );
        obs.observe(el);
      }
    });
  }

  function renderFilmstrip() {
    if (!filmstrip) return;
    filmstrip.innerHTML = "";
    const items = [...highlights, ...highlights];
    items.forEach((h) => {
      const el = document.createElement("div");
      el.className = "filmstrip__item";
      el.innerHTML = `<img src="${h.image}" alt="${h.title}" onerror="this.src='${h.fallback}'" />`;
      filmstrip.appendChild(el);
    });
  }

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightbox();
    lightbox?.classList.add("lightbox--open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox?.classList.remove("lightbox--open");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    const item = filtered[lightboxIndex];
    if (!item || !lightbox) return;
    lightbox.querySelector(".lightbox__img").src = item.image;
    lightbox.querySelector(".lightbox__img").onerror = () => {
      lightbox.querySelector(".lightbox__img").src = item.fallback;
    };
    lightbox.querySelector(".lightbox__title").textContent = item.title;
    lightbox.querySelector(".lightbox__meta").textContent = `${item.date} · ${item.location}`;
    lightbox.querySelector(".lightbox__link").href = item.linkedin;
    lightbox.querySelector(".lightbox__counter").textContent = `${lightboxIndex + 1} / ${filtered.length}`;
  }

  lightbox?.querySelector(".lightbox__close")?.addEventListener("click", closeLightbox);
  lightbox?.querySelector(".lightbox__prev")?.addEventListener("click", () => {
    lightboxIndex = (lightboxIndex - 1 + filtered.length) % filtered.length;
    updateLightbox();
  });
  lightbox?.querySelector(".lightbox__next")?.addEventListener("click", () => {
    lightboxIndex = (lightboxIndex + 1) % filtered.length;
    updateLightbox();
  });
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("lightbox--open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightbox.querySelector(".lightbox__prev")?.click();
    if (e.key === "ArrowRight") lightbox.querySelector(".lightbox__next")?.click();
  });

  function render() {
    filtered = getFiltered();
    const featured = filtered.find((h) => h.featured) || filtered[0];
    const idx = filtered.indexOf(featured);
    renderSpotlight(featured, idx >= 0 ? idx : 0);
    renderBento();
  }

  renderFilmstrip();
  render();
}
