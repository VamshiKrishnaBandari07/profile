import * as THREE from "three";

export function initScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 32);

  // Particle field
  const particleCount = 2000;
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
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(particles);

  // Neural core
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(7, 2),
    new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.28 })
  );
  scene.add(core);

  const innerCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(4, 1),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.45 })
  );
  scene.add(innerCore);

  const rings = [];
  [
    { r: 10, color: 0x8b5cf6, opacity: 0.45, rx: Math.PI / 2.5 },
    { r: 14, color: 0x10b981, opacity: 0.22, rx: Math.PI / 3, ry: Math.PI / 4 },
    { r: 18, color: 0x3b82f6, opacity: 0.15, rx: Math.PI / 5, ry: Math.PI / 6 },
  ].forEach(({ r, color, opacity, rx, ry = 0 }) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.06, 16, 140),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
    );
    ring.rotation.x = rx;
    ring.rotation.y = ry;
    scene.add(ring);
    rings.push(ring);
  });

  // Orbiting nodes with connection lines
  const nodeCount = 12;
  const nodes = [];
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = new Float32Array(nodeCount * 6);
  lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.12 })
  );
  scene.add(lines);

  for (let i = 0; i < nodeCount; i++) {
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.2 + Math.random() * 0.15, 12, 12),
      new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0x60a5fa : i % 3 === 1 ? 0xa78bfa : 0x34d399 })
    );
    const angle = (i / nodeCount) * Math.PI * 2;
    node.userData = {
      angle,
      radius: 12 + Math.random() * 8,
      speed: 0.002 + Math.random() * 0.004,
      yOffset: Math.random() * Math.PI * 2,
    };
    scene.add(node);
    nodes.push(node);
  }

  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

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

    const lineArr = lineGeo.attributes.position.array;
    nodes.forEach((node, i) => {
      const d = node.userData;
      d.angle += d.speed;
      node.position.x = Math.cos(d.angle) * d.radius;
      node.position.z = Math.sin(d.angle) * d.radius;
      node.position.y = Math.sin(t * 0.8 + d.yOffset) * 3;

      const next = nodes[(i + 1) % nodeCount];
      lineArr[i * 6] = node.position.x;
      lineArr[i * 6 + 1] = node.position.y;
      lineArr[i * 6 + 2] = node.position.z;
      lineArr[i * 6 + 3] = next.position.x;
      lineArr[i * 6 + 4] = next.position.y;
      lineArr[i * 6 + 5] = next.position.z;
    });
    lineGeo.attributes.position.needsUpdate = true;

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
