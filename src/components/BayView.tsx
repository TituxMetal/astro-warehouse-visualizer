// src/components/BayView.tsx
import type { Bay, Location } from '@prisma/client'
import React from 'react'

interface BayViewProps {
  bay: Bay & {
    locations: Location[]
  }
  selectedPosition: number | null
  onLocationSelect: (position: number | null) => void
  cellNumber: number
  aisleNumber: number
}

const LevelsDisplay = React.memo<{
  levels: Location[]
  position: number
  cellNumber: number
  aisleNumber: number
}>(({ levels, position, cellNumber, aisleNumber }) => {
  const formattedPosition = position.toString().padStart(4, '0')

  return (
    <div className='mt-2 flex flex-row flex-nowrap justify-center gap-2'>
      {levels.map(location => (
        <a
          key={location.level}
          href={`/warehouse/cell/${cellNumber}/aisle/${aisleNumber}/${formattedPosition}-${location.level.toString().padStart(2, '0')}`}
          className={`rounded p-2 text-center text-sm ${
            location.isPicking
              ? 'bg-amber-900 hover:bg-amber-800'
              : 'bg-zinc-600 hover:bg-emerald-600'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {location.level.toString().padStart(2, '0')}
        </a>
      ))}
    </div>
  )
})

const LocationButton = React.memo<{
  position: number
  isSelected: boolean
  onSelect: (position: number | null) => void
}>(({ position, isSelected, onSelect }) => {
  const formattedPosition = position.toString().padStart(4, '0')

  return (
    <button
      className={`rounded p-2 transition-colors ${
        isSelected ? 'bg-sky-700' : 'bg-zinc-700 hover:bg-zinc-600'
      }`}
      onClick={() => onSelect(isSelected ? null : position)}
    >
      {formattedPosition}
    </button>
  )
})

export const BayView = React.memo<BayViewProps>(
  ({ bay, selectedPosition, onLocationSelect, cellNumber, aisleNumber }) => {
    const positions = React.useMemo(
      () => Array.from(new Set(bay.locations.map(loc => loc.position))).sort((a, b) => a - b),
      [bay.locations]
    )

    const getLevelsForPosition = React.useCallback(
      (position: number) => {
        return bay.locations
          .filter(loc => loc.position === position)
          .sort((a, b) => a.level - b.level)
      },
      [bay.locations]
    )

    return (
      <div className='rounded-sm border-2 border-zinc-500'>
        <div className='p-2 text-center font-bold'>
          Bay {bay.number.toString().padStart(2, '0')}
        </div>
        <div className='grid grid-cols-4 gap-2 p-2'>
          {positions.map(position => (
            <div key={position} className='flex flex-col gap-2'>
              <LocationButton
                position={position}
                isSelected={selectedPosition === position}
                onSelect={onLocationSelect}
              />
              {selectedPosition === position && (
                <LevelsDisplay
                  levels={getLevelsForPosition(position)}
                  position={position}
                  cellNumber={cellNumber}
                  aisleNumber={aisleNumber}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
