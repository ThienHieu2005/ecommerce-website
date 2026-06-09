import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client' //dùng để tạo React root và render app
import './index.css'
import App from './App.jsx'
import { store, persistor } from './redux/store'
import { Provider } from 'react-redux'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistGate } from 'redux-persist/integration/react'


const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider >
  //</StrictMode>,
)
