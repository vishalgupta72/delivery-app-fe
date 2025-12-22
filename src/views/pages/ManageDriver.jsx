/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { API_URL, APP_PREFIX_PATH, IMAGE_PATH } from 'config/constant';
import { Modal } from 'react-bootstrap';
import { encode as base64_encode } from 'base-64';
import Swal from 'sweetalert2';
import Tooltip from '@mui/material/Tooltip';

const columns = [
    { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
    { id: 'actions', label: 'Actions', minWidth: 140, align: 'center' },
    { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
    { id: 'f_name', label: 'Name', minWidth: 200, align: 'center' },
    { id: 'email', label: 'Email', minWidth: 170, align: 'center' },
    { id: 'Gender', label: 'Gender', minWidth: 170, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 170, align: 'center' },
];

const ManageDriver = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(25);
    const [user_data, setUserAllData] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showActiveModal, setShowActiveModal] = React.useState(false);
    const [activemodalUserid, setactivemodalUserid] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false); // 👈 Added loading state
    const theme = useTheme();
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    React.useEffect(() => {
    document.title = "Manage driver";

    // Specify the user type you want to fetch (e.g., 'driver')
    const userType = 'driver'; // or 'user', based on your page

    axios
        .get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
            type: userType  // 👈 This adds ?type=driver to the URL
        }
        })
        .then((response) => {
        if (response.data.key === 'authenticateFailed') {
            sessionStorage.clear();
            navigate(APP_PREFIX_PATH + '/');
        }
        if (response.data.success) {
            setUserAllData(response.data.data);
        } else {
            setUserAllData([]);
        }
        })
        .catch((error) => {
        console.error('Error fetching users:', error);
        });
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleView = (user_id) => {
        const encode_user_id = base64_encode(user_id.toString());
        navigate(`${APP_PREFIX_PATH}/view_coach/${encode_user_id}`);
    };

    const handleToggleStatus = (user) => {
        setactivemodalUserid(user);
        setShowActiveModal(true);
    };

    const handleActivateDeactivate = () => {
        if (!activemodalUserid || isLoading) return;

        setIsLoading(true);

        const newStatus = activemodalUserid.active_flag === 1 ? 0 : 1;
        const actionText = newStatus === 1 ? 'Activate' : 'Deactivate';

        axios
            .post(
                `${API_URL}ActivateDeactivateUser`,
                { user_id: activemodalUserid.user_id, newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                if (res.data.success) {
                    const updatedUsers = user_data.map((user) =>
                        user.user_id === activemodalUserid.user_id
                            ? { ...user, active_flag: newStatus }
                            : user
                    );
                    setUserAllData(updatedUsers);
                    Swal.fire({
                        icon: 'success',
                        text: `Coach ${actionText}d Successfully`,
                        timer: 1000,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: res.data.msg || 'Operation failed. Please try again.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            })
            .catch((error) => {
                console.log('Error updating coach status:', error);
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to update status. Please try again.',
                    timer: 2000,
                    showConfirmButton: false
                });
            })
            .finally(() => {
                setIsLoading(false);
                setShowActiveModal(false);
            });
    };

    const filteredUsers = user_data.filter((user) => {
        const term = searchQuery.toLowerCase().trim();
        return (
            (user.name?.toLowerCase().includes(term)) ||
            (user.email?.toLowerCase().includes(term)) ||
            (user.gender_lable?.toLowerCase().includes(term)) ||
            (user.active_flag_lable?.toLowerCase().includes(term)) ||
            (user.createtime?.toString().toLowerCase().includes(term))
        );
    });

    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p
                    style={{
                        fontSize: '1.25rem',
                        color: '#121926',
                        fontWeight: '600',
                        fontFamily: 'Poppins',
                        lineHeight: '1.167',
                        marginBottom: '5px'
                    }}
                >
                    Manage Coach List
                </p>
            </div>

            <Box alignItems="center" justifyContent="space-start" display="flex" className="mobile-res">
                <OutlinedInput
                    sx={{ pr: 1, pl: 2, my: 2 }}
                    id="input-search-profile"
                    placeholder="Search"
                    onChange={handleSearch}
                    startAdornment={
                        <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                        </InputAdornment>
                    }
                />
            </Box>

            <Paper sx={{ width: '100%' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.user_id || row.index}>
                                        <TableCell style={{ textAlign: 'center' }}>{index + 1}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                                                <Tooltip title="View" arrow>
                                                    <VisibilityIcon
                                                        sx={{ cursor: 'pointer', color: 'info.main' }}
                                                        onClick={() => handleView(row.user_id)}
                                                    />
                                                </Tooltip>
                                                {row.active_flag === 0 ? (
                                                    <Tooltip title="Deactivate" arrow>
                                                        <ToggleOffIcon
                                                            sx={{ cursor: 'pointer', color: 'error.main' }}
                                                            onClick={() => handleToggleStatus(row)}
                                                        />
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip title="Activate" arrow>
                                                        <ToggleOnIcon
                                                            sx={{ cursor: 'pointer', color: 'success.main' }}
                                                            onClick={() => handleToggleStatus(row)}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <img
                                                alt={row.fullName || 'User'}
                                                src={row?.profileImage}
                                                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.fullName || 'NA'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.email || 'NA'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.gender || 'NA'}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <span
                                                style={{
                                                    backgroundColor: row.status === 'active' ? '#009640' : '#FF2222',
                                                    color: 'white',
                                                    padding: '4px 15px',
                                                    width: '120px',
                                                    borderRadius: '8px',
                                                    display: 'inline-block',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {row.status === 'active' ? 'active' : 'inactive'}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                                        No Data Available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                    <p>
                        {`Showing ${Math.min(filteredUsers.length > 0 ? page * rowsPerPage + 1 : 0, filteredUsers.length)} to ${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} entries`}
                    </p>
                    <div>
                        <button
                            onClick={() => handleChangePage(null, page - 1)}
                            disabled={page === 0}
                            style={{ borderRadius: '4px', marginRight: '10px', background: 'whitesmoke', border: 'none', padding: '6px 10px' }}
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={() => handleChangePage(null, page + 1)}
                            disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
                            style={{ borderRadius: '4px', background: 'whitesmoke', border: 'none', padding: '6px 10px' }}
                        >
                            {'>'}
                        </button>
                    </div>
                </div>
            </Paper>

            {/* Activate/Deactivate Confirmation Modal */}
            <Modal
                show={showActiveModal}
                onHide={() => !isLoading && setShowActiveModal(false)}
                backdrop="static"
            >
                <Modal.Header closeButton={!isLoading}>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to{' '}
                    {activemodalUserid?.active_flag === 1 ? 'deactivate' : 'activate'} this coach?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => !isLoading && setShowActiveModal(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleActivateDeactivate}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Yes'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};


export default ManageDriver
