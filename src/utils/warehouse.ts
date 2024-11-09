// src/utils/warehouse.ts
import { FORMAT_LENGTHS, type FullLocation, type Location, REGEX_PATTERNS } from '~/types/warehouse'

/**
 * Custom error types for better error handling
 */
export class WarehouseError extends Error {
  constructor(
    message: string,
    public code:
      | 'INVALID_LEVEL'
      | 'INVALID_FORMAT'
      | 'CELL_NOT_FOUND'
      | 'INVALID_AISLE'
      | 'INVALID_POSITION'
  ) {
    super(message)
    this.name = 'WarehouseError'
  }
}

/**
 * Normalizes a part of the location to a specific length
 * @private
 */
const normalizePart = (value: string | number, length: number): string => {
  return value.toString().padStart(length, '0')
}

/**
 * Normalizes a location string to the standard format (position-level)
 * Example: "54-20" becomes "0054-20"
 * @param location The location string to normalize
 * @returns The normalized location string or the original if invalid format
 */
export const normalizeLocation = (location: string): string => {
  const parts = location.split('-')
  if (parts.length !== 2) return location

  const [position, level] = parts
  return [
    normalizePart(position, FORMAT_LENGTHS.POSITION),
    normalizePart(level, FORMAT_LENGTHS.LEVEL)
  ].join('-')
}

/**
 * Function to normalize an address
 * @param address The full address string to normalize
 */
const normalizeAddress = (address: string): string => {
  const parts = address.split('-')
  if (parts.length !== 4) return address

  const [cell, aisle, position, level] = parts
  return [
    cell,
    normalizePart(aisle, FORMAT_LENGTHS.AISLE),
    normalizePart(position, FORMAT_LENGTHS.POSITION),
    normalizePart(level, FORMAT_LENGTHS.LEVEL)
  ].join('-')
}

/**
 * Validates and parses a full warehouse address
 * @param address The full address string to parse
 * @returns FullLocation object or null if invalid
 */
export const parseFullAddress = (address: string): FullLocation => {
  const normalized = normalizeAddress(address)
  const match = normalized.match(REGEX_PATTERNS.FULL_ADDRESS)
  if (!match) {
    throw new WarehouseError(
      'Invalid address format. Expected format: cell-aisle-position-level',
      'INVALID_FORMAT'
    )
  }

  const [, cellStr, aisleStr, positionStr, levelStr] = match
  const cell = parseInt(cellStr)
  const aisle = parseInt(aisleStr)
  const position = parseInt(positionStr)
  const level = parseInt(levelStr)

  // Validate level
  if (!isValidLevel(level)) {
    throw new WarehouseError('Invalid level. Levels must be 0, 10, 20, 30, or 40', 'INVALID_LEVEL')
  }

  return { cell, aisle, position, level }
}

/**
 * Validates a full address string
 * @param address The full address string to validate
 */
export const isValidAddress = (address: string): boolean => {
  return parseFullAddress(address) !== null
}

/**
 * Validates if a location string is properly formatted
 * @param location The location string to validate
 * @returns boolean indicating if the location is valid
 */
export const isValidLocation = (location: string): boolean => {
  const normalized = normalizeLocation(location)
  const match = normalized.match(/^(\d{4})-(\d{2})$/)
  if (!match) return false

  const [_, levelStr] = match
  const level = parseInt(levelStr)
  return isValidLevel(level)
}

/**
 * Validates a level number
 * @private
 */
const isValidLevel = (level: number): boolean => {
  const validLevels = [0, 10, 20, 30, 40]
  return validLevels.includes(level)
}

/**
 * Result type for validation operations
 */
interface ValidationResult<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Validates and normalizes a location string
 * @returns ValidationResult with normalized location or error
 */
export const validateLocation = (location: string): ValidationResult<string> => {
  try {
    const normalized = normalizeLocation(location)
    const match = normalized.match(REGEX_PATTERNS.LOCATION)

    if (!match) {
      return {
        success: false,
        error: 'Invalid location format'
      }
    }

    const level = parseInt(match[2])
    if (!isValidLevel(level)) {
      return {
        success: false,
        error: 'Invalid level value'
      }
    }

    return {
      success: true,
      data: normalized
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Parses a location string into a Location object
 * @throws {WarehouseError} When location format is invalid
 */
export const parseLocation = (location: string): Location | null => {
  const validation = validateLocation(location)

  if (!validation.success || !validation.data) {
    return null
  }

  const [position, level] = validation.data.split('-').map(Number)

  if (!isValidLevel(level)) {
    return null
  }

  return { position, level }
}

// Cache for formatted addresses
const addressCache = new Map<string, string>()

/**
 * Formats a full location into an address string
 * Uses caching for better performance
 */
export const formatAddress = (location: FullLocation): string => {
  const cacheKey = `${location.cell}-${location.aisle}-${location.position}-${location.level}`

  if (addressCache.has(cacheKey)) {
    return addressCache.get(cacheKey)!
  }

  const formatted = [
    location.cell,
    normalizePart(location.aisle, FORMAT_LENGTHS.AISLE),
    normalizePart(location.position, FORMAT_LENGTHS.POSITION),
    normalizePart(location.level, FORMAT_LENGTHS.LEVEL)
  ].join('-')

  addressCache.set(cacheKey, formatted)
  return formatted
}

// Clear cache when it gets too large
if (addressCache.size > 1000) {
  addressCache.clear()
}
