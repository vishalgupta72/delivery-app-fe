// import { useEffect, useRef, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import {
//     Avatar,
//     Box,
//     Button,
//     CardActions,
//     ClickAwayListener,
//     Divider,
//     Grid,
//     Paper,
//     Popper,
//     Stack,
//     Typography,
//     useMediaQuery,
//     ButtonBase,
//     Badge
// } from '@mui/material';

// // third-party
// import PerfectScrollbar from 'react-perfect-scrollbar';

// // project imports
// import MainCard from 'ui-component/cards/MainCard';
// import Transitions from 'ui-component/extended/Transitions';
// import NotificationList from './NotificationList';

// // assets
// import { IconBell } from '@tabler/icons-react';
// // import { APP_PREFIX_PATH } from 'config/constant';
// import { API_URL, APP_PREFIX_PATH } from '../../../../config/constant.js';

// const NotificationSection = () => {
//     const theme = useTheme();
//     const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
//     const [open, setOpen] = useState(false);
//     const [notificationCount, setNotificationCount] = useState(0);
//     const anchorRef = useRef(null);
//     const navigate = useNavigate();

//     const handleToggle = () => {
//         setOpen((prevOpen) => !prevOpen);
//     };

//     const handleClose = (event) => {
//         if (anchorRef.current && anchorRef.current.contains(event.target)) return;
//         setOpen(false);
//     };
//     var token = sessionStorage.getItem('token');

//     const prevOpen = useRef(open);
//     useEffect(() => {
//         if (prevOpen.current === true && open === false) {
//             anchorRef.current.focus();
//         }
//         prevOpen.current = open;
//     }, [open]);

//     const fetchNotificationCountData = () => {
//         axios
//             .get(`${API_URL}get_notification_count`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             .then((response) => {
//                 if (response.data.key === 'authenticateFailed') {
//                     sessionStorage.clear();
//                     navigate(APP_PREFIX_PATH + '/');
//                 } else if (response.data.success) {
//                     setNotificationCount(response.data.count || 0);
//                 } else {
//                     setNotificationCount(0);
//                 }
//             })
//             .catch((error) => {
//                 console.error('Error fetching notification count:', error);
//             });
//     };

//     useEffect(() => {
//         fetchNotificationCountData();
//     });

//     return (
//         <>
//             <Box sx={{ ml: 2, mr: 3, [theme.breakpoints.down('md')]: { mr: 2 } }}>
//                 <ButtonBase sx={{ borderRadius: '12px' }}>
//                     <Badge badgeContent={notificationCount} color="error" showZero>
//                         <Avatar
//                             variant="rounded"
//                             sx={{
//                                 ...theme.typography.commonAvatar,
//                                 ...theme.typography.mediumAvatar,
//                                 transition: 'all .2s ease-in-out',
//                                 background: theme.palette.secondary.light,
//                                 color: theme.palette.secondary.dark,
//                                 '&[aria-controls="menu-list-grow"],&:hover': {
//                                     background: theme.palette.secondary.dark,
//                                     color: theme.palette.secondary.light
//                                 }
//                             }}
//                             ref={anchorRef}
//                             aria-controls={open ? 'menu-list-grow' : undefined}
//                             aria-haspopup="true"
//                             onClick={handleToggle}
//                             color="inherit"
//                         >
//                             <IconBell stroke={1.5} size="1.3rem" />
//                         </Avatar>
//                     </Badge>
//                 </ButtonBase>
//             </Box>

