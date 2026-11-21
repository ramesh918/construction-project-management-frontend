import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store, setTokens } from './app/store.ts'
import { loadTokens } from './shared/api/sessionStorage.ts'

// Rehydrate the session from localStorage before the first render, so a page
// refresh doesn't bounce an already-logged-in user back to /login.
const persisted = loadTokens()
if (persisted) {
  store.dispatch(setTokens(persisted))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <QueryClientProvider
          client={
            new QueryClient({
              defaultOptions: {
                queries: { retry: 2 },
                mutations: { retry: 2 },
              },
            })
          }
        >
          <App />
        </QueryClientProvider>
      </ReduxProvider>
    </BrowserRouter>
  </StrictMode>,
)
