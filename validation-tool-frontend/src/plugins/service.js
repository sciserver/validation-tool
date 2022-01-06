import {
  reviewService
} from '@/services'
  
export default {
  install(Vue) {
    Vue.prototype.$reviewService = reviewService
  }
};
  