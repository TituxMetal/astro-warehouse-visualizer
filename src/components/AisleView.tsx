// src/components/AisleView.tsx

import type { Aisle } from '@prisma/client'

interface AisleProps {
  aisles: Aisle[]
}

export const AisleView: React.FC<AisleProps> = ({ aisles }) => {
  return (
    <div className='rounded-sm border-2 border-zinc-500' role='region' aria-label='Aisle View'>
      <div className='p-2 text-center font-bold'>
        Aisle {aisles[0].number.toString().padStart(3, '0')}
      </div>
      <div className='flex flex-col gap-2 p-1'>
        {aisles.map(aisle => (
          <div
            key={aisle.id}
            className={`p-2 ${aisle.isOdd ? 'bg-sky-700' : 'bg-emerald-700'}`}
            aria-label={`Aisle side ${aisle.isOdd ? 'Odd' : 'Even'}`}
          >
            <span className='text-sm text-zinc-50'>{aisle.isOdd ? 'Odd' : 'Even'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
