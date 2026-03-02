"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  
  const particles = useMemo(() => {
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const r = 2 + Math.random() * 3;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      // Color variation (mostly primary blue with some purple)
      const isPurple = Math.random() > 0.8;
      colors[i * 3] = isPurple ? 0.6 : 0.0; // R
      colors[i * 3 + 1] = isPurple ? 0.2 : 0.6; // G
      colors[i * 3 + 2] = 1.0; // B
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
      
      // Subtle pulsing effect
      const time = state.clock.getElapsedTime();
      ref.current.scale.setScalar(1 + Math.sin(time * 0.5) * 0.05);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particles.positions} colors={particles.colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.008}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
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
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default ThreeBackground;