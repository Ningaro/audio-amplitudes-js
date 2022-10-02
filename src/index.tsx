import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import InputFromFile from './pages/InputFromFile'
import FromFileLink from './pages/FromFileLink'
import Example from './pages/Example'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ChakraProvider>
      <FromFileLink />
    </ChakraProvider>
  </StrictMode>
)
