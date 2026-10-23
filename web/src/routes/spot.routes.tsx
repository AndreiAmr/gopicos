import { AppLayout } from '@/pages/_layouts/AppLayout';
import NewSpotLayout from '@/pages/_layouts/NewSpotLayout';
import { NewSpot } from '@/pages/app/spot/newSpot';
import { SpotDetailsPage } from '@/pages/app/spot/details';
import { RouteObject } from 'react-router';

export const spotRoutes: RouteObject[] = [
  {
    path: '/spot',
    element: <AppLayout />,
    children: [
      {
        path: '/spot/new-spot',
        element: <NewSpotLayout />,
        children: [
          {
            path: '/spot/new-spot',
            element: <NewSpot />,
          },
          {
            path: '/spot/new-spot/details',
            element: <>spot details</>,
          },
        ],
      },
      {
        // As rotas estáticas (new-spot) têm precedência sobre :id.
        path: '/spot/:id',
        element: <SpotDetailsPage />,
      },
    ],
  },
];
