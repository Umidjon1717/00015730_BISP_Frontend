import { useState, useEffect, useRef, useCallback } from 'react'
import L from 'leaflet'

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

const REGION_MAP: Record<string, string> = {
  toshkent: 'Tashkent', tashkent: 'Tashkent',
  namangan: 'Namangan',
  andijon: 'Andijan', andijan: 'Andijan',
  "farg'ona": 'Fergana', fergana: 'Fergana', farghona: 'Fergana',
  jizzax: 'Jizzakh', jizzakh: 'Jizzakh',
  samarqand: 'Samarkand', samarkand: 'Samarkand',
  buxoro: 'Bukhara', bukhara: 'Bukhara',
  qashqadaryo: 'Kashkadarya', kashkadarya: 'Kashkadarya', "kashkadar'ya": 'Kashkadarya',
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

export default function MapPicker({ onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  // Keep onSelect stable via ref so we never need to re-attach the click handler
  const onSelectRef = useRef(onSelect)
  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])

  const [pin, setPin] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)

  const reverse = useCallback(async (lat: number, lng: number) => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      const a = data.address ?? {}
      onSelectRef.current({
        lat, lng,
        street: a.road ?? a.street ?? a.pedestrian ?? a.path ?? '',
        district: a.suburb ?? a.quarter ?? a.neighbourhood ?? a.district ?? a.county ?? '',
        region: resolveRegion(a.state ?? a.province ?? a.region ?? ''),
      })
    } catch {
      onSelectRef.current({ lat, lng, street: '', district: '', region: '' })
    } finally {
      setLoading(false)
    }
  }, [])

  const placePin = useCallback((lat: number, lng: number) => {
    const map = mapRef.current
    if (!map) return
    setPin([lat, lng])
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(map)
    }
    map.flyTo([lat, lng], 15, { duration: 1 })
    reverse(lat, lng)
  }, [reverse])

  // Initialize Leaflet map once using vanilla API — no react-leaflet hooks
  useEffect(() => {
    const el = containerRef.current
    if (!el || mapRef.current) return

    const map = L.map(el).setView([41.2995, 69.2401], 11)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map)

    map.on('click', (e: L.LeafletMouseEvent) => {
      placePin(e.latlng.lat, e.latlng.lng)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [placePin])

  const handleMyLocation = () => {
    if (!navigator.geolocation) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        placePin(coords.latitude, coords.longitude)
        setLocating(false)
      },
      () => setLocating(false),
      { timeout: 8000 }
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-600">
      <div ref={containerRef} style={{ height: 280, width: '100%' }} />

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

      {loading && (
        <div className="absolute inset-0 bg-white/40 dark:bg-black/30 flex items-center justify-center z-[999]">
          <div className="w-7 h-7 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      )}

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
