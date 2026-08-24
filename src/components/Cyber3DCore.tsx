import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Cyber3DCoreProps {
  lastBlastTrigger?: number;
  solvedCount?: number;
  totalQuestions?: number;
}

export const Cyber3DCore: React.FC<Cyber3DCoreProps> = ({
  lastBlastTrigger = 0,
  solvedCount = 0,
  totalQuestions = 15,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const shockwaveRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 220;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Outer Boss Geodesic Wireframe Shield
    const outerGeo = new THREE.IcosahedronGeometry(1.8, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00eefc,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerShield = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerShield);

    // 3. Inner Cyber Core (Torus Knot + Glowing Core)
    const coreGeo = new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00ff66,
      emissive: 0x00aa44,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    scene.add(innerCore);

    // 4. Floating Holographic Rings
    const ringGeo = new THREE.RingGeometry(2.1, 2.15, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00eefc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xff0055,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 5. Particle Starfield Matrix
    const particlesCount = 250;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x00eefc,
      transparent: true,
      opacity: 0.8,
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ff66, 3, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    const redLight = new THREE.PointLight(0xff0055, 2, 10);
    redLight.position.set(-2, 2, -2);
    scene.add(redLight);

    // 7. Interactive Parallax Cursor Movement
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 8. Shockwave Pulse Trigger
    let shockwaveIntensity = 0;
    shockwaveRef.current = () => {
      shockwaveIntensity = 1.0;
    };

    // 9. Animation Loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotations
      outerShield.rotation.x = elapsedTime * 0.2;
      outerShield.rotation.y = elapsedTime * 0.3;

      innerCore.rotation.x = elapsedTime * 0.6;
      innerCore.rotation.y = elapsedTime * 0.4;

      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.z = -elapsedTime * 0.5;

      particlesMesh.rotation.y = elapsedTime * 0.05;

      // Parallax smooth camera movement
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 0.8 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Handle shockwave impact
      if (shockwaveIntensity > 0) {
        shockwaveIntensity -= 0.03;
        const pulseScale = 1 + shockwaveIntensity * 0.4;
        outerShield.scale.set(pulseScale, pulseScale, pulseScale);
        innerCore.scale.set(pulseScale * 1.1, pulseScale * 1.1, pulseScale * 1.1);
        outerMat.color.setHex(0x00ff66);
        pointLight.intensity = 3 + shockwaveIntensity * 10;
      } else {
        outerShield.scale.set(1, 1, 1);
        innerCore.scale.set(1, 1, 1);
        outerMat.color.setHex(0x00eefc);
        pointLight.intensity = 3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Trigger shockwave effect on new laser blast
  useEffect(() => {
    if (lastBlastTrigger > 0 && shockwaveRef.current) {
      shockwaveRef.current();
    }
  }, [lastBlastTrigger]);

  const healthPercent = Math.max(0, Math.round(100 - (solvedCount / totalQuestions) * 100));

  return (
    <div className="relative w-full h-[220px] bg-[#050811]/90 overflow-hidden border border-[#00eefc]/40 rounded-sm font-mono flex flex-col justify-between p-3">
      {/* Top HUD Telemetry */}
      <div className="z-10 flex items-center justify-between text-[11px] text-[#00eefc]">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
          <span>CYBER DOOMBOT CORE // 3D MATRIX</span>
        </div>
        <span className="text-xs font-bold text-[#ff0055] px-2 py-0.5 bg-[#ff0055]/10 border border-[#ff0055]/40">
          CORE HP: {healthPercent}%
        </span>
      </div>

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Bottom Health Bar & Telemetry */}
      <div className="z-10 w-full space-y-1">
        <div className="w-full bg-slate-900 border border-slate-700 h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00ff66] via-[#00eefc] to-[#ff0055] transition-all duration-500"
            style={{ width: `${healthPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>STATUS: {healthPercent > 50 ? 'PHASE 1: SHIELD ACTIVE' : healthPercent > 0 ? 'PHASE 2: CORE CRITICAL' : 'DOOMBOT DEFEATED'}</span>
          <span className="text-[#00ff66] font-bold">INTERACTIVE 3D PARALLAX</span>
        </div>
      </div>
    </div>
  );
};
