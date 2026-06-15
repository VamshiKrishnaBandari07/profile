import * as THREE from "three";

export function initScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 28;

  // Ambient particles
  const particleCount = 1200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 80;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({
      color: 0x6b9fff,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    })
  );
  scene.add(particles);

  // Wireframe icosahedron — "neural network" aesthetic
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(6, 1),
    new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.35 })
  );
  scene.add(core);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(9, 0.08, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.5 })
  );
  ring.rotation.x = Math.PI / 2.5;
  scene.add(ring);

  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(12, 0.05, 12, 100),
    new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.25 })
  );
  innerRing.rotation.x = Math.PI / 3;
  innerRing.rotation.y = Math.PI / 4;
  scene.add(innerRing);

  // Floating nodes
  const nodes = [];
  for (let i = 0; i < 8; i++) {
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0x60a5fa : 0xa78bfa })
    );
    const angle = (i / 8) * Math.PI * 2;
    node.userData = { angle, radius: 14 + Math.random() * 4, speed: 0.003 + Math.random() * 0.004 };
    node.position.set(Math.cos(angle) * 14, Math.sin(angle) * 3, Math.sin(angle) * 14);
    scene.add(node);
    nodes.push(node);
  }

  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    core.rotation.x = t * 0.15;
    core.rotation.y = t * 0.22;
    ring.rotation.z = t * 0.12;
    innerRing.rotation.z = -t * 0.08;
    particles.rotation.y = t * 0.02;

    nodes.forEach((node, i) => {
      const d = node.userData;
      d.angle += d.speed;
      node.position.x = Math.cos(d.angle) * d.radius;
      node.position.z = Math.sin(d.angle) * d.radius;
      node.position.y = Math.sin(t + i) * 2;
    });

    camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
