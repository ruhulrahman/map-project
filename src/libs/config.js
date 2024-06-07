import axios from 'axios'

// export const baseURL = 'https://mapproject.nvs.la'
export const baseURL = 'https://api-nuxtgen.nvs.la'
// export const baseURL = 'https://api-adn-gmap.nuxtgen.com'
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
  },
  Authorization: {
    'token': 'token e6865b0c7034527cc56eb7a97007f4d18bbd1c9e'
  }
});

if (accessToken) {
  RestApi.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  // RestApi.defaults.Authorization['token'] = `Bearer ${accessToken}`;
}

export default RestApi;