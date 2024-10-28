import { actions, isInputError } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import React, { useRef, useState } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'

interface InputErrors {
  username?: string[]
  password?: string[]
}

interface FormMessage {
  error: string | boolean
  success: string | boolean
}

interface AuthFormProps {
  mode: 'signup' | 'login'
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [errors, setErrors] = useState<InputErrors>({})
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null)
  const inputRefs = {
    username: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null)
  }

  const resetForm = () =>
    Object.values(inputRefs).forEach(ref => ref.current && (ref.current.value = ''))

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const { data, error } = await (mode === 'signup'
      ? actions.signup(formData)
      : actions.login(formData))

    if (data) {
      setFormMessage({ success: 'Successfully logged in', error: false })
      resetForm()
      navigate('/')
    }

    if (error && isInputError(error)) {
      setFormMessage(null)
      setErrors(error.fields)

      // Focus on the first errored field
      const firstErrorField = Object.keys(error.fields)[0] as keyof InputErrors
      inputRefs[firstErrorField]?.current?.focus()
    }

    if (error && !isInputError(error)) {
      setErrors({})
      setFormMessage({ error: error.message, success: false })
      resetForm()
    }
  }

  return (
    <form onSubmit={handleSubmit} className='mx-auto mt-6 grid w-full max-w-md gap-4 p-4'>
      {formMessage && (
        <p className={`font-semibold ${formMessage.success ? 'text-green-400' : 'text-red-400'}`}>
          {formMessage.success || formMessage.error}
        </p>
      )}
      <label htmlFor='username'>Username</label>
      <Input type='text' id='username' name='username' required ref={inputRefs.username} />
      {errors?.username && (
        <p className='font-semibold text-red-400'>{errors.username.join(', ')}</p>
      )}
      <label htmlFor='password'>Password</label>
      <Input type='password' id='password' name='password' required ref={inputRefs.password} />
      {errors.password && (
        <p className='font-semibold text-red-400'>{errors.password.join(', ')}</p>
      )}
      <Button type='submit'>{mode === 'signup' ? 'Sign Up' : 'Log In'}</Button>
      <p>
        {mode === 'signup' ? (
          <>
            Already have an account? <a href='/login'>Login</a>
          </>
        ) : (
          <>
            Don't have an account? <a href='/signup'>Sign Up</a>
          </>
        )}
      </p>
    </form>
  )
}
