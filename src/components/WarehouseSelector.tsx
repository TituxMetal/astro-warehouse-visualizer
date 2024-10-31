// src/components/WarehouseSelector.tsx
import { useState } from 'react'
import { normalizeLocation, parseFullAddress, WarehouseError } from '~/utils/warehouse'

interface Props {
  address: string
}

export const WarehouseSelector = ({ address }: Props) => {
  const [inputValue, setInputValue] = useState(address)
  const [error, setError] = useState<string>('')

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().replace(/\s+/g, '') // Remove whitespace
    setInputValue(value)
    setError('')
  }

  const handleSubmit = (value: string) => {
    try {
      const parsedAddress = parseFullAddress(value)
      if (!parsedAddress) {
        setError('Invalid address format or level. Levels must be 10, 20, 30, or 40')
        return
      }

      const { cell, aisle, position, level } = parsedAddress
      const location = normalizeLocation(`${position}-${level}`)
      window.location.href = `/warehouse/cell/${cell}/aisle/${aisle}/${location}`
    } catch (err) {
      err instanceof WarehouseError ? setError(err.message) : setError('Invalid address format')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(inputValue)
    }
  }

  const handleBlur = () => {
    if (inputValue !== address) {
      handleSubmit(inputValue)
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      <input
        type='text'
        value={inputValue}
        onChange={handleAddressChange}
        onKeyUp={handleKeyPress}
        onBlur={handleBlur}
        placeholder='Enter location (e.g., 4-016-0026-10)'
        className={`w-full rounded border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-zinc-300'}`}
      />
      {error && <div className='text-sm text-red-500'>{error}</div>}
      <div className='text-sm text-zinc-400'>
        Format: cell-aisle-position-level (e.g., 4-016-0026-10)
        <br />
        Valid levels: 10, 20, 30, 40
      </div>
    </div>
  )
}
