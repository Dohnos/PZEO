"use client";

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Model } from "@/components/Models3D";
import * as THREE from "three";
import type { BoxVariant } from "@/data/boxes";
import type { ModelKey } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Časování a dráhy                                                   */
/* ------------------------------------------------------------------ */

const LID_TIME = 1.25; // zvednutí a odložení víka
const FIRST = 1.05; // kdy vyjede první věc
const STEP = 1.05; // rozestup mezi věcmi
const RISE = 0.45; // vyjetí z krabice
const HOLD = 0.55; // představení uprostřed
const FLY = 0.5; // odlet na místo
const CLOSE_TIME = 0.75;

const BOX_TOP = 1.1;
const INSIDE = new THREE.Vector3(0, 0.6, 0);
const PRESENT = new THREE.Vector3(0, 2.15, 1.9);
const PLACED_SCALE = 1.2;

/* víko: zavřené → zvednuté → opřené vlevo o krabici (jako na fotce) */
const LID_CLOSED = { p: new THREE.Vector3(0, BOX_TOP + 0.15, 0), r: new THREE.Euler(0, 0, 0) };
const LID_LIFT = { p: new THREE.Vector3(0.1, 2.9, 0.3), r: new THREE.Euler(-0.35, 0.2, 0.15) };
const LID_LEAN = { p: new THREE.Vector3(-1.72, 1.28, -0.75), r: new THREE.Euler(0.12, 0.42, 1.18) };

/** šest míst na oblouku nad krabicí */
const SLOTS = [160, 132, 104, 76, 48, 20].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return new THREE.Vector3(2.2 * Math.cos(a), 1.85 + 1.25 * Math.sin(a), 0.7);
});

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

type ItemState = { pos: THREE.Vector3; scale: number; spin: number; placed: number };

/** Stav jedné věci v čase e (sekundy od otevření). */
function itemAt(i: number, e: number, out: ItemState) {
  const s = FIRST + i * STEP;
  const slot = SLOTS[i];
  if (e <= s) {
    out.pos.copy(INSIDE);
    out.scale = 0;
    out.spin = 0;
    out.placed = 0;
  } else if (e <= s + RISE) {
    const k = easeOutCubic((e - s) / RISE);
    out.pos.lerpVectors(INSIDE, PRESENT, k);
    out.scale = 1.45 * k;
    out.spin = k * Math.PI;
    out.placed = 0;
  } else if (e <= s + RISE + HOLD) {
    const k = (e - s - RISE) / HOLD;
    out.pos.copy(PRESENT);
    out.pos.y += Math.sin(k * Math.PI) * 0.08;
    out.scale = 1.45;
    out.spin = Math.PI + k * Math.PI;
    out.placed = 0;
  } else if (e <= s + RISE + HOLD + FLY) {
    const k = easeInOutCubic((e - s - RISE - HOLD) / FLY);
    out.pos.lerpVectors(PRESENT, slot, k);
    out.pos.y += Math.sin(k * Math.PI) * 0.35; // lehký oblouk letu
    out.scale = 1.45 - (1.45 - PLACED_SCALE) * k;
    out.spin = 2 * Math.PI;
    out.placed = k;
  } else {
    out.pos.copy(slot);
    out.scale = PLACED_SCALE;
    out.spin = 2 * Math.PI;
    out.placed = 1;
  }
}

