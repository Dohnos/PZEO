"use client";

import { Component, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import type { SeasonId } from "@/lib/types";

/** Nastavení částic a barev pro jednotlivá roční období. */
const SEASONS: Record<
  SeasonId,
  { colors: string[]; box: string; lid: string; ring: string; count: number; fall: number; kind: "snow" | "petal" | "mote" | "leaf" }
> = {
  zima: { colors: ["#ffffff", "#e6f3f7", "#cfe7ee"], box: "#dfe9ec", lid: "#f4f8f9", ring: "#8fc3d3", count: 90, fall: 0.35, kind: "snow" },
  jaro: { colors: ["#f5c6d2", "#fbe3ea", "#ffffff", "#e9a7b9"], box: "#5f8a4c", lid: "#78a563", ring: "#f5c6d2", count: 55, fall: 0.28, kind: "petal" },
  leto: { colors: ["#ffd87a", "#ffe9b0", "#fff4d6"], box: "#2e6b6f", lid: "#3f878b", ring: "#ffd87a", count: 60, fall: -0.18, kind: "mote" },
  podzim: { colors: ["#c8642f", "#e08a3c", "#a9432a", "#d9a441"], box: "#6b3f24", lid: "#8a5433", ring: "#e0a13c", count: 45, fall: 0.4, kind: "leaf" },
};

function leafGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.12);
  s.quadraticCurveTo(0.1, 0, 0, 0.12);
  s.quadraticCurveTo(-0.1, 0, 0, -0.12);
  return new THREE.ShapeGeometry(s, 8);
}

function Particles({ season, reduce }: { season: SeasonId; reduce: boolean }) {
  const cfg = SEASONS[season];
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const geometry = useMemo(() => {
    if (cfg.kind === "leaf") return leafGeometry();
    if (cfg.kind === "petal") {
      const g = new THREE.CircleGeometry(0.07, 12);
      g.scale(1, 0.62, 1);
      return g;
    }
    return new THREE.SphereGeometry(cfg.kind === "snow" ? 0.035 : 0.03, 10, 10);
  }, [cfg.kind]);

  const seeds = useMemo(
    () =>
      Array.from({ length: cfg.count }, () => ({
        x: (Math.random() - 0.5) * 7,
        y: Math.random() * 4.6 - 1.6,
        z: (Math.random() - 0.5) * 3 - 0.3,
        speed: 0.6 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 3,
        scale: 0.7 + Math.random() * 0.8,
      })),
    [cfg.count],
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const c = new THREE.Color();
    seeds.forEach((s, i) => {
      mesh.setColorAt(i, c.set(cfg.colors[i % cfg.colors.length]));
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;
  }, [seeds, cfg.colors, dummy]);

  useFrame(({ clock }, delta) => {
    const mesh = ref.current;
    if (!mesh || reduce) return;
    const t = clock.getElapsedTime();
    const d = Math.min(delta, 0.05);
    seeds.forEach((s, i) => {
      s.y -= cfg.fall * s.speed * d;
      if (cfg.fall > 0 && s.y < -1.7) s.y = 3.1;
      if (cfg.fall < 0 && s.y > 3.1) s.y = -1.7;
      const sway = Math.sin(t * 0.9 * s.speed + s.phase) * (cfg.kind === "mote" ? 0.12 : 0.35);
      dummy.position.set(s.x + sway, s.y, s.z);
      dummy.rotation.set(t * s.spin * 0.5, t * s.spin, t * s.spin * 0.3);
      const pulse = cfg.kind === "mote" ? 0.6 + 0.4 * Math.sin(t * 2 * s.speed + s.phase) : 1;
      dummy.scale.setScalar(s.scale * pulse);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  const basic = cfg.kind === "mote" || cfg.kind === "snow";
  return (
    <instancedMesh ref={ref} args={[geometry, undefined, cfg.count]}>
      {basic ? (
        <meshBasicMaterial toneMapped={false} transparent opacity={0.95} />
      ) : (
        <meshStandardMaterial side={THREE.DoubleSide} roughness={0.7} />
      )}
    </instancedMesh>
  );
}

function MiniBox({ season, reduce }: { season: SeasonId; reduce: boolean }) {
  const cfg = SEASONS[season];
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (reduce) return;
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.45) * 0.5;
      group.current.position.y = Math.sin(t * 1.1) * 0.05;
    }
    // víko se jemně nadzvedává, jako by se box chtěl otevřít
    if (lid.current) lid.current.position.y = 0.52 + Math.max(0, Math.sin(t * 0.9)) * 0.12;
  });

  return (
    <group ref={group} rotation={[0.12, -0.3, 0]}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.62, 72]} />
        <meshStandardMaterial color={cfg.box} roughness={0.75} />
      </mesh>
      <group ref={lid} position={[0, 0.52, 0]}>
        <mesh>
          <cylinderGeometry args={[0.76, 0.76, 0.18, 72]} />
          <meshStandardMaterial color={cfg.lid} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.092, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 64]} />
          <meshStandardMaterial color={cfg.ring} metalness={0.5} roughness={0.35} />
        </mesh>
      </group>
      <mesh position={[0, 0.2, 0.722]}>
        <torusGeometry args={[0.11, 0.012, 12, 48]} />
        <meshStandardMaterial color={cfg.ring} metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

class SafeBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {}
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function EditionScene({
  season,
  active,
  reduce,
  fallback,
}: {
  season: SeasonId;
  active: boolean;
  reduce: boolean;
  fallback: ReactNode;
}) {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => setOk(hasWebGL()), []);
  if (ok === false) return <>{fallback}</>;
  if (ok === null) return null;

  return (
    <SafeBoundary fallback={fallback}>
      <Canvas
        className="!absolute inset-0"
        style={{ pointerEvents: "none" }}
        frameloop={active && !reduce ? "always" : "demand"}
        dpr={[1, 2]}
        camera={{ position: [0, 1.25, 4.6], fov: 36 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.35, 0)}
        gl={{ antialias: true, alpha: true }}
        aria-hidden="true"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1.4} />
        <Environment resolution={64}>
          <Lightformer intensity={1.6} position={[0, 4, 3]} scale={[6, 2, 1]} />
          <Lightformer intensity={0.8} position={[-4, 1, 2]} scale={[2, 4, 1]} />
        </Environment>
        <MiniBox season={season} reduce={reduce} />
        <Particles season={season} reduce={reduce} />
        <ContactShadows position={[0, -0.12, 0]} opacity={0.3} scale={5} blur={2.4} far={2} />
      </Canvas>
    </SafeBoundary>
  );
}
