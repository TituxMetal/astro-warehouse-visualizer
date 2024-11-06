// src/utils/summaryGenerators.ts
import type { AisleConfig } from '~/types/warehouse'

const formatAisleNumber = (num: number) => num.toString().padStart(3, '0')

export const generateAisleSummary = (aisles: AisleConfig[]): string => {
  const [first, ...middle] = aisles
  const last = middle.pop()

  const parts = [
    `Aisle ${formatAisleNumber(first.number)}: ${first.locations} locations`,
    middle.length > 0 &&
      `Aisles from ${formatAisleNumber(middle[0].number)} to ${formatAisleNumber(
        middle[middle.length - 1].number
      )}: both locations`,
    last && `Aisle ${formatAisleNumber(last.number)}: ${last.locations} locations`
  ]

  return parts.filter(Boolean).join('\n')
}

export const generateLevelsSummary = (levels: number[], hasPicking: boolean): string =>
  levels
    .map(level => ({
      level: level.toString().padStart(2, '0'),
      isPicking: hasPicking && level === 0
    }))
    .map(({ level, isPicking }) => `${level}${isPicking ? ' (picking)' : ''}`)
    .join(', ')

export const calculateTotalLocations = (
  aisles: AisleConfig[],
  locationsPerAisle: number,
  levelsCount: number
): number =>
  aisles.reduce(
    (total, aisle) =>
      total +
      (aisle.locations === 'both' ? locationsPerAisle : Math.ceil(locationsPerAisle / 2)) *
        levelsCount,
    0
  )
