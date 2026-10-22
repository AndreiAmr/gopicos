import { RouteObject } from 'react-router';

import { ProfileLayout } from '@/pages/_layouts/ProfileLayout';
import { MyDataPage } from '@/pages/app/profile';
import { PageNotFound } from '@/pages/error/PageNotFound';

import { URL } from './url';

export const profileRoutes: RouteObject[] = [
  {
    path: URL.PROFILE,
    element: <ProfileLayout />,
    errorElement: <PageNotFound />,
    children: [{ path: URL.PROFILE, element: <MyDataPage /> }],
  },
];
