// src/utils/implementation.ts

import type { AisleConfig, LocationsRange, LocationsSummary, LocationType } from '~/types/warehouse'

export const generateAisleNumbers = (
  start: number,
  end: number,
  startLocationType: LocationType,
  endLocationType: LocationType
): AisleConfig[] => {
  const aisles: AisleConfig[] = []

  // Handle first aisle
  aisles.push({ number: start, locations: startLocationType })

  // Handle middle aisles (always pairs)
  for (let current = start + 1; current < end; current++) {
    aisles.push({ number: current, locations: 'both' })
  }

  // Handle last aisle
  if (start !== end) {
    aisles.push({ number: end, locations: endLocationType })
  }

  return aisles
}

export const calculateLocationRanges = (
  locationsPerAisle: number,
  startLocationType: LocationType,
  endLocationType: LocationType
): LocationsSummary => {
  const oddRange: LocationsRange = {
    count: Math.ceil(locationsPerAisle / 2),
    start: 1,
    end: locationsPerAisle - 1
  }

  const evenRange: LocationsRange = {
    count: Math.floor(locationsPerAisle / 2),
    start: 2,
    end: locationsPerAisle
  }

  // Adjust based on start/end location types
  if (startLocationType === 'even') {
    oddRange.count--
    oddRange.start += 2
  }
  if (endLocationType === 'even') {
    oddRange.count--
    oddRange.end -= 2
  }

  return { odd: oddRange, even: evenRange }
}

export const generateLocations = (count: number): number[] => {
  return Array.from({ length: count }, (_, i) => i + 1)
}

export const generateLevels = (count: number, hasPicking: boolean): number[] => {
  return hasPicking
    ? [0, ...Array.from({ length: count - 1 }, (_, i) => (i + 1) * 10)]
    : Array.from({ length: count }, (_, i) => (i + 1) * 10)
}
