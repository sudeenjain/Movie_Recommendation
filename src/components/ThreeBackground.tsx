"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const [accentColor, setAccentColor] = React.useState(new THREE.Color(0x00a2ff));
  
  const particles = useMemo(() => {
    const count = 6000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 4;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 1.0;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 40;
      
      const time = state.clock.getElapsedTime();
      ref.current.scale.setScalar(1 + Math.sin(time * 0.3) * 0.1);
      
      // Sync color with CSS variable
      const style = getComputedStyle(document.documentElement);
      const primaryRgb = style.getPropertyValue("--primary-rgb").split(",");
      if (primaryRgb.length === 3) {
        const targetColor = new THREE.Color(
          parseInt(primaryRgb[0]) / 255,
          parseInt(primaryRgb[1]) / 255,
          parseInt(primaryRgb[2]) / 255
        );
        accentColor.lerp(targetColor, 0.05);
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particles.positions} colors={particles.colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={accentColor}
          size={0.007}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

const ThreeBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020205]">
      <Canvas camera={{ position: [0, 0, 1.5], fov: 75 }}>
        <ParticleField />
      </Canvas>
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020205_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020205]" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
};

export default ThreeBackground;