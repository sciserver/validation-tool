import Vue from 'vue'

import app from './App.vue'
import router from './router'
import store from './store';
import vuetify from './plugins/vuetify'

import Api from './plugins/api';
import Service from './plugins/service';

Vue.use(Api);
Vue.use(Service);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(app)
}).$mount('#app')
