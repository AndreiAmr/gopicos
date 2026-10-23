import { AppLayout } from '@/pages/_layouts/AppLayout';
import NewSpotLayout from '@/pages/_layouts/NewSpotLayout';
import { NewSpotMapTemplate } from '@/templates/spot/newSpot/NewSpotMap';
import { NewSpotDetailsTemplate } from '@/templates/spot/newSpot/NewSpotDetails';
import { SpotDetailsPage } from '@/pages/app/spot/details';
import { RouteObject } from 'react-router';

import { RequireAuth } from './RequireAuth';

export const spotRoutes: RouteObject[] = [
  {
    path: '/spot',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: '/spot/new-spot',
        element: <NewSpotLayout />,
        children: [
          {
            path: '/spot/new-spot',
            element: <NewSpotMapTemplate />,
          },
          {
            path: '/spot/new-spot/details',
            element: <NewSpotDetailsTemplate />,
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
