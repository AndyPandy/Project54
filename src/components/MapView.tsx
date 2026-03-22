'use client'

import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
  address: string
}

export default function MapView({ lat, lng, address }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // Fix default marker icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      if (!containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 14)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      L.marker([lat, lng]).addTo(map).bindPopup(address).openPopup()
    })

    return () => {
      if (mapRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(mapRef.current as any).remove()
        mapRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!lat || !lng) {
    return (
      <div className="h-64 bg-brand-offwhite rounded-xl flex items-center justify-center text-brand-muted text-sm">
        Ingen plats angiven
      </div>
    )
  }

  return <div ref={containerRef} className="h-72 rounded-xl overflow-hidden border border-gray-100 z-0" />
}
