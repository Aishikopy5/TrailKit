import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ destination = "Leh, Ladakh" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect environment profile based on searched destination
    const dest = destination.toLowerCase();
    let envType = "himalayan"; // default alpine peaks
    if (/goa|kerala|beach|coast|sea|island|andaman|bali/i.test(dest)) {
      envType = "coastal";
    } else if (/manali|shimla|kasol|forest|valley|munnar|kashmir|dharamsala/i.test(dest)) {
      envType = "valley";
    } else if (/desert|rajasthan|jaipur|jaisalmer/i.test(dest)) {
      envType = "desert";
    }

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(
      envType === "coastal" ? 0x071e33 : envType === "valley" ? 0x052e16 : 0x050c18,
      0.018
    );

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 45);
    camera.lookAt(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Dynamic 3D Terrain Plane
    const width = 120;
    const height = 120;
    const widthSegments = 65;
    const heightSegments = 65;
    const geometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;

    // Apply procedural terrain height based on destination type
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let y = 0;

      if (envType === "himalayan") {
        // Jagged dramatic peaks with sharp ridges
        const d = Math.sqrt(x * x + z * z);
        y = Math.sin(x * 0.12) * Math.cos(z * 0.12) * 9;
        y += Math.sin(x * 0.25 + z * 0.2) * 5;
        y += Math.sin(x * 0.5) * 2;
        // Valley trail down the center
        if (Math.abs(x) < 14) {
          y *= 0.3;
        }
      } else if (envType === "coastal") {
        // Rolling ocean swell waves
        y = Math.sin(x * 0.15 + z * 0.1) * 3 + Math.cos(x * 0.08 - z * 0.12) * 2;
      } else if (envType === "valley") {
        // Rolling alpine forest hills
        y = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 6 + Math.sin(z * 0.18) * 3;
        if (Math.abs(x) < 18) y *= 0.4;
      } else {
        // Desert rolling dunes
        y = Math.sin(x * 0.07 + z * 0.05) * 5 + Math.cos(x * 0.14) * 2.5;
      }

      pos.setY(i, y);
    }
    geometry.computeVertexNormals();

    // Material 1: Wireframe topography lines
    const wireColor = envType === "coastal" ? 0x06b6d4 : envType === "valley" ? 0x10b981 : 0x38bdf8;
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: wireColor,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    scene.add(wireMesh);

    // Material 2: Shaded mountain body with soft gradient
    const solidColor = envType === "coastal" ? 0x021d38 : envType === "valley" ? 0x062817 : 0x0b172a;
    const solidMaterial = new THREE.MeshStandardMaterial({
      color: solidColor,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
      transparent: true,
      opacity: 0.82,
    });
    const solidMesh = new THREE.Mesh(geometry, solidMaterial);
    solidMesh.position.y = -0.05;
    scene.add(solidMesh);

    // 3. Floating 3D Atmospheric Particles (Snow mist, Fireflies, or Ocean spray)
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 110;
      particlePositions[i + 1] = Math.random() * 35;
      particlePositions[i + 2] = (Math.random() - 0.5) * 110;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: envType === "coastal" ? 0x38bdf8 : envType === "valley" ? 0x34d399 : 0xe0f2fe,
      size: 0.7,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMaterial);
    scene.add(particleSystem);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLightColor = envType === "coastal" ? 0xf59e0b : envType === "valley" ? 0x34d399 : 0x38bdf8;
    const dirLight = new THREE.DirectionalLight(dirLightColor, 1.8);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // 5. Mouse Parallax & Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera lerp with mouse movement
      targetX += (mouseX * 8 - targetX) * 0.05;
      targetY += (-mouseY * 4 - targetY) * 0.05;

      camera.position.x = targetX;
      camera.position.y = 15 + targetY;
      camera.lookAt(0, 4, -10);

      // Subtle terrain undulation / wave drift
      if (envType === "coastal") {
        const positions = geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const z = positions.getZ(i);
          const wave = Math.sin(x * 0.15 + elapsedTime * 1.5) * 1.8 + Math.cos(z * 0.1 + elapsedTime) * 1.5;
          positions.setY(i, wave);
        }
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;
      }

      // Slow terrain drift
      wireMesh.position.z = (elapsedTime * 1.8) % (height / 2) - height / 4;
      solidMesh.position.z = wireMesh.position.z;

      // Particle floating animation
      const partPos = particleGeo.attributes.position;
      for (let i = 1; i < particleCount * 3; i += 3) {
        partPos.array[i] -= 0.04;
        if (partPos.array[i] < 0) {
          partPos.array[i] = 35;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      wireMaterial.dispose();
      solidMaterial.dispose();
      particleGeo.dispose();
      particleMaterial.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [destination]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  );
}
