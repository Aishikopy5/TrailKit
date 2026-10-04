import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground({ destination = "Leh, Ladakh" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect environment type
    const dest = (destination || "").toLowerCase();
    let isCoastal = /goa|kerala|beach|coast|sea|island/i.test(dest);
    let isValley = /manali|shimla|kasol|valley|forest|munnar/i.test(dest);

    // 1. Scene & Sky Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xe0f2fe, 0.012);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 18, 52);
    camera.lookAt(0, 8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Low-Poly Mountain Range (Inspired by the white geometric 3D landmarks in reference)
    const mountainGeo = new THREE.PlaneGeometry(160, 90, 48, 32);
    mountainGeo.rotateX(-Math.PI / 2);
    const mPos = mountainGeo.attributes.position;

    for (let i = 0; i < mPos.count; i++) {
      const x = mPos.getX(i);
      const z = mPos.getZ(i);
      let y = 0;

      if (isCoastal) {
        // Soft rolling coastal waves with white foam crests
        y = Math.sin(x * 0.12) * 2.5 + Math.cos(z * 0.15) * 2;
      } else if (isValley) {
        // Pine valley ridges
        y = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 7 + Math.sin(x * 0.2) * 3;
        if (Math.abs(x) < 22) y *= 0.3; // center trail
      } else {
        // High Alpine jagged peaks (White low-poly mountains)
        const dist = Math.abs(x);
        y = Math.sin(x * 0.1) * Math.cos(z * 0.12) * 11;
        y += Math.sin(x * 0.25 + z * 0.18) * 6;
        if (z < -10) y += 6; // background peaks higher
        if (dist < 18) y *= 0.25; // pass through middle
      }
      mPos.setY(i, y);
    }
    mountainGeo.computeVertexNormals();

    // Pristine White / Ice-Cyan Low Poly Mountain Material
    const mountainMat = new THREE.MeshStandardMaterial({
      color: isCoastal ? 0xbae6fd : 0xf8fafc,
      roughness: 0.6,
      metalness: 0.1,
      flatShading: true,
      transparent: true,
      opacity: 0.72,
    });
    const mountainMesh = new THREE.Mesh(mountainGeo, mountainMat);
    mountainMesh.position.set(0, -6, -20);
    scene.add(mountainMesh);

    // Cyan wireframe contour accent overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const wireMesh = new THREE.Mesh(mountainGeo, wireMat);
    wireMesh.position.set(0, -5.9, -20);
    scene.add(wireMesh);

    // 3. 3D Low-Poly Paper Airplane (Directly inspired by reference hero!)
    const planeGroup = new THREE.Group();
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.2,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    // Create origami paper plane geometry
    const planeGeo = new THREE.BufferGeometry();
    const planeVertices = new Float32Array([
      // Left Wing
      0, 0, 4,
      -3.2, 0.4, -2.5,
      0, -0.6, -2,

      // Right Wing
      0, 0, 4,
      0, -0.6, -2,
      3.2, 0.4, -2.5,

      // Center Keel / Fuselage Left
      0, 0, 4,
      0, -1.2, -1.8,
      -0.6, -0.4, -2,

      // Center Keel / Fuselage Right
      0, 0, 4,
      0.6, -0.4, -2,
      0, -1.2, -1.8,
    ]);
    planeGeo.setAttribute('position', new THREE.BufferAttribute(planeVertices, 3));
    planeGeo.computeVertexNormals();

    const airplaneMesh = new THREE.Mesh(planeGeo, planeMat);
    planeGroup.add(airplaneMesh);
    planeGroup.scale.set(1.4, 1.4, 1.4);
    planeGroup.position.set(12, 16, 10);
    scene.add(planeGroup);

    // Dashed flight loop curve (Inspired by dashed flight path in image)
    const curvePoints = [];
    for (let t = 0; t <= Math.PI * 2; t += 0.1) {
      const px = Math.cos(t) * 14 + 10;
      const py = Math.sin(t * 2) * 3 + 15;
      const pz = Math.sin(t) * 10 - 2;
      curvePoints.push(new THREE.Vector3(px, py, pz));
    }
    const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const curveMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.8,
      gapSize: 0.5,
      transparent: true,
      opacity: 0.45,
    });
    const flightPathLine = new THREE.Line(curveGeo, curveMat);
    flightPathLine.computeLineDistances();
    scene.add(flightPathLine);

    // 4. Floating 3D Geometric Clouds / Sparkles
    const cloudCount = 12;
    const cloudGroup = new THREE.Group();
    const cloudGeo = new THREE.DodecahedronGeometry(2.5, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      flatShading: true,
      transparent: true,
      opacity: 0.55,
    });

    for (let c = 0; c < cloudCount; c++) {
      const cloud = new THREE.Mesh(cloudGeo, cloudMat);
      cloud.position.set(
        (Math.random() - 0.5) * 100,
        Math.random() * 12 + 10,
        (Math.random() - 0.5) * 60 - 10
      );
      const s = Math.random() * 1.5 + 0.8;
      cloud.scale.set(s * 1.8, s * 0.9, s * 1.2);
      cloudGroup.add(cloud);
    }
    scene.add(cloudGroup);

    // 5. Ambient & Directional Sun Lighting
    const ambientLight = new THREE.AmbientLight(0xe0f2fe, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(30, 45, 25);
    scene.add(sunLight);

    const skyFillLight = new THREE.DirectionalLight(0x0284c7, 0.8);
    skyFillLight.position.set(-25, 20, -10);
    scene.add(skyFillLight);

    // 6. Interactive Mouse Parallax & Flight Loop Animation
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
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Mouse camera parallax
      targetX += (mouseX * 6 - targetX) * 0.04;
      targetY += (-mouseY * 3 - targetY) * 0.04;

      camera.position.x = targetX;
      camera.position.y = 18 + targetY;
      camera.lookAt(0, 7, -10);

      // Airplane flight motion along graceful curve
      const angle = elapsedTime * 0.45;
      const ax = Math.cos(angle) * 14 + 10;
      const ay = Math.sin(angle * 2) * 2.8 + 15;
      const az = Math.sin(angle) * 10 - 2;

      planeGroup.position.set(ax, ay, az);
      planeGroup.rotation.y = -angle + Math.PI / 2;
      planeGroup.rotation.z = Math.sin(angle * 2) * 0.35; // banking turn
      planeGroup.rotation.x = Math.cos(angle * 2) * 0.15; // pitch

      // Slow drift of clouds
      cloudGroup.children.forEach((cloud, i) => {
        cloud.position.x += 0.03 * (i % 2 === 0 ? 1 : 0.8);
        if (cloud.position.x > 60) cloud.position.x = -60;
      });

      renderer.render(scene, camera);
    };

    animate();

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
      mountainGeo.dispose();
      mountainMat.dispose();
      wireMat.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      curveGeo.dispose();
      curveMat.dispose();
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
