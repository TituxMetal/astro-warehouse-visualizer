// src/components/CellForm.tsx
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import React, { useCallback, useMemo, useState } from 'react'
import type { CellConfigForm } from '~/schemas/implementation.schema'
import {
  calculateLocationRanges,
  generateAisleNumbers,
  generateLevels
} from '~/utils/implementation'
import {
  calculateTotalLocations,
  generateAisleSummary,
  generateLevelsSummary
} from '~/utils/summaryGenerators'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

export const CellForm: React.FC = () => {
  const [config, setConfig] = useState<CellConfigForm>({
    cellNumber: 1,
    aisleStart: 1,
    aisleEnd: 4,
    startLocationType: 'even',
    endLocationType: 'odd',
    locationsPerAisle: 80,
    levelCount: 3,
    hasPicking: true
  })

  const locationTypeOptions = [
    { value: 'both', label: 'Both Even and Odd' },
    { value: 'even', label: 'Even Only' },
    { value: 'odd', label: 'Odd Only' }
  ]

  const summary = useMemo(() => {
    const aisles = generateAisleNumbers(
      config.aisleStart,
      config.aisleEnd,
      config.startLocationType,
      config.endLocationType
    )

    const locationRanges = calculateLocationRanges(config.locationsPerAisle)
    const levels = generateLevels(config.levelCount)
    const totalLocations = calculateTotalLocations(aisles, config.locationsPerAisle, levels.length)

    return `Cell ${config.cellNumber}:

Aisles Configuration:
${generateAisleSummary(aisles)}

Locations Configuration:
- Odd locations: ${locationRanges.odd.count} (from ${locationRanges.odd.start} to ${locationRanges.odd.end})
- Even locations: ${locationRanges.even.count} (from ${locationRanges.even.start} to ${locationRanges.even.end})

Levels: ${generateLevelsSummary(levels, config.hasPicking)}

Total Locations: ${totalLocations}
`
  }, [config])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target
      setConfig(prev => ({
        ...prev,
        [name]:
          type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : type === 'number'
              ? parseInt(value, 10)
              : value
      }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const input = new FormData(e.target as HTMLFormElement)
        const { error } = await actions.createCell(input)
        if (!error) {
          navigate('/implementation')
        }
      } catch (error) {
        console.error('Failed to create cell:', error)
      }
    },
    [config]
  )

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto mt-6 grid w-full max-w-(--breakpoint-lg) grid-cols-12 grid-rows-5 gap-4 p-6'
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
