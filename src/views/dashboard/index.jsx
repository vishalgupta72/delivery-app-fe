/* eslint-disable no-dupe-keys */
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { gridSpacing } from 'store/constant';
import Authentication from 'views/pages/auth/authentication';
import { SyncLoader } from 'react-spinners';
import TotalUserCard from './TotalUserCard';
import TotalDriverCard from './TotalDriverCard';
import TotalCategoryCard from './TotalCategoryCard';
import TotalSubCategoryCard from './TotalSubCategoryCard';
import TotalProductCard from './TotalProductCard';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Dashboard"
        setLoading(false);
    }, []);

    return (
        <>
            {loading ? (
                <div style={{ marginLeft: '25rem', marginTop: '10rem' }}>
                    <SyncLoader color="#36d7b7" />
                </div>
            ) : (
                <>
                    <div
                        className="col-xl-12"
                        style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}
                    >
                        <p
                            style={{
                                fontSize: '1.25rem',
                                color: '#121926',
                                fontWeight: '600',
                                fontFamily: 'Poppins',
                                lineHeight: '1.167',
                                marginBottom: ' 5px'
                            }}
                        >
                            Dashboard
                        </p>
                    </div>
                    <Grid container spacing={gridSpacing} style={{ cursor: 'pointer' }}>
                        <Authentication />
                        <Grid item xs={12}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item lg={3} md={6} sm={6} xs={12}>
                                    <TotalUserCard isLoading={loading} />
                                </Grid>
                                <Grid item lg={3} md={6} sm={6} xs={12}>
                                    <TotalDriverCard isLoading={loading} />
                                </Grid>
                                <Grid item lg={3} md={6} sm={6} xs={12}>
                                    <TotalCategoryCard isLoading={loading} />
                                </Grid>
                                <Grid item lg={3} md={6} sm={6} xs={12}>
                                    <TotalSubCategoryCard isLoading={loading} />
                                </Grid>
                                <Grid item lg={3} md={6} sm={6} xs={12}>
                                    <TotalProductCard isLoading={loading} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            )}
        </>
    );
};

export default Dashboard;
