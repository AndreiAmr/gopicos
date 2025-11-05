import { AppLayout } from '@/pages/_layouts/AppLayout';
import { StartLayout } from '@/pages/_layouts/StartLayout';
import { HomePage } from '@/pages/app/home';

import { LoginPage } from '@/pages/auth/login';
import { PageNotFound } from '@/pages/error/PageNotFound';
import { createBrowserRouter } from 'react-router';
import { spotRoutes } from './spot.routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <StartLayout />,
    errorElement: <PageNotFound />,
    children: [{ path: '/', element: <LoginPage /> }],
  },
  {
    path: '/home',
    errorElement: <PageNotFound />,
    element: <AppLayout />,
    children: [{ path: '/home', element: <HomePage /> }],
  },
  ...spotRoutes,
]);

export { router };
