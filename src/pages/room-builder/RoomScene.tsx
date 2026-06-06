// eslint-disable-next-line react-refresh/only-export-components
import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Html } from "@react-three/drei";
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
  const legH = 0.1;
  const seatH = h * 0.42;
  const backH = h * 0.62;
  const armW = Math.max(0.12, w * 0.1);
  const wood = "#3D2010";
  return (
    <group>
      {/* Seat base */}
      <mesh position={[0, legH + seatH * 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, seatH * 0.55, l]} />
        <meshStandardMaterial {...m(color, 0.92, 0, isSelected)} />
      </mesh>
      {/* Seat cushions */}
      {(w > 1.6 ? [-w / 4, w / 4] : [0]).map((x, i) => (
        <mesh key={i} position={[x, legH + seatH * 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[w > 1.6 ? w / 2 - 0.06 : w - armW * 2 - 0.04, seatH * 0.5, l * 0.68]} />
          <meshStandardMaterial {...m(color, 0.95, 0, isSelected)} />
        </mesh>
      ))}
      {/* Backrest */}
      <mesh
        position={[0, legH + seatH + backH * 0.5, -(l / 2 - 0.1)]}
        castShadow receiveShadow
      >
        <boxGeometry args={[w, backH, 0.2]} />
        <meshStandardMaterial {...m(color, 0.92, 0, isSelected)} />
      </mesh>
      {/* Back cushions */}
      {(w > 1.6 ? [-w / 4, w / 4] : [0]).map((x, i) => (
        <mesh key={i} position={[x, legH + seatH + backH * 0.5, -(l / 2 - 0.22)]} castShadow receiveShadow>
          <boxGeometry args={[w > 1.6 ? w / 2 - 0.08 : w - armW * 2 - 0.06, backH * 0.85, 0.12]} />
          <meshStandardMaterial {...m(color, 0.95, 0, isSelected)} />
        </mesh>
      ))}
      {/* Left arm */}
      <mesh
        position={[-(w / 2 - armW / 2), legH + (seatH * 0.6 + backH * 0.25) / 2, 0]}
        castShadow receiveShadow
      >
        <boxGeometry args={[armW, seatH * 0.6 + backH * 0.25, l]} />
        <meshStandardMaterial {...m(color, 0.92, 0, isSelected)} />
      </mesh>
      {/* Right arm */}
      <mesh
        position={[(w / 2 - armW / 2), legH + (seatH * 0.6 + backH * 0.25) / 2, 0]}
        castShadow receiveShadow
      >
        <boxGeometry args={[armW, seatH * 0.6 + backH * 0.25, l]} />
        <meshStandardMaterial {...m(color, 0.92, 0, isSelected)} />
      </mesh>
      {/* Legs */}
      {[
        [-w / 2 + 0.13, l / 2 - 0.13],
        [w / 2 - 0.13, l / 2 - 0.13],
        [-w / 2 + 0.13, -(l / 2 - 0.13)],
        [w / 2 - 0.13, -(l / 2 - 0.13)],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, legH / 2, z]} castShadow>
          <boxGeometry args={[0.07, legH, 0.07]} />
          <meshStandardMaterial color={wood} roughness={0.5} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Bed (Bedroom) ────────────────────────────────────────────────────────────
function BedShape({ w, h, l, color, isSelected }: ShapeProps) {
  const frameH = 0.18;
  const mattH = h * 0.55;
  const headH = Math.max(0.7, h * 1.1);
  const wood = "#4A2C12";
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, frameH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, frameH, l]} />
        <meshStandardMaterial color={wood} roughness={0.65} metalness={0} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, frameH + mattH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.94, mattH, l * 0.96]} />
        <meshStandardMaterial {...m("#f2ede8", 0.88, 0, isSelected)} />
      </mesh>
      {/* Duvet */}
      <mesh position={[0, frameH + mattH + 0.045, l * 0.18]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.89, 0.09, l * 0.58]} />
        <meshStandardMaterial {...m(color, 0.95, 0, isSelected)} />
      </mesh>
      {/* Pillows */}
      {[-(w * 0.22), w * 0.22].map((x, i) => (
        <mesh key={i} position={[x, frameH + mattH + 0.07, -(l / 2 - 0.22)]} castShadow receiveShadow>
          <boxGeometry args={[w * 0.37, 0.13, 0.35]} />
          <meshStandardMaterial color="#f5f0ea" roughness={0.9} metalness={0} />
        </mesh>
      ))}
      {/* Headboard */}
      <mesh position={[0, headH / 2, -(l / 2 - 0.05)]} castShadow receiveShadow>
        <boxGeometry args={[w, headH, 0.1]} />
        <meshStandardMaterial color={wood} roughness={0.65} metalness={0} />
      </mesh>
      {/* Footboard */}
      <mesh position={[0, frameH + mattH * 0.3, l / 2 - 0.05]} castShadow receiveShadow>
        <boxGeometry args={[w, frameH + mattH * 0.3, 0.07]} />
        <meshStandardMaterial color={wood} roughness={0.65} metalness={0} />
      </mesh>
    </group>
  );
}

