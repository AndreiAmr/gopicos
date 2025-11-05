import { AppLayout } from '@/pages/_layouts/AppLayout';
import NewSpotLayout from '@/pages/_layouts/NewSpotLayout';
import { NewSpot } from '@/pages/app/spot/newSpot';
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
    ],
  },
];
