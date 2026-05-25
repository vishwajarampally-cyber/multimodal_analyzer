import api from './api';

export const sendChatQuestion = (documentId, question) => api.post(`/chat/${documentId}`, { question });
export const fetchChatHistory = (documentId) => api.get(`/chat/${documentId}/history`);
