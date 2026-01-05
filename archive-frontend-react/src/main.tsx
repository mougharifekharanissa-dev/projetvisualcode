import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // ← AJOUTEZ CETTE LIGNE
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* ← ENTOUREZ App avec BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)