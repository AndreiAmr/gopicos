import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RouterProvider } from 'react-router-dom';
import { store } from './store/index.ts';
import { apolloClient } from './config/apollo-client.ts';
import { router } from './routes/routes.tsx';
import { Toaster } from './atomic/atoms/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </Provider>
      </ApolloProvider>
    </QueryClientProvider>
  </StrictMode>,
);
