'use client'

import { useEffect, useRef } from 'react'
import type { Apartment } from '@/types'

interface Props {
  apartments: Apartment[]
}

export default function ListingsMap({ apartments }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  const valid = apartments.filter((a) => a.latitude && a.longitude)

  useEffect(() => {
    if (!containerRef.current || mapRef.current || valid.length === 0) return

    import('leaflet').then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      if (!containerRef.current || mapRef.current) return

      const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      const bounds = L.latLngBounds([])
      valid.forEach((apt) => {
        const priceLabel =
          apt.listingType === 'rent'
            ? `${apt.price.toLocaleString('sv-SE')} kr/mån`
            : `${apt.price.toLocaleString('sv-SE')} kr`

        const popup = `
          <a href="/apartments/${apt.slug}" style="text-decoration:none;color:inherit;">
            <strong style="font-size:13px;display:block;margin-bottom:2px">${apt.title}</strong>
            <span style="font-size:12px;color:#8C8070">${apt.address}</span><br/>
            <span style="font-size:13px;font-weight:700;color:#2C2C2C">${priceLabel}</span>
          </a>`

        L.marker([apt.latitude, apt.longitude])
          .addTo(map)
          .bindPopup(popup)

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

  return <div ref={containerRef} className="h-80 w-full rounded-xl overflow-hidden border border-gray-200 z-0" />
}
