"use client";

/**
 * Knihovna 3D modelů produktů (z jednoduchých tvarů three.js).
 * Každý model má výšku zhruba 0,6 jednotky a střed v počátku.
 * Nový produkt = nový model sem + klíč do ModelKey (lib/types.ts) a popisek (lib/labels.ts).
 */

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { ModelKey } from "@/lib/types";

const WOOD = "#b98a5c";
const CREAM = "#f3ede2";
const AMBER = "#8a4516";

function Flame({ y }: { y: number }) {
  return (
    <mesh position={[0, y, 0]} scale={[0.045, 0.1, 0.045]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#ffc46b" toneMapped={false} />
    </mesh>
  );
}

function Tin() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.26, 0.26, 0.46, 48]} />
        <meshStandardMaterial color="#b3babc" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.275, 0.275, 0.09, 48]} />
        <meshStandardMaterial color="#9aa2a5" metalness={0.7} roughness={0.28} />
      </mesh>
    </group>
  );
}

function Candle() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.27, 0.25, 0.46, 48]} />
        <meshPhysicalMaterial color={AMBER} roughness={0.12} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.245, 0.245, 0.03, 48]} />
        <meshStandardMaterial color="#f1e6cf" roughness={0.8} />
      </mesh>
      <Flame y={0.3} />
    </group>
  );
}

function CandleCeramic({ accent }: { accent: string }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.32, 0.25, 0.4, 48]} />
        <meshStandardMaterial color="#e8e0d3" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.31, 0.022, 12, 48]} />
        <meshStandardMaterial color={accent} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.03, 48]} />
        <meshStandardMaterial color="#f4ead6" roughness={0.8} />
      </mesh>
      <Flame y={0.27} />
    </group>
  );
}

function Tube({ accent }: { accent: string }) {
  return (
    <group rotation={[0, 0, 0.2]}>
      <mesh scale={[1, 1, 0.62]}>
        <cylinderGeometry args={[0.16, 0.13, 0.52, 40]} />
        <meshStandardMaterial color={CREAM} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.05, 0]} scale={[1, 1, 0.62]}>
        <cylinderGeometry args={[0.162, 0.155, 0.08, 40]} />
        <meshStandardMaterial color={accent} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.33, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.14, 32]} />
        <meshStandardMaterial color={accent} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Bottle({ accent }: { accent: string }) {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.13, 0.14, 0.46, 40]} />
        <meshPhysicalMaterial color={AMBER} roughness={0.1} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.1, 0.11, 0.2, 32]} />
        <meshStandardMaterial color={accent} roughness={0.35} metalness={0.3} />
      </mesh>
    </group>
  );
}

function Dropper() {
  return (
    <group>
      <mesh position={[0, -0.08, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.36, 40]} />
        <meshPhysicalMaterial color={AMBER} roughness={0.08} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.07, 0.12, 0.08, 32]} />
        <meshPhysicalMaterial color={AMBER} roughness={0.08} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.09, 32]} />
        <meshStandardMaterial color="#c9a45c" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.32, 0]} scale={[0.075, 0.12, 0.075]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color="#1d1f21" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Balm({ accent }: { accent: string }) {
  return (
    <group rotation={[0.5, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.14, 48]} />
        <meshStandardMaterial color="#b3babc" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.072, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.22, 48]} />
        <meshStandardMaterial color={CREAM} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.074, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.13, 48]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Ball({ accent }: { accent: string }) {
  // míček s výstupky (ježek)
  const bumps = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const n = 42;
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      pts.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(0.26));
    }
    return pts;
  }, []);
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.26, 40, 40]} />
        <meshStandardMaterial color={accent} roughness={0.55} />
      </mesh>
      {bumps.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color={accent} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function Roller() {
  return (
    <group rotation={[0, 0, 0.15]}>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.05, 0.065, 0.55, 24]} />
        <meshStandardMaterial color={WOOD} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 16]} />
        <meshStandardMaterial color="#8c6a47" roughness={0.6} />
      </mesh>
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.2, 0]}>
          <sphereGeometry args={[0.14, 32, 32]} />
          <meshStandardMaterial color={WOOD} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function FoamRoller({ accent }: { accent: string }) {
  return (
    <group rotation={[0.3, 0.4, Math.PI / 2]}>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.72, 40]} />
        <meshStandardMaterial color="#3a4046" roughness={0.85} />
      </mesh>
      {[-0.24, -0.08, 0.08, 0.24].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.025, 10, 40]} />
          <meshStandardMaterial color={accent} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function MassageGun({ accent }: { accent: string }) {
  return (
    <group rotation={[0, 0, -0.1]}>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 0.42, 24]} />
        <meshStandardMaterial color="#2b2f33" roughness={0.5} />
      </mesh>
      <mesh position={[0.02, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.42, 32]} />
        <meshStandardMaterial color="#2b2f33" roughness={0.45} />
      </mesh>
      <mesh position={[0.26, 0.18, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.1, 16]} />
        <meshStandardMaterial color="#9aa2a5" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.34, 0.18, 0]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial color={accent} roughness={0.5} />
      </mesh>
    </group>
  );
}

