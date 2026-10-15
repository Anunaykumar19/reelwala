"use client";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox, Sparkles, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

type PhoneSpec = { src: string; pos: [number, number, number]; rot: [number, number, number]; scale: number; speed: number };

function Screen({ src }: { src: string }) {
  const tex = useVideoTexture(src, { crossOrigin: "anonymous", muted: true, loop: true, start: true, playsInline: true } as any);
  // object-fit: cover for 9:16 video on ~0.49 aspect plane
  const W = 1.3, H = 2.72;
  useMemo(() => {
    const va = 9 / 16, pa = W / H;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    if (pa < va) { tex.repeat.set(pa / va, 1); tex.offset.set((1 - pa / va) / 2, 0); } else { tex.repeat.set(1, va / pa); tex.offset.set(0, (1 - va / pa) / 2); }
    tex.colorSpace = THREE.SRGBColorSpace;
  }, [tex]);
  return (
    <mesh position={[0, 0, 0.075]}>
      <planeGeometry args={[W, H]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function Phone({ spec, mouse, scroll, idx }: { spec: PhoneSpec; mouse: React.MutableRefObject<[number, number]>; scroll: MotionValue<number>; idx: number }) {
  const g = useRef<THREE.Group>(null);
  const base = useMemo(() => new THREE.Vector3(...spec.pos), [spec.pos]);
  useFrame((state) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    const p = scroll.get();
    const [mx, my] = mouse.current;
    // bob + drift apart on scroll + zoom away
    const spread = 1 + p * 1.1;
    g.current.position.x = THREE.MathUtils.lerp(g.current.position.x, base.x * spread + Math.sin(t * spec.speed + idx) * 0.08, 0.08);
    g.current.position.y = THREE.MathUtils.lerp(g.current.position.y, base.y + Math.sin(t * spec.speed * 1.3 + idx * 2) * 0.15 - p * 1.5, 0.08);
    g.current.position.z = THREE.MathUtils.lerp(g.current.position.z, base.z - p * 4, 0.08);
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, spec.rot[0] + my * 0.25 + Math.sin(t * 0.5 + idx) * 0.03, 0.06);
    g.current.rotation.y = THREE.MathUtils.lerp(g.current.rotation.y, spec.rot[1] + mx * 0.35 + p * 0.6 * (idx % 2 ? 1 : -1), 0.06);
    g.current.rotation.z = THREE.MathUtils.lerp(g.current.rotation.z, spec.rot[2] + Math.sin(t * 0.4 + idx) * 0.02, 0.06);
  });
  return (
    <group ref={g} position={spec.pos} rotation={spec.rot} scale={spec.scale}>
      <RoundedBox args={[1.5, 3, 0.14]} radius={0.16} smoothness={6}>
        <meshStandardMaterial color="#1a1a24" metalness={0.9} roughness={0.25} />
      </RoundedBox>
      {/* bezel frame highlight */}
      <mesh position={[0, 0, 0.071]}>
        <planeGeometry args={[1.42, 2.9]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <Suspense fallback={<mesh position={[0, 0, 0.075]}><planeGeometry args={[1.3, 2.72]} /><meshBasicMaterial color="#2a1a4a" /></mesh>}>
        <Screen src={spec.src} />
      </Suspense>
      {/* dynamic island */}
      <mesh position={[0, 1.22, 0.08]}>
        <capsuleGeometry args={[0.045, 0.22, 4, 8]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      {/* screen glow onto scene */}
      <pointLight position={[0, 0, 0.6]} intensity={0.6} distance={2.5} color="#EC4899" />
    </group>
  );
}

function GlowRing({ scroll }: { scroll: MotionValue<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 512; c.height = 16;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 512, 0);
    g.addColorStop(0, "#7C3AED"); g.addColorStop(0.5, "#EC4899"); g.addColorStop(1, "#F97316");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 16);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.elapsedTime * 0.15;
    const sc = 1 + scroll.get() * 0.8;
    ref.current.scale.setScalar(sc);
  });
  return (
    <group position={[0, 0, -2.5]}>
      <mesh ref={ref}>
        <torusGeometry args={[3.4, 0.08, 16, 120]} />
        <meshBasicMaterial map={tex} transparent opacity={0.9} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[3.4, 0.5, 16, 120]} />
        <meshBasicMaterial color="#EC4899" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function Scene({ children, mobile }: { children: React.ReactNode; mobile: boolean }) {
  const g = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  useFrame(() => {
    if (!g.current) return;
    const need = mobile ? 5.2 : 8.8;
    const s = Math.min(1, viewport.width / need);
    g.current.scale.setScalar(THREE.MathUtils.lerp(g.current.scale.x, s, 0.1));
  });
  return <group ref={g}>{children}</group>;
}

function Rig({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.current[0] * 0.4, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.current[1] * 0.25, 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Hero3D({ videos, mobile, scroll }: { videos: string[]; mobile: boolean; scroll: MotionValue<number> }) {
  const mouse = useRef<[number, number]>([0, 0]);
  const specs: PhoneSpec[] = useMemo(() => mobile
    ? [
        { src: videos[0], pos: [-0.9, 0.2, 0], rot: [0.05, 0.35, -0.08], scale: 0.78, speed: 0.9 },
        { src: videos[1], pos: [0.95, -0.3, -0.6], rot: [-0.05, -0.35, 0.1], scale: 0.7, speed: 1.1 },
      ]
    : [
        { src: videos[0], pos: [0, 0, 0.4], rot: [0.02, -0.15, 0], scale: 1, speed: 0.8 },
        { src: videos[1], pos: [-2.4, 0.5, -1], rot: [0.1, 0.5, -0.12], scale: 0.85, speed: 1 },
        { src: videos[2], pos: [2.5, -0.4, -1], rot: [-0.05, -0.55, 0.12], scale: 0.85, speed: 1.2 },
        { src: videos[3], pos: [-3.9, -1.3, -2.6], rot: [0.15, 0.7, -0.2], scale: 0.7, speed: 0.7 },
        { src: videos[4], pos: [3.8, 1.5, -2.8], rot: [-0.2, -0.7, 0.2], scale: 0.65, speed: 1.3 },
      ], [videos, mobile]);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7.5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onPointerMove={(e) => { if (!mobile) mouse.current = [(e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1)]; }}
      className="!absolute inset-0"
      style={{ pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#fff" />
      <pointLight position={[-5, -2, 3]} intensity={30} color="#7C3AED" />
      <pointLight position={[5, 3, 2]} intensity={25} color="#F97316" />
      <Scene mobile={mobile}>
        <GlowRing scroll={scroll} />
        {specs.map((s, i) => (
          <Float key={i} speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
            <Phone spec={s} mouse={mouse} scroll={scroll} idx={i} />
          </Float>
        ))}
      </Scene>
      <Sparkles count={mobile ? 40 : 120} scale={[14, 8, 6]} size={2.5} speed={0.3} color="#EC4899" opacity={0.6} />
      <Rig mouse={mouse} />
    </Canvas>
  );
}
