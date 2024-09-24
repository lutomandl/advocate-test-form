import {
  Input,
  Checkbox,
  Button,
  Alert,
  AlertIcon,
  Stack,
  Spinner,
} from '@chakra-ui/react'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { boolean, object, ref, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { RepeatIcon } from '@chakra-ui/icons'
import FormInput from './FormInput'
import PasswordInput from './PasswordInput'

export type FormValues = {
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
        <FormInput error={errors.fullName?.message} label="Full name">
          <Input {...register('fullName')} type="name" />
        </FormInput>
        <FormInput error={errors.email?.message} label="Email">
          <Input {...register('email')} type="email" />
        </FormInput>
        <PasswordInput
          error={errors.password?.message}
          label="Password"
          register={register('password')}
        />
        <PasswordInput
          error={errors.passwordConfirm?.message}
          label="Password confirmation"
          register={register('passwordConfirm')}
        />
        <FormInput error={errors.hasReferralCode?.message}>
          <Checkbox {...register('hasReferralCode')}>
            I have a referral code
          </Checkbox>
        </FormInput>
        {watch('hasReferralCode') && (
          <FormInput error={errors.referralCode?.message} label="Referral code">
            <Input {...register('referralCode')} type="text" />
          </FormInput>
        )}
        <FormInput>
          <Checkbox {...register('newsletter')}>
            Subscribe to newsletter
          </Checkbox>
        </FormInput>
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
