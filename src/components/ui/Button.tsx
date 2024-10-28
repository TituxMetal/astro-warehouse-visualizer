interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button
      {...rest}
      className='w-fit rounded-lg border-2 border-transparent bg-blue-400 px-4 py-2 font-bold text-zinc-900 hover:bg-blue-400/80 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-transparent'
    >
      {children}
    </button>
  )
}
