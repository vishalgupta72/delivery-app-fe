import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ViewCustomer from 'views/pages/ViewCustomer';
import Profile from 'views/pages/Profile';
import { APP_PREFIX_PATH } from 'config/constant';
import ManageUsers from 'views/pages/ManageUsers';
import ManageDriver from 'views/pages/ManageDriver';
import ManageCategory from 'views/pages/ManageCategory';
import ManageSubcategory from 'views/pages/ManageSubcategory';
import ManageProduct from 'views/pages/ManageProduct';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const CustomerList = Loadable(lazy(() => import('views/pages/CustomerList')));
const Inventory = Loadable(lazy(() => import('views/inventory/Inventory')));

const MainRoutes = {
    path: APP_PREFIX_PATH + '/',
    element: <MainLayout />,
    children: [
        {
            path: APP_PREFIX_PATH + '/dashboard',
            element: <DashboardDefault />
        },
        {
            path: '',
            children: [
                {
                    path: APP_PREFIX_PATH + '/dashboard',
                    element: <DashboardDefault />
                },
                {
                    path: APP_PREFIX_PATH + '/customer_list',
                    element: <CustomerList />
                },
                {
                    path: APP_PREFIX_PATH + '/inventory',
                    element: <Inventory />
                },
                {
                    path: APP_PREFIX_PATH + '/manage_users',
                    element: <ManageUsers />
                },
                {
                    path: APP_PREFIX_PATH + '/manage_driver',
                    element: <ManageDriver />
                },
                {
                    path: APP_PREFIX_PATH + '/manage_category',
                    element: <ManageCategory />
                },
                {
                    path: APP_PREFIX_PATH + '/manage_subcategory',
                    element: <ManageSubcategory />
                },
                {
                    path: APP_PREFIX_PATH + '/manage_product',
                    element: <ManageProduct />
                },
                {
                    path: APP_PREFIX_PATH + '/view_deleted_user/:user_id',
                    element: <ViewCustomer />
                },
                {
                    path: APP_PREFIX_PATH + '/profile',
                    breadcrumbs: false,
                    element: <Profile />
                }
            ]
        }
    ]
};

export default MainRoutes;
