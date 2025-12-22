// utils/fetchAdminData.js
import axios from 'axios';
import { API_URL } from '../config/constant';

export const fetchAdminData = async (navigate) => {
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`${API_URL}/admin/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.key == 'authenticateFailed') {
            sessionStorage.clear();
            navigate('/'); // Use the passed navigate function
        }

        const adminData = response.data?.data;

        // Support both array and single-object responses from the API
        if (Array.isArray(adminData)) {
            return adminData[0] || null;
        }

        return adminData || null; // Return the admin data (or null if missing)
    } catch (error) {
        console.error('Error fetching admin data:', error);
        throw error; // Propagate the error to the caller
    }
};