// src/components/WarehouseOverview.tsx
import type { Cell } from '@prisma/client'

interface WarehouseOverviewProps {
  cells: (Cell & { _count: { aisles: number } })[]
}

export const WarehouseOverview: React.FC<WarehouseOverviewProps> = ({ cells }) => {
  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-3xl font-bold'>Warehouse Overview</h1>

      <div className='grid grid-cols-2 gap-4'>
        {cells.map(cell => (
          <a
            key={`cell-${cell.number}`}
            href={`/warehouse/cell/${cell.number}`}
            className='rounded-lg border-2 p-6 transition-colors hover:border-zinc-300 hover:bg-blue-700'
          >
            <div className='flex flex-col gap-4'>
              <h2 className='text-2xl font-bold'>Cell {cell.number}</h2>
              <div className='grid grid-cols-2 gap-4 text-sm text-zinc-200'>
                <div>
                  <span className='font-semibold'>Aisles:</span> {cell._count.aisles}
                </div>
                <div>
                  <span className='font-semibold'>Locations per Aisle:</span>{' '}
                  {cell.locationsPerAisle}
                </div>
                <div>
                  <span className='font-semibold'>Levels:</span> {cell.levelsPerLocation}
                </div>
                <div>
                  <span className='font-semibold'>Total Locations:</span>{' '}
                  {cell._count.aisles * cell.locationsPerAisle * cell.levelsPerLocation}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className='mt-4 rounded-lg bg-zinc-800 p-4'>
        <h3 className='mb-2 text-lg font-semibold'>Warehouse Statistics</h3>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-zinc-700 p-4 shadow-sm'>
            <div className='text-sm text-zinc-200'>Total Cells</div>
            <div className='text-2xl font-bold'>{cells.length}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4 shadow-sm'>
            <div className='text-sm text-zinc-200'>Total Aisles</div>
            <div className='text-2xl font-bold'>
              {cells.reduce((acc, cell) => acc + cell._count.aisles, 0)}
            </div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4 shadow-sm'>
            <div className='text-sm text-zinc-200'>Locations per Cell</div>
            <div className='text-2xl font-bold'>
              {cells.reduce((acc, cell) => acc + cell._count.aisles * cell.locationsPerAisle, 0)}
            </div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4 shadow-sm'>
            <div className='text-sm text-zinc-200'>Total Warehouse Locations</div>
            <div className='text-2xl font-bold'>
              {cells.reduce(
                (acc, cell) =>
                  acc + cell._count.aisles * cell.locationsPerAisle * cell.levelsPerLocation,
                0
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
