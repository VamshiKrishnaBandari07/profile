import * as THREE from "three";

/** Background scene with orbiting 3D photo frames */
export function initScene(canvas, photoUrls = []) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 32);

  const loader = new THREE.TextureLoader();
  const photoFrames = [];
  const urls = photoUrls.filter(Boolean).slice(0, 10);

  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    const mix = Math.random();
    colors[i * 3] = 0.2 + mix * 0.4;
    colors[i * 3 + 1] = 0.4 + mix * 0.3;
    colors[i * 3 + 2] = 0.9 + mix * 0.1;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(particles);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(6, 2),
    new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.22 })
  );
  scene.add(core);

  const innerCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.5, 1),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.38 })
  );
  scene.add(innerCore);

  const rings = [];
  [
    { r: 9, color: 0x8b5cf6, opacity: 0.4, rx: Math.PI / 2.5 },
    { r: 13, color: 0x10b981, opacity: 0.18, rx: Math.PI / 3, ry: Math.PI / 4 },
    { r: 17, color: 0x3b82f6, opacity: 0.12, rx: Math.PI / 5, ry: Math.PI / 6 },
  ].forEach(({ r, color, opacity, rx, ry = 0 }) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.05, 16, 120),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
    );
    ring.rotation.x = rx;
    ring.rotation.y = ry;
    scene.add(ring);
    rings.push(ring);
  });

  urls.forEach((url, i) => {
    const tex = loader.load(url);
    const angle = (i / urls.length) * Math.PI * 2;
    const orbitR = 11 + (i % 3) * 2.5;
    const w = 2.2;
    const h = 1.5;

    const frame = new THREE.Group();
    const border = new THREE.Mesh(
      new THREE.PlaneGeometry(w + 0.08, h + 0.08),
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.6 })
    );
    const img = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85 })
    );
    img.position.z = 0.01;
    frame.add(border, img);

    frame.userData = { angle, radius: orbitR, speed: 0.0015 + (i % 4) * 0.0005, yOff: i * 0.7 };
    frame.position.set(Math.cos(angle) * orbitR, Math.sin(i) * 2, Math.sin(angle) * orbitR);
    frame.lookAt(0, 0, 0);
    scene.add(frame);
    photoFrames.push(frame);
  });

  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener("scroll", () => { scrollY = window.scrollY; });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const scrollFactor = Math.min(scrollY / 2000, 1);

    core.rotation.x = t * 0.12 + scrollFactor * 0.5;
    core.rotation.y = t * 0.18;
    innerCore.rotation.x = -t * 0.2;
    innerCore.rotation.y = t * 0.25;
    particles.rotation.y = t * 0.015;

    rings.forEach((ring, i) => {
      ring.rotation.z = t * (0.08 + i * 0.03) * (i % 2 ? 1 : -1);
    });

    photoFrames.forEach((frame) => {
      const d = frame.userData;
      d.angle += d.speed;
      frame.position.x = Math.cos(d.angle) * d.radius;
      frame.position.z = Math.sin(d.angle) * d.radius;
      frame.position.y = Math.sin(t * 0.6 + d.yOff) * 2.5;
      frame.lookAt(0, frame.position.y * 0.3, 0);
    });

    camera.position.x += (mouseX * 4 - camera.position.x) * 0.025;
    camera.position.y += (-mouseY * 3 - scrollFactor * 4 - camera.position.y) * 0.025;
    camera.position.z = 32 - scrollFactor * 6;
    camera.lookAt(0, scrollFactor * -2, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
