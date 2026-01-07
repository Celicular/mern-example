import axios from "axios";

const API_URL = "https://mern-example-tau.vercel.app/api";

const getAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const register = (email, password, fullName, referredBy) =>
  axios.post(`${API_URL}/auth/register`, {
    email,
    password,
    fullName,
    referredBy,
  });

export const login = (email, password) =>
  axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

export const createInvestment = (token, amount, plan) =>
  axios.post(`${API_URL}/investments`, { amount, plan }, getAuthHeader(token));

export const getUserInvestments = (token) =>
  axios.get(`${API_URL}/investments`, getAuthHeader(token));

export const getDashboard = (token) =>
  axios.get(`${API_URL}/dashboard`, getAuthHeader(token));

export const getReferralTree = (token) =>
  axios.get(`${API_URL}/referrals/tree`, getAuthHeader(token));
