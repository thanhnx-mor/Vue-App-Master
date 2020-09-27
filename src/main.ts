import Vue from 'vue'
import './libraries'
import App from './App.vue'
import router from './router'
import store from './store'
import './mixins'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
