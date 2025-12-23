import React from 'react';
import { Box, Typography } from '@mui/material';

const RootMessage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                bgcolor: 'background.default'
            }}
        >
            <Typography variant="h2" component="div">
                frontend server is working...
            </Typography>
        </Box>
    );
};

export default RootMessage;
