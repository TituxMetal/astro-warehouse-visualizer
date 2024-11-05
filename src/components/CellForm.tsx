// src/components/CellForm.tsx
import React, { useEffect, useState } from 'react'
import {
  calculateLocationRanges,
  generateAisleNumbers,
  generateLevels
} from '~/utils/implementation'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

interface CellConfig {
  cellNumber: number
  aisleStart: number
  aisleEnd: number
  startLocationType: 'even' | 'odd' | 'both' // For first aisle
  endLocationType: 'even' | 'odd' | 'both' // For last aisle
  locationsPerAisle: number
  levelCount: number
  hasPicking: boolean
}

export const CellForm: React.FC = () => {
  const [config, setConfig] = useState<CellConfig>({
    cellNumber: 1,
    aisleStart: 3,
    aisleEnd: 16,
    startLocationType: 'even',
    endLocationType: 'even',
    locationsPerAisle: 138,
    levelCount: 5,
    hasPicking: true
  })

  const [summary, setSummary] = useState<string>('')

  const locationTypeOptions = [
    { value: 'both', label: 'Both Even and Odd' },
    { value: 'even', label: 'Even Only' },
    { value: 'odd', label: 'Odd Only' }
  ]

  useEffect(() => {
    const aisles = generateAisleNumbers(
      config.aisleStart,
      config.aisleEnd,
      config.startLocationType,
      config.endLocationType
    )

    const locationRanges = calculateLocationRanges(
      config.locationsPerAisle,
      config.startLocationType,
      config.endLocationType
    )

    const levels = generateLevels(config.levelCount, config.hasPicking)

    // Calculate total locations
    const totalLocations = aisles.reduce((total, aisle) => {
      const locationCount =
        aisle.locations === 'both'
          ? config.locationsPerAisle
          : Math.ceil(config.locationsPerAisle / 2)
      return total + locationCount * levels.length
    }, 0)

    const firstAisle = config.aisleStart.toString().padStart(3, '0')
    const intermediateAisles = aisles.slice(1, -1)
    const lastAisle = config.aisleEnd.toString().padStart(3, '0')

    const summaryText = `
Cell ${config.cellNumber}:

Aisles Configuration:
Aisle ${firstAisle}: ${aisles[0].locations} locations
Aisles from ${intermediateAisles[0].number.toString().padStart(3, '0')} to ${intermediateAisles[
      intermediateAisles.length - 1
    ].number
      .toString()
      .padStart(3, '0')}: ${
      intermediateAisles.every(aisle => aisle.locations !== 'odd' && aisle.locations !== 'even') &&
      'both locations'
    }
Aisle ${lastAisle}: ${aisles[aisles.length - 1].locations} locations


Locations Configuration:
- Odd locations: ${locationRanges.odd.count} (from ${locationRanges.odd.start} to ${locationRanges.odd.end})
- Even locations: ${locationRanges.even.count} (from ${locationRanges.even.start} to ${locationRanges.even.end})

Levels: ${levels.map(l => l.toString().padStart(2, '0')).join(', ')}

Total Locations: ${totalLocations}
    `

    setSummary(summaryText)
  }, [config])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    console.log('name', name, typeof name)
    console.log('value', value, typeof value)
    console.log('type', type, typeof type)
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined
    const numberValue = type === 'number' ? parseInt(value, 10) : value
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : numberValue
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would call your action to create the cell
    console.log('Submitting cell config:', config)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto mt-6 grid w-full max-w-screen-lg grid-cols-12 grid-rows-5 gap-4 p-6'
    >
      <div className='col-span-3 col-start-1'>
        <label htmlFor='cellNumber'>Cell Number</label>
        <Input
          id='cellNumber'
          name='cellNumber'
          type='number'
          value={config.cellNumber}
          onChange={handleInputChange}
        />
      </div>

      <div className='col-span-3 col-start-1 space-y-2'>
        <label htmlFor='aisleStart'>Starting Aisle Number</label>
        <Input
          id='aisleStart'
          name='aisleStart'
          type='number'
          value={config.aisleStart}
          onChange={handleInputChange}
        />
      </div>

      <div className='col-span-3 col-start-5 space-y-2'>
        <label htmlFor='startLocationType'>Starting Aisle Location Type</label>
        <Select
          name='startLocationType'
          value={config.startLocationType}
          onChange={handleInputChange}
          options={locationTypeOptions}
        />
      </div>

      <div className='col-span-3 col-start-1 space-y-2'>
        <label htmlFor='aisleEnd'>Ending Aisle Number</label>
        <Input
          id='aisleEnd'
          name='aisleEnd'
          type='number'
          value={config.aisleEnd}
          onChange={handleInputChange}
        />
      </div>

      <div className='col-span-3 col-start-5 space-y-2'>
        <label htmlFor='endLocationType'>Ending Aisle Location Type</label>
        <Select
          name='endLocationType'
          value={config.endLocationType}
          onChange={handleInputChange}
          options={locationTypeOptions}
        />
      </div>

      <div className='col-span-3 col-start-1 space-y-2'>
        <label htmlFor='locationsPerAisle'>Locations per Aisle</label>
        <Input
          id='locationsPerAisle'
          name='locationsPerAisle'
          type='number'
          value={config.locationsPerAisle}
          onChange={handleInputChange}
        />
      </div>

      <div className='col-span-3 col-start-5 space-y-2'>
        <label htmlFor='levelCount'>Number of Levels</label>
        <Input
          id='levelCount'
          name='levelCount'
          type='number'
          value={config.levelCount}
          onChange={handleInputChange}
        />
      </div>

      <div className='col-span-3 col-start-3 flex w-full flex-row items-center justify-center gap-2 text-nowrap'>
        <label htmlFor='hasPicking'>Has Picking Level</label>
        <Input
          id='hasPicking'
          name='hasPicking'
          type='checkbox'
          checked={config.hasPicking}
          onChange={handleInputChange}
        />
      </div>

      <div className='col-span-5 col-start-8 row-span-full'>
        <h3 className='mb-2 text-lg font-semibold'>Summary</h3>
        <pre className='whitespace-pre-wrap rounded-lg bg-zinc-800 p-4'>{summary}</pre>
      </div>

      <div className='col-span-3 col-start-1'>
        <Button type='submit'>Create Cell</Button>
      </div>
    </form>
  )
}