import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/global.css"; // Estilos globais
import { App } from './App.tsx' // Seu componente principal

// 1. Encontra a div 'root' no index.html
const rootElement = document.getElementById('root')!

// 2. Cria a raiz da aplicação React nesse elemento
const root = createRoot(rootElement)

// 3. Renderiza o componente App dentro da raiz
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
