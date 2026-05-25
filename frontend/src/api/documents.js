import api from './api';

export const uploadDocument = (formData, onUploadProgress) =>
  api.post('/documents/upload', formData, {
    onUploadProgress,
  });

export const listDocuments = (query) => api.get('/documents', { params: { search: query } });
export const getDocument = (id) => api.get(`/documents/${id}`);
export const deleteDocument = (id) => api.delete(`/documents/${id}`);
export const refreshDocumentAnalysis = (id) => api.post(`/documents/${id}/analyze`);
export const getAnalytics = () => api.get('/analytics/dashboard');
