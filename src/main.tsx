import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n'
import ErrorBoundary from './ErrorBoundary.tsx'
import { bootstrapSite } from './content/siteSync'

// Load the latest published content (texts, products, gallery, settings) from
// the server before the first render, so every visitor sees what the admin saved.
bootstrapSite().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
})
