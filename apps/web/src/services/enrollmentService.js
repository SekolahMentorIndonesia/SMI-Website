import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../config';

export const enrollmentService = {
  createEnrollment: async (packageId, userData, paymentMethod, proofImage, proofDescription, token, paymentAmount) => {
    // Create form data for file upload
    const formData = new FormData();
    
    // Add all data to form data
    formData.append('package_id', packageId);
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('telegram_user', userData.telegramUser);
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
    }
    
    const response = await axios.post(
      getApiUrl(API_ENDPOINTS.USER.ENROLLMENT),
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }
};
