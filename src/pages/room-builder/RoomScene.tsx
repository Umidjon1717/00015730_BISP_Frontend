import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid, Html } from "@react-three/drei";
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

export const CATEGORY_COLORS: Record<number, string> = {
  1: "#8B7355",
  2: "#6B8CAE",
  3: "#7A9E7E",
  4: "#9E8A7A",
  5: "#8FAF72",
  6: "#C4A84F",
};

// --- Room geometry (floor + 3 walls + grid) ---
function Room({ size }: { size: number }) {
  const half = size / 2;
  const wallH = 3;
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#d4b896" roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, wallH / 2, -half]}>
        <planeGeometry args={[size, wallH]} />
        <meshStandardMaterial color="#e8e0d6" side={THREE.DoubleSide} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-half, wallH / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[size, wallH]} />
        <meshStandardMaterial color="#e0d8cf" side={THREE.DoubleSide} />
      </mesh>

      {/* Right wall */}
      <mesh position={[half, wallH / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[size, wallH]} />
        <meshStandardMaterial color="#e0d8cf" side={THREE.DoubleSide} />
      </mesh>

      <Grid
        position={[0, 0.002, 0]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#bbbbbb"
        sectionSize={size}
        sectionThickness={0.8}
        sectionColor="#888888"
        fadeDistance={size * 4}
        infiniteGrid={false}
      />
    </group>
  );
}

// --- Single furniture mesh (imperative drag pattern) ---
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
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const posRef = useRef<[number, number, number]>([...item.position] as [number, number, number]);
  const rotRef = useRef(item.rotationY);
  const [hovered, setHovered] = useState(false);

  const floorPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const rc = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const hit = useRef(new THREE.Vector3());

  // Sync from item props → refs when not dragging
  useEffect(() => {
    if (!isDragging.current) {
      posRef.current = [...item.position] as [number, number, number];
      rotRef.current = item.rotationY;
    }
  }, [item.position, item.rotationY]);

  // Apply refs → mesh every animation frame (avoids R3F reconciler conflicts)
  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.set(...posRef.current);
    meshRef.current.rotation.y = rotRef.current;
  });

  // DOM-level pointer listeners for smooth drag without re-renders
  useEffect(() => {
    const canvas = gl.domElement;
    const half = roomHalfSize;
    const hw = (item.width || 1) / 2;
    const hl = (item.length || 1) / 2;
    const yPos = (item.height || 0.8) / 2;

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
          yPos,
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
  }, [gl.domElement, camera, item.id, item.width, item.length, item.height, roomHalfSize, onUpdatePosition, orbitControlsRef]);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onSelect(item.id);
      isDragging.current = true;
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
    },
    [item.id, onSelect, orbitControlsRef]
  );

  const color = CATEGORY_COLORS[item.categoryId] ?? "#888888";
  const w = item.width || 1;
  const h = item.height || 0.8;
  const l = item.length || 1;

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[w, h, l]} />
      <meshStandardMaterial
        color={color}
        emissive={isSelected ? "#ffffff" : "#000000"}
        emissiveIntensity={isSelected ? 0.18 : 0}
        roughness={0.7}
        metalness={0.05}
      />
      {(isSelected || hovered) && (
        <Html
          position={[0, h / 2 + 0.35, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: "none" }}
        >
          <span
            style={{
              background: "#fff",
              color: "#333",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "999px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.22)",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {item.name.length > 15 ? item.name.slice(0, 15) + "…" : item.name}
          </span>
        </Html>
      )}
    </mesh>
  );
}

// --- Scene (runs inside Canvas) ---
interface SceneProps {
  placedItems: PlacedItem[];
  selectedId: string | null;
  roomSize: number;
  onSelectItem: (id: string) => void;
  onUpdatePosition: (id: string, pos: [number, number, number]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orbitControlsRef: React.RefObject<any>;
}

function Scene({
  placedItems,
  selectedId,
  roomSize,
  onSelectItem,
  onUpdatePosition,
  orbitControlsRef,
}: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-3, 5, -3]} intensity={0.4} />

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
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        enablePan
        makeDefault
      />
    </>
  );
}

// --- RoomScene: Canvas wrapper + HTML toolbar overlay ---
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
        camera={{ position: [0, 8, 10], fov: 50 }}
        style={{ background: "#f0ede8" }}
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
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-2xl shadow-xl px-4 py-2.5 z-10 border border-gray-100"
          style={{ background: "#fff", whiteSpace: "nowrap" }}
        >
          <span className="text-sm font-semibold text-gray-700 max-w-[120px] truncate">
            {selectedItem.name}
          </span>
          <span className="w-px h-5 bg-gray-200 mx-1 shrink-0" />
          <button
            onClick={() => onRotate(selectedItem.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ↺ Rotate
          </button>
          <button
            onClick={() => onRemove(selectedItem.id)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            🗑 Remove
          </button>
          {selectedProduct && (
            <button
              onClick={() => onAddToCart(selectedItem.productId)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              🛒 Add to Cart
            </button>
          )}
        </div>
      )}

      {/* Keyboard hint */}
      <div className="absolute bottom-2 right-3 text-[10px] text-gray-400 select-none pointer-events-none">
        R — rotate &nbsp;·&nbsp; Del — remove &nbsp;·&nbsp; Esc — deselect
      </div>
    </div>
  );
}
