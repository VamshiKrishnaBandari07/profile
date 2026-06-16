const BASE = import.meta.env.BASE_URL;
const API = `${BASE}api`.replace("//api", "/api").replace("/profile/api", "/api");

export function getAllPhotos(highlights) {
  return highlights
    .filter((event) => event.id !== "profile")
    .flatMap((event) =>
      (event.photos || []).map((photo, i) => ({
        ...photo,
        id: `${event.id}-${i}`,
        eventId: event.id,
        title: event.title,
        category: event.category,
        location: event.location,
        date: event.date,
        linkedin: event.linkedin,
        fallback: event.image || photo.src,
      }))
    );
}

export function photoCount(highlights) {
  return getAllPhotos(highlights).length;
}

export async function loadSiteData() {
  const urls = [`${BASE}site-data.json`, "/profile/site-data.json", "/site-data.json"];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch (_) {}
  }
  const mod = await import("./data.js");
  return {
    profile: mod.profile,
    about: mod.about,
    highlights: mod.highlights,
    stats: mod.stats,
    skills: mod.skills,
    achievements: mod.achievements,
    certifications: mod.certifications,
    projects: mod.projects,
    timeline: mod.timeline,
  };
}

export async function cmsAvailable() {
  try {
    const res = await fetch("/api/health", { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function saveSiteData(data) {
  const res = await fetch("/api/site-data", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Could not save — start the site with start.bat");
  return res.json();
}

export async function uploadPhoto(album, file, caption = "") {
  const fd = new FormData();
  fd.append("album", album);
  fd.append("caption", caption);
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export function normalizeHighlights(highlights) {
  return highlights.map((h) => {
    const photos = h.photos || [];
    return {
      ...h,
      bento: h.bento || (h.featured ? "hero" : "standard"),
      image: photos[0]?.src || h.image || "",
      fallback: photos[0]?.src || h.fallback || "",
      photos,
    };
  });
}
