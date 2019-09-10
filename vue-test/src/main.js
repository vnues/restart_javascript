import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// 这一步做了new Vue操作

// 注意这种直接调用mount方法的
// 生成一个实例vm调用$mount方法初始化
new Vue({
  render: h => h(App),
}).$mount('#app')

