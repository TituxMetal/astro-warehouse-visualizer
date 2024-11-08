// src/components/AisleVisualization.tsx
import type { Aisle, Cell, Location } from '@prisma/client'
import { useState } from 'react'

interface Props {
  aisles: (Aisle & {
    cell: Cell
    locations: Location[]
    _count: {
      locations: number
    }
  })[]
}

export const AisleVisualization = ({ aisles }: Props) => {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)

  // Early return if no aisles
  if (!aisles.length) return null

  const [oddAisle, evenAisle] = aisles
  const cell = oddAisle.cell
  const formattedAisle = oddAisle.number.toString().padStart(3, '0')

  // Get unique positions and levels
  const positions = Array.from(
    new Set(aisles.flatMap(aisle => aisle.locations.map(loc => loc.position)))
  ).sort((a, b) => a - b)

  const levels = Array.from(
    new Set(aisles.flatMap(aisle => aisle.locations.map(loc => loc.level)))
  ).sort((a, b) => a - b)

  const handlePositionClick = (position: number) => {
    setSelectedPosition(selectedPosition === position ? null : position)
  }

  const handleKeyPress = (e: React.KeyboardEvent, position: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handlePositionClick(position)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>
        Cell {cell.number} - Aisle {formattedAisle}
      </h2>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {positions.map(position => {
          const formattedPosition = position.toString().padStart(4, '0')
          const isSelected = selectedPosition === position

          return (
            <button
              key={`position-${position}`}
              className={`flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors ${
                isSelected ? 'border-blue-600 bg-blue-800' : 'border-zinc-700 hover:border-zinc-500'
              }`}
              onClick={() => handlePositionClick(position)}
              onKeyDown={e => handleKeyPress(e, position)}
              aria-expanded={isSelected}
              aria-label={`Position ${formattedPosition}`}
              tabIndex={0}
            >
              <div className='text-sm font-semibold text-zinc-300'>
                Position {formattedPosition}
              </div>
              {isSelected && (
                <div
                  className='mt-2 grid grid-cols-2 gap-2'
                  role='group'
                  aria-label={`Levels for position ${formattedPosition}`}
                >
                  {levels.map(level => {
                    const formattedLevel = level.toString().padStart(2, '0')
                    const location = `${formattedPosition}-${formattedLevel}`
                    const isPicking = level === 0

                    return (
                      <a
                        key={`level-${formattedLevel}`}
                        href={`/warehouse/cell/${cell.number}/aisle/${oddAisle.number}/${location}`}
                        className={`flex items-center justify-center rounded border p-2 text-sm transition-colors ${
                          isPicking
                            ? 'border-amber-400 bg-amber-900 text-amber-200 hover:bg-amber-800'
                            : 'border-zinc-600 hover:border-green-600 hover:bg-green-700'
                        }`}
                        onClick={e => e.stopPropagation()}
                        aria-label={`${isPicking ? 'Picking level' : `Level ${level}`} of position ${formattedPosition}`}
                        role='link'
                      >
                        {formattedLevel}
                      </a>
                    )
                  })}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div
        className='mt-4 rounded-lg bg-zinc-800 p-4'
        role='complementary'
        aria-label='Aisle Statistics'
      >
        <h3 className='mb-4 text-lg font-semibold'>Aisle Statistics</h3>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-300'>Positions</div>
            <div className='text-2xl font-bold'>{positions.length}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-300'>Levels per Position</div>
            <div className='text-2xl font-bold'>{levels.length}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-300'>Total Locations</div>
            <div className='text-2xl font-bold'>
              {aisles.reduce((total, aisle) => total + aisle._count.locations, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
