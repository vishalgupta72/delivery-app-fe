import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { APP_PREFIX_PATH } from 'config/constant';

function Authentication() {
  const navigate = useNavigate();
  // console.log('auth page enter');

  useEffect(() => {
    const path = window.location.pathname;
    const protectedPaths = [
      '/dashboard',
      APP_PREFIX_PATH + '/manage-category',
      APP_PREFIX_PATH + '/customer_list',
      APP_PREFIX_PATH + '/deleted_customer',
      APP_PREFIX_PATH + '/manage-category',
      APP_PREFIX_PATH + '/manage-banner',
      APP_PREFIX_PATH + '/view-homes',
      APP_PREFIX_PATH + '/manage-user-subscription',
      APP_PREFIX_PATH + '/manage-question',
      APP_PREFIX_PATH + '/manage-FAQ',
      APP_PREFIX_PATH + '/manage-contact',
      APP_PREFIX_PATH + '/manage-content',
      APP_PREFIX_PATH + '/manage-broadcast',
      APP_PREFIX_PATH + '/customer-tabular-report',
      APP_PREFIX_PATH + '/business-tabular-report',
      APP_PREFIX_PATH + '/customer-ana-report',
      APP_PREFIX_PATH + '/business-ana-report',
      APP_PREFIX_PATH + '/profile',
      APP_PREFIX_PATH + '/manage-center',
      APP_PREFIX_PATH + '/view-customer/:user_id',
      APP_PREFIX_PATH + '/view-question/:user_id'
    ];

    const token = sessionStorage.getItem('token');
    const userType = sessionStorage.getItem('user_type');

    if (token) {
      var pathh = window.location;
      // console.log('pathh : ', pathh);

      if ([APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/login', APP_PREFIX_PATH + '/forgotpassword'].includes(path)) {
        navigate(APP_PREFIX_PATH + '/dashboard');
      } else if (path.startsWith(APP_PREFIX_PATH + '/resetpassword/')) {
        navigate(APP_PREFIX_PATH + '/dashboard');
      }
    }

    if (!token) {
      if (
        ![APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/forgotpassword'].includes(path) &&
        !path.startsWith(APP_PREFIX_PATH + '/resetpassword/')
      ) {
        // console.log('Navigating to /');
        navigate(APP_PREFIX_PATH + '/');
      }
    } else {
      //   if ([APP_PREFIX_PATH + '/', APP_PREFIX_PATH + '/resetpassword/', APP_PREFIX_PATH + '/forgotpassword'].includes(path)) {
      //     navigate(APP_PREFIX_PATH + '/dashboard');
      //   }

      // Check for protected paths and user type validity
      if (protectedPaths.some((protectedPath) => path.startsWith(protectedPath))) {
        // console.log('Protected path');
        if (userType !== '0' && !token) {
          // console.log('Invalid user type, navigating to /logout');
          navigate(APP_PREFIX_PATH + '/');
        }
      }
    }
  }, [navigate]);

  return null;
}

export default Authentication;
