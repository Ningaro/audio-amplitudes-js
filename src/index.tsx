import { ChakraProvider } from '@chakra-ui/react'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import Root from './pages/Root'
import Example from './pages/Example'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ChakraProvider>
      <Root />
    </ChakraProvider>
  </StrictMode>
)
