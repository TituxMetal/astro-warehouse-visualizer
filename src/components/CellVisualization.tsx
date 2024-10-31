// src/components/CellVisualization.tsx
import { getCellConfig } from '~/utils/warehouse'

interface Props {
  cell: number
}

export const CellVisualization = ({ cell }: Props) => {
  const config = getCellConfig(cell)
  if (!config) return null

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'>Cell {cell} Overview</h2>

      <div className='grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8'>
        {Array.from({ length: config.aislesCount }).map((_, index) => {
          const aisleNumber = index + 1
          const formattedAisle = aisleNumber.toString().padStart(3, '0')

          return (
            <a
              key={`aisle-${aisleNumber}`}
              href={`/warehouse/cell/${cell}/aisle/${aisleNumber}`}
              className='flex flex-col items-center rounded-lg border border-zinc-700 p-4 transition-colors hover:border-blue-600 hover:bg-blue-800'
            >
              <span className='text-lg font-bold'>Aisle {formattedAisle}</span>
              <span className='text-sm text-zinc-400'>{config.locationsPerAisle} locations</span>
              <span className='text-sm text-zinc-400'>{config.levelsPerLocation} levels</span>
            </a>
          )
        })}
      </div>

      <div className='mt-4 rounded-lg bg-zinc-800 p-4'>
        <h3 className='mb-4 text-lg font-semibold'>Cell Statistics</h3>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-400'>Aisles</div>
            <div className='text-2xl font-bold'>{config.aislesCount}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-400'>Locations per Aisle</div>
            <div className='text-2xl font-bold'>{config.locationsPerAisle}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-400'>Levels</div>
            <div className='text-2xl font-bold'>{config.levelsPerLocation}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4'>
            <div className='text-sm text-zinc-400'>Total Locations</div>
            <div className='text-2xl font-bold'>
              {config.aislesCount * config.locationsPerAisle * config.levelsPerLocation}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
