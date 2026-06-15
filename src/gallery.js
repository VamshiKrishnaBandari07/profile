/** Multi-photo gallery — albums, masonry wall, spotlight carousel, lightbox */

export function initGallery(highlights, allPhotos) {
  const spotlight = document.getElementById("spotlight");
  const bento = document.getElementById("bento-gallery");
  const filmstrip = document.getElementById("filmstrip");
  const filters = document.getElementById("photo-filters");
  const lightbox = document.getElementById("lightbox");
  const photoWall = document.getElementById("photo-wall");
  const albums = document.getElementById("event-albums");

  if (!bento) return;

  const categories = ["All", ...new Set(highlights.map((h) => h.category))];
  let activeFilter = "All";
  let lightboxIndex = 0;
  let filtered = [...highlights];
  let filteredPhotos = [...allPhotos];
  let spotlightPhotoIndex = 0;
  let spotlightEvent = filtered[0];

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

  function getFilteredEvents() {
    return activeFilter === "All" ? highlights : highlights.filter((h) => h.category === activeFilter);
  }

  function getFilteredPhotos() {
    return activeFilter === "All" ? allPhotos : allPhotos.filter((p) => p.category === activeFilter);
  }

  function photoIndexInFiltered(photo) {
    return filteredPhotos.findIndex((p) => p.id === photo.id);
  }

  function renderSpotlight(event, eventIndex, photoIdx = 0) {
    if (!spotlight) return;
    spotlightEvent = event;
    spotlightPhotoIndex = photoIdx;
    const photo = event.photos[photoIdx] || event.photos[0];
    const globalIdx = photoIndexInFiltered({
      id: `${event.id}-${photoIdx}`,
      eventId: event.id,
    });
    const lbIdx = filteredPhotos.findIndex((p) => p.eventId === event.id && p.src === photo.src);

    spotlight.innerHTML = `
      <div class="spotlight__visual" data-event="${event.id}">
        <div class="spotlight__slides">
          ${event.photos
            .map(
              (p, i) => `
            <div class="spotlight__slide${i === photoIdx ? " spotlight__slide--active" : ""}" data-photo="${i}">
              <img src="${p.src}" alt="${p.caption}" onerror="this.src='${event.fallback}'" />
            </div>`
            )
            .join("")}
        </div>
        <div class="spotlight__overlay">
          <span class="spotlight__category">${event.category} · ${event.photos.length} photos</span>
          <h3>${event.title}</h3>
          <p class="spotlight__caption">${photo.caption}</p>
          <p>${event.excerpt}</p>
          <div class="spotlight__meta">
            <time>${event.date} · ${event.location}</time>
            <a href="${event.linkedin}" target="_blank" rel="noopener">View on LinkedIn →</a>
          </div>
        </div>
        ${event.photos.length > 1 ? `<div class="spotlight__dots">${event.photos.map((_, i) => `<button class="spotlight__dot${i === photoIdx ? " spotlight__dot--active" : ""}" data-dot="${i}" aria-label="Photo ${i + 1}"></button>`).join("")}</div>` : ""}
        ${event.photos.length > 1 ? `<button class="spotlight__nav spotlight__nav--prev" aria-label="Previous photo">‹</button><button class="spotlight__nav spotlight__nav--next" aria-label="Next photo">›</button>` : ""}
        <button class="spotlight__expand" aria-label="Expand photo">⤢</button>
      </div>
      <div class="spotlight__thumbs" id="spotlight-thumbs"></div>
    `;

    const thumbs = spotlight.querySelector("#spotlight-thumbs");
    filtered.forEach((h, i) => {
      const t = document.createElement("button");
      t.className = `spotlight__thumb${h.id === event.id ? " spotlight__thumb--active" : ""}`;
      t.innerHTML = `
        <img src="${h.image}" alt="" onerror="this.src='${h.fallback}'" />
        <span>${h.category}</span>
        <em>${h.photos.length}</em>`;
      t.addEventListener("click", () => renderSpotlight(h, i, 0));
      thumbs.appendChild(t);
    });

    const goPhoto = (idx) => {
      const next = (idx + event.photos.length) % event.photos.length;
      renderSpotlight(event, eventIndex, next);
    };

    spotlight.querySelector(".spotlight__nav--prev")?.addEventListener("click", (e) => {
      e.stopPropagation();
      goPhoto(photoIdx - 1);
    });
    spotlight.querySelector(".spotlight__nav--next")?.addEventListener("click", (e) => {
      e.stopPropagation();
      goPhoto(photoIdx + 1);
    });
    spotlight.querySelectorAll(".spotlight__dot").forEach((dot) => {
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        goPhoto(+dot.dataset.dot);
      });
    });

    spotlight.querySelector(".spotlight__visual")?.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      openLightbox(lbIdx >= 0 ? lbIdx : 0);
    });
    spotlight.querySelector(".spotlight__expand")?.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(lbIdx >= 0 ? lbIdx : 0);
    });
  }

  function renderBento() {
    bento.innerHTML = "";
    filtered.forEach((h, i) => {
      const stack = h.photos.slice(0, 3);
      const el = document.createElement("article");
      el.className = `bento__item bento__item--${h.bento} reveal`;
      el.innerHTML = `
        <div class="bento__stack">
          ${stack
            .map(
              (p, si) =>
                `<img class="bento__stack-img bento__stack-img--${si}" src="${p.src}" alt="" loading="lazy" onerror="this.src='${h.fallback}'" />`
            )
            .join("")}
        </div>
        <div class="bento__count">${h.photos.length} photos</div>
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
        <button class="bento__zoom" aria-label="View album">⤢</button>
      `;

      el.querySelector(".bento__zoom")?.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = photoIndexInFiltered({ id: `${h.id}-0`, eventId: h.id });
        openLightbox(idx >= 0 ? idx : 0);
      });
      el.addEventListener("click", (e) => {
        if (e.target.closest("a") || e.target.closest(".bento__zoom")) return;
        renderSpotlight(h, i, 0);
        spotlight?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
      bento.appendChild(el);
    });
    observeReveal(".bento__item.reveal");
  }

  function renderPhotoWall() {
    if (!photoWall) return;
    photoWall.innerHTML = "";
    const sizes = ["tall", "wide", "standard", "standard", "tall", "wide", "standard"];
    filteredPhotos.forEach((p, i) => {
      const el = document.createElement("button");
      el.className = `wall__item wall__item--${sizes[i % sizes.length]} reveal`;
      el.type = "button";
      el.innerHTML = `
        <img src="${p.src}" alt="${p.caption}" loading="lazy" onerror="this.src='${p.fallback}'" />
        <div class="wall__overlay">
          <span class="wall__cat">${p.category}</span>
          <strong>${p.caption}</strong>
        </div>`;
      el.addEventListener("click", () => openLightbox(i));
      photoWall.appendChild(el);
    });
    observeReveal(".wall__item.reveal");
  }

  function renderAlbums() {
    if (!albums) return;
    albums.innerHTML = "";
    filtered.forEach((event, ei) => {
      const el = document.createElement("article");
      el.className = "album reveal";
      el.innerHTML = `
        <header class="album__head">
          <div>
            <span class="album__cat">${event.category}</span>
            <h3>${event.title}</h3>
            <p>${event.date} · ${event.location}</p>
          </div>
          <span class="album__count">${event.photos.length} photos</span>
        </header>
        <div class="album__scroll">
          ${event.photos
            .map(
              (p, pi) => `
            <button class="album__photo" type="button" data-event="${ei}" data-photo="${pi}">
              <img src="${p.src}" alt="${p.caption}" loading="lazy" onerror="this.src='${event.fallback}'" />
              <span>${p.caption}</span>
            </button>`
            )
            .join("")}
        </div>
        <a href="${event.linkedin}" target="_blank" rel="noopener" class="album__link">View source →</a>
      `;

      el.querySelectorAll(".album__photo").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = filteredPhotos.findIndex(
            (fp) => fp.eventId === event.id && fp.src === event.photos[+btn.dataset.photo].src
          );
          openLightbox(idx >= 0 ? idx : 0);
        });
      });
      albums.appendChild(el);
    });
    observeReveal(".album.reveal");
  }

  function renderFilmstrip() {
    if (!filmstrip) return;
    filmstrip.innerHTML = "";
    const items = [...filteredPhotos, ...filteredPhotos];
    items.forEach((p) => {
      const el = document.createElement("div");
      el.className = "filmstrip__item";
      el.innerHTML = `<img src="${p.src}" alt="${p.caption}" onerror="this.src='${p.fallback}'" />`;
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
    const item = filteredPhotos[lightboxIndex];
    if (!item || !lightbox) return;
    const img = lightbox.querySelector(".lightbox__img");
    img.src = item.src;
    img.onerror = () => { img.src = item.fallback; };
    lightbox.querySelector(".lightbox__title").textContent = item.title;
    lightbox.querySelector(".lightbox__caption").textContent = item.caption;
    lightbox.querySelector(".lightbox__meta").textContent = `${item.date} · ${item.location} · ${item.category}`;
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

  function observeReveal(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      if (el.classList.contains("reveal--visible")) return;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("reveal--visible")),
        { threshold: 0.06 }
      );
      obs.observe(el);
    });
  }

  function render() {
    filtered = getFilteredEvents();
    filteredPhotos = getFilteredPhotos();
    const featured = filtered.find((h) => h.featured) || filtered[0];
    const idx = filtered.indexOf(featured);
    renderSpotlight(featured, idx >= 0 ? idx : 0, 0);
    renderBento();
    renderPhotoWall();
    renderAlbums();
    renderFilmstrip();
  }

  render();
}
