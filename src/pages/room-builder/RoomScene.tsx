// eslint-disable-next-line react-refresh/only-export-components
import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export type PlacedItem = {
  id: string;
  productId: number;
  name: string;
  width: number;
  length: number;
  height: number;
  categoryId: number;
  position: [number, number, number];
  rotationY: number;
};

export type RBProduct = {
  id: number;
  name: string;
  price: number;
  images: string[];
  categoryId: number;
  width: number;
  length: number;
  height: number;
  colors: string[];
};

// eslint-disable-next-line react-refresh/only-export-components
export const CATEGORY_COLORS: Record<number, string> = {
  1: "#8B6E52",
  2: "#7B9DB8",
  3: "#7A6B52",
  4: "#6B7A8B",
  5: "#7A8B6B",
  6: "#C4A84F",
};

// ─── Material helper ──────────────────────────────────────────────────────────
function m(
  color: string,
  roughness = 0.85,
  metalness = 0,
  isSelected = false
) {
  return {
    color,
    roughness,
    metalness,
    emissive: "#ffffff" as string,
    emissiveIntensity: isSelected ? 0.07 : 0,
  };
}

interface ShapeProps {
  w: number;
  h: number;
  l: number;
  color: string;
  isSelected: boolean;
}

// ─── Sofa (Living Room) ───────────────────────────────────────────────────────
function SofaShape({ w, h, l, color, isSelected }: ShapeProps) {
  const legH = 0.13;
  const seatH = h * 0.42;
  const backH = h * 0.62;
  const armW = Math.max(0.14, w * 0.1);
  const wood = "#2C1A0A";
  const cushionXs = w > 1.6 ? [-w / 4, w / 4] : [0];
  const cushionW = w > 1.6 ? w / 2 - 0.08 : w - armW * 2 - 0.06;
  const armH = seatH * 0.6 + backH * 0.25;
  const legPositions: [number, number][] = [
    [-w / 2 + 0.15, l / 2 - 0.15],
    [ w / 2 - 0.15, l / 2 - 0.15],
    [-w / 2 + 0.15, -(l / 2 - 0.15)],
    [ w / 2 - 0.15, -(l / 2 - 0.15)],
  ];
  return (
    <group>
      {/* Seat base */}
      <mesh position={[0, legH + seatH * 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, seatH * 0.55, l]} />
        <meshStandardMaterial {...m(color, 0.9, 0, isSelected)} />
      </mesh>
      {/* Seat cushions — rounded */}
      {cushionXs.map((x, i) => (
        <RoundedBox key={i} args={[cushionW, seatH * 0.52, l * 0.67]} radius={0.05} smoothness={4}
          position={[x, legH + seatH * 0.76, 0]} castShadow receiveShadow>
          <meshStandardMaterial {...m(color, 0.95, 0, isSelected)} />
        </RoundedBox>
      ))}
      {/* Backrest frame */}
      <mesh position={[0, legH + seatH + backH * 0.5, -(l / 2 - 0.11)]} castShadow receiveShadow>
        <boxGeometry args={[w, backH, 0.22]} />
        <meshStandardMaterial {...m(color, 0.9, 0, isSelected)} />
      </mesh>
      {/* Back cushions — rounded */}
      {cushionXs.map((x, i) => (
        <RoundedBox key={i} args={[cushionW, backH * 0.84, 0.15]} radius={0.04} smoothness={4}
          position={[x, legH + seatH + backH * 0.5, -(l / 2 - 0.24)]} castShadow receiveShadow>
          <meshStandardMaterial {...m(color, 0.95, 0, isSelected)} />
        </RoundedBox>
      ))}
      {/* Armrests */}
      {([-1, 1] as const).map((side, i) => (
        <group key={i}>
          <mesh position={[side * (w / 2 - armW / 2), legH + armH / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[armW, armH, l]} />
            <meshStandardMaterial {...m(color, 0.9, 0, isSelected)} />
          </mesh>
          {/* Padded armrest top */}
          <RoundedBox args={[armW + 0.02, 0.07, l + 0.02]} radius={0.03} smoothness={4}
            position={[side * (w / 2 - armW / 2), legH + armH + 0.035, 0]} castShadow>
            <meshStandardMaterial {...m(color, 0.88, 0, isSelected)} />
          </RoundedBox>
        </group>
      ))}
      {/* Cylindrical tapered legs */}
      {legPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, legH / 2, z]} castShadow>
          <cylinderGeometry args={[0.032, 0.042, legH, 8]} />
          <meshStandardMaterial color={wood} roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Bed (Bedroom) ────────────────────────────────────────────────────────────
function BedShape({ w, h, l, color, isSelected }: ShapeProps) {
  const postR = 0.045;
  const postH = Math.max(0.75, h * 1.15);
  const frameH = 0.18;
  const mattH = h * 0.52;
  const wood = "#4A2C12";
  const postXs = [-w / 2 + postR, w / 2 - postR] as const;
  const postZs = [-l / 2 + postR, l / 2 - postR] as const;
  const slats = 5;
  return (
    <group>
      {/* Bed frame */}
      <mesh position={[0, frameH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, frameH, l]} />
        <meshStandardMaterial color={wood} roughness={0.65} />
      </mesh>
      {/* Side rails */}
      {([-1, 1] as const).map((side, i) => (
        <mesh key={i} position={[side * (w / 2 - 0.04), frameH + 0.06, 0]} castShadow>
          <boxGeometry args={[0.07, 0.12, l]} />
          <meshStandardMaterial color={wood} roughness={0.65} />
        </mesh>
      ))}
      {/* Mattress — rounded */}
      <RoundedBox args={[w * 0.93, mattH, l * 0.95]} radius={0.04} smoothness={4}
        position={[0, frameH + mattH / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f2ede8" roughness={0.88} />
      </RoundedBox>
      {/* Duvet — rounded */}
      <RoundedBox args={[w * 0.88, 0.1, l * 0.56]} radius={0.04} smoothness={4}
        position={[0, frameH + mattH + 0.05, l * 0.17]} castShadow receiveShadow>
        <meshStandardMaterial {...m(color, 0.95, 0, isSelected)} />
      </RoundedBox>
      {/* Pillows — rounded */}
      {[-(w * 0.21), w * 0.21].map((x, i) => (
        <RoundedBox key={i} args={[w * 0.36, 0.12, 0.34]} radius={0.04} smoothness={4}
          position={[x, frameH + mattH + 0.06, -(l / 2 - 0.23)]} castShadow receiveShadow>
          <meshStandardMaterial color="#f5f0ea" roughness={0.9} />
        </RoundedBox>
      ))}
      {/* Headboard — vertical slats */}
      {Array.from({ length: slats }).map((_, i) => {
        const x = -w / 2 + ((i + 0.5) * w) / slats;
        return (
          <mesh key={i} position={[x, postH * 0.52, -(l / 2 - 0.06)]} castShadow receiveShadow>
            <boxGeometry args={[w / slats - 0.03, postH * 0.78, 0.07]} />
            <meshStandardMaterial color={wood} roughness={0.6} />
          </mesh>
        );
      })}
      {/* Headboard rail */}
      <mesh position={[0, postH * 0.06, -(l / 2 - 0.06)]} castShadow>
        <boxGeometry args={[w, postH * 0.12, 0.09]} />
        <meshStandardMaterial color={wood} roughness={0.6} />
      </mesh>
      {/* Footboard */}
      <mesh position={[0, frameH + mattH * 0.28, l / 2 - 0.05]} castShadow receiveShadow>
        <boxGeometry args={[w, frameH + mattH * 0.28, 0.08]} />
        <meshStandardMaterial color={wood} roughness={0.65} />
      </mesh>
      {/* Cylindrical corner bedposts */}
      {postXs.flatMap((x) =>
        postZs.map((z, j) => (
          <mesh key={`${x}-${j}`} position={[x, postH / 2, z]} castShadow>
            <cylinderGeometry args={[postR, postR * 1.1, postH, 10]} />
            <meshStandardMaterial color={wood} roughness={0.5} metalness={0.05} />
          </mesh>
        ))
      )}
    </group>
  );
}

// ─── Dining Table ─────────────────────────────────────────────────────────────
function TableShape({ w, h, l, color, isSelected }: ShapeProps) {
  const topH = 0.07;
  const legH = h - topH;
  const legR = 0.04;
  const legPositions: [number, number][] = [
    [-w / 2 + 0.1, l / 2 - 0.1],
    [ w / 2 - 0.1, l / 2 - 0.1],
    [-w / 2 + 0.1, -(l / 2 - 0.1)],
    [ w / 2 - 0.1, -(l / 2 - 0.1)],
  ];
  return (
    <group>
      {/* Table top — rounded */}
      <RoundedBox args={[w, topH, l]} radius={0.025} smoothness={4}
        position={[0, legH + topH / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...m(color, 0.6, 0.05, isSelected)} />
      </RoundedBox>
      {/* Apron frame */}
      {([
        [0,          l / 2 - 0.04,  w * 0.9, 0.06, 0.04],
        [0,         -(l / 2 - 0.04), w * 0.9, 0.06, 0.04],
        [ w / 2 - 0.04, 0,           0.04,   0.06, l * 0.9],
        [-(w / 2 - 0.04), 0,         0.04,   0.06, l * 0.9],
      ] as [number, number, number, number, number][]).map(([x, z, bw, bh, bl], i) => (
        <mesh key={i} position={[x, legH - 0.04, z]} castShadow>
          <boxGeometry args={[bw, bh, bl]} />
          <meshStandardMaterial {...m(color, 0.65, 0, isSelected)} />
        </mesh>
      ))}
      {/* Cylindrical tapered legs */}
      {legPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, legH / 2, z]} castShadow receiveShadow>
          <cylinderGeometry args={[legR * 0.8, legR, legH, 8]} />
          <meshStandardMaterial {...m(color, 0.6, 0.05, isSelected)} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Desk (Office) ────────────────────────────────────────────────────────────
function DeskShape({ w, h, l, color, isSelected }: ShapeProps) {
  const topH = 0.05;
  const legH = h - topH;
  const legR = 0.022;
  const metalMat = { color: "#8a8a8a", roughness: 0.25, metalness: 0.9, emissive: "#ffffff" as string, emissiveIntensity: isSelected ? 0.05 : 0 };
  const legPositions: [number, number][] = [
    [-w / 2 + 0.07, l / 2 - 0.07],
    [ w / 2 - 0.07, l / 2 - 0.07],
    [-w / 2 + 0.07, -(l / 2 - 0.07)],
    [ w / 2 - 0.07, -(l / 2 - 0.07)],
  ];
  return (
    <group>
      {/* Desk top — rounded */}
      <RoundedBox args={[w, topH, l]} radius={0.02} smoothness={4}
        position={[0, legH + topH / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...m(color, 0.55, 0.06, isSelected)} />
      </RoundedBox>
      {/* Thin metal tube legs */}
      {legPositions.map(([x, z], i) => (
        <mesh key={i} position={[x, legH / 2, z]} castShadow receiveShadow>
          <cylinderGeometry args={[legR, legR, legH, 8]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>
      ))}
      {/* Cross stretcher between front legs */}
      <mesh position={[0, legH * 0.18, l / 2 - 0.07]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[legR * 0.8, legR * 0.8, w - 0.14, 8]} />
        <meshStandardMaterial {...metalMat} />
      </mesh>
      {/* Monitor */}
      <RoundedBox args={[Math.min(0.54, w * 0.4), 0.36, 0.04]} radius={0.015} smoothness={4}
        position={[0, legH + topH + 0.31, -(l / 2 - 0.1)]} castShadow>
        <meshStandardMaterial color="#111111" roughness={0.15} metalness={0.75} />
      </RoundedBox>
      {/* Monitor stand */}
      <mesh position={[0, legH + topH + 0.12, -(l / 2 - 0.12)]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.24, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Monitor base disc */}
      <mesh position={[0, legH + topH + 0.01, -(l / 2 - 0.12)]} castShadow>
        <cylinderGeometry args={[0.1, 0.11, 0.02, 12]} />
        <meshStandardMaterial color="#222222" roughness={0.4} metalness={0.7} />
      </mesh>
      {/* Keyboard */}
      <RoundedBox args={[Math.min(0.36, w * 0.26), 0.02, 0.115]} radius={0.008} smoothness={3}
        position={[0, legH + topH + 0.012, 0]} castShadow>
        <meshStandardMaterial color="#d8d8d8" roughness={0.7} metalness={0.1} />
      </RoundedBox>
    </group>
  );
}

// ─── Outdoor Bench ────────────────────────────────────────────────────────────
function BenchShape({ w, h, l, color, isSelected }: ShapeProps) {
  const seatY = h - 0.07;
  const legR = 0.025;
  const metalMat = { color: "#606060", roughness: 0.35, metalness: 0.8, emissive: "#ffffff" as string, emissiveIntensity: isSelected ? 0.05 : 0 };
  const slats = 5;
  const slatGap = l / slats;
  return (
    <group>
      {/* Rounded seat slats */}
      {Array.from({ length: slats }).map((_, i) => {
        const z = -l / 2 + (i + 0.5) * slatGap;
        return (
          <RoundedBox key={i} args={[w, 0.055, slatGap * 0.8]} radius={0.02} smoothness={4}
            position={[0, seatY + 0.028, z]} castShadow receiveShadow>
            <meshStandardMaterial {...m(color, 0.65, 0, isSelected)} />
          </RoundedBox>
        );
      })}
      {/* Side frames — cylindrical legs */}
      {([-w / 2 + 0.06, w / 2 - 0.06] as const).map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Front & back vertical legs */}
          {([l / 2 - 0.08, -(l / 2 - 0.08)] as const).map((z, j) => (
            <mesh key={j} position={[0, seatY / 2, z]} castShadow>
              <cylinderGeometry args={[legR, legR, seatY, 8]} />
              <meshStandardMaterial {...metalMat} />
            </mesh>
          ))}
          {/* Horizontal stretcher */}
          <mesh position={[0, seatY * 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[legR * 0.85, legR * 0.85, l * 0.84, 8]} />
            <meshStandardMaterial {...metalMat} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Floor Lamp (Lighting) ────────────────────────────────────────────────────
function LampShape({ w, h, color, isSelected }: Omit<ShapeProps, "l">) {
  const poleH = h * 0.82;
  const shadeH = h * 0.2;
  const shadeR = Math.max(0.22, w * 0.55);
  const poleMat = { color: "#b0b0b0", roughness: 0.2, metalness: 0.95, emissive: "#ffffff" as string, emissiveIntensity: isSelected ? 0.05 : 0 };
  return (
    <group>
      {/* Weighted disc base */}
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.05, 16]} />
        <meshStandardMaterial color="#888888" roughness={0.35} metalness={0.85} emissive="#ffffff" emissiveIntensity={isSelected ? 0.06 : 0} />
      </mesh>
      {/* Thin cylindrical pole */}
      <mesh position={[0, 0.05 + poleH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.022, poleH, 10]} />
        <meshStandardMaterial {...poleMat} />
      </mesh>
      {/* Cone shade — open bottom */}
      <mesh position={[0, 0.05 + poleH + shadeH * 0.45, 0]} castShadow receiveShadow>
        <coneGeometry args={[shadeR, shadeH, 20, 1, true]} />
        <meshStandardMaterial {...m(color, 0.72, 0, isSelected)} side={THREE.DoubleSide} />
      </mesh>
      {/* Shade top cap ring */}
      <mesh position={[0, 0.05 + poleH + shadeH * 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 10]} />
        <meshStandardMaterial {...poleMat} />
      </mesh>
      {/* Bulb glow */}
      <mesh position={[0, 0.05 + poleH + 0.06, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial color="#fff9e6" emissive="#ffe066" emissiveIntensity={1.5} roughness={1} />
      </mesh>
    </group>
  );
}

// ─── Default Box (fallback) ───────────────────────────────────────────────────
function DefaultShape({ w, h, l, color, isSelected }: ShapeProps) {
  return (
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, l]} />
      <meshStandardMaterial {...m(color, 0.8, 0, isSelected)} />
    </mesh>
  );
}

const CATEGORY_SHAPES: Record<number, React.ComponentType<ShapeProps>> = {
  1: SofaShape,
  2: BedShape,
  3: TableShape,
  4: DeskShape,
  5: BenchShape,
  6: (props) => <LampShape {...props} />,
};

// ─── Room ─────────────────────────────────────────────────────────────────────
function Room({ w, l }: { w: number; l: number }) {
  const halfW = w / 2;
  const halfL = l / 2;
  const wallH = 3.2;
  return (
    <group>
      {/* Hardwood floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, l]} />
        <meshStandardMaterial color="#c4956a" roughness={0.82} metalness={0.02} />
      </mesh>
      {/* Subtle floor board lines */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[w, l, 1, Math.floor(l * 3)]} />
        <meshStandardMaterial color="#ba8a60" roughness={0.9} opacity={0.18} transparent />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, wallH / 2, -halfL]} receiveShadow>
        <planeGeometry args={[w, wallH]} />
        <meshStandardMaterial color="#f2ede6" roughness={0.95} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-halfW, wallH / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[l, wallH]} />
        <meshStandardMaterial color="#ede9e2" roughness={0.95} />
      </mesh>
      {/* Right wall */}
      <mesh position={[halfW, wallH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[l, wallH]} />
        <meshStandardMaterial color="#ede9e2" roughness={0.95} />
      </mesh>

      {/* Baseboard back */}
      <mesh position={[0, 0.06, -halfL + 0.01]} castShadow>
        <boxGeometry args={[w, 0.12, 0.02]} />
        <meshStandardMaterial color="#e8e2da" roughness={0.9} />
      </mesh>
      {/* Baseboard left */}
      <mesh position={[-halfW + 0.01, 0.06, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[l, 0.12, 0.02]} />
        <meshStandardMaterial color="#e8e2da" roughness={0.9} />
      </mesh>
      {/* Baseboard right */}
      <mesh position={[halfW - 0.01, 0.06, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[l, 0.12, 0.02]} />
        <meshStandardMaterial color="#e8e2da" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ─── FurnitureMesh ────────────────────────────────────────────────────────────
interface FurnitureMeshProps {
  item: PlacedItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdatePosition: (id: string, pos: [number, number, number]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orbitControlsRef: React.RefObject<any>;
  roomHalfW: number;
  roomHalfL: number;
}

function FurnitureMesh({
  item,
  isSelected,
  onSelect,
  onUpdatePosition,
  orbitControlsRef,
  roomHalfW,
  roomHalfL,
}: FurnitureMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const posRef = useRef<[number, number, number]>([...item.position] as [number, number, number]);
  const rotRef = useRef(item.rotationY);
  const [hovered, setHovered] = useState(false);

  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const rc = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const hit = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!isDragging.current) {
      posRef.current = [...item.position] as [number, number, number];
      rotRef.current = item.rotationY;
    }
  }, [item.position, item.rotationY]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.set(...posRef.current);
    groupRef.current.rotation.y = rotRef.current;
  });

  useEffect(() => {
    const canvas = gl.domElement;
    const hw = (item.width || 1) / 2;
    const hl = (item.length || 1) / 2;

    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      rc.current.setFromCamera(mouse.current, camera);
      const result = rc.current.ray.intersectPlane(floorPlane.current, hit.current);
      if (result) {
        posRef.current = [
          Math.max(-roomHalfW + hw, Math.min(roomHalfW - hw, hit.current.x)),
          0,
          Math.max(-roomHalfL + hl, Math.min(roomHalfL - hl, hit.current.z)),
        ];
      }
    };

    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
      onUpdatePosition(item.id, posRef.current);
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
    };
  }, [gl.domElement, camera, item.id, item.width, item.length, roomHalfW, roomHalfL, onUpdatePosition, orbitControlsRef]);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onSelect(item.id);
      isDragging.current = true;
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
    },
    [item.id, onSelect, orbitControlsRef]
  );

  const ShapeComp = CATEGORY_SHAPES[item.categoryId] ?? DefaultShape;
  const color = CATEGORY_COLORS[item.categoryId] ?? "#888888";
  const labelY = item.height + 0.45;

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <ShapeComp
        w={item.width}
        h={item.height}
        l={item.length}
        color={color}
        isSelected={isSelected}
      />

      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
          <ringGeometry args={[
            Math.max(item.width, item.length) * 0.52,
            Math.max(item.width, item.length) * 0.56,
            32
          ]} />
          <meshBasicMaterial color="#B88E2F" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
      )}

      {(isSelected || hovered) && (
        <Html
          position={[0, labelY, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <span
            style={{
              background: isSelected ? "#B88E2F" : "#fff",
              color: isSelected ? "#fff" : "#333",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "999px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {item.name.length > 16 ? item.name.slice(0, 16) + "…" : item.name}
          </span>
        </Html>
      )}
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
interface SceneProps {
  placedItems: PlacedItem[];
  selectedId: string | null;
  roomW: number;
  roomL: number;
  onSelectItem: (id: string) => void;
  onUpdatePosition: (id: string, pos: [number, number, number]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orbitControlsRef: React.RefObject<any>;
}

function Scene({ placedItems, selectedId, roomW, roomL, onSelectItem, onUpdatePosition, orbitControlsRef }: SceneProps) {
  const maxDim = Math.max(roomW, roomL);
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 9, 4]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0005}
      />
      <directionalLight position={[-3, 6, -2]} intensity={0.35} />

      <Environment preset="apartment" />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.45}
        scale={maxDim * 1.5}
        blur={2.2}
        far={maxDim}
        resolution={512}
      />

      <Room w={roomW} l={roomL} />

      {placedItems.map((item) => (
        <FurnitureMesh
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onSelect={onSelectItem}
          onUpdatePosition={onUpdatePosition}
          orbitControlsRef={orbitControlsRef}
          roomHalfW={roomW / 2}
          roomHalfL={roomL / 2}
        />
      ))}

      <OrbitControls
        ref={orbitControlsRef}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={2}
        maxDistance={18}
        enablePan
        makeDefault
      />
    </>
  );
}

// ─── RoomScene (Canvas + toolbar overlay) ────────────────────────────────────
export interface RoomSceneProps {
  placedItems: PlacedItem[];
  selectedId: string | null;
  roomW: number;
  roomL: number;
  products: RBProduct[];
  onSelectItem: (id: string) => void;
  onDeselectAll: () => void;
  onUpdatePosition: (id: string, pos: [number, number, number]) => void;
  onRotate: (id: string) => void;
  onRemove: (id: string) => void;
  onAddToCart: (productId: number) => void;
}

export default function RoomScene({
  placedItems,
  selectedId,
  roomW,
  roomL,
  products,
  onSelectItem,
  onDeselectAll,
  onUpdatePosition,
  onRotate,
  onRemove,
  onAddToCart,
}: RoomSceneProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orbitControlsRef = useRef<any>(null);
  const selectedItem = placedItems.find((i) => i.id === selectedId) ?? null;
  const selectedProduct = selectedItem
    ? products.find((p) => p.id === selectedItem.productId) ?? null
    : null;

  const camDist = Math.max(roomW, roomL) * 1.2 + 3;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows
        camera={{ position: [0, camDist * 0.8, camDist], fov: 45 }}
        style={{ background: "#e8e4de" }}
        onPointerMissed={onDeselectAll}
      >
        <Scene
          placedItems={placedItems}
          selectedId={selectedId}
          roomW={roomW}
          roomL={roomL}
          onSelectItem={onSelectItem}
          onUpdatePosition={onUpdatePosition}
          orbitControlsRef={orbitControlsRef}
        />
      </Canvas>

      {/* Selected item toolbar */}
      {selectedItem && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-2xl shadow-2xl px-4 py-2.5 z-10"
          style={{ background: "#fff", whiteSpace: "nowrap", border: "1px solid #e5e5e5" }}
        >
          <span className="text-sm font-bold text-gray-800 max-w-[130px] truncate pr-1">
            {selectedItem.name}
          </span>
          <span className="w-px h-5 bg-gray-200 mx-0.5 shrink-0" />
          <button
            onClick={() => onRotate(selectedItem.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium"
          >
            ↺ Rotate
          </button>
          <button
            onClick={() => onRemove(selectedItem.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            🗑 Remove
          </button>
          {selectedProduct && (
            <button
              onClick={() => onAddToCart(selectedItem.productId)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-90"
              style={{ background: "#B88E2F" }}
            >
              🛒 Add to Cart
            </button>
          )}
        </div>
      )}

      <div className="absolute bottom-2 right-3 text-[10px] text-gray-400 select-none pointer-events-none">
        R — rotate &nbsp;·&nbsp; Del — remove &nbsp;·&nbsp; Esc — deselect
      </div>
    </div>
  );
}
