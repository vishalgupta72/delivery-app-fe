// import { Outlet } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// // material-ui
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import useMediaQuery from '@mui/material/useMediaQuery';

// // project imports
// import { CssBaseline, styled, useTheme } from '@mui/material';
// import Header from './Header';
// import Sidebar from './Sidebar';
// // import Customization from '../Customization';
// import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
// import { SET_MENU } from 'store/actions';
// import { drawerWidth } from 'store/constant';

// // assets
// import { IconChevronRight } from '@tabler/icons-react';

// const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'theme' })(({ theme, open }) => ({
//     ...theme.typography.mainContent,
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//     transition: theme.transitions.create(
//         'margin',
//         open
//             ? {
//                   easing: theme.transitions.easing.easeOut,
//                   duration: theme.transitions.duration.enteringScreen
//               }
//             : {
//                   easing: theme.transitions.easing.sharp,
//                   duration: theme.transitions.duration.leavingScreen
//               }
//     ),
//     [theme.breakpoints.up('md')]: {
//         marginLeft: open ? 0 : -(drawerWidth - 20),
//         width: `calc(100% - ${drawerWidth}px)`
//     },
//     [theme.breakpoints.down('md')]: {
//         marginLeft: '20px',
//         width: `calc(100% - ${drawerWidth}px)`,
//         padding: '16px'
//     },
//     [theme.breakpoints.down('sm')]: {
//         marginLeft: '10px',
//         width: `calc(100% - ${drawerWidth}px)`,
//         padding: '16px',
//         marginRight: '10px'
//     }
// }));

// // ==============================|| MAIN LAYOUT ||============================== //

// const MainLayout = () => {
//     const theme = useTheme();
//     const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
//     // Handle left drawer
//     const leftDrawerOpened = useSelector((state) => state.customization.opened);
//     const dispatch = useDispatch();
//     const handleLeftDrawerToggle = () => {
//         dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
//     };

//     return (
//         <Box sx={{ display: 'flex' }}>
//             <CssBaseline />
//             {/* header */}
//             <AppBar
//                 enableColorOnDark
//                 position="fixed"
//                 color="inherit"
//                 elevation={0}
//                 sx={{
//                     bgcolor: theme.palette.background.default,
//                     transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
//                 }}
//             >
//                 <Toolbar style={{ background: '#009C1A' }}>
//                     <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
//                 </Toolbar>
//             </AppBar>

//             {/* drawer */}
//             <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

//             {/* main content */}
//             <Main theme={theme} open={leftDrawerOpened}>
//                 {/* breadcrumb */}
//                 <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
//                 <Outlet />

//             </Main>

//             {/* <Customization /> */}
//         </Box>
//     );
// };

// export default MainLayout;

import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CssBaseline, styled, useTheme } from '@mui/material';

// project imports
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import { SET_MENU } from 'store/actions';
import { drawerWidth } from 'store/constant';

// assets
import { IconChevronRight } from '@tabler/icons-react';

const Wrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh' // Ensures full height
});

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1, // Makes content take up remaining space
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 60px)', // Adjust for header/footer
    marginTop: '64px', // Adjust for fixed AppBar
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    [theme.breakpoints.up('md')]: {
        marginLeft: open ? `${drawerWidth}px` : 0
    }
}));

const Footer = styled(Box)({
    backgroundColor: '#305CDE',
    padding: '12px',
    textAlign: 'center',
    marginTop: 'auto'
});

const MainLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    const leftDrawerOpened = useSelector((state) => state.customization.opened);
    const dispatch = useDispatch();
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
    };

    return (
        <Wrapper style={{ background: '#EEF2F6', marginTop: '1.5rem' }}>
            <CssBaseline />

            {/* Header */}
            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                sx={{
                    bgcolor: theme.palette.background.default,
                    transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
                }}
            >
                <Toolbar style={{ background: '#305CDE' }}>
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

            {/* Main Content */}
            <Main theme={theme} open={leftDrawerOpened}>
                <Breadcrumbs separator={IconChevronRight} />
                <Outlet />
            </Main>

            {/* Footer */}
            <Footer>
                <p
                    style={{
                        fontSize: '10px',
                        color: '#FFF',
                        fontWeight: '200',
                        fontFamily: 'Poppins',
                        lineHeight: '1.167',
                        marginBottom: '5px'
                    }}
                >
                    Copyright © Young Decade IT Software Solution
                </p>
            </Footer>
        </Wrapper>
    );
};

export default MainLayout;
