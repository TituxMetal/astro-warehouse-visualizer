// src/components/ui/Select.tsx
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export const Select: React.FC<SelectProps> = ({ name, value, options, ...rest }) => {
  return (
    <select
      id={name}
      name={name}
      value={value}
      className='w-full rounded-lg border-2 border-zinc-300 px-3 py-2 text-zinc-300'
      {...rest}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
