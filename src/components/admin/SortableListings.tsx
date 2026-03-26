'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DeleteButton from '@/components/admin/DeleteButton'

interface Apt {
  id: string
  title: string
  address: string
  listingType: string
  rooms: number
  sizeSqm: number
  price: number
  status: string
  slug: string
}

function SortableRow({ apt }: { apt: Apt }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: apt.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-brand-offwhite/50 transition">
      <td className="px-3 py-3.5">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-brand-muted/40 hover:text-brand-muted transition touch-none"
          title="Drag to reorder"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </td>
      <td className="px-5 py-3.5">
        <p className="font-medium text-brand-navy">{apt.title}</p>
        <p className="text-xs text-brand-muted mt-0.5">{apt.address}</p>
      </td>
      <td className="px-5 py-3.5 capitalize text-brand-muted">{apt.listingType}</td>
      <td className="px-5 py-3.5 text-brand-muted">{apt.rooms} rooms · {apt.sizeSqm} m²</td>
      <td className="px-5 py-3.5 font-semibold text-brand-navy">
        {apt.price.toLocaleString('sv-SE')} kr{apt.listingType === 'rent' ? '/mån' : ''}
      </td>
      <td className="px-5 py-3.5">
        <span className={`inline-block text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${apt.status === 'published' ? 'bg-brand-green/10 text-brand-green' : 'bg-amber-100 text-amber-600'}`}>
          {apt.status}
        </span>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-3">
          <Link href={`/apartments/${apt.slug}`} target="_blank" className="text-xs text-brand-muted hover:text-brand-navy transition">
            View ↗
          </Link>
          <Link href={`/admin/listings/${apt.id}/edit`} className="text-xs text-brand-green font-semibold hover:underline">
            Edit
          </Link>
          <DeleteButton id={apt.id} />
        </div>
      </td>
    </tr>
  )
}

export default function SortableListings({ initialApartments }: { initialApartments: Apt[] }) {
  const [apartments, setApartments] = useState(initialApartments)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor))

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = apartments.findIndex((a) => a.id === active.id)
    const newIndex = apartments.findIndex((a) => a.id === over.id)
    const reordered = arrayMove(apartments, oldIndex, newIndex)
    setApartments(reordered)

    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/sort', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: reordered.map((a) => a.id) }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      {(saving || saved) && (
        <p className="text-xs text-brand-muted mb-3 text-right">
          {saving ? 'Sparar ordning…' : '✓ Ordning sparad'}
        </p>
      )}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-offwhite/60">
            <tr>
              <th className="px-3 py-3" />
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Title</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Type</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Rooms / Size</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Price</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-brand-muted uppercase tracking-wide">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {apartments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-brand-muted">
                  No listings yet.{' '}
                  <Link href="/admin/listings/new" className="text-brand-green font-semibold hover:underline">
                    Create one →
                  </Link>
                </td>
              </tr>
            )}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={apartments.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                {apartments.map((apt) => (
                  <SortableRow key={apt.id} apt={apt} />
                ))}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
      </div>
    </div>
  )
}
