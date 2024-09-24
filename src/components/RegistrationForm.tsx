import {
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Stack,
  Spinner,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { boolean, object, ref, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { RepeatIcon } from '@chakra-ui/icons'

type FormValues = {
  fullName: string
  email: string
  password: string
  passwordConfirm: string
  hasReferralCode?: boolean
  referralCode?: string
  newsletter?: boolean
}

const schema = object({
  fullName: string().required().min(3).label('Full name'),
  email: string().email().required().label('Email'),
  password: string().required().min(6).label('Password'),
  passwordConfirm: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required()
    .label('Password confirmation'),
  hasReferralCode: boolean(),
  referralCode: string().min(6).max(6).label('Referral code'),
  newsletter: boolean().label('Newsletter'),
})

export default function RegistrationForm() {
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const toggleShowPassword = () => setShowPassword(!showPassword)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  })

  const handleFormReset = () => {
    reset()
    setSubmitSuccess(false)
    setSubmitError(false)
  }

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    setSubmitLoading(true)
    const res = await fetch('https://jsonplaceholder.typicode.com/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setSubmitSuccess(true)
    } else {
      // It would make sense to handle some error codes etc. in a real app
      setSubmitError(true)
    }

    setSubmitLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack p={4} spacing={4}>
        <Button
          onClick={handleFormReset}
          size="sm"
          variant="outline"
          leftIcon={<RepeatIcon />}
        >
          Reset form
        </Button>
        <FormControl isInvalid={!!errors.fullName}>
          <FormLabel>Full name</FormLabel>
          <Input {...register('fullName')} type="name" />
          <FormErrorMessage>
            {errors?.fullName && errors.fullName.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input {...register('email')} type="email" />
          <FormErrorMessage>
            {errors?.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => toggleShowPassword()}
              >
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors?.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.passwordConfirm}>
          <FormLabel>Password confirmation</FormLabel>
          <InputGroup>
            <Input
              {...register('passwordConfirm')}
              type={showPassword ? 'text' : 'password'}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => toggleShowPassword()}
              >
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors?.passwordConfirm && errors.passwordConfirm.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.hasReferralCode}>
          <Checkbox {...register('hasReferralCode')}>
            I have a referral code
          </Checkbox>
        </FormControl>
        {watch('hasReferralCode') && (
          <FormControl isInvalid={!!errors.referralCode}>
            <FormLabel>Referral code</FormLabel>
            <Input {...register('referralCode')} type="text" />
            <FormErrorMessage>
              {errors?.referralCode && errors.referralCode.message}
            </FormErrorMessage>
          </FormControl>
        )}
        <FormControl>
          <Checkbox {...register('newsletter')}>
            Subscribe to newsletter
          </Checkbox>
        </FormControl>
        {submitSuccess || submitError ? (
          <>
            <Alert status={submitSuccess ? 'success' : 'error'}>
              <AlertIcon />
              {submitSuccess
                ? 'Registration form submitted successfully!'
                : 'Something went wrong. Please try again.'}
            </Alert>
            <Button onClick={handleFormReset}>
              {submitSuccess ? 'Fill in again' : 'Try again'}
            </Button>
          </>
        ) : (
          <Button type="submit">
            {submitLoading ? <Spinner /> : 'Submit'}
          </Button>
        )}
      </Stack>
    </form>
  )
}
