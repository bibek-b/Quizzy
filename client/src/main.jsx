import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QuizContextProvider } from './Context/QuizContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './Context/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <UserContextProvider>
 <QuizContextProvider>
   <StrictMode>
    <App />
  </StrictMode>
 </QuizContextProvider>
 </UserContextProvider>
 </BrowserRouter>
)
