// src/components/CellVisualization.tsx
import type { Aisle, Cell } from '@prisma/client'

interface Props {
  cell: Cell & {
    aisles: Aisle[]
    _count: {
      aisles: number
    }
  }
}

export const CellVisualization = ({ cell }: Props) => {
  // Group aisles by number to handle odd/even pairs
  const aislesByNumber = cell.aisles.reduce(
    (acc, aisle) => {
      if (!acc[aisle.number]) {
        acc[aisle.number] = []
      }
      acc[aisle.number].push(aisle)
      return acc
    },
    {} as Record<number, Aisle[]>
  )

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>Cell {cell.number} Overview</h2>

      <div className='grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8'>
        {Object.entries(aislesByNumber).map(([aisleNumber, aisles]) => {
          const formattedAisle = aisleNumber.toString().padStart(3, '0')
          const locationType =
            aisles.length === 2
              ? 'Both sides'
              : aisles[0].isOdd
                ? 'Odd side only'
                : 'Even side only'

          return (
            <a
              key={`aisle-${aisleNumber}`}
              href={`/warehouse/cell/${cell.number}/aisle/${aisleNumber}`}
              className='flex flex-col items-center rounded-lg border border-zinc-700 p-4 transition-colors hover:border-blue-600 hover:bg-blue-800'
            >
              <span className='text-lg font-bold'>Aisle {formattedAisle}</span>
              <span className='text-sm text-zinc-400'>
                {cell.locationsPerAisle * aisles.length} locations
              </span>
              <span className='text-sm text-zinc-400'>{cell.levelsPerLocation} levels</span>
              <span className='mt-1 text-xs text-zinc-500'>{locationType}</span>
            </a>
          )
        })}
      </div>

      <div className='mt-4 rounded-lg bg-zinc-800 p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Cell Statistics</h3>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-300'>Aisles</div>
            <div className='text-2xl font-bold'>{Object.keys(aislesByNumber).length}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-300'>Total Aisle Sides</div>
            <div className='text-2xl font-bold'>{cell._count.aisles}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-300'>Levels</div>
            <div className='text-2xl font-bold'>{cell.levelsPerLocation}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-300'>Total Locations</div>
            <div className='text-2xl font-bold'>
              {cell._count.aisles * cell.locationsPerAisle * cell.levelsPerLocation}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
