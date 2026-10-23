import { RouteObject } from 'react-router';

import { StartLayout } from '@/pages/_layouts/StartLayout';
import { PageNotFound } from '@/pages/error/PageNotFound';
import { StepEmail } from '@/pages/auth/signUp/StepEmail';
import { StepName } from '@/pages/auth/signUp/StepName';
import { StepPassword } from '@/pages/auth/signUp/StepPassword';

import { URL } from './url';

export const signUpRoutes: RouteObject[] = [
  {
    path: URL.SIGN_UP,
    element: <StartLayout />,
    errorElement: <PageNotFound />,
    children: [
      { path: URL.SIGN_UP, element: <StepName /> },
      { path: URL.SIGN_UP_EMAIL, element: <StepEmail /> },
      { path: URL.SIGN_UP_PASSWORD, element: <StepPassword /> },
    ],
  },
];
