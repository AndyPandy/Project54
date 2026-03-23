'use client'

import { useState, useEffect } from 'react'

interface Props {
  count: number
}

const LINE1 = 'Hitta din nästa bostad'

export default function HeroTypewriter({ count }: Props) {
  const LINE2 = `Bläddra bland ${count} ${count === 1 ? 'annons' : 'annonser'}`

  const [displayed1, setDisplayed1] = useState('')
  const [displayed2, setDisplayed2] = useState('')
  const [phase, setPhase] = useState<'line1' | 'line2' | 'done'>('line1')

  useEffect(() => {
    if (phase === 'line1') {
      if (displayed1.length < LINE1.length) {
        const t = setTimeout(() => setDisplayed1(LINE1.slice(0, displayed1.length + 1)), 55)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('line2'), 400)
        return () => clearTimeout(t)
      }
    }
    if (phase === 'line2') {
      if (displayed2.length < LINE2.length) {
        const t = setTimeout(() => setDisplayed2(LINE2.slice(0, displayed2.length + 1)), 40)
        return () => clearTimeout(t)
      } else {
        setPhase('done')
      }
    }
  }, [displayed1, displayed2, phase, LINE2])

  return (
    <div className="absolute bottom-12 left-8 right-8 md:bottom-16 md:left-12">
      <p className="text-white font-black text-5xl md:text-7xl lg:text-8xl font-sans drop-shadow-lg leading-none tracking-tight">
        {displayed1}
        {phase === 'line1' && <span className="animate-pulse">|</span>}
      </p>
      {(displayed2 || phase === 'line2' || phase === 'done') && (
        <p className="text-white/70 text-lg md:text-2xl font-sans mt-4 tracking-wide">
          {displayed2}
          {phase === 'line2' && <span className="animate-pulse">|</span>}
        </p>
      )}
    </div>
  )
}
