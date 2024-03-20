import axios from 'axios'

export const baseURL = 'https://mapproject.nvs.la'
// export const baseURL = 'https://opentv.ncare.io/'
const accessToken = localStorage.getItem('token')

const RestApi = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    // Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
    // 'Content-Type': 'multipart/form-data'
    // accessMenuName: window.location.href,
  }
});

if (accessToken) {
  RestApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

export default RestApi;