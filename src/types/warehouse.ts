// src/types/warehouse.ts

export interface CellWithDetails {
  id: number
  number: number
  locationsPerAisle: number
  levelsPerLocation: number
  aisles: {
    id: number
    number: number
    isOdd: boolean
    bays: {
      id: number
      number: number
      width: number
    }[]
    locations: {
      id: number
      position: number
      level: number
      isPicking: boolean
    }[]
  }[]
  _count: {
    aisles: number
  }
}

export type LocationType = 'odd' | 'even' | 'both'

export interface AisleConfig {
  number: number
  locations: 'odd' | 'even' | 'both'
}

export interface LocationsRange {
  count: number
  start: number
  end: number
}

export interface LocationsSummary {
  odd: LocationsRange
  even: LocationsRange
}

export interface CellWithAislesAndLocations {
  number: number
  aisles: {
    number: number
    isOdd: boolean
    locations: {
      position: number
      level: number
      isPicking: boolean
    }[]
  }[]
}

/**
 * Represents a specific location within an aisle
 * @property position - Horizontal position in the aisle
 * @property level - Vertical level (must be multiple of 10)
 */
export interface Location {
  position: number
  level: number
}

/**
 * Represents a complete warehouse location
 * Extends Location with cell and aisle information
 */
export interface FullLocation extends Location {
  cell: number
  aisle: number
}

/**
 * Format specifications for address parts
 */
export const FORMAT_LENGTHS = {
  AISLE: 3,
  POSITION: 4,
  LEVEL: 2
} as const

/**
 * Regular expressions for validation
 */
export const REGEX_PATTERNS = {
  LOCATION: /^(\d{4})-(\d{2})$/,
  FULL_ADDRESS: /^(\d{1,2})-(\d{3})-(\d{4})-(\d{2})$/
} as const
