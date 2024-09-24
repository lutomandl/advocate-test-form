import { Container, Heading } from '@chakra-ui/react'
import './App.css'
import RegistrationForm from './components/RegistrationForm'

function App() {
  return (
    <Container p="4">
      <Heading>Registration Form</Heading>
      <RegistrationForm />
    </Container>
  )
}

export default App
