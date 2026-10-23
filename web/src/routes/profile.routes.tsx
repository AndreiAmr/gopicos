import { RouteObject } from 'react-router';

import { ProfileLayout } from '@/pages/_layouts/ProfileLayout';
import { MyDataPage } from '@/pages/app/profile';
import { ChangePasswordPage } from '@/pages/app/profile/password';
import {
  MyReviewsPage,
  MySpotsPage,
} from '@/pages/app/profile/activity/ActivityPages';
import { PageNotFound } from '@/pages/error/PageNotFound';

import { RequireAuth } from './RequireAuth';
import { URL } from './url';

export const profileRoutes: RouteObject[] = [
  {
    path: URL.PROFILE,
    element: (
      <RequireAuth>
        <ProfileLayout />
      </RequireAuth>
    ),
    errorElement: <PageNotFound />,
    children: [
      { path: URL.PROFILE, element: <MyDataPage /> },
      { path: URL.PROFILE_PASSWORD, element: <ChangePasswordPage /> },
      { path: URL.PROFILE_SPOTS, element: <MySpotsPage /> },
      { path: URL.PROFILE_REVIEWS, element: <MyReviewsPage /> },
    ],
  },
];
