import * as THREE from "three";

/** Subtle animated background — no duplicate photos */
export function initScene(canvas) {
  if (!canvas) return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 32);

  const particleCount = 1400;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 70;
    colors[i * 3] = 0.25 + Math.random() * 0.3;
    colors[i * 3 + 1] = 0.4 + Math.random() * 0.25;
    colors[i * 3 + 2] = 0.85 + Math.random() * 0.15;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const particles = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(particles);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(5, 1),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.15 })
  );
  scene.add(core);

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
    core.rotation.x = t * 0.1;
    core.rotation.y = t * 0.14;
    particles.rotation.y = t * 0.012;
    camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.025;
    camera.position.y += (-mouseY * 2 - scrollFactor * 3 - camera.position.y) * 0.025;
    camera.lookAt(0, scrollFactor * -1.5, 0);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
