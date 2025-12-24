import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
    Chip,
    Divider,
    Stack,
    Avatar,
    Checkbox,
    TextField
} from '@mui/material';
import {
    IconDashboard,
    IconPackage,
    IconBuildingStore,
    IconTruck,
    IconAlertTriangle,
    IconFileText,
    IconChartBar,
    IconPlus,
    IconEdit,
    IconCopy,
    IconUpload,
    IconReport,
    IconCategory,
    IconShoppingCart,
    IconUsers,
    IconDatabase,
    IconCurrencyDollar,
    IconClock,
    IconCheck,
    IconX,
    IconDownload,
    IconApi
} from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';

const Inventory = () => {
    const theme = useTheme();

    // Mock Data for Dashboard
    const dashboardMetrics = [
        { label: 'Total Products', value: '1,250', color: theme.palette.primary.main },
        { label: 'Low Stock Items', value: '45', color: theme.palette.warning.main },
        { label: 'Out of Stock', value: '12', color: theme.palette.error.main },
        { label: 'Pending Restocks', value: '8', color: theme.palette.success.main },
        { label: 'Active Warehouses', value: '5', color: theme.palette.info.main },
        { label: 'Total Value', value: '$85,000', color: theme.palette.secondary.main }
    ];

    // Mock Stock Data
    const stockData = [
        { product: 'Magnesium', warehouse: 'Bessemer', available: 106, reserved: 24, damaged: 24, reorder: '⚠️' },
        { product: 'Catenary', warehouse: 'Stouthfort', available: 100, reserved: 91, damaged: 22, reorder: '✅' },
        { product: 'Jamdog', warehouse: 'Single', available: 160, reserved: 35, damaged: 25, reorder: '✅' },
    ];

    // Simulated Flow Arrows (CSS)
    const Arrow = ({ direction = 'right', color = '#ccc', size = 12 }) => (
        <Box
            sx={{
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: 1,
                ...(direction === 'right' && {
                    left: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    '&::before': {
                        content: '""',
                        display: 'block',
                        width: 0,
                        height: 0,
                        borderLeft: `${size}px solid ${color}`,
                        borderTop: `${size / 2}px solid transparent`,
                        borderBottom: `${size / 2}px solid transparent`
                    }
                }),
                ...(direction === 'down' && {
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    '&::before': {
                        content: '""',
                        display: 'block',
                        width: 0,
                        height: 0,
                        borderTop: `${size}px solid ${color}`,
                        borderLeft: `${size / 2}px solid transparent`,
                        borderRight: `${size / 2}px solid transparent`
                    }
                })
            }}
        />
    );

    return (
        <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 'bold', color: theme.palette.primary.main, mb: 0.5 }}>
                    INVENTORY MANAGEMENT
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    Admin Panel for Delivery App
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    {['Grocery', 'Food', 'Pharmacy', 'B2B Delivery'].map((cat, i) => (
                        <Chip
                            key={i}
                            icon={
                                ['🛒', '🍎', '💊', '🚚'][i]
                            }
                            label={cat}
                            variant="outlined"
                            sx={{
                                bgcolor: theme.palette.background.paper,
                                borderColor: theme.palette.grey[300],
                                color: theme.palette.text.primary
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Main Flow Layout */}
            <Grid container spacing={2} sx={{ position: 'relative' }}>

                {/* ROW 1: DASHBOARD → PRODUCT MASTER → STOCK MANAGEMENT */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            borderLeft: `5px solid ${theme.palette.primary.main}`,
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconDashboard size={20} color={theme.palette.primary.main} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Inventory Dashboard</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Grid container spacing={1}>
                            {dashboardMetrics.slice(0, 3).map((m, i) => (
                                <Grid item xs={6} key={i}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.85rem' }}>
                                        <Typography variant="caption" color="textSecondary">{m.label}:</Typography>
                                        <Chip label={m.value} size="small" sx={{ bgcolor: m.color, color: 'white' }} />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            {dashboardMetrics.slice(3, 6).map((m, i) => (
                                <Grid item xs={6} key={i}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.85rem' }}>
                                        <Typography variant="caption" color="textSecondary">{m.label}:</Typography>
                                        <Chip label={m.value} size="small" sx={{ bgcolor: m.color, color: 'white' }} />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="textSecondary">Stock Levels Trend</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 40, gap: 0.5, mt: 0.5 }}>
                                {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                    <Box key={i} sx={{
                                        width: '12%',
                                        height: `${h}%`,
                                        bgcolor: '#64b5f6',
                                        borderTop: '3px solid #1565c0',
                                        borderRadius: '2px 2px 0 0'
                                    }} />
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', mt: 0.5, gap: 0.5 }}>
                                {[0, 2, 5, 8, 12, 15, 18].map((num, i) => (
                                    <Typography key={i} variant="caption" align="center" color="textSecondary" sx={{ width: '12%', fontSize: '0.65rem' }}>{num}</Typography>
                                ))}
                            </Box>
                        </Box>

                        {/* Right Arrow to Product Master */}
                        <Arrow direction="right" color={theme.palette.primary.main} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            borderLeft: `5px solid ${theme.palette.warning.main}`,
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconPackage size={20} color={theme.palette.warning.main} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Product Master</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ fontSize: '0.85rem', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" color="textSecondary" sx={{ minWidth: 80 }}>Product ID:</Typography>
                                <TextField variant="outlined" size="small" fullWidth sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.8rem' } }} placeholder="PROD-001" />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" color="textSecondary" sx={{ minWidth: 80 }}>Name:</Typography>
                                <TextField variant="outlined" size="small" fullWidth sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.8rem' } }} placeholder="Product Name" />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" color="textSecondary" sx={{ minWidth: 80 }}>Category:</Typography>
                                <TextField variant="outlined" size="small" fullWidth sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.8rem' } }} placeholder="Select Category" />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" color="textSecondary" sx={{ minWidth: 80 }}>SKU:</Typography>
                                <TextField variant="outlined" size="small" fullWidth sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.8rem' } }} placeholder="SKU-12345" />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" color="textSecondary" sx={{ minWidth: 80 }}>Price:</Typography>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    type="number"
                                    sx={{ '& .MuiInputBase-input': { py: 0.5, fontSize: '0.8rem' } }}
                                    placeholder="0.00"
                                />
                            </Box>
                        </Box>

                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button size="small" startIcon={<IconPlus />} variant="contained" color="success" fullWidth>Add</Button>
                            <Button size="small" startIcon={<IconEdit />} variant="contained" color="primary" fullWidth>Edit</Button>
                            <Button size="small" startIcon={<IconCopy />} variant="contained" color="warning" fullWidth>Duplicate</Button>
                        </Stack>

                        {/* Right Arrow to Stock Management */}
                        <Arrow direction="right" color={theme.palette.warning.main} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            borderLeft: `5px solid ${theme.palette.info.main}`,
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconBuildingStore size={20} color={theme.palette.info.main} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Stock Management</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ fontSize: '0.8rem' }}>
                            {/* Table Header */}
                            <Box sx={{ color: 'white', p: 1, borderRadius: 1, mb: 1 }}>
                                <Grid container alignItems="center" spacing={1}>
                                    <Grid item xs={3}><Typography variant="caption" fontWeight="bold">Product</Typography></Grid>
                                    <Grid item xs={2.5}><Typography variant="caption" fontWeight="bold">Warehouse</Typography></Grid>
                                    <Grid item xs={1.5}><Typography variant="caption" fontWeight="bold" align="center">Avail</Typography></Grid>
                                    <Grid item xs={1.5}><Typography variant="caption" fontWeight="bold" align="center">Rsrv</Typography></Grid>
                                    <Grid item xs={1.5}><Typography variant="caption" fontWeight="bold" align="center">Dmg</Typography></Grid>
                                    <Grid item xs={2}><Typography variant="caption" fontWeight="bold">Level</Typography></Grid>
                                </Grid>
                            </Box>

                            {/* Table Rows */}
                            {stockData.slice(0, 3).map((item, i) => (
                                <Box key={i} sx={{ p: 1, borderBottom: '1px solid #f0f0f0' }}>
                                    <Grid container alignItems="center" spacing={1}>
                                        <Grid item xs={3}><Typography variant="caption" fontWeight="bold">{item.product}</Typography></Grid>
                                        <Grid item xs={2.5}><Typography variant="caption" color="textSecondary">{item.warehouse}</Typography></Grid>
                                        <Grid item xs={1.5}><Typography variant="caption" display="block" align="center">{item.available}</Typography></Grid>
                                        <Grid item xs={1.5}><Typography variant="caption" display="block" align="center">{item.reserved}</Typography></Grid>
                                        <Grid item xs={1.5}><Typography variant="caption" display="block" align="center">{item.damaged}</Typography></Grid>
                                        <Grid item xs={2}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box sx={{
                                                    bgcolor: item.reorder === '✅' ? 'success.main' : 'error.main',
                                                    width: 14, height: 14, borderRadius: 0.5,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                                }}>
                                                    <IconCheck size={10} stroke={3} />
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 0.25 }}>
                                                    {[1, 2, 3, 4].map(d => (
                                                        <Box key={d} sx={{
                                                            width: 6, height: 6, borderRadius: '50%',
                                                            bgcolor: (item.reorder === '✅'
                                                                ? (d <= 3 ? 'success.main' : 'grey.200')
                                                                : (d <= 3 ? 'error.main' : 'grey.200'))
                                                        }} />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Box>

                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button size="small" startIcon={<IconUpload />} variant="contained" color="info" fullWidth>Bulk Upload</Button>
                            <Button size="small" variant="outlined" color="primary" fullWidth>Update Stock</Button>
                        </Stack>

                        {/* Down Arrow to next row */}
                        <Arrow direction="down" color={theme.palette.info.main} />
                    </Paper>
                </Grid>

                {/* ROW 2: CATEGORY → WAREHOUSE → SUPPLIER */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            borderLeft: `5px solid ${theme.palette.secondary.main}`,
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconCategory size={20} color={theme.palette.secondary.main} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Category Management</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ fontSize: '1rem' }}>
                            <Typography variant="caption" color="textSecondary" fontSize={'0.85rem'} fontWeight={'bold'}>Category {'>'} Sub-Category {'>'} Child Category</Typography>
                            <Button size="small" variant="outlined" fullWidth sx={{ mt: 1 }}>Manage Categories</Button>
                        </Box>

                        {/* Right Arrow to Warehouse */}
                        <Arrow direction="right" color={theme.palette.secondary.main} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            borderLeft: `5px solid ${theme.palette.success.main}`,
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconBuildingStore size={20} color={theme.palette.success.main} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Warehouse / Stores</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ fontSize: '0.85rem' }}>
                            {/* Group 1: Store A & B */}
                            <Paper variant="outlined" sx={{ p: 1.5, mb: 1.5, display: 'flex', alignItems: 'center', bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">Store A</Typography>
                                        <Checkbox size="small" sx={{ p: 0.5 }} />
                                    </Box>
                                    <Divider sx={{ borderStyle: 'dashed' }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">Store B</Typography>
                                        <Checkbox size="small" sx={{ p: 0.5 }} />
                                    </Box>
                                </Box>
                                <Box
                                    component="img"
                                    src="https://static.vecteezy.com/system/resources/previews/017/733/724/non_2x/school-building-icon-with-colorful-style-isolated-on-white-background-free-vector.jpg"
                                    alt="store-group-1"
                                    sx={{ width: 70, height: 70, ml: 1.5, borderRadius: 1, objectFit: 'cover' }}
                                />
                            </Paper>

                            {/* Group 2: Store C & D */}
                            <Paper variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">Store C</Typography>
                                        <Checkbox size="small" sx={{ p: 0.5 }} />
                                    </Box>
                                    <Divider sx={{ borderStyle: 'dashed' }} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">Store D</Typography>
                                        <Checkbox size="small" sx={{ p: 0.5 }} />
                                    </Box>
                                </Box>
                                <Box
                                    component="img"
                                    src="https://static.vecteezy.com/system/resources/previews/017/733/724/non_2x/school-building-icon-with-colorful-style-isolated-on-white-background-free-vector.jpg"
                                    alt="store-group-2"
                                    sx={{ width: 70, height: 70, ml: 1.5, borderRadius: 1, objectFit: 'cover', filter: 'hue-rotate(180deg)' }}
                                />
                            </Paper>
                        </Box>

                        {/* Right Arrow to Supplier */}
                        <Arrow direction="right" color={theme.palette.success.main} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            borderLeft: `5px solid ${theme.palette.error.main}`,
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconTruck size={20} color={theme.palette.error.main} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Supplier / Vendors</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ fontSize: '0.85rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="caption" color="textSecondary" sx={{ minWidth: 80 }}>Supplier ID:</Typography>
                                <Chip label="f9L21065" size="small" sx={{ ml: 1 }} />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="caption" color="textSecondary" sx={{ minWidth: 80 }}>Name:</Typography>
                                <Typography variant="body2">Order • Store</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="caption" color="textSecondary" sx={{ minWidth: 80 }}>Contact:</Typography>
                                <Chip label="STN4 306" size="small" color="success" sx={{ ml: 1 }} />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="caption" color="textSecondary" sx={{ minWidth: 80 }}>History:</Typography>
                                <Chip label="REACTS LIFE" size="small" color="info" sx={{ ml: 1 }} />
                            </Box>
                        </Box>

                        <Button size="small" variant="contained" color="error" fullWidth sx={{ mt: 1 }}>Update Stock</Button>

                        {/* Down Arrow to next row */}
                        <Arrow direction="down" color={theme.palette.error.main} />
                    </Paper>
                </Grid>

                {/* ROW 3: PURCHASE → ALERTS → LOGS */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', position: 'relative' }}>
                        <Box sx={{ p: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                            <IconShoppingCart size={20} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Purchase & Restocking</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            {[
                                { label: 'Low Stock', icon: <IconChartBar />, color: '#1e88e5' },
                                { label: 'Out of Lock', icon: <IconReport />, color: '#e91e63' },
                                { label: 'Out of Stock', icon: <IconX />, color: '#d32f2f' },
                                { label: 'Expiry Alert', icon: <IconClock />, color: '#43a047' }
                            ].map((item, i) => (
                                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, borderRight: i !== 3 ? '1px solid #f0f0f0' : 'none' }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 1, boxShadow: 1 }}>
                                        {item.icon}
                                    </Box>
                                    <Typography variant="caption" fontWeight="bold" align="center" sx={{ lineHeight: 1.2 }}>{item.label}</Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Down Arrow */}
                        <Arrow direction="down" color={theme.palette.warning.main} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', position: 'relative' }}>
                        <Box sx={{ p: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                            <IconAlertTriangle size={20} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Alerts & Notifications</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            {[
                                { label: 'Low Stock', icon: <IconAlertTriangle />, color: '#4caf50' },
                                { label: 'Out of Stock', icon: <IconX />, color: '#ef6c00' },
                                { label: 'Expiry Alert', icon: <IconClock />, color: '#78909c' }
                            ].map((item, i) => (
                                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, borderRight: i !== 2 ? '1px solid #f0f0f0' : 'none' }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 1, boxShadow: 1 }}>
                                        {item.icon}
                                    </Box>
                                    <Typography variant="caption" fontWeight="bold" align="center" sx={{ lineHeight: 1.2 }}>{item.label}</Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Down Arrow */}
                        <Arrow direction="down" color={theme.palette.info.main} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff', position: 'relative' }}>
                        <Box sx={{ p: 1, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                            <IconFileText size={20} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Inventory Logs</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            {[
                                { label: 'Low Stock', icon: <IconFileText />, color: '#1976d2' },
                                { label: 'Out of Stock', icon: <IconPackage />, color: '#388e3c' },
                                { label: 'Expiry Alert', icon: <IconAlertTriangle />, color: '#fbc02d' }
                            ].map((item, i) => (
                                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, borderRight: i !== 2 ? '1px solid #f0f0f0' : 'none' }}>
                                    <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', mb: 1, boxShadow: 1 }}>
                                        {item.icon}
                                    </Box>
                                    <Typography variant="caption" fontWeight="bold" align="center" sx={{ lineHeight: 1.2 }}>{item.label}</Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* Down Arrow */}
                        <Arrow direction="down" color={theme.palette.success.main} />
                    </Paper>
                </Grid>

                {/* ROW 4: PRICING → ROLES → EXPORTS */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            borderLeft: `5px solid ${theme.palette.secondary.main}`,
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconCurrencyDollar size={20} color={theme.palette.secondary.main} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Pricing & Margin</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ fontSize: '0.8rem' }}>
                            <Grid container spacing={0.5} sx={{ mb: 0.5 }}>
                                <Grid item xs={3}><Typography variant="caption" fontWeight="bold">Action</Typography></Grid>
                                <Grid item xs={3}><Typography variant="caption" fontWeight="bold">Old Qty</Typography></Grid>
                                <Grid item xs={3}><Typography variant="caption" fontWeight="bold">New Qty</Typography></Grid>
                                <Grid item xs={3}><Typography variant="caption" fontWeight="bold">User</Typography></Grid>
                            </Grid>
                            <Grid container spacing={0.5}>
                                <Grid item xs={3}><Typography variant="body2">Batch No</Typography></Grid>
                                <Grid item xs={3}><Typography variant="body2">35</Typography></Grid>
                                <Grid item xs={3}><Typography variant="body2">65</Typography></Grid>
                                <Grid item xs={3}><Typography variant="body2">Same</Typography></Grid>
                            </Grid>
                            <Grid container spacing={0.5}>
                                <Grid item xs={3}><Typography variant="body2">Expiry Date</Typography></Grid>
                                <Grid item xs={3}><Typography variant="body2">299</Typography></Grid>
                                <Grid item xs={3}><Typography variant="body2">109</Typography></Grid>
                                <Grid item xs={3}><Typography variant="body2">1250</Typography></Grid>
                            </Grid>
                        </Box>

                        {/* Right Arrow to Roles */}
                        <Arrow direction="right" color={theme.palette.secondary.main} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            borderLeft: `5px solid ${theme.palette.primary.main}`,
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconUsers size={20} color={theme.palette.primary.main} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Roles & Permissions</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                            <Chip avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>SA</Avatar>} label="Super Admin" size="small" />
                            <Chip avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>IM</Avatar>} label="Inventory Manager" size="small" />
                            <Chip avatar={<Avatar sx={{ bgcolor: 'info.main' }}>WM</Avatar>} label="Warehouse Manager" size="small" />
                            <Chip avatar={<Avatar sx={{ bgcolor: 'warning.main' }}>SS</Avatar>} label="Support Staff" size="small" />
                        </Box>

                        {/* Right Arrow to Exports */}
                        <Arrow direction="right" color={theme.palette.primary.main} />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            borderLeft: `5px solid ${theme.palette.error.main}`,
                            position: 'relative'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <IconDownload size={20} color={theme.palette.error.main} />
                            <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>Stock & Exports</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />

                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <Chip icon={<IconDatabase size={16} />} label="Excel" color="success" size="small" />
                            <Chip icon={<IconDatabase size={16} />} label="CSV" color="info" size="small" />
                            <Chip icon={<IconDatabase size={16} />} label="PDF" color="warning" size="small" />
                            <Chip icon={<IconDatabase size={16} />} label="PDF" color="error" size="small" />
                        </Stack>

                        {/* Down Arrow to API */}
                        <Arrow direction="down" color={theme.palette.error.main} />
                    </Paper>
                </Grid>

                {/* BOTTOM BAR: API Integration */}
                <Grid item xs={12}>
                    <Paper
                        elevation={2}
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: '#fff',
                            borderLeft: `5px solid ${theme.palette.grey[500]}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <IconApi size={20} color={theme.palette.grey[500]} />
                        <Typography variant="body2" fontWeight="bold">API Integration</Typography>
                        <Divider orientation="vertical" flexItem />
                        <Typography variant="caption" color="textSecondary">/inventory/summary</Typography>
                        <Typography variant="caption" color="textSecondary">/stock/update</Typography>
                        <Typography variant="caption" color="textSecondary">/purchase-order</Typography>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

export default Inventory;