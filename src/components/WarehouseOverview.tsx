// src/components/WarehouseOverview.tsx
import { WAREHOUSE_CONFIG } from '~/types/warehouse'

export const WarehouseOverview = () => {
  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-3xl font-bold'>Warehouse Overview</h1>

      <div className='grid grid-cols-2 gap-4'>
        {WAREHOUSE_CONFIG.map(config => (
          <a
            key={`cell-${config.cell}`}
            href={`/warehouse/cell/${config.cell}`}
            className='rounded-lg border-2 p-6 transition-colors hover:border-zinc-300 hover:bg-blue-700'
          >
            <div className='flex flex-col gap-4'>
              <h2 className='text-2xl font-bold'>Cell {config.cell}</h2>
              <div className='grid grid-cols-2 gap-4 text-sm text-zinc-200'>
                <div>
                  <span className='font-semibold'>Aisles:</span> {config.aislesCount}
                </div>
                <div>
                  <span className='font-semibold'>Locations per Aisle:</span>{' '}
                  {config.locationsPerAisle}
                </div>
                <div>
                  <span className='font-semibold'>Levels:</span> {config.levelsPerLocation}
                </div>
                <div>
                  <span className='font-semibold'>Total Locations:</span>{' '}
                  {config.aislesCount * config.locationsPerAisle * config.levelsPerLocation}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className='mt-4 rounded-lg bg-zinc-800 p-4'>
        <h3 className='mb-2 text-lg font-semibold'>Warehouse Statistics</h3>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-zinc-700 p-4 shadow'>
            <div className='text-sm text-zinc-200'>Total Cells</div>
            <div className='text-2xl font-bold'>{WAREHOUSE_CONFIG.length}</div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4 shadow'>
            <div className='text-sm text-zinc-200'>Total Aisles</div>
            <div className='text-2xl font-bold'>
              {WAREHOUSE_CONFIG.reduce((acc, config) => acc + config.aislesCount, 0)}
            </div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4 shadow'>
            <div className='text-sm text-zinc-200'>Locations per Cell</div>
            <div className='text-2xl font-bold'>
              {WAREHOUSE_CONFIG.reduce(
                (acc, config) => acc + config.aislesCount * config.locationsPerAisle,
                0
              )}
            </div>
          </div>
          <div className='rounded-lg bg-zinc-700 p-4 shadow'>
            <div className='text-sm text-zinc-200'>Total Warehouse Locations</div>
            <div className='text-2xl font-bold'>
              {WAREHOUSE_CONFIG.reduce(
                (acc, config) =>
                  acc + config.aislesCount * config.locationsPerAisle * config.levelsPerLocation,
                0
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
