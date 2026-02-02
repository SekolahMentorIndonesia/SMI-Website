import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('photo', file);
    
    const uploadUrl = `${API_BASE_URL}${API_ENDPOINTS.USER.UPLOAD}`;

    const response = await axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getAuthHeader()
      },
    });

    if (response.data.photoUrl) {
      return response.data.photoUrl;
    }

    throw new Error('Upload failed - no photoUrl returned');
  } catch (error) {
    console.error('❌ Upload error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};
