import React from 'react'
import Statistics from './pages/Statistics'
import { Routes , Route} from "react-router-dom"
import TransactionSection from './pages/TransactionSection'
import Homepage from './pages/Homepage'
import { Analytics } from '@vercel/analytics/react'



const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route path="/statistics" element={<Statistics/>} />
        <Route path="/transaction" element={<TransactionSection/>}/>
      </Routes>
      <Analytics />
    </div>
  )
}

export default App
