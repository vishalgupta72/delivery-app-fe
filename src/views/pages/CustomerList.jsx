/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { ArrowDropDown } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
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
const columns = [
    { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
    { id: 'Action', label: 'Action', minWidth: 100, align: 'center' },
    { id: 'f_name', label: 'Name', minWidth: 200, align: 'center' },
    { id: 'image', label: 'Image', minWidth: 100, align: 'center' },
    { id: 'email', label: 'Email', minWidth: 170, align: 'center' },
    { id: 'Gender', label: 'Gender', minWidth: 170, align: 'center' },
    { id: 'user_type', label: 'User Type', minWidth: 100, align: 'center' },
    { id: 'status', label: 'Status', minWidth: 170, align: 'center' },
    { id: 'date_time', label: 'Create Date & Time', minWidth: 200, align: 'center' }
];

const CustomerList = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(25);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(null);
    const [user_data, setUserAllData] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showActiveModal, setShowActiveModal] = React.useState(false);
    const [activemodalUserid, setactivemodalUserid] = React.useState('');
    const [msg, setmsg] = React.useState('');
    const theme = useTheme();
    const navigate = useNavigate();
    var token = sessionStorage.getItem('token');

    React.useEffect(() => {
        axios
            .get(`${API_URL}get_all_user_data`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                if (response.data.key == 'authenticateFailed') {
                    sessionStorage.clear();
                    navigate(APP_PREFIX_PATH + '/');
                    // setLoading(false);
                }
                if (response.data.success) {
                    setUserAllData(response.data.user_arr);
                } else {
                    setUserAllData([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching user count details:', error);
            });
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleClick = (event, index) => {
        setAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleAction = (action, user_id, active_flag) => {
        if (action === 'View') {
            console.log('user_id,', user_id);
            let encode_user_id = base64_encode(user_id.toString());
            navigate(APP_PREFIX_PATH + `/view-customer/${encode_user_id}`);
        } else if (action === 'Activate/Deactivate') {
            setShowActiveModal(true);
            setmsg(active_flag);
            setactivemodalUserid({ user_id, status: active_flag });
        }
        handleClose();
    };

    const handleActivateDeactivate = () => {
        if (activemodalUserid) {
            const newStatus = activemodalUserid.status === 1 ? 0 : 1;
            const active_flag_Status = newStatus === 1 ? 'Activate' : 'Deactivate';
            axios
                .post(
                    `${API_URL}ActivateDeactivateUser`,
                    { user_id: activemodalUserid.user_id, newStatus },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                .then((res) => {
                    if (res.data.success) {
                        const updatedUserDetails = user_data.map((user) =>
                            user.user_id === activemodalUserid.user_id ? { ...user, active_flag: newStatus } : user
                        );
                        setUserAllData(updatedUserDetails);
                        setShowActiveModal(false);
                        Swal.fire({
                            icon: 'success',
                            text: `User ${active_flag_Status} Successfully`,
                            timer: 1000,
                            showConfirmButton: false
                        });
                    }
                    handleClose();
                })
                .catch((error) => {
                    console.log('Error updating user status:', error);
                    handleClose();
                });
        }
    };

    const filteredUsers = user_data.filter((user) => {
        const lowercasedTerm = searchQuery.toLowerCase();
        const f_nameMatch = user.name?.toLowerCase().includes(lowercasedTerm);
        const emailMatch = user.email?.toLowerCase().includes(lowercasedTerm);
        const activeMatch = user.active_flag_lable?.toLowerCase().includes(lowercasedTerm);
        const userTypeLabelMatch = user.user_type_label?.toLowerCase().includes(lowercasedTerm);
        const genderLableMatch = user.gender_lable?.toLowerCase().includes(lowercasedTerm);
        const dateMatch = user.createtime ? String(user.createtime).toLowerCase().includes(lowercasedTerm) : false;
        return dateMatch || f_nameMatch || activeMatch || emailMatch || userTypeLabelMatch || genderLableMatch;
    });

    return (
        <>
            <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
                <p
                    style={{
                        // margin: '2px',
                        fontSize: '1.25rem',
                        color: '#121926',
                        fontWeight: '600',
                        fontFamily: 'Poppins',
                        lineHeight: '1.167',
                        // fontWeight: ' 500',
                        marginBottom: ' 5px'
                    }}
                >
                    Manage Users List
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

            {filteredUsers.length > 0 ? (
                <Paper sx={{ width: '100%' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table>
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
                                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                        <TableCell style={{ textAlign: 'center' }}>{row.s_no}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <Button
                                                className="btn btn-primary"
                                                aria-label="more"
                                                aria-controls="long-menu"
                                                aria-haspopup="true"
                                                onClick={(event) => handleClick(event, index)}
                                                style={{ width: '120px' }}
                                            >
                                                Action <ArrowDropDown style={{
                                                    transform: selectedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.4s ease-in-out'
                                                }} />
                                            </Button>
                                            <Menu
                                                id="long-menu"
                                                anchorEl={anchorEl}
                                                keepMounted
                                                open={selectedIndex === index}
                                                onClose={handleClose}
                                            >
                                                <MenuItem
                                                    onClick={() => handleAction('View', row.user_id, row.active_flag)}
                                                    className="menu-icons"
                                                >
                                                    <VisibilityIcon style={{ marginRight: '8px' }} />
                                                    View
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => handleAction('Activate/Deactivate', row.user_id, row.active_flag)}
                                                    className="menu-icons"
                                                >
                                                    <ToggleOffIcon style={{ marginRight: '8px' }} />
                                                    Activate/Deactivate
                                                </MenuItem>

                                                {
                                                    row.active_flag === 0 ?
                                                        (<MenuItem
                                                            onClick={() => handleAction('Activate/Deactivate', row.user_id, row.active_flag)}
                                                            className="menu-icons"
                                                        >
                                                            <ToggleOffIcon style={{ marginRight: '8px' }} />
                                                            Activate
                                                        </MenuItem>)
                                                        :
                                                        (<MenuItem
                                                            onClick={() => handleAction('Activate/Deactivate', row.user_id, row.active_flag)}
                                                            className="menu-icons"
                                                        >
                                                            <ToggleOffIcon style={{ marginRight: '8px' }} />
                                                            Deactivate
                                                        </MenuItem>)
                                                }

                                            </Menu>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.name}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>
                                            <img
                                                alt={row.image}
                                                src={
                                                    row.image && row.image != null
                                                        ? `${IMAGE_PATH}${row.image}`
                                                        : `${IMAGE_PATH}placeholder.png`
                                                }
                                                style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.email}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.gender_lable}</TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.user_type_label}</TableCell>

                                        <TableCell style={{ textAlign: 'center' }}>
                                            <p
                                                // className="active-btn"
                                                style={{
                                                    backgroundColor: row.active_flag === 1 ? '#009640' : '#FF2222',
                                                    color: 'white',
                                                    padding: '4px 15px',
                                                    width: '120px',
                                                    borderRadius: '8px',
                                                    display: 'inline-block',
                                                    textTransform: 'capitalize'
                                                }}
                                            >
                                                {row.active_flag === 1 ? 'activate' : 'deactivate'}
                                            </p>
                                        </TableCell>
                                        <TableCell style={{ textAlign: 'center' }}>{row.createtime}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p
                            style={{ marginLeft: '26px', marginTop: '15px' }}
                        >{`Showing ${Math.min(filteredUsers.length > 0 ? page * rowsPerPage + 1 : 0, filteredUsers.length)} to ${Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length} entries`}</p>
                        <div>
                            <button
                                onClick={() => handleChangePage(null, page - 1)}
                                disabled={page === 0}
                                style={{ marginRight: '8px', borderRadius: '4px', background: 'whitesmoke' }}
                            >
                                {'<'}
                            </button>
                            <button
                                onClick={() => handleChangePage(null, page + 1)}
                                disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
                                style={{ borderRadius: '4px', marginRight: '10px', background: 'whitesmoke' }}
                            >
                                {'>'}
                            </button>
                        </div>
                    </div>
                </Paper>
            ) : (
                <Paper sx={{ width: '100%' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table>
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
                                <TableRow>
                                    <TableCell colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                                        No Data Available
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <Modal show={showActiveModal} onHide={() => setShowActiveModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Activate/Deactivate User</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to {msg === 1 ? 'Deactivate' : 'Activate'} this user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" className="btn btn-primary" onClick={handleActivateDeactivate}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CustomerList;
