import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p className="text-red-500">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