// ─── Dining Table ─────────────────────────────────────────────────────────────
function TableShape({ w, h, l, color, isSelected }: ShapeProps) {
  const topH = 0.07;
  const legH = h - topH;
  const legS = 0.07;
  return (
    <group>
      {/* Table top */}
      <mesh position={[0, legH + topH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topH, l]} />
        <meshStandardMaterial {...m(color, 0.65, 0, isSelected)} />
      </mesh>
      {/* Apron (underside frame) */}
      {([
        [0, 0, l / 2 - 0.04, w * 0.9, 0.06, 0.04],
        [0, 0, -(l / 2 - 0.04), w * 0.9, 0.06, 0.04],
        [w / 2 - 0.04, 0, 0, 0.04, 0.06, l * 0.9],
        [-(w / 2 - 0.04), 0, 0, 0.04, 0.06, l * 0.9],
      ] as [number, number, number, number, number, number][]).map(([x, , z, bw, bh, bl], i) => (
        <mesh key={i} position={[x, legH - 0.04, z]} castShadow>
          <boxGeometry args={[bw, bh, bl]} />
          <meshStandardMaterial {...m(color, 0.65, 0, isSelected)} />
        </mesh>
      ))}
      {/* Legs */}
      {[
        [-w / 2 + 0.1, l / 2 - 0.1],
        [w / 2 - 0.1, l / 2 - 0.1],
        [-w / 2 + 0.1, -(l / 2 - 0.1)],
        [w / 2 - 0.1, -(l / 2 - 0.1)],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, legH / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[legS, legH, legS]} />
          <meshStandardMaterial {...m(color, 0.65, 0, isSelected)} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Desk (Office) ────────────────────────────────────────────────────────────
function DeskShape({ w, h, l, color, isSelected }: ShapeProps) {
  const topH = 0.05;
  const legH = h - topH;
  const legS = 0.05;
  const metalMat = { color: "#999999", roughness: 0.3, metalness: 0.85, emissive: "#ffffff", emissiveIntensity: isSelected ? 0.05 : 0 };
  return (
    <group>
      {/* Desk top */}
      <mesh position={[0, legH + topH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topH, l]} />
        <meshStandardMaterial {...m(color, 0.62, 0.05, isSelected)} />
      </mesh>
      {/* Metal legs */}
      {[
        [-w / 2 + 0.06, l / 2 - 0.06],
        [w / 2 - 0.06, l / 2 - 0.06],
        [-w / 2 + 0.06, -(l / 2 - 0.06)],
        [w / 2 - 0.06, -(l / 2 - 0.06)],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, legH / 2, z]} castShadow receiveShadow>
          <boxGeometry args={[legS, legH, legS]} />
          <meshStandardMaterial {...metalMat} />
        </mesh>
      ))}
      {/* Monitor */}
      <mesh position={[0, legH + topH + 0.32, -(l / 2 - 0.09)]} castShadow>
        <boxGeometry args={[Math.min(0.55, w * 0.4), 0.38, 0.04]} />
        <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.7} />
      </mesh>
      <mesh position={[0, legH + topH + 0.13, -(l / 2 - 0.11)]} castShadow>
        <boxGeometry args={[0.05, 0.22, 0.05]} />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Keyboard */}
      <mesh position={[0, legH + topH + 0.015, 0]} castShadow>
        <boxGeometry args={[Math.min(0.38, w * 0.27), 0.02, 0.12]} />
        <meshStandardMaterial color="#dddddd" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}

