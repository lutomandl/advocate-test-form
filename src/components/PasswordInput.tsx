import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import FormInput from './FormInput'
import { useState } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface PasswordInputProps {
  error?: FieldError['message']
  label?: string
  register: UseFormRegisterReturn
}

export default function PasswordInput({
  error,
  label,
  register,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => setShowPassword(!showPassword)

  return (
    <FormInput error={error} label={label}>
      <InputGroup>
        <Input {...register} type={showPassword ? 'text' : 'password'} />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={() => toggleShowPassword()}>
            {showPassword ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormInput>
  )
}
