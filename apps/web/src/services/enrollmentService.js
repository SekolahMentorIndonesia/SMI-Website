import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../config';

export const enrollmentService = {
  createEnrollment: async (packageId, userData, paymentMethod, proofImage, proofDescription, token, paymentAmount) => {
    console.log('🚀 Creating enrollment with:', {
      packageId,
      userData,
      paymentMethod,
      hasProofImage: !!proofImage,
      proofDescription,
      paymentAmount,
      hasToken: !!token
    });

    // Validate token first
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }

    // Create form data for file upload
    const formData = new FormData();
    
    // Add all data to form data
    formData.append('package_id', packageId);
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('telegram_user', userData.telegramUser || '');
    formData.append('phone_number', userData.phoneNumber);
    formData.append('motivation', userData.motivation);
    formData.append('payment_method', paymentMethod);
    formData.append('proof_description', proofDescription);
    if (paymentAmount) {
      formData.append('payment_amount', paymentAmount);
    }
    
    // Add file if exists
    if (proofImage) {
      formData.append('proof_image', proofImage);
      console.log('📎 Proof image attached:', proofImage.name, proofImage.size);
    }

    const apiUrl = getApiUrl(API_ENDPOINTS.USER.ENROLLMENT);
    console.log('🌐 API URL:', apiUrl);
    console.log('📤 Form data contents:');
    for (let [key, value] of formData.entries()) {
      if (key === 'proof_image') {
        console.log(`  ${key}:`, value.name, value.size, 'bytes');
      } else {
        console.log(`  ${key}:`, value);
      }
    }
    
    try {
      const response = await axios.post(
        apiUrl,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('✅ Enrollment successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Enrollment failed:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config);
      
      // Provide more specific error messages
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.message || 'Data tidak valid';
        console.error('Validation error details:', error.response?.data?.details);
        throw new Error(errorMsg);
      } else if (error.response?.status === 401) {
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk melakukan aksi ini.');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Tidak dapat terhubung ke server. Pastikan backend berjalan.');
      } else {
        throw new Error(error.message || 'Terjadi kesalahan saat mengirim data.');
      }
    }
  }
};
