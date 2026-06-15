import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/** Interactive 3D photo ring — drag to rotate, click to open gallery */
export function initPhoto3D(canvas, photos, onPhotoClick) {
  if (!canvas || !photos?.length) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.set(0, 2, 22);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = true;
  controls.minDistance = 12;
  controls.maxDistance = 40;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  controls.maxPolarAngle = Math.PI / 1.6;
  controls.minPolarAngle = Math.PI / 4;

  const loader = new THREE.TextureLoader();
  const group = new THREE.Group();
  scene.add(group);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const frames = [];
  const count = Math.min(photos.length, 14);
  const radius = 10;

  // Center profile glow
  const centerGeo = new THREE.RingGeometry(2.8, 3.2, 64);
  const centerMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
  });
  const centerRing = new THREE.Mesh(centerGeo, centerMat);
  centerRing.rotation.x = -Math.PI / 2;
  scene.add(centerRing);

  const profileTex = loader.load(photos.find((p) => p.eventId === "profile")?.src || photos[0].src);
  const profilePlane = new THREE.Mesh(
    new THREE.CircleGeometry(2.6, 48),
    new THREE.MeshBasicMaterial({ map: profileTex, transparent: true })
  );
  profilePlane.rotation.x = -Math.PI / 2;
  profilePlane.position.y = 0.05;
  scene.add(profilePlane);

  photos.slice(0, count).forEach((photo, i) => {
    if (photo.eventId === "profile") return;

    const angle = (i / count) * Math.PI * 2;
    const tex = loader.load(photo.src, undefined, undefined, () => {
      tex.image = null;
    });

    const aspect = 1.4;
    const w = 3.2;
    const h = w / aspect;

    // Frame border
    const frame = new THREE.Mesh(
      new THREE.PlaneGeometry(w + 0.15, h + 0.15),
      new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.85 })
    );

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true })
    );
    plane.position.z = 0.02;
    frame.add(plane);

    const yWave = Math.sin(i * 1.3) * 1.5;
    frame.position.set(Math.cos(angle) * radius, yWave, Math.sin(angle) * radius);
    frame.lookAt(0, yWave, 0);
    frame.userData = { photoIndex: i, photo };

    // Glow back
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(w + 0.5, h + 0.5),
      new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.12 })
    );
    glow.position.z = -0.05;
    frame.add(glow);

    group.add(frame);
    frames.push(frame);
  });

  // Ambient particles
  const pts = new Float32Array(600 * 3);
  for (let i = 0; i < 600 * 3; i++) pts[i] = (Math.random() - 0.5) * 50;
  const particles = new THREE.Points(
    new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(pts, 3)),
    new THREE.PointsMaterial({ color: 0x6b9fff, size: 0.08, transparent: true, opacity: 0.5 })
  );
  scene.add(particles);

  // Floor grid
  const grid = new THREE.GridHelper(40, 40, 0x1e3a5f, 0x0f172a);
  grid.position.y = -4;
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  scene.add(grid);

  let hovered = null;

  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(frames, true);
    let obj = hits[0]?.object;
    while (obj && !obj.userData?.photo) obj = obj.parent;
    hovered = obj?.userData?.photo ? obj : null;
    canvas.style.cursor = hovered ? "pointer" : "grab";
  });

  canvas.addEventListener("click", () => {
    if (hovered?.userData?.photo && onPhotoClick) {
      onPhotoClick(hovered.userData.photo);
    }
  });

  canvas.addEventListener("pointerdown", () => { controls.autoRotate = false; });
  canvas.addEventListener("pointerup", () => {
    setTimeout(() => { controls.autoRotate = true; }, 3000);
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    group.rotation.y = t * 0.04;
    centerRing.rotation.z = t * 0.3;
    particles.rotation.y = t * 0.02;

    frames.forEach((f, i) => {
      f.position.y += Math.sin(t * 0.8 + i) * 0.002;
      const scale = hovered === f ? 1.08 : 1;
      f.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    });

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  const ro = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(canvas);

  return { destroy: () => ro.disconnect() };
}
