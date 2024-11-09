// src/components/LocationVisualization.tsx
import { useEffect, useMemo, useRef } from 'react'
import type { CellWithAislesAndLocations } from '~/types/warehouse'

interface Props {
  cell: CellWithAislesAndLocations
  selectedLocation: {
    cell: number
    aisle: number
    position: number
    level: number
  }
}

export const LocationVisualization = ({ cell, selectedLocation }: Props) => {
  const selectedAisleRef = useRef<HTMLDivElement | null>(null)

  // Get unique levels from all locations
  const levels = useMemo(() => {
    return Array.from(
      new Set(cell.aisles.flatMap(aisle => aisle.locations.map(loc => loc.level)))
    ).sort((a, b) => a - b)
  }, [cell.aisles])

  // Group aisles by number to handle odd/even pairs
  const aislesByNumber = useMemo(() => {
    return cell.aisles.reduce(
      (acc, aisle) => {
        if (!acc[aisle.number]) {
          acc[aisle.number] = []
        }
        acc[aisle.number].push(aisle)
        return acc
      },
      {} as Record<number, typeof cell.aisles>
    )
  }, [cell.aisles])

  useEffect(() => {
    selectedAisleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [selectedLocation.aisle])

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h2 className='text-xl font-bold'>
        Cell {cell.number} - {cell.aisles.length} Aisles
      </h2>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Object.entries(aislesByNumber).map(([aisleNumber, aisles]) => {
          const isSelectedAisle = parseInt(aisleNumber) === selectedLocation.aisle
          const formattedAisle = aisleNumber.toString().padStart(3, '0')

          return (
            <div
              key={`aisle-${aisleNumber}`}
              ref={isSelectedAisle ? selectedAisleRef : null}
              className={`flex flex-col gap-1 rounded border p-2 ${
                isSelectedAisle ? 'border-blue-700 bg-blue-800' : 'border-zinc-400'
              }`}
            >
              <span className='text-center text-xs font-semibold'>
                Aisle {formattedAisle}{' '}
                {aisles.length === 2
                  ? '(Both Sides)'
                  : aisles[0].isOdd
                    ? '(Odd Side)'
                    : '(Even Side)'}
              </span>

              <div className='flex flex-col gap-1'>
                {aisles
                  .flatMap(aisle => aisle.locations)
                  .filter(
                    (loc, index, self) => self.findIndex(l => l.position === loc.position) === index
                  )
                  .sort((a, b) => a.position - b.position)
                  .map(location => {
                    const isSelectedPosition =
                      location.position === selectedLocation.position && isSelectedAisle

                    return (
                      <div key={`pos-${location.position}`} className='flex flex-col gap-1 p-1'>
                        <div className='text-xs text-zinc-200'>
                          Position {location.position.toString().padStart(4, '0')}
                        </div>
                        <div className='grid grid-cols-4 gap-1'>
                          {levels.map(level => {
                            const locationAtLevel = aisles.flatMap(a =>
                              a.locations.filter(
                                l => l.position === location.position && l.level === level
                              )
                            )[0]

                            return (
                              <div
                                key={`${location.position}-${level}`}
                                className={`flex h-6 items-center justify-center rounded-sm border text-xs ${
                                  isSelectedPosition && selectedLocation.level === level
                                    ? 'border-green-400 bg-green-400 font-bold text-zinc-800'
                                    : locationAtLevel?.isPicking
                                      ? 'border-amber-400 bg-amber-900 font-semibold text-amber-200'
                                      : 'border-zinc-400'
                                }`}
                              >
                                {level.toString().padStart(2, '0')}
                              </div>
                            )
                          })}
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
  )
}
