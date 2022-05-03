import axios from 'axios';
import router from '@/router'
import store from '@/store'

let url;
if (`${process.env.VUE_APP_API_BASE_URL}`) {
  url = `${process.env.VUE_APP_API_BASE_URL}${process.env.VUE_APP_API_URL}`;
} else if (window.location.host) {
  url = `${window.location.protocol}//${window.location.host}${process.env.VUE_APP_API_URL}`;
}

const api = axios.create({
  baseURL: url,
  timeout: 100000
});

api.interceptors.response.use(null, function (error) {
  if (error.response?.status === 401) {
    console.log(error)
    store.dispatch('logout')
    router.push('/login')
  }
  return Promise.reject(error)
})

export default api;
export { url };
