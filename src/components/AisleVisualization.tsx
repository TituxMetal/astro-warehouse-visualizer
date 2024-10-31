// src/components/AisleVisualization.tsx
import { useState } from 'react'
import { getCellConfig, getValidLevels } from '~/utils/warehouse'

interface Props {
  cell: number
  aisle: number
}

export const AisleVisualization = ({ cell, aisle }: Props) => {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const config = getCellConfig(cell)
  if (!config) return null

  const validLevels = getValidLevels(config.levelsPerLocation)
  const formattedAisle = aisle.toString().padStart(3, '0')

  const handlePositionClick = (position: number) => {
    setSelectedPosition(selectedPosition === position ? null : position)
  }

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>
        Cell {cell} - Aisle {formattedAisle}
      </h2>

      <div className='overflow-x-auto'>
        <div
          className='grid gap-4'
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}
        >
          {Array.from({ length: config.locationsPerAisle }).map((_, index) => {
            const position = index + 1
            const formattedPosition = position.toString().padStart(4, '0')
            const isSelected = selectedPosition === position

            return (
              <div
                key={`position-${position}`}
                className={`flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors ${
                  isSelected
                    ? 'border-blue-600 bg-blue-800'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
                onClick={() => handlePositionClick(position)}
              >
                <div className='text-sm font-semibold text-zinc-300'>
                  Position {formattedPosition}
                </div>
                {isSelected && (
                  <div className='mt-2 grid grid-cols-2 gap-2'>
                    {validLevels.map(level => {
                      // Create the location part (position-level)
                      const location = `${formattedPosition}-${level}`
                      return (
                        <a
                          key={`level-${level}`}
                          href={`/warehouse/cell/${cell}/aisle/${aisle}/${location}`}
                          className='flex items-center justify-center rounded border border-zinc-600 p-2 text-sm transition-colors hover:border-green-600 hover:bg-green-700'
                          onClick={e => e.stopPropagation()}
                        >
                          Level {level}
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className='mt-4 rounded-lg bg-zinc-800 p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Aisle Statistics</h3>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-400'>Positions</div>
            <div className='text-2xl font-bold'>{config.locationsPerAisle}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-400'>Levels per Position</div>
            <div className='text-2xl font-bold'>{config.levelsPerLocation}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-400'>Total Locations</div>
            <div className='text-2xl font-bold'>
              {config.locationsPerAisle * config.levelsPerLocation}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
