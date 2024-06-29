import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import { GASClient } from 'gas-client'
const { serverFunctions } = new GASClient()

function App() {
  const [count, setCount] = useState(0)

  const handleButton = async () => {
    if (import.meta.env.PROD) {
      try {
        const response: number = await serverFunctions.sampleFunction(count)
        setCount(response)
      } catch (err) {
        console.log(err)
      }
    } else {
      setCount(count + 1)
    }
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + clasp</h1>
      <div className="card">
        <button onClick={handleButton}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p className="read-the-docs">and see the official clasp repository</p>
      <a href="https://github.com/google/clasp" target="_blank">
        <p>https://github.com/google/clasp</p>
      </a>
    </>
  )
}

export default App
