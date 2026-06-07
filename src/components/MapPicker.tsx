import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet's broken default icon paths in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

export interface PickedLocation {
  lat: number
  lng: number
  street: string
  district: string
  region: string
}

interface Props {
  onSelect: (loc: PickedLocation) => void
}

// Nominatim → REGIONS mapping
const REGION_MAP: Record<string, string> = {
  toshkent: 'Tashkent', tashkent: 'Tashkent',
  namangan: 'Namangan',
  andijon: 'Andijan', andijan: 'Andijan',
  "farg'ona": 'Fergana', fergana: 'Fergana', farghona: 'Fergana',
  jizzax: 'Jizzakh', jizzakh: 'Jizzakh',
  samarqand: 'Samarkand', samarkand: 'Samarkand',
  buxoro: 'Bukhara', bukhara: 'Bukhara',
  qashqadaryo: 'Kashkadarya', kashkadarya: 'Kashkadarya', 'kashkadar\'ya': 'Kashkadarya',
  surxondaryo: 'Surkhandarya', surkhandarya: 'Surkhandarya',
  sirdaryo: 'Sirdarya', syrdarya: 'Sirdarya',
  navoiy: 'Navoi', navoi: 'Navoi',
  xorazm: 'Khorezm', khorezm: 'Khorezm',
  "qoraqalpog'iston": 'Karakalpakstan', karakalpakstan: 'Karakalpakstan',
}

function resolveRegion(state?: string): string {
  if (!state) return ''
  const key = state.toLowerCase().replace(/ (region|viloyati|oblast)$/i, '').trim()
  return REGION_MAP[key] ?? ''
}

// Fly map to new position
function FlyTo({ pos }: { pos: [number, number] }) {
  const map = useMap()
  useEffect(() => { map.flyTo(pos, 15, { duration: 1 }) }, [pos, map])
  return null
}

// Click handler inside map
function ClickLayer({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onClick(e.latlng.lat, e.latlng.lng) })
  return null
}

export default function MapPicker({ onSelect }: Props) {
  const [pin, setPin] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)

  const reverse = async (lat: number, lng: number) => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      const a = data.address ?? {}
      onSelect({
        lat, lng,
        street: a.road ?? a.street ?? a.pedestrian ?? a.path ?? '',
        district: a.suburb ?? a.quarter ?? a.neighbourhood ?? a.district ?? a.county ?? '',
        region: resolveRegion(a.state ?? a.province ?? a.region ?? ''),
      })
    } catch {
      onSelect({ lat, lng, street: '', district: '', region: '' })
    } finally {
      setLoading(false)
    }
  }

  const handleClick = (lat: number, lng: number) => {
    setPin([lat, lng])
    reverse(lat, lng)
  }

  const handleMyLocation = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos: [number, number] = [coords.latitude, coords.longitude]
        setPin(pos)
        reverse(coords.latitude, coords.longitude)
        setLocating(false)
      },
      () => setLocating(false),
      { timeout: 8000 }
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-600">
      <MapContainer
        center={[41.2995, 69.2401]}
        zoom={11}
        style={{ height: 280, width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickLayer onClick={handleClick} />
        {pin && (
          <>
            <Marker position={pin} />
            <FlyTo pos={pin} />
          </>
        )}
      </MapContainer>

      {/* My location button */}
      <button
        type="button"
        onClick={handleMyLocation}
        disabled={locating}
        className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-white dark:bg-zinc-800 dark:text-white shadow-md rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition disabled:opacity-60"
      >
        {locating ? (
          <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <span>📍</span>
        )}
        My Location
      </button>

      {/* Geocoding spinner overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/40 dark:bg-black/30 flex items-center justify-center z-[999]">
          <div className="w-7 h-7 border-3 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Hint when no pin yet */}
      {!pin && !loading && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
          <span className="bg-white dark:bg-zinc-800 dark:text-white shadow-md rounded-full px-4 py-2 text-sm text-gray-600 font-medium">
            Tap the map to drop your delivery pin
          </span>
        </div>
      )}
    </div>
  )
}
