import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './AuthenticationRoutes';

// project imports (lazy load if preferred, but direct import is fine for this simple page)
import Loadable from 'ui-component/Loadable';
import { lazy } from 'react';

const RootMessage = Loadable(lazy(() => import('views/pages/RootMessage')));

// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootMessage />
  },
  LoginRoutes,
  MainRoutes
]);

export default router;
