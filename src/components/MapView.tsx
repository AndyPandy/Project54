'use client'

import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
  address: string
}

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? 'zUtDrwoCqjB8Qaex3MQp'

export default function MapView({ lat, lng, address }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import('leaflet').then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl

      const markerIcon = L.divIcon({
        className: '',
        html: `<div style="width:12px;height:12px;background:#1A1815;border:2px solid #F0EDE6;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      })

      if (!containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 14)
      mapRef.current = map

      L.tileLayer(
        `https://api.maptiler.com/maps/dataviz-light/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
        {
          attribution: '© <a href="https://www.maptiler.com/">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          tileSize: 512,
          zoomOffset: -1,
        }
      ).addTo(map)

      L.marker([lat, lng], { icon: markerIcon }).addTo(map).bindPopup(address, { className: 'brand-popup' }).openPopup()
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
      <div className="h-64 bg-brand-offwhite flex items-center justify-center text-brand-muted text-sm">
        Ingen plats angiven
      </div>
    )
  }

  return <div ref={containerRef} className="h-72 overflow-hidden z-0" />
}
