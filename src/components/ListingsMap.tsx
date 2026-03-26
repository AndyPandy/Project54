'use client'

import { useEffect, useRef } from 'react'
import type { Apartment } from '@/types'

interface Props {
  apartments: Apartment[]
}

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY

export default function ListingsMap({ apartments }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  const valid = apartments.filter((a) => a.latitude && a.longitude)

  useEffect(() => {
    if (!containerRef.current || mapRef.current || valid.length === 0) return

    import('leaflet').then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl

      // Custom brand-colored marker
      const markerIcon = L.divIcon({
        className: '',
        html: `<div style="width:12px;height:12px;background:#1A1815;border:2px solid #F0EDE6;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      })

      if (!containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false })
      mapRef.current = map

      L.tileLayer(
        `https://api.maptiler.com/maps/dataviz-light/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
        {
          attribution: '© <a href="https://www.maptiler.com/">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          tileSize: 512,
          zoomOffset: -1,
        }
      ).addTo(map)

      const bounds = L.latLngBounds([])
      valid.forEach((apt) => {
        const priceLabel =
          apt.listingType === 'rent'
            ? `${apt.price.toLocaleString('sv-SE')} kr/mån`
            : `${apt.price.toLocaleString('sv-SE')} kr`

        const popup = `
          <a href="/apartments/${apt.slug}" style="text-decoration:none;color:inherit;font-family:'Raleway',sans-serif;">
            <strong style="font-size:12px;display:block;margin-bottom:2px;text-transform:uppercase;letter-spacing:0.08em;color:#1A1815">${apt.address}</strong>
            <span style="font-size:12px;font-weight:600;color:#1A1815">${priceLabel}</span>
          </a>`

        L.marker([apt.latitude, apt.longitude], { icon: markerIcon })
          .addTo(map)
          .bindPopup(popup, { className: 'brand-popup' })

        bounds.extend([apt.latitude, apt.longitude])
      })

      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
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

  if (valid.length === 0) return null

  return <div ref={containerRef} className="h-[28rem] w-full overflow-hidden z-0" />
}
