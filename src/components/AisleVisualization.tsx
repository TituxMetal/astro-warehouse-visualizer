// src/components/AisleVisualization.tsx
import type { Aisle, Bay, Cell, Location } from '@prisma/client'
import { memo, useState } from 'react'
import { BayView } from './BayView'

interface AisleWithDetails extends Aisle {
  cell: Cell
  bays: (Bay & {
    locations: Location[]
  })[]
  _count: {
    locations: number
  }
}

interface Props {
  aisles: AisleWithDetails[]
}

const AisleSide = memo<{
  title: string
  aisle?: AisleWithDetails
  selectedPosition: number | null
  onLocationSelect: (position: number | null) => void
}>(({ title, aisle, selectedPosition, onLocationSelect }) => {
  if (!aisle) return null

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-center text-lg font-semibold'>{title}</h3>
      {aisle.bays.map(bay => (
        <BayView
          key={bay.id}
          bay={bay}
          selectedPosition={selectedPosition}
          onLocationSelect={onLocationSelect}
          cellNumber={aisle.cell.number}
          aisleNumber={aisle.number}
        />
      ))}
    </div>
  )
})

export const AisleVisualization = memo<Props>(({ aisles }) => {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)

  if (!aisles.length) return null

  const [evenAisle, oddAisle] = aisles
  const activeCell = oddAisle?.cell || evenAisle?.cell
  const formattedAisle = (oddAisle || evenAisle)?.number.toString().padStart(3, '0')

  if (!activeCell || !formattedAisle) return null

  return (
    <div className='flex flex-col gap-4'>
      <div className='rounded-lg bg-zinc-800 p-4'>
        <h2 className='mb-6 text-center text-2xl font-bold'>
          Cell {activeCell.number} - Aisle {formattedAisle}
        </h2>

        <div className='grid grid-cols-2 gap-4'>
          <AisleSide
            title='Odd Side'
            aisle={oddAisle}
            selectedPosition={selectedPosition}
            onLocationSelect={setSelectedPosition}
          />
          <AisleSide
            title='Even Side'
            aisle={evenAisle}
            selectedPosition={selectedPosition}
            onLocationSelect={setSelectedPosition}
          />
        </div>
      </div>
    </div>
  )
})

AisleVisualization.displayName = 'AisleVisualization'
