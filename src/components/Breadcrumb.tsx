// src/components/Breadcrumb.tsx
interface Props {
  cell: number
  aisle?: number
  showLocation?: boolean
}

export const Breadcrumb = ({ cell, aisle, showLocation = false }: Props) => {
  return (
    <nav className='mb-4 flex text-sm'>
      <a href='/' className='text-blue-400 hover:text-blue-300'>
        Home
      </a>
      <span className='mx-2 text-zinc-200'>/</span>
      <a href='/warehouse' className='text-blue-400 hover:text-blue-300'>
        Overview
      </a>
      <span className='mx-2 text-zinc-200'>/</span>
      {!aisle ? (
        <span>Cell {cell}</span>
      ) : (
        <>
          <a href={`/warehouse/cell/${cell}`} className='text-blue-400 hover:text-blue-300'>
            Cell {cell}
          </a>
          <span className='mx-2 text-zinc-200'>/</span>

          {!showLocation ? (
            <span>Aisle {aisle.toString().padStart(3, '0')}</span>
          ) : (
            <>
              <a
                href={`/warehouse/cell/${cell}/aisle/${aisle}`}
                className='text-blue-400 hover:text-blue-300'
              >
                Aisle {aisle.toString().padStart(3, '0')}
              </a>
              <span className='mx-2 text-zinc-200'>/</span>
              <span>Location</span>
            </>
          )}
        </>
      )}
    </nav>
  )
}
