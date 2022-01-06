import axios from 'axios';

let url;
if(`${process.env.VUE_APP_API_BASE_URL}`) {
  url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_API_URL}`;
} else if (window.location.host) {
  url = `${window.location.protocol}//${window.location.host}${process.env.VUE_APP_API_URL}`;
}

const api = axios.create({
  baseURL: url,
  timeout: 100000
});

export default api;
export { url };
