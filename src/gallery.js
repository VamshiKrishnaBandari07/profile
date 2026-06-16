/** Clean single-view gallery — each photo appears once */

export function initGallery(highlights, allPhotos) {
  const grid = document.getElementById("gallery-grid");
  const filters = document.getElementById("photo-filters");
  const lightbox = document.getElementById("lightbox");

  if (!grid) return;

  let activeFilter = "All";
  let lightboxIndex = 0;
  let filteredPhotos = [...allPhotos];

  const categories = ["All", ...new Set(allPhotos.map((p) => p.category))];

  if (filters) {
    filters.innerHTML = "";
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = `photo-filter${cat === "All" ? " photo-filter--active" : ""}`;
      btn.textContent = cat;
      btn.dataset.filter = cat;
      filters.appendChild(btn);
    });
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".photo-filter");
      if (!btn) return;
      filters.querySelectorAll(".photo-filter").forEach((b) => b.classList.remove("photo-filter--active"));
      btn.classList.add("photo-filter--active");
      activeFilter = btn.dataset.filter;
      render();
    });
  }

  function render() {
    filteredPhotos =
      activeFilter === "All" ? allPhotos : allPhotos.filter((p) => p.category === activeFilter);

    grid.innerHTML = "";
    filteredPhotos.forEach((p, i) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "gallery-grid__item reveal";
      el.innerHTML = `
        <div class="gallery-grid__frame">
          <img src="${p.src}" alt="${p.caption}" loading="lazy" />
        </div>
        <div class="gallery-grid__info">
          <span class="gallery-grid__cat">${p.category}</span>
          <strong>${p.caption}</strong>
          <span class="gallery-grid__event">${p.title}</span>
        </div>`;
      el.addEventListener("click", () => openLightbox(i));
      grid.appendChild(el);
    });

    grid.querySelectorAll(".gallery-grid__item").forEach((el, idx) => {
      setTimeout(() => el.classList.add("reveal--visible"), idx * 60);
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
    const item = filteredPhotos[lightboxIndex];
    if (!item || !lightbox) return;
    const img = lightbox.querySelector(".lightbox__img");
    img.src = item.src;
    lightbox.querySelector(".lightbox__title").textContent = item.title;
    lightbox.querySelector(".lightbox__caption").textContent = item.caption;
    lightbox.querySelector(".lightbox__meta").textContent = `${item.date} · ${item.location}`;
    lightbox.querySelector(".lightbox__link").href = item.linkedin;
    lightbox.querySelector(".lightbox__counter").textContent = `${lightboxIndex + 1} / ${filteredPhotos.length}`;
  }

  lightbox?.querySelector(".lightbox__close")?.addEventListener("click", closeLightbox);
  lightbox?.querySelector(".lightbox__prev")?.addEventListener("click", () => {
    lightboxIndex = (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateLightbox();
  });
  lightbox?.querySelector(".lightbox__next")?.addEventListener("click", () => {
    lightboxIndex = (lightboxIndex + 1) % filteredPhotos.length;
    updateLightbox();
  });
  lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("lightbox--open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightbox.querySelector(".lightbox__prev")?.click();
    if (e.key === "ArrowRight") lightbox.querySelector(".lightbox__next")?.click();
  });

  render();
}
