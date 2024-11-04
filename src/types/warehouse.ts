// src/types/warehouse.ts

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

/**
 * Configuration for a warehouse cell
 * @property cell - The cell number
 * @property aislesCount - Number of aisles in the cell
 * @property locationsPerAisle - Number of locations per aisle
 * @property levelsPerLocation - Number of vertical levels per location
 */
export interface CellConfig {
  cell: number
  aislesCount: number
  locationsPerAisle: number
  levelsPerLocation: number
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
 * Validation constraints for warehouse locations
 */
export const LEVEL_CONSTRAINTS = {
  MIN: 0,
  MAX: 40,
  STEP: 10,
  PICKING: 0
} as const

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

/**
 * Warehouse configuration by cell
 */
export const WAREHOUSE_CONFIG: readonly CellConfig[] = [
  { cell: 1, aislesCount: 12, locationsPerAisle: 137, levelsPerLocation: 4 },
  { cell: 2, aislesCount: 15, locationsPerAisle: 100, levelsPerLocation: 4 },
  { cell: 3, aislesCount: 20, locationsPerAisle: 100, levelsPerLocation: 4 },
  { cell: 4, aislesCount: 16, locationsPerAisle: 100, levelsPerLocation: 4 }
] as const
