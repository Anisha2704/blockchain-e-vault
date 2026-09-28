import API from './api';

export const verificationService = {
  async verifyDocument(formData) {
    const response = await API.post('/verification/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async getVerificationInfo(documentId) {
    const response = await API.get(`/verification/${documentId}`);
    return response.data;
  }
};
