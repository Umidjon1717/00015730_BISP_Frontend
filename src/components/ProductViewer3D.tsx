import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { CATEGORY_SHAPES, CATEGORY_COLORS } from '@/pages/room-builder/RoomScene'
import type { ShapeProps } from '@/pages/room-builder/RoomScene'

const CATEGORY_DIMS: Record<number, { w: number; h: number; l: number }> = {
  1: { w: 2.0,  h: 0.88, l: 0.95 },
  2: { w: 1.6,  h: 0.55, l: 2.0  },
  3: { w: 1.6,  h: 0.76, l: 0.9  },
  4: { w: 1.4,  h: 0.76, l: 0.65 },
  5: { w: 1.5,  h: 0.82, l: 0.55 },
  6: { w: 0.4,  h: 1.7,  l: 0.4  },
}
const DEFAULT_DIMS = { w: 1.0, h: 0.8, l: 1.0 }

function FallbackShape({ w, h, l, color }: ShapeProps) {
  return (
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[w, h, l]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  )
}

function Stage({ categoryId, color }: { categoryId: number; color: string }) {
  const dims = CATEGORY_DIMS[categoryId] ?? DEFAULT_DIMS
  const ShapeComp = CATEGORY_SHAPES[categoryId] ?? FallbackShape
  const radius = Math.max(dims.w, dims.l) * 0.68

  return (
    <group>
      {/* Presentation platform */}
      <mesh position={[0, -0.008, 0]} receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.04, 0.016, 48]} />
        <meshStandardMaterial color="#d6cfc4" roughness={0.6} metalness={0.06} />
      </mesh>

      <ShapeComp
        w={dims.w}
        h={dims.h}
        l={dims.l}
        color={color}
        isSelected={false}
      />
    </group>
  )
}

interface Props {
  categoryId: number
  colors: string[]
}

export default function ProductViewer3D({ categoryId, colors }: Props) {
  const fallback = CATEGORY_COLORS[categoryId] ?? '#8B6E52'
  const palette = colors?.length ? colors : [fallback]
  const [activeColor, setActiveColor] = useState(palette[0])

  const dims = CATEGORY_DIMS[categoryId] ?? DEFAULT_DIMS
  // Camera distance based on the largest dimension; add extra headroom for tall items
  const span = Math.max(dims.w, dims.l, dims.h * 0.6)
  const dist = span * 2.4 + 0.6
  const midY = dims.h / 2

  return (
    <div className="w-full">
      <div
        className="w-full rounded-2xl overflow-hidden"
        style={{
          height: 380,
          background: 'linear-gradient(160deg, #f6f1ea 0%, #ece6dc 100%)',
        }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [dist * 0.85, dist * 0.72, dist], fov: 40 }}
        >
          <ambientLight intensity={0.38} />
          <directionalLight
            position={[4, 9, 3]}
            intensity={1.05}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0005}
          />
          <directionalLight position={[-3, 5, -2]} intensity={0.28} />

          <Environment preset="apartment" />

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.52}
            scale={Math.max(dims.w, dims.l) * 3}
            blur={2.8}
            far={3}
          />

          <Stage categoryId={categoryId} color={activeColor} />

          <OrbitControls
            target={[0, midY, 0]}
            autoRotate
            autoRotateSpeed={1.4}
            enableDamping
            dampingFactor={0.07}
            minPolarAngle={Math.PI / 10}
            maxPolarAngle={Math.PI / 2.05}
            minDistance={1.5}
            maxDistance={dist * 1.6}
            enablePan={false}
          />
        </Canvas>
      </div>

      {/* Color swatches */}
      {palette.length > 1 && (
        <div className="flex items-center gap-3 mt-4 px-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium shrink-0 uppercase tracking-wide">
            Color
          </span>
          <div className="flex gap-2 flex-wrap">
            {palette.map((c, i) => (
              <button
                key={i}
                type="button"
                title={c}
                onClick={() => setActiveColor(c)}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  outline: activeColor === c ? '2px solid #B88E2F' : '2px solid transparent',
                  outlineOffset: '3px',
                  border: '1.5px solid rgba(0,0,0,0.12)',
                }}
              />
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2 select-none">
        Drag to rotate · Scroll to zoom
      </p>
    </div>
  )
}
