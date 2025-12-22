import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { API_URL, APP_PREFIX_PATH } from 'config/constant';
import { useNavigate } from 'react-router-dom';
import { IconUsers } from '@tabler/icons-react';

const TotalDriverCard = ({ isLoading }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const token = sessionStorage.getItem('token');
    const [totalCount, setTotalCount] = React.useState(0);

    useEffect(() => {
        axios
            .get(`${API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    type: 'driver'
                }
            })
            .then((response) => {
                const count = response.data?.count ?? response.data?.data?.length ?? 0;
                setTotalCount(count);
            })
            .catch((error) => {
                console.error('Error fetching driver count details:', error);
            });
    }, [token]);

    const handleToggle = () => {
        navigate(APP_PREFIX_PATH + `/manage_driver`);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <MainCard
                    border={false}
                    content={false}
                    sx={{
                        bgcolor: 'secondary.dark',
                        height: '185px',
                        color: '#fff',
                        overflow: 'hidden',
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 210,
                            bgcolor: '#305CDE',
                            borderRadius: '50%',
                            top: { xs: -105, sm: -85 },
                            right: { xs: -140, sm: -95 }
                        },
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            width: 210,
                            height: 173,
                            bgcolor: '#305CDE',
                            borderRadius: '50%',
                            top: { xs: -155, sm: -125 },
                            right: { xs: -70, sm: -15 },
                            opacity: 0.5
                        }
                    }}
                >
                    <Box sx={{ p: 2.25, cursor: 'pointer' }} onClick={handleToggle}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                bgcolor: 'secondary.800',
                                                color: '#fff',
                                                mt: 1
                                            }}
                                        >
                                            <IconUsers />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                            {totalCount}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            sx={{
                                                cursor: 'pointer',
                                                ...theme.typography.smallAvatar,
                                                bgcolor: '#305CDE',
                                                color: '#FFF'
                                            }}
                                        >
                                            <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 1.25 }}>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 500,
                                        color: '#FFF'
                                    }}
                                >
                                    Drivers
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </MainCard>
            )}
        </>
    );
};

TotalDriverCard.propTypes = {
    isLoading: PropTypes.bool
};


export default TotalDriverCard
