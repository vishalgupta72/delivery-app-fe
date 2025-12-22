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
  { id: 'name', label: 'Product Name', minWidth: 200, align: 'center' },
  { id: 'category', label: 'Category', minWidth: 150, align: 'center' },
  { id: 'subcategory', label: 'Subcategory', minWidth: 150, align: 'center' },
  { id: 'price', label: 'Price (₹)', minWidth: 100, align: 'center' },
  { id: 'quantity', label: 'Quantity', minWidth: 100, align: 'center' },
  { id: 'status', label: 'Status', minWidth: 120, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 180, align: 'center' },
];

const ManageProduct = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const theme = useTheme();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  // Data
  const [productData, setProductData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  // Used for selects inside the add/edit forms
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  // Separate list of all subcategories so we can always resolve names in the table
  const [allSubcategoryOptions, setAllSubcategoryOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [form, setForm] = useState({
    name: '',
    category: null,
    subCategory: null,
    price: '',
    quantity: '',
    description: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [selectedProductId, setSelectedProductId] = useState('');

  // Loading
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all products
  const fetchProducts = () => {
    axios
      .get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/');
          return;
        }
        if (res.data.success) {
          setProductData(res.data.products || []);
        }
      })
      .catch((err) => console.error('Fetch products error:', err));
  };

  // Fetch active categories
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

  // Fetch all active subcategories (for displaying names in the table)
  const fetchAllSubcategories = () => {
    axios
      .get(`${API_URL}/subcategories?status=active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          const options = res.data.data.map((sub) => ({
            value: sub._id,
            label: sub.name,
          }));
          setAllSubcategoryOptions(options);
        }
      })
      .catch((err) => console.error('Fetch all subcategories error:', err));
  };

  // Fetch subcategories by category
  const fetchSubcategoriesByCategory = (categoryId) => {
    if (!categoryId) {
      setSubcategoryOptions([]);
      setForm((prev) => ({ ...prev, subCategory: null }));
      return;
    }
    axios
      .get(`${API_URL}/subcategories?categoryId=${categoryId}&status=active`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          const options = res.data.data.map((sub) => ({
            value: sub._id,
            label: sub.name,
          }));
          setSubcategoryOptions(options);
        } else {
          setSubcategoryOptions([]);
        }
      })
      .catch((err) => {
        console.error('Fetch subcategories error:', err);
        setSubcategoryOptions([]);
      });
  };

  useEffect(() => {
    document.title = 'Manage Products';
    fetchProducts();
    fetchCategories();
    fetchAllSubcategories();
  }, []);

  // Reset form
  const resetForm = () => {
    setForm({
      name: '',
      category: null,
      subCategory: null,
      price: '',
      quantity: '',
      description: '',
      status: 'active',
    });
    setErrors({});
    setSubcategoryOptions([]);
  };

  // Validation
  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Product name is required';
    if (!form.category) err.category = 'Category is required';
    if (!form.subCategory) err.subCategory = 'Subcategory is required';
    if (!form.price || isNaN(form.price) || parseFloat(form.price) < 0)
      err.price = 'Valid price is required';
    if (!form.quantity || isNaN(form.quantity) || parseInt(form.quantity) < 0)
      err.quantity = 'Valid quantity is required';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Add product
  const handleAdd = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsAdding(true);
    axios
      .post(
        `${API_URL}/products`, // 🔥 Fix: missing slash
        {
          name: form.name.trim(),
          category: form.category.value,
          subCategory: form.subCategory.value,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          description: form.description.trim(),
          status: form.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          Swal.fire('Success', 'Product added!', 'success');
          fetchProducts();
          setShowAddModal(false);
          resetForm();
        } else {
          Swal.fire('Error', res.data.message || 'Failed to add', 'error');
        }
      })
      .catch((err) => {
        console.error('Add error:', err);
        Swal.fire('Error', 'Failed to add product', 'error');
      })
      .finally(() => setIsAdding(false));
  };

  // Edit product
  const handleEdit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsUpdating(true);
    axios
      .put(
        `${API_URL}/products`,
        {
          id: selectedProductId,
          name: form.name.trim(),
          category: form.category.value,
          subCategory: form.subCategory.value,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          description: form.description.trim(),
          status: form.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          Swal.fire('Success', 'Product updated!', 'success');
          fetchProducts();
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
  const openEditModal = (product) => {
    const catOpt = categoryOptions.find((opt) => opt.value === product.category);
    // Use the full subcategory list to resolve the current product's subcategory
    const subCatOpt = allSubcategoryOptions.find((opt) => opt.value === product.subCategory) || null;

    setForm({
      name: product.name,
      category: catOpt || null,
      subCategory: subCatOpt,
      price: product.price,
      quantity: product.quantity,
      description: product.description || '',
      status: product.status,
    });

    // Populate subcategory options for the select in the modal
    if (catOpt) {
      fetchSubcategoriesByCategory(catOpt.value);
    }

    setSelectedProductId(product._id);
    setShowEditModal(true);
  };

  // Delete product
  const handleDelete = () => {
    axios
      .delete(`${API_URL}/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: selectedProductId },
        }
      )
      .then((res) => {
        if (res.data.success) {
          Swal.fire('Deleted', 'Product deleted', 'success');
          fetchProducts();
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
        `${API_URL}/products/status`,
        { id, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          fetchProducts();
          Swal.fire('Updated', `Status set to ${newStatus}`, 'success');
        }
      })
      .catch((err) => console.error('Status update error:', err));
  };

  // Filter data
  const filteredData = productData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    (item.categoryId?.name || '').toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
    (item.subCategoryId?.name || '').toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  // Get names safely
  const getCategoryName = (id) => {
    const cat = categoryOptions.find(c => c.value === id);
    return cat ? cat.label : '—';
  };
  const getSubcategoryName = (id) => {
    const sub = allSubcategoryOptions.find(s => s.value === id);
    return sub ? sub.label : '—';
  };

  return (
    <>
      <div className="col-xl-12" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '10px', marginBottom: '20px' }}>
        <p style={{ fontSize: '1.25rem', color: '#121926', fontWeight: '600', fontFamily: 'Poppins' }}>
          Manage Products
        </p>
      </div>

      <Box alignItems="center" justifyContent="space-between" display="flex" className="mobile-res">
        <OutlinedInput
          sx={{ pr: 1, pl: 2, my: 2 }}
          placeholder="Search products..."
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
          style={{ width: '200px' }}
        >
          Add Product
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
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{getCategoryName(row.category)}</TableCell>
                      <TableCell align="center">{getSubcategoryName(row.subCategory)}</TableCell>
                      <TableCell align="center">₹{row.price.toFixed(2)}</TableCell>
                      <TableCell align="center">{row.quantity}</TableCell>
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
                                setSelectedProductId(row._id);
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
                    No products found
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
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleAdd}>
          <Modal.Body>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label">Category *</label>
              <Select
                options={categoryOptions}
                value={form.category}
                onChange={(opt) => {
                  setForm({ ...form, category: opt, subCategory: null });
                  if (opt) fetchSubcategoriesByCategory(opt.value);
                }}
                placeholder="Select Category"
              />
              {errors.category && <p style={{ color: 'red' }}>{errors.category}</p>}
            </div>

            {/* Subcategory */}
            <div className="mb-3">
              <label className="form-label">Subcategory *</label>
              <Select
                options={subcategoryOptions}
                value={form.subCategory}
                onChange={(opt) => setForm({ ...form, subCategory: opt })}
                placeholder="Select Subcategory"
                isDisabled={!form.category}
              />
              {errors.subCategory && <p style={{ color: 'red' }}>{errors.subCategory}</p>}
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                className="form-control"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                min="0"
                step="0.01"
              />
              {errors.price && <p style={{ color: 'red' }}>{errors.price}</p>}
            </div>

            {/* Quantity */}
            <div className="mb-3">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                className="form-control"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                min="0"
              />
              {errors.quantity && <p style={{ color: 'red' }}>{errors.quantity}</p>}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="3"
              />
            </div>

            {/* Status */}
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
              {isAdding ? 'Adding...' : 'Add Product'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleEdit}>
          <Modal.Body>
            {/* Same fields as Add Modal */}
            <div className="mb-3">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
            </div>

            <div className="mb-3">
              <label className="form-label">Category *</label>
              <Select
                options={categoryOptions}
                value={form.category}
                onChange={(opt) => {
                  setForm({ ...form, category: opt, subCategory: null });
                  if (opt) fetchSubcategoriesByCategory(opt.value);
                }}
                placeholder="Select Category"
              />
              {errors.category && <p style={{ color: 'red' }}>{errors.category}</p>}
            </div>

            <div className="mb-3">
              <label className="form-label">Subcategory *</label>
              <Select
                options={subcategoryOptions}
                value={form.subCategory}
                onChange={(opt) => setForm({ ...form, subCategory: opt })}
                placeholder="Select Subcategory"
                isDisabled={!form.category}
              />
              {errors.subCategory && <p style={{ color: 'red' }}>{errors.subCategory}</p>}
            </div>

            <div className="mb-3">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                className="form-control"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                min="0"
                step="0.01"
              />
              {errors.price && <p style={{ color: 'red' }}>{errors.price}</p>}
            </div>

            <div className="mb-3">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                className="form-control"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                min="0"
              />
              {errors.quantity && <p style={{ color: 'red' }}>{errors.quantity}</p>}
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="3"
              />
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
              {isUpdating ? 'Updating...' : 'Update Product'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
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

export default ManageProduct;