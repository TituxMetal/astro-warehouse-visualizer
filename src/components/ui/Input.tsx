import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ ...rest }, ref) => {
  return (
    <input
      {...rest}
      ref={ref}
      className='w-full rounded-lg border-2 border-zinc-300 px-3 py-2 text-zinc-300 focus:border-sky-400 focus:outline-hidden'
    />
  )
})

Input.displayName = 'FormInput'
