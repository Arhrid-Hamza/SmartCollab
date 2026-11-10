import api from './client';

export const usersApi = {
  getStudents: async () => {
    const res = await api.get('/users/students');
    return res.data;
  },

  getProfessors: async () => {
    const res = await api.get('/users/professors');
    return res.data;
  },

  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  createUser: async (userData) => {
    const res = await api.post('/users', userData);
    return res.data;
  },

  updateUser: async (id, userData) => {
    const res = await api.put(`/users/${id}`, userData);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

export default usersApi;
