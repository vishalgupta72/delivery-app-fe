import {
    IconDashboard,
    IconUsers,
    IconCategory,
    IconPhone,
    IconBroadcast,
    IconFileText,
    IconReportAnalytics,
    IconReport,
    IconBox,
    IconHome,
    IconHeartHandshake,
    IconTable,
    IconCalendarRepeat,
    IconFriends,
    IconRun,
    IconTag,
    IconPuzzle,
    IconPhotoEdit,
    IconCreditCard,
    IconTrendingUp,
    IconCat,
    IconCalendarEvent,
    IconWorld,
    IconUserExclamation,
    IconGenderMale,
    IconGenderFemale,
    IconQuestionMark,
    IconChartHistogram,
    IconStar,
    IconThumbUp,
    IconEye
} from '@tabler/icons-react';
import { APP_PREFIX_PATH } from 'config/constant';


const icons = {
    IconDashboard,
    IconUsers,
    IconCategory,
    IconPhone,
    IconBroadcast,
    IconFileText,
    IconReportAnalytics,
    IconReport,
    IconBox,
    IconHome,
    IconHeartHandshake,
    IconTable,
    IconQuestionMark,
    IconTrendingUp,
    IconCalendarRepeat,
    IconFriends,
    IconRun,
    IconTag,
    IconPuzzle,
    IconPhotoEdit,
    IconCreditCard,
    IconCat,
    IconCalendarEvent,
    IconWorld,
    IconUserExclamation,
    IconGenderMale,
    IconGenderFemale,
    IconChartHistogram,
    IconStar,
    IconThumbUp,
    IconEye
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //
const privileges = '1, 2, 3'; // Example privileges
const userType = 0; //if user type 0 then show all field

// Map privileges to menu item IDs
const privilegeMap = {
    1: 'manage-customer',
    2: 'manage_communities',
    3: 'manage_pet_categories',
    4: 'manage_pet_breed',
    5: 'manage_pet_size',
    6: 'manage_all_pet'
};

// Full menu items definition
const fullMenuItems = {
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: APP_PREFIX_PATH + '/dashboard',
            icon: icons.IconDashboard
        },
        {
            id: 'manage-customer',
            title: 'Manage Users',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [
                {
                    id: 'manage_users',
                    title: 'Users',
                    type: 'item',
                    url: APP_PREFIX_PATH + '/manage_users',
                    icon: icons.IconUsers
                },
                {
                    id: 'manage_driver',
                    title: 'Driver',
                    type: 'item',
                    url: APP_PREFIX_PATH + '/manage_driver',
                    icon: icons.IconUsers
                }
            ]
        },
        {
            id: 'manage_category',
            title: 'Manage Categories',
            type: 'item',
            icon: icons.IconPuzzle,
            url: APP_PREFIX_PATH + '/manage_category'
        },
        {
            id: 'manage_subcategory',
            title: 'Manage Sub-Categories',
            type: 'item',
            icon: icons.IconPuzzle,
            url: APP_PREFIX_PATH + '/manage_subcategory'
        },
        {
            id: 'manage_product',
            title: `Manage Products`,
            type: 'item',
            url: APP_PREFIX_PATH + '/manage_product',
            icon: icons.IconTag
        },
        {
            id: 'profile',
            title: 'Profile',
            type: 'item',
            url: APP_PREFIX_PATH + '/profile',
            icon: icons.IconDashboard,
            breadcrumbs: false,
            hidden: true
        },
        {
            id: 'cuestomer',
            title: 'view-customer',
            type: 'item',
            url: APP_PREFIX_PATH + '/view-customer/:user_id',
            icon: icons.IconDashboard,
            breadcrumbs: false,
            hidden: true
        }
    ]
};


// Function to filter menu items based on user type and privileges
function filterMenuItemsByPrivileges(menuItems, privileges, userType) {
    // If user type is 0, return the full menu without filtering
    if (userType === 0) {
        return menuItems;
    }

    // Parse privileges string into an array of numbers
    const allowedPrivileges = privileges.split(',').map(Number);
    const allowedIds = allowedPrivileges.map(privilege => privilegeMap[privilege]);

    // Filter children based on allowed IDs
    const filteredChildren = menuItems.children.filter(item => allowedIds.includes(item.id));

    return {
        ...menuItems,
        children: filteredChildren
    };
}

// Filtered menu items based on privileges and user type
const filteredMenuItems = filterMenuItemsByPrivileges(fullMenuItems, privileges, userType);

export default filteredMenuItems;