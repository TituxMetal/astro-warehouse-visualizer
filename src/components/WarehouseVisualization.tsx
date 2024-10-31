// src/components/WarehouseVisualization.tsx
import type { FullLocation } from '~/types/warehouse'
import { getCellConfig, getValidLevels } from '~/utils/warehouse'

interface Props {
  fullLocation: FullLocation
}

export const WarehouseVisualization = ({ fullLocation }: Props) => {
  const cellConfig = getCellConfig(fullLocation.cell)
  if (!cellConfig) return null

  const startPosition = Math.max(1, fullLocation.position - 5)
  const endPosition = Math.min(cellConfig.locationsPerAisle, fullLocation.position + 5)
  const validLevels = getValidLevels(cellConfig.levelsPerLocation)

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h2 className='text-xl font-bold'>
        Cell {fullLocation.cell} - {cellConfig.aislesCount} Aisles
      </h2>

      <div className='overflow-x-auto'>
        <div
          className='grid gap-2'
          style={{
            gridTemplateColumns: `repeat(${cellConfig.aislesCount}, minmax(150px, 1fr))`
          }}
        >
          {Array.from({ length: cellConfig.aislesCount }).map((_, aisleIndex) => {
            const currentAisle = aisleIndex + 1
            const isSelectedAisle = currentAisle === fullLocation.aisle

            return (
              <div
                key={`aisle-${currentAisle}`}
                className={`flex min-w-[150px] flex-col gap-1 rounded border p-2 ${
                  isSelectedAisle ? 'border-blue-700 bg-blue-800' : 'border-zinc-400'
                } `}
              >
                <span className='text-center text-xs font-semibold'>
                  Aisle {currentAisle.toString().padStart(3, '0')}
                </span>

                <div className='grid gap-1'>
                  {Array.from({ length: endPosition - startPosition + 1 }).map((_, posIndex) => {
                    const currentPosition = startPosition + posIndex
                    const isSelectedPosition =
                      currentPosition === fullLocation.position && isSelectedAisle

                    return (
                      <div key={`pos-${currentPosition}`} className='flex flex-col gap-1 p-1'>
                        <div className='text-xs text-zinc-200'>
                          Position {currentPosition.toString().padStart(4, '0')}
                        </div>
                        <div className='grid grid-cols-4 gap-1'>
                          {validLevels.map(level => (
                            <div
                              key={`${currentPosition}-${level}`}
                              className={`flex h-6 items-center justify-center rounded-sm border text-xs ${
                                isSelectedPosition && fullLocation.level === level
                                  ? 'border-green-400 bg-green-400 font-bold text-zinc-800'
                                  : 'border-zinc-400'
                              } `}
                            >
                              {level}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
