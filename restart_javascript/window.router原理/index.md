实际上window.router是这样的

```javascript
import { createHashHistory } from 'history'
window.router = createHashHistory()
```

所以原理是这样的 那么我们来研究下history

# history

history是一个用来管理历史会话的一个JS包。对于不同环境history提供了统一的API，用于用来管理历史堆栈(history stack)、导航，导航确认、持久化状态。


这段话翻译过来可能比较难懂，可以对比浏览器端原生的history对象来理解它的功能。对于浏览器端，其实就是对原生history对象进行再封装。



我们的路由可以通过浏览器的history对象进行控制

DOM window 对象通过 history 对象提供了对浏览器的会话历史的访问。它暴露了很多有用的方法和属性，允许你在用户浏览历史中向前和向后跳转，同时——从HTML5开始——提供了对history栈中内容的操作。

在history中跳转
使用 back(), forward()和 go() 方法来完成在用户历史记录中向后和向前的跳转。


我们非路由组件是没有传递过来的this.props.history属性的


所以非路由组件怎么跳转 直接利用这个history这个包就行了