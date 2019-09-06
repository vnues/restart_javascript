import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 这一步做了new Vue操作

new Vue({
  render: h => h(App),
}).$mount('#app')