/** Které věci se právě představují (nebo null). */
function presentingAt(e: number): number | null {
  for (let i = 0; i < 6; i++) {
    const s = FIRST + i * STEP;
    if (e > s && e <= s + RISE + HOLD + FLY * 0.4) return i;
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Scéna                                                              */
/* ------------------------------------------------------------------ */

type SceneProps = {
  variant: BoxVariant;
  models: ModelKey[];
  open: boolean;
  restartKey: string;
  highlighted: number | null;
  reduce: boolean;
  onPresent?: (index: number | null) => void;
};

function Scene({ variant, models, open, restartKey, highlighted, reduce, onPresent }: SceneProps) {
  const t = variant.theme;
  const clock = useThree((s) => s.clock);
  const lidPivot = useRef<THREE.Group>(null);
  const itemRefs = useRef<Array<THREE.Group | null>>([]);
  const openedAt = useRef<number | null>(null);
  const closedAt = useRef<number | null>(null);
  const frozenE = useRef(0);
  const lastPresent = useRef<number | null>(-1);
  const tmp = useMemo<ItemState>(() => ({ pos: new THREE.Vector3(), scale: 0, spin: 0, placed: 0 }), []);
  const tmpVec = useMemo(() => new THREE.Vector3(), []);
  const lidTmp = useMemo(() => ({ p: new THREE.Vector3() }), []);

  // otevření / zavření
  useEffect(() => {
    const now = clock.getElapsedTime();
    if (open) {
      openedAt.current = reduce ? now - 100 : now;
      closedAt.current = null;
    } else if (openedAt.current !== null) {
      frozenE.current = now - openedAt.current;
      closedAt.current = now;
      openedAt.current = null;
    }
  }, [open, reduce, clock]);

  // nová varianta = nové představení
  useEffect(() => {
    if (openedAt.current !== null) openedAt.current = reduce ? clock.getElapsedTime() - 100 : clock.getElapsedTime();
  }, [restartKey, reduce, clock]);

  useFrame(({ clock: c }) => {
    const now = c.getElapsedTime();
    let e = 0;
    let collapse = 1; // 1 = otevřeno, 0 = vše v krabici

    if (openedAt.current !== null) {
      e = now - openedAt.current;
    } else if (closedAt.current !== null) {
      e = frozenE.current;
      collapse = 1 - easeInOutCubic(clamp01((now - closedAt.current) / (reduce ? 0.001 : CLOSE_TIME)));
    } else {
      collapse = 0;
    }

    // víko: zvednout, pak odložit a opřít vlevo
    const L = clamp01(e / LID_TIME) * collapse;
    const g = lidPivot.current;
    if (g) {
      const a = easeInOutCubic(clamp01(L / 0.45));
      const b = easeOutBack(clamp01((L - 0.45) / 0.55));
      lidTmp.p.lerpVectors(LID_CLOSED.p, LID_LIFT.p, a).lerp(LID_LEAN.p, b);
      g.position.copy(lidTmp.p);
      g.rotation.set(
        THREE.MathUtils.lerp(THREE.MathUtils.lerp(LID_CLOSED.r.x, LID_LIFT.r.x, a), LID_LEAN.r.x, b),
        THREE.MathUtils.lerp(THREE.MathUtils.lerp(LID_CLOSED.r.y, LID_LIFT.r.y, a), LID_LEAN.r.y, b),
        THREE.MathUtils.lerp(THREE.MathUtils.lerp(LID_CLOSED.r.z, LID_LIFT.r.z, a), LID_LEAN.r.z, b),
      );
    }

    // věci
    for (let i = 0; i < 6; i++) {
      const it = itemRefs.current[i];
      if (!it) continue;
      itemAt(i, e, tmp);
      tmpVec.lerpVectors(INSIDE, tmp.pos, collapse);
      const bob = reduce ? 0 : Math.sin(now * 1.4 + i * 0.9) * 0.05 * tmp.placed;
      it.position.set(tmpVec.x, tmpVec.y + bob, tmpVec.z);
      const hi = highlighted === i && tmp.placed > 0.99 ? 1.18 : 1;
      const sc = Math.max(0.0001, tmp.scale * collapse * hi);
      it.scale.setScalar(sc);
      const idle = reduce ? 0 : Math.sin(now * 0.8 + i) * 0.25 * tmp.placed;
      it.rotation.set(0.12, tmp.spin + idle - 0.35 + i * 0.12, 0);
    }

    // kterou věc právě představujeme
    const p = openedAt.current !== null && !reduce ? presentingAt(e) : null;
    if (p !== lastPresent.current) {
      lastPresent.current = p;
      onPresent?.(p);
    }
  });

  const items: ReactNode[] = models.map((m, i) => <Model key={`${i}-${m}`} kind={m} accent={t.motif} />);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 6, 5]} intensity={1.6} castShadow />
      <directionalLight position={[-4, 3, -2]} intensity={0.5} />
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 5, 3]} scale={[8, 3, 1]} form="rect" />
        <Lightformer intensity={1} position={[-5, 2, 1]} scale={[3, 5, 1]} form="rect" />
        <Lightformer intensity={1} position={[5, 2, 1]} scale={[3, 5, 1]} form="rect" />
      </Environment>

      {/* kulatá krabice */}
      <group>
        <mesh position={[0, BOX_TOP / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.25, 1.25, BOX_TOP, 96]} />
          <meshStandardMaterial color={t.boxBody} roughness={0.78} />
        </mesh>
        {/* vnitřek */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BOX_TOP + 0.002, 0]}>
          <circleGeometry args={[1.19, 96]} />
          <meshStandardMaterial color={new THREE.Color(t.boxBody).multiplyScalar(0.4)} roughness={1} />
        </mesh>
        {/* lněná výstelka vyčnívající nad okraj */}
        <mesh position={[0, BOX_TOP + 0.1, 0]}>
          <cylinderGeometry args={[1.17, 1.16, 0.22, 96, 1, true]} />
          <meshStandardMaterial color="#efe7d8" roughness={0.95} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, BOX_TOP + 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.17, 0.03, 12, 96]} />
          <meshStandardMaterial color="#f4ede0" roughness={0.9} />
        </mesh>
        {/* znak na přední straně */}
        <mesh position={[0, BOX_TOP / 2, 1.255]}>
          <torusGeometry args={[0.19, 0.016, 16, 64]} />
          <meshStandardMaterial color={t.motif} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, BOX_TOP / 2, 1.255]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.12, 0.12, 0.01]} />
          <meshStandardMaterial color={t.motif} metalness={0.6} roughness={0.3} />
        </mesh>

        {/* víko */}
        <group ref={lidPivot} position={[0, BOX_TOP + 0.15, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.31, 1.31, 0.3, 96]} />
            <meshStandardMaterial color={t.boxLid} roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.152, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.34, 64]} />
            <meshStandardMaterial color={t.motif} metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      </group>

      {/* věci */}
      {items.map((node, i) => (
        <group
          key={i}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          scale={0.0001}
        >
          {node}
        </group>
      ))}

      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={9} blur={2.6} far={4} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Veřejná komponenta                                                 */
/* ------------------------------------------------------------------ */

type Props = SceneProps & {
  active: boolean;
  fallback?: ReactNode;
};

/** Zachytí chybu 3D (např. zařízení bez WebGL) a ukáže 2D zálohu místo pádu stránky. */
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

export default function Box3D({ active, fallback, ...scene }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => setSupported(hasWebGL()), []);

  if (supported === false) return <>{fallback}</>;
  if (supported === null) return <div className="aspect-square w-full" />;

  return (
    <SafeBoundary fallback={fallback}>
      <Box3DCanvas active={active} fallback={fallback} {...scene} />
    </SafeBoundary>
  );
}

function Box3DCanvas({ active, fallback, ...scene }: Props) {
  return (
    <div className="relative aspect-square w-full">
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full transition-colors duration-500"
        style={{ background: scene.variant.theme.halo }}
      />
      <Canvas
        className="!absolute inset-0"
        style={{ pointerEvents: "none" }}
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 3.5, 8.6], fov: 36 }}
        onCreated={({ camera }) => camera.lookAt(0, 1.55, 0)}
        gl={{ antialias: true, alpha: true }}
        fallback={fallback}
        aria-hidden="true"
      >
        <Scene {...scene} />
      </Canvas>
    </div>
  );
}
