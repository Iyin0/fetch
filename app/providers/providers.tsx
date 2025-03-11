'use client'

import { Provider as JotaiProvider } from 'jotai'
import AuthProvider from './auth-provider'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </JotaiProvider>
    </QueryClientProvider>
  )
}
