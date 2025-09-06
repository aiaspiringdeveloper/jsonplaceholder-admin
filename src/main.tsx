import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home';
import UsersPage from './pages/UsersPage';
import PostsPage from './pages/PostsPage';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/users', element: <UsersPage /> },
  { path: '/posts', element: <PostsPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);