//             <Popper
//                 placement={matchesXs ? 'bottom' : 'bottom-end'}
//                 open={open}
//                 anchorEl={anchorRef.current}
//                 role={undefined}
//                 transition
//                 disablePortal
//                 popperOptions={{
//                     modifiers: [
//                         {
//                             name: 'offset',
//                             options: {
//                                 offset: [matchesXs ? 5 : 0, 20]
//                             }
//                         }
//                     ]
//                 }}
//             >
//                 {({ TransitionProps }) => (
//                     <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
//                         <Paper>
//                             <ClickAwayListener onClickAway={handleClose}>
//                                 <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
//                                     <Grid container direction="column" spacing={2}>
//                                         <Grid item xs={12}>
//                                             <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
//                                                 <Grid item>
//                                                     <Stack direction="row" spacing={2}>
//                                                         <Typography variant="subtitle1" className="p-2">
//                                                             {' '}
//                                                             Notifications
//                                                         </Typography>
//                                                     </Stack>
//                                                 </Grid>
//                                             </Grid>
//                                         </Grid>
//                                         <Grid item xs={12}>

//                                             <PerfectScrollbar
//                                                 style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}
//                                             >
//                                                 <NotificationList onClose={() => setOpen(false)} />
//                                             </PerfectScrollbar>
//                                         </Grid>
//                                     </Grid>
//                                     <Divider />
//                                     {/* <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
//                                         <Button size="small" disableElevation>
//                                             View All
//                                         </Button>
//                                     </CardActions> */}
//                                 </MainCard>
//                             </ClickAwayListener>
//                         </Paper>
//                     </Transitions>
//                 )}
//             </Popper>
//         </>
//     );
// };

// export default NotificationSection;
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    ButtonBase,
    Badge,
    ClickAwayListener,
    Divider,
    Grid,
    Paper,
    Popper,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';

// assets
import { IconBell } from '@tabler/icons-react';
import { API_URL, APP_PREFIX_PATH } from '../../../../config/constant.js';

const NotificationSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const anchorRef = useRef(null);
    const navigate = useNavigate();

    const token = sessionStorage.getItem('token');

    const handleToggle = () => {
        setOpen((prevOpen) => {
            const newState = !prevOpen;
            // Uncomment below line if you want to reset count when opening
            // if (newState) setNotificationCount(0);
            return newState;
        });
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) return;
        setOpen(false);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const fetchNotificationCountData = () => {
        axios
            .get(`${API_URL}get_notification_count`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                if (response.data.key === 'authenticateFailed') {
                    sessionStorage.clear();
                    navigate(APP_PREFIX_PATH + '/');
                } else if (response.data.success) {
                    setNotificationCount(response.data.count || 0);
                } else {
                    setNotificationCount(0);
                }
            })
            .catch((error) => {
                console.error('Error fetching notification count:', error);
            });
    };

    // Polling for real-time notification updates
    useEffect(() => {
        fetchNotificationCountData(); // Initial fetch

        const interval = setInterval(() => {
            fetchNotificationCountData(); // Poll every 10 seconds
        }, 10000);

        return () => clearInterval(interval); // Cleanup
    }, []);

    return (
        <>
            <Box sx={{ ml: 2, mr: 3, [theme.breakpoints.down('md')]: { mr: 2 } }}>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Badge badgeContent={notificationCount} color="error" showZero>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.secondary.light,
                                color: theme.palette.secondary.dark,
                                '&[aria-controls="menu-list-grow"],&:hover': {
                                    background: theme.palette.secondary.dark,
                                    color: theme.palette.secondary.light
                                }
                            }}
                            ref={anchorRef}
                            aria-controls={open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                            color="inherit"
                        >
                            <IconBell stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </Badge>
                </ButtonBase>
            </Box>

            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                alignItems="center"
                                                justifyContent="space-between"
                                                sx={{ pt: 2, px: 2 }}
                                                style={{ paddingLeft: '24px' }}
                                            >
                                                <Grid item>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="subtitle1" className="p-2">
                                                            Notifications
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <PerfectScrollbar
                                                style={{
                                                    height: '100%',
                                                    maxHeight: 'calc(100vh - 205px)',
                                                    overflowX: 'hidden',
                                                    marginBottom: '25px'
                                                }}
                                            >
                                                <NotificationList onClose={() => setOpen(false)} />
                                            </PerfectScrollbar>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default NotificationSection;
