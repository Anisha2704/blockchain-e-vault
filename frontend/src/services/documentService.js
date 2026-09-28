import API from './api';

export const documentService = {
  async uploadDocument(formData) {
    const response = await API.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async getDocuments(params = {}) {
    const response = await API.get('/documents', { params });
    return response.data;
  },

  async getDocumentById(id) {
    const response = await API.get(`/documents/${id}`);
    return response.data;
  },

  async deleteDocument(id) {
    const response = await API.delete(`/documents/${id}`);
    return response.data;
  }
};