// ─── Outdoor Bench ────────────────────────────────────────────────────────────
function BenchShape({ w, h, l, color, isSelected }: ShapeProps) {
  const seatH = 0.07;
  const seatY = h - seatH;
  const metalMat = { color: "#666666", roughness: 0.45, metalness: 0.75, emissive: "#ffffff", emissiveIntensity: isSelected ? 0.05 : 0 };
  const slats = 4;
  const slatW = (l / slats) * 0.78;
  return (
    <group>
      {/* Seat slats */}
      {Array.from({ length: slats }).map((_, i) => {
        const z = -l / 2 + (i + 0.5) * (l / slats);
        return (
          <mesh key={i} position={[0, seatY + seatH / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[w, seatH, slatW]} />
            <meshStandardMaterial {...m(color, 0.7, 0, isSelected)} />
          </mesh>
        );
      })}
      {/* Side frames */}
      {[-w / 2 + 0.07, w / 2 - 0.07].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {[l / 2 - 0.07, -(l / 2 - 0.07)].map((z, j) => (
            <mesh key={j} position={[0, seatY / 2, z]} castShadow>
              <boxGeometry args={[0.06, seatY, 0.06]} />
              <meshStandardMaterial {...metalMat} />
            </mesh>
          ))}
          <mesh position={[0, seatY * 0.38, 0]} castShadow>
            <boxGeometry args={[0.06, 0.06, l * 0.82]} />
            <meshStandardMaterial {...metalMat} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Floor Lamp (Lighting) ────────────────────────────────────────────────────
function LampShape({ w, h, color, isSelected }: Omit<ShapeProps, "l">) {
  const poleH = h * 0.8;
  const shadeH = h * 0.18;
  const shadeW = Math.max(0.38, w * 0.9);
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.07, 0.28]} />
        <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.8} emissive="#ffffff" emissiveIntensity={isSelected ? 0.06 : 0} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.04 + poleH / 2, 0]} castShadow>
        <boxGeometry args={[0.04, poleH, 0.04]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.9} emissive="#ffffff" emissiveIntensity={isSelected ? 0.05 : 0} />
      </mesh>
      {/* Shade */}
      <mesh position={[0, 0.04 + poleH + shadeH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[shadeW, shadeH, shadeW]} />
        <meshStandardMaterial {...m(color, 0.75, 0, isSelected)} />
      </mesh>
      {/* Bulb glow */}
      <mesh position={[0, 0.04 + poleH, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#fff8e0" emissive="#fff5cc" emissiveIntensity={1.2} roughness={1} />
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
function Room({ size }: { size: number }) {
  const half = size / 2;
  const wallH = 3.2;
  return (
    <group>
      {/* Hardwood floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#c4956a" roughness={0.82} metalness={0.02} />
      </mesh>
      {/* Floor boards lines (very subtle via secondary layer) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[size, size, 1, Math.floor(size * 3)]} />
        <meshStandardMaterial color="#ba8a60" roughness={0.9} wireframe={false} opacity={0.18} transparent />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, wallH / 2, -half]} receiveShadow>
        <planeGeometry args={[size, wallH]} />
        <meshStandardMaterial color="#f2ede6" roughness={0.95} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-half, wallH / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[size, wallH]} />
        <meshStandardMaterial color="#ede9e2" roughness={0.95} />
      </mesh>
      {/* Right wall */}
      <mesh position={[half, wallH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[size, wallH]} />
        <meshStandardMaterial color="#ede9e2" roughness={0.95} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, wallH, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#f8f5f0" roughness={1} side={THREE.BackSide} />
      </mesh>

      {/* Baseboard back */}
      <mesh position={[0, 0.06, -half + 0.01]} castShadow>
        <boxGeometry args={[size, 0.12, 0.02]} />
        <meshStandardMaterial color="#e8e2da" roughness={0.9} />
      </mesh>
      {/* Baseboard left */}
      <mesh position={[-half + 0.01, 0.06, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[size, 0.12, 0.02]} />
        <meshStandardMaterial color="#e8e2da" roughness={0.9} />
      </mesh>
      {/* Baseboard right */}
      <mesh position={[half - 0.01, 0.06, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[size, 0.12, 0.02]} />
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
  roomHalfSize: number;
}

function FurnitureMesh({
  item,
  isSelected,
  onSelect,
  onUpdatePosition,
  orbitControlsRef,
  roomHalfSize,
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
    const half = roomHalfSize;
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
          Math.max(-half + hw, Math.min(half - hw, hit.current.x)),
          0,
          Math.max(-half + hl, Math.min(half - hl, hit.current.z)),
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
  }, [gl.domElement, camera, item.id, item.width, item.length, roomHalfSize, onUpdatePosition, orbitControlsRef]);

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
  roomSize: number;
  onSelectItem: (id: string) => void;
  onUpdatePosition: (id: string, pos: [number, number, number]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orbitControlsRef: React.RefObject<any>;
}

function Scene({ placedItems, selectedId, roomSize, onSelectItem, onUpdatePosition, orbitControlsRef }: SceneProps) {
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
        scale={roomSize * 1.5}
        blur={2.2}
        far={roomSize}
        resolution={512}
      />

      <Room size={roomSize} />

      {placedItems.map((item) => (
        <FurnitureMesh
          key={item.id}
          item={item}
          isSelected={selectedId === item.id}
          onSelect={onSelectItem}
          onUpdatePosition={onUpdatePosition}
          orbitControlsRef={orbitControlsRef}
          roomHalfSize={roomSize / 2}
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
  roomSize: number;
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
  roomSize,
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

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        shadows
        camera={{ position: [0, 7, 9], fov: 45 }}
        style={{ background: "#e8e4de" }}
        onPointerMissed={onDeselectAll}
      >
        <Scene
          placedItems={placedItems}
          selectedId={selectedId}
          roomSize={roomSize}
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
