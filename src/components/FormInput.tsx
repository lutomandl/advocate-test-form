import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { FieldError } from 'react-hook-form'

interface FormInputProps {
  error?: FieldError['message']
  label?: string
  children: React.ReactNode
}

export default function FormInput({ error, label, children }: FormInputProps) {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel>{label}</FormLabel>}
      {children}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}