function GuaSha() {
  const geometry = useMemo(() => {
    const s = new THREE.Shape();
    // tvar křídla / srdce s vykrojením
    s.moveTo(0, -0.3);
    s.bezierCurveTo(0.28, -0.26, 0.34, 0.05, 0.22, 0.24);
    s.bezierCurveTo(0.14, 0.34, 0.04, 0.3, 0, 0.2);
    s.bezierCurveTo(-0.04, 0.3, -0.14, 0.34, -0.22, 0.24);
    s.bezierCurveTo(-0.34, 0.05, -0.28, -0.26, 0, -0.3);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 4 });
    g.center();
    return g;
  }, []);
  return (
    <mesh geometry={geometry} rotation={[0.2, 0, 0]}>
      <meshPhysicalMaterial color="#b9e0d6" roughness={0.05} transmission={0.6} thickness={0.3} ior={1.5} clearcoat={1} />
    </mesh>
  );
}

function Card({ accent }: { accent: string }) {
  return (
    <group rotation={[0, 0, 0.08]}>
      <RoundedBox args={[0.46, 0.64, 0.02]} radius={0.008} smoothness={2}>
        <meshStandardMaterial color={CREAM} roughness={0.9} />
      </RoundedBox>
      <mesh position={[0, 0.1, 0.012]}>
        <circleGeometry args={[0.12, 48]} />
        <meshStandardMaterial color={accent} roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.18, 0.012]}>
        <planeGeometry args={[0.14, 0.14]} />
        <meshStandardMaterial color="#1d1f21" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Voucher({ accent }: { accent: string }) {
  return (
    <group rotation={[0, 0, -0.1]}>
      <RoundedBox args={[0.66, 0.4, 0.025]} radius={0.01} smoothness={2}>
        <meshStandardMaterial color="#1b3547" roughness={0.6} />
      </RoundedBox>
      <mesh position={[-0.16, 0, 0.014]}>
        <ringGeometry args={[0.08, 0.1, 48]} />
        <meshStandardMaterial color={accent} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0.12, 0.05, 0.014]}>
        <planeGeometry args={[0.26, 0.03]} />
        <meshStandardMaterial color={accent} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0.08, -0.04, 0.014]}>
        <planeGeometry args={[0.18, 0.02]} />
        <meshStandardMaterial color={accent} metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Notebook() {
  return (
    <group rotation={[0, 0, -0.08]}>
      <RoundedBox args={[0.46, 0.62, 0.09]} radius={0.02} smoothness={3}>
        <meshStandardMaterial color="#d7caae" roughness={0.95} />
      </RoundedBox>
      <mesh position={[0.015, 0, 0]}>
        <boxGeometry args={[0.44, 0.58, 0.075]} />
        <meshStandardMaterial color="#f6f0e3" roughness={0.9} />
      </mesh>
      <mesh position={[0.23, 0, 0]}>
        <boxGeometry args={[0.07, 0.15, 0.1]} />
        <meshStandardMaterial color="#c5b391" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Honey() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.22, 0.22, 0.36, 40]} />
        <meshPhysicalMaterial color="#e3a431" roughness={0.1} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.25, 0.23, 0.07, 40]} />
        <meshStandardMaterial color="#e9dcc2" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.225, 0.008, 8, 40]} />
        <meshStandardMaterial color="#8a6b45" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Glass() {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.22, 0.18, 0.46, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.03}
          transmission={0.92}
          thickness={0.05}
          ior={1.45}
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.03, 48]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.05} transmission={0.9} thickness={0.1} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.19, 0.175, 0.2, 48]} />
        <meshStandardMaterial color="#c68a3b" roughness={0.1} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function Chocolate() {
  return (
    <group rotation={[0, 0, 0.12]}>
      <mesh>
        <boxGeometry args={[0.4, 0.62, 0.07]} />
        <meshStandardMaterial color="#c8a574" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.22, 0.004]}>
        <boxGeometry args={[0.4, 0.2, 0.075]} />
        <meshStandardMaterial color="#4b2a1a" roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.05, 0.005]}>
        <boxGeometry args={[0.41, 0.018, 0.075]} />
        <meshStandardMaterial color="#8a6b45" />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <boxGeometry args={[0.018, 0.63, 0.075]} />
        <meshStandardMaterial color="#8a6b45" />
      </mesh>
    </group>
  );
}

export function Model({ kind, accent }: { kind: ModelKey; accent: string }) {
  switch (kind) {
    case "tin":
      return <Tin />;
    case "candle":
      return <Candle />;
    case "candleCeramic":
      return <CandleCeramic accent={accent} />;
    case "tube":
      return <Tube accent={accent} />;
    case "bottle":
      return <Bottle accent={accent} />;
    case "dropper":
      return <Dropper />;
    case "balm":
      return <Balm accent={accent} />;
    case "ball":
      return <Ball accent={accent} />;
    case "roller":
      return <Roller />;
    case "foamRoller":
      return <FoamRoller accent={accent} />;
    case "massageGun":
      return <MassageGun accent={accent} />;
    case "gem":
      return <GuaSha />;
    case "card":
      return <Card accent={accent} />;
    case "voucher":
      return <Voucher accent={accent} />;
    case "notebook":
      return <Notebook />;
    case "honey":
      return <Honey />;
    case "glass":
      return <Glass />;
    case "chocolate":
      return <Chocolate />;
    default:
      return <Tin />;
  }
}
