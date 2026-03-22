'use client'

import { useState } from 'react'

interface Props {
  floorPlan: string
}

export default function FloorPlanButton({ floorPlan }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-brand-navy/30 text-brand-navy hover:bg-brand-navy hover:text-white transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Planlösning
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-brand-navy">Planlösning</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-brand-muted hover:text-brand-navy transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 overflow-auto max-h-[calc(90vh-64px)]">
              <img
                src={floorPlan}
                alt="Planlösning"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
