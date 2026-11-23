import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import './index.css'
import './global.css'
import './theme.css'
import './direction.css'
import { BrowserRouter } from "react-router-dom";
import { publicAsset } from './utils/publicAsset.js'

document.documentElement.style.setProperty(
  '--about-background-image',
  `url("${publicAsset('image/edu.jpg')}")`
)

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
    <App />
  </BrowserRouter>
)
