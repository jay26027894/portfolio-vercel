import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const rootElement = document.getElementById('root');

if (!window.__root) {
  window.__root = createRoot(rootElement);
}

window.__root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
