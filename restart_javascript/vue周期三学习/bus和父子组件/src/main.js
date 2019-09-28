import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

var bus = new Vue()
var eventBus = {
  install(Vue, options) {
    // 注册到原型上去 就可以直接使用this.xxx
    Vue.prototype.$bus = bus
  }
}

Vue.use(eventBus)
new Vue({
  render: h => h(App),
}).$mount('#app')
