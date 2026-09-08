import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';
import { AuthPage } from '@/features/auth/pages/AuthPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { PublicProfilePage } from '@/features/profile/pages/PublicProfilePage';
import { AppLayout } from '@/components/layout/AppLayout';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <AuthPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/app',
            children: [
              {
                index: true,
                element: <Navigate to="profile" replace />,
              },
              {
                path: 'profile',
                element: <ProfilePage />,
              },
            ],
          },
        ],
      },
      {
        path: '/:username',
        element: <PublicProfilePage />,
      },
    ],
  },
]);
