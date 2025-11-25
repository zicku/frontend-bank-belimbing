import axios from "axios";

const API_URL = "https://backend-bank-belimbing.vercel.app/api";

const apiService = {
  // Dashboard
  getDashboardData: () => axios.get(`${API_URL}/dashboard-data`),

  // Customers
  getCustomers: () => axios.get(`${API_URL}/customers`),
  createCustomer: (name) => axios.post(`${API_URL}/customers`, { name }),
  updateCustomer: (id, name) =>
    axios.put(`${API_URL}/customers/${id}`, { name }),
  deleteCustomer: (id) => axios.delete(`${API_URL}/customers/${id}`),

  // Deposito Types
  getTypes: () => axios.get(`${API_URL}/deposito-types`),
  createType: (data) => axios.post(`${API_URL}/deposito-types`, data),
  updateType: (id, data) => axios.put(`${API_URL}/deposito-types/${id}`, data),
  deleteType: (id) => axios.delete(`${API_URL}/deposito-types/${id}`),

  // Accounts
  getAccounts: () => axios.get(`${API_URL}/accounts`),
  createAccount: (data) => axios.post(`${API_URL}/accounts`, data),
  updateAccount: (id, typeId) =>
    axios.put(`${API_URL}/accounts/${id}`, { deposito_type_id: typeId }),
  deleteAccount: (id) => axios.delete(`${API_URL}/accounts/${id}`),

  // Transactions
  calculateWithdraw: (data) => axios.post(`${API_URL}/calculate`, data),
  processTransaction: (data) => axios.post(`${API_URL}/transaction`, data),
};

export default apiService;
