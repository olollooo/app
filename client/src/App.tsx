import { Router } from './routers/router'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { AuthProvider } from './provider/AuthProvider/AuthProvider'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const queryClient = new QueryClient()

export const App = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastContainer />
          <Router />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  )
}
