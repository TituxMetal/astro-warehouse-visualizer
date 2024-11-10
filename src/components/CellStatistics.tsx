import type { Aisle, Cell } from '@prisma/client'
import React from 'react'

interface CellStatisticsProps {
  cell: Cell & {
    aisles: Aisle[]
    _count: {
      aisles: number
    }
  }
}

export const CellStatistics: React.FC<CellStatisticsProps> = React.memo(({ cell }) => {
  const oddAislesCount = cell.aisles.filter(aisle => aisle.isOdd).length
  const evenAislesCount = cell.aisles.length - oddAislesCount

  return (
    <div className='mt-4 rounded-lg bg-zinc-800 p-4' role='region' aria-label='Cell Statistics'>
      <h3 className='mb-4 text-lg font-semibold'>Cell Statistics</h3>
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
        <StatItem label='Odd Aisles' value={oddAislesCount} />
        <StatItem label='Even Aisles' value={evenAislesCount} />
        <StatItem label='Total Aisle Sides' value={cell._count.aisles} />
        <StatItem label='Levels Per Location' value={cell.levelsPerLocation} />
        <StatItem
          label='Total Locations'
          value={cell._count.aisles * cell.locationsPerAisle * cell.levelsPerLocation}
        />
      </div>
    </div>
  )
})

const StatItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className='rounded-lg bg-zinc-700 p-4'>
    <div className='text-sm text-zinc-300'>{label}</div>
    <div className='text-2xl font-bold'>{value}</div>
  </div>
)

CellStatistics.displayName = 'CellStatistics'
