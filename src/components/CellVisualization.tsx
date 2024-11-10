// src/components/CellVisualization.tsx
import type { Aisle, Cell } from '@prisma/client'
import React from 'react'
import { AisleView } from './AisleView'
import { CellStatistics } from './CellStatistics'

interface Props {
  cell: Cell & {
    aisles: Aisle[]
    _count: {
      aisles: number
    }
  }
}

export const CellVisualization: React.FC<Props> = React.memo(({ cell }) => {
  const groupedAisles = React.useMemo(
    () =>
      cell.aisles.reduce(
        (acc, aisle) => {
          const key = aisle.number
          return { ...acc, [key]: [...(acc[key] || []), aisle] }
        },
        {} as Record<number, Aisle[]>
      ),
    [cell.aisles]
  )

  return (
    <div className='flex flex-col gap-4'>
      <div className='rounded-lg bg-zinc-800 p-4'>
        <h2 className='mb-6 text-center text-2xl font-bold'>
          Cell {cell.number} - Aisles Overview
        </h2>
        <div className='grid grid-cols-2 gap-4' role='list' aria-label='Aisles'>
          {Object.entries(groupedAisles).map(([aisleNumber, aisles]) => (
            <a
              key={aisleNumber}
              href={`/warehouse/cell/${cell.number}/aisle/${aisleNumber}`}
              className='block'
              role='listitem'
              aria-label={`Aisle ${aisleNumber}`}
            >
              <AisleView aisles={aisles} />
            </a>
          ))}
        </div>
      </div>
      <CellStatistics cell={cell} />
    </div>
  )
})

CellVisualization.displayName = 'CellVisualization'
