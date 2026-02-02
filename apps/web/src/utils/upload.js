import axios from 'axios';

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.url) {
      return response.data.url;
    }

    throw new Error('Gagal mengunggah file');
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
