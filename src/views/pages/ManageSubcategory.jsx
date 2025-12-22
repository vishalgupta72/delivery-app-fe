/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import './main.css';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import { IconSearch } from '@tabler/icons-react';
import InputAdornment from '@mui/material/InputAdornment';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from 'config/constant';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'config/constant';
import Tooltip from '@mui/material/Tooltip';
import Select from 'react-select';

// Column config
const columns = [
  { id: 'number', label: 'S.No.', minWidth: 70, align: 'center' },
  { id: 'category', label: 'Category', minWidth: 180, align: 'center' },
  { id: 'name', label: 'Subcategory Name', minWidth: 200, align: 'center' },
  { id: 'status', label: 'Status', minWidth: 120, align: 'center' },
  { id: 'created', label: 'Created At', minWidth: 170, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 180, align: 'center' },
];

const ManageSubcategory = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const theme = useTheme();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  // Data
  const [subcategoryData, setSubcategoryData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [form, setForm] = useState({ categoryId: '', name: '', status: 'active' });
  const [errors, setErrors] = useState({ categoryId: '', name: '' });
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');

  // Loading
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all subcategories
  const fetchSubcategories = () => {
    axios
      .get(`${API_URL}/subcategories`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
          return;
        }
        if (res.data.success) {
          setSubcategoryData(res.data.data);
        }
      })
      .catch((err) => console.error('Fetch subcategories error:', err));
  };

  // Fetch active categories for dropdown
  const fetchCategories = () => {
    axios
      .get(`${API_URL}/categories?status=active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          const options = res.data.data.map((cat) => ({
            value: cat._id,
            label: cat.name,
          }));
          setCategoryOptions(options);
        }
      })
      .catch((err) => console.error('Fetch categories error:', err));
  };

  useEffect(() => {
    document.title = 'Manage Subcategories';
    fetchSubcategories();
    fetchCategories();
  }, []);

  // Reset form
  const resetForm = () => {
    setForm({ categoryId: '', name: '', status: 'active' });
    setErrors({ categoryId: '', name: '' });
  };

  // Validation
  const validate = () => {
    let valid = true;
    if (!form.categoryId) {
      setErrors((prev) => ({ ...prev, categoryId: 'Category is required' }));
      valid = false;
    } else {
      setErrors((prev) => ({ ...prev, categoryId: '' }));
    }
    if (!form.name.trim()) {
      setErrors((prev) => ({ ...prev, name: 'Subcategory name is required' }));
      valid = false;
    } else if (form.name.trim().length < 2) {
      setErrors((prev) => ({ ...prev, name: 'Min 2 characters' }));
      valid = false;
    } else {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
    return valid;
  };

  // Add subcategory
  const handleAdd = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsAdding(true);
    axios
      .post(
        `${API_URL}/subcategories`,
        { 
          categoryId: form.categoryId.value, 
          name: form.name.trim(), 
          status: form.status 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          Swal.fire('Success', 'Subcategory added!', 'success');
          fetchSubcategories();
          setShowAddModal(false);
          resetForm();
        } else {
          Swal.fire('Error', res.data.message || 'Failed to add', 'error');
        }
      })
      .catch((err) => {
        console.error('Add error:', err);
        Swal.fire('Error', 'Failed to add subcategory', 'error');
      })
      .finally(() => setIsAdding(false));
  };

  // Edit subcategory
  const handleEdit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsUpdating(true);
    axios
      .put(
        `${API_URL}/subcategories`,
        {
          id: selectedSubcategoryId,
          categoryId: form.categoryId.value,
          name: form.name.trim(),
          status: form.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          Swal.fire('Success', 'Subcategory updated!', 'success');
          fetchSubcategories();
          setShowEditModal(false);
          resetForm();
        } else {
          Swal.fire('Error', res.data.message || 'Update failed', 'error');
        }
      })
      .catch((err) => {
        console.error('Edit error:', err);
        Swal.fire('Error', 'Update failed', 'error');
      })
      .finally(() => setIsUpdating(false));
  };

  // Open edit modal
  const openEditModal = (sub) => {
    const catOption = categoryOptions.find((opt) => opt.value === sub.categoryId._id?.toString() || opt.value === sub.categoryId);
    setForm({
      categoryId: catOption || null,
      name: sub.name,
      status: sub.status,
    });
    setSelectedSubcategoryId(sub._id);
    setShowEditModal(true);
  };

  // Delete subcategory
  const handleDelete = () => {
    axios
      .delete(
        `${API_URL}/subcategories`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: selectedSubcategoryId },
        }
      )
      .then((res) => {
        if (res.data.success) {
          Swal.fire('Deleted', 'Subcategory deleted', 'success');
          fetchSubcategories();
          setShowDeleteModal(false);
        }
      })
      .catch((err) => console.error('Delete error:', err));
  };

  // Toggle status
  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    axios
      .patch(
        `${API_URL}/subcategories/status`,
        { id, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          fetchSubcategories();
          Swal.fire('Updated', `Status set to ${newStatus}`, 'success');
        }
      })
      .catch((err) => console.error('Status update error:', err));
  };

  // Filter data
  const filteredData = subcategoryData.filter((item) =>
    (item.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      item.categoryId?.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()))
  );

  // Get category name safely
  const getCategoryName = (cat) => {
    if (typeof cat === 'string') return '—';
    return cat?.name || '—';
  };

  return (
    <>
      <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
        <p style={{ fontSize: '1.25rem', color: '#121926', fontWeight: '600', fontFamily: 'Poppins' }}>
          Manage Subcategories
        </p>
      </div>

      <Box alignItems="center" justifyContent="space-between" display="flex" className="mobile-res">
        <OutlinedInput
          sx={{ pr: 1, pl: 2, my: 2 }}
          placeholder="Search subcategories..."
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
            </InputAdornment>
          }
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          startIcon={<AddIcon />}
          style={{ width: '220px' }}
        >
          Add Subcategory
        </Button>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align} style={{ minWidth: col.minWidth }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={row._id}>
                      <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell align="center">{getCategoryName(row.categoryId)}</TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            backgroundColor: row.status === 'active' ? '#e8f5e9' : '#ffebee',
                            color: row.status === 'active' ? '#2e7d32' : '#c62828',
                          }}
                        >
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell align="center">
                        {new Date(row.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Tooltip title="Edit" arrow>
                            <EditIcon
                              sx={{ color: 'primary.main', cursor: 'pointer' }}
                              onClick={() => openEditModal(row)}
                            />
                          </Tooltip>
                          <Tooltip title={row.status === 'active' ? 'Deactivate' : 'Activate'} arrow>
                            {row.status === 'active' ? (
                              <ToggleOnIcon
                                sx={{ color: '#4caf50', cursor: 'pointer' }}
                                onClick={() => toggleStatus(row._id, row.status)}
                              />
                            ) : (
                              <ToggleOffIcon
                                sx={{ color: '#f44336', cursor: 'pointer' }}
                                onClick={() => toggleStatus(row._id, row.status)}
                              />
                            )}
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <DeleteIcon
                              sx={{ color: 'error.main', cursor: 'pointer' }}
                              onClick={() => {
                                setSelectedSubcategoryId(row._id);
                                setShowDeleteModal(true);
                              }}
                            />
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" style={{ padding: '20px' }}>
                    No subcategories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {filteredData.length > rowsPerPage && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
            <p>
              Showing {Math.min(page * rowsPerPage + 1, filteredData.length)} to{' '}
              {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} entries
            </p>
            <div>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                style={{
                  padding: '6px 10px',
                  margin: '0 5px',
                  borderRadius: '4px',
                  background: page === 0 ? '#f0f0f0' : 'whitesmoke',
                  border: '1px solid #ddd',
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {'<'}
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={(page + 1) * rowsPerPage >= filteredData.length}
                style={{
                  padding: '6px 10px',
                  margin: '0 5px',
                  borderRadius: '4px',
                  background: (page + 1) * rowsPerPage >= filteredData.length ? '#f0f0f0' : 'whitesmoke',
                  border: '1px solid #ddd',
                  cursor: (page + 1) * rowsPerPage >= filteredData.length ? 'not-allowed' : 'pointer',
                }}
              >
                {'>'}
              </button>
            </div>
          </div>
        )}
      </Paper>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Subcategory</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleAdd}>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Category *</label>
              <Select
                options={categoryOptions}
                value={form.categoryId}
                onChange={(opt) => setForm({ ...form, categoryId: opt })}
                placeholder="Select Category"
              />
              {errors.categoryId && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.categoryId}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Subcategory Name *</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Dairy"
              />
              {errors.name && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.name}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? 'Adding...' : 'Add Subcategory'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subcategory</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleEdit}>
          <Modal.Body>
            <div className="mb-3">
              <label className="form-label">Category *</label>
              <Select
                options={categoryOptions}
                value={form.categoryId}
                onChange={(opt) => setForm({ ...form, categoryId: opt })}
                placeholder="Select Category"
              />
              {errors.categoryId && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.categoryId}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Subcategory Name *</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Dairy"
              />
              {errors.name && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors.name}</p>}
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Subcategory'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this subcategory?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageSubcategory;