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

http://wangwl.net/static/pages/npm_history.html

还有github里面也有说明文档


注意千万别踩坑了


createHashHistory==>window.router 没有这种query和params参数

要传的话传state

React Router 是建立在 history 之上的。 简而言之，一个 history 知道如何去监听浏览器地址栏的变化， 并解析这个 URL 转化为 location 对象， 然后 router 使用它匹配到路由，最后正确地渲染对应的组件。



也就是react路由依赖于history



那么就算不是react框架我在原生的基础上也是可以使用的


HTML5 history新增了两个API:history.pushState和history.replaceState

https://github.com/hijiangtao/hijiangtao.github.io/blob/master/_posts/2017-08-20-History-API-and-Location-Object.md


#  html5 history api详解~很好的文章

从Ajax翻页的问题说起
请想象你正在看一个视频下面的评论，在翻到十几页的时候，你发现一个写得稍长，但非常有趣的评论。正当你想要停下滚轮细看的时候，手残按到了F5。然后，页面刷新了，评论又回到了第一页，所以你又要重新翻一次。

再或者，你想把这个评论发给别人分享，一面给了别人页面地址（为什么不直接复制呢？因为要连带视频等场景啊），一面又要加一句嘱咐：请翻到下面评论的第XX页的XX楼。

这就是问题。试想一下，如果浏览器能记住你当前的状态（比如看到了第十几页），而不是一刷新就还原，是不是就显得智能多了？

为什么用Ajax？
用Ajax实现翻页等内容切换是有原因的。在传统的无Ajax的站点里，页面A和页面B可能只有10%的地方是不同的，其他90%的内容（尤其是导航、页脚等公用元素）都是一样的，但却仍然需要浏览器下载并显示新的一整个页面。而如果使用Ajax，不仅节省了浏览器需要下载的资源，而且无刷新切换明显比页面跳转更平滑、流畅。

就视频下面的评论来说，Ajax可以说是必须的。视频这样的重量级元素，动不动给你重新加载一次，不能忍。

传统的跳转翻页的可取之处
传统的不使用Ajax的站点，每一个翻页是一个跳转，然后你可以在浏览器地址栏里看到诸如?page=2这样的参数。每一页就这样通过地址栏的URL做了标记，每一次请求，浏览器都会根据参数返回正确的页码。

所以，传统的跳转翻页，刷新也不会丢失状态。

结合两者
现在我们就可以想到，如果在Ajax更新页面局部内容的同时，也在地址栏的URL里更新状态参数，就可以做出更完美的Ajax翻页了。

不过，JavaScript修改location的除hash外的任意属性，页面都会以新URL重新加载。而唯一不引发刷新的hash参数并不会发送到服务器，因此服务器无法获得状态。

然后，HTML5 history API将解决这个问题。



不只是翻页，HTML5 history API将尤其适合用在大量使用Ajax、包含多个视图的单页应用。



> `对我们会经常遇到这种问题 保持幂等 但是又不刷新`


https://www.cnblogs.com/stephenykk/p/5057022.html



javascript的 history对象 然后HTML5那块出来又增加了些api



还有打印出location对象

到此为止，我们深入的了解了 History API 和 Location 对象，并理清了它们之间的关系。最重要的是需要明白为什么需要前端路由以及适合在什么样的场景下使用；另外，我们也通过 History API 实现了一个小巧的前端路由，虽然这个实现很简单，但是五脏俱全，通过它能很清晰的知道像 React、Vue 之类的前端框架的路由实现原理。



# location

hash是location的一个属性

Location 对象
Location 对象提供了 URL 相关的信息和操作方法，通过 document.location 和 window.location 属性都能访问这个对象。
History API 和 Location 对象实际上是通过地址栏中的 URL 关联 的，因为 Location 对象的值始终与地址栏中的 URL 保持一致，所以当我们操作会话浏览历史的记录时，Location 对象也会随之更改；当然，我们修改 Location 对象，也会触发浏览器执行相应操作并且改变地址栏中的 URL。
属性
Location 对象提供以下属性：

window.location.href：完整的 URL；http://username:password@www.test.com:8080/test/index.html?id=1&name=test#test。
window.location.protocol：当前 URL 的协议，包括 :；http:。
window.location.host：主机名和端口号，如果端口号是 80（http）或者 443（https），那就会省略端口号，因此只会包含主机名；www.test.com:8080。
window.location.hostname：主机名；www.test.com。
window.location.port：端口号；8080。
window.location.pathname：URL 的路径部分，从 / 开始；/test/index.html。
window.location.search：查询参数，从 ? 开始；?id=1&name=test。
window.location.hash：片段标识符，从 # 开始；#test。
window.location.username：域名前的用户名；username。
window.location.password：域名前的密码；password。
window.location.origin：只读，包含 URL 的协议、主机名和端口号；http://username:password@www.test.com:8080。

除了 window.location.origin 之外，其他属性都是可读写的；因此，改变属性的值能让页面做出相应变化。例如对 window.location.href 写入新的 URL，浏览器就会立即跳转到相应页面；另外，改变 window.location 也能达到同样的效果

作者：晨风明悟
链接：https://juejin.im/post/5c5313905188257a4a7fbeab
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


改变 hash
改变 hash 并不会触发页面跳转，因为 hash 链接的是当前页面中的某个片段，所以如果 hash 有变化，那么页面将会滚动到 hash 所链接的位置；当然，页面中如果 不存在 hash 对应的片段，则没有 任何效果。这和 window.history.pushState(data, title, ?url) 方法非常类似，都能在不刷新页面的情况下更改 URL；因此，我们也可以使用 hash 来实现前端路由，但是 hash 相比 pushState 来说有以下缺点：


hash 只能修改 URL 的片段标识符部分，并且必须从 # 开始；而 pushState 却能修改路径、查询参数和片段标识符；因此，在新增会话浏览历史的记录时，pushState 比起 hash 来说更符合以前后端路由的访问方式，也更加优雅。

作者：晨风明悟
链接：https://juejin.im/post/5c5313905188257a4a7fbeab
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。


hash ：hash 虽然出现在 URL 中，但不会被包含在 http 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。history ：history 利用了 html5 history interface 中新增的 pushState() 和 replaceState() 方法。这两个方法应用于浏览器记录栈，在当前已有的 back、forward、go 基础之上，它们提供了对历史记录修改的功能。只是当它们执行修改时，虽然改变了当前的 URL ，但浏览器不会立即向后端发送请求。

作者：西芹儿
链接：https://juejin.im/post/5b31a4f76fb9a00e90018cee
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



所以无刷新hash可以做到 history也行


那么history包


一个场景我们并不是有#是路由比如https://test/killing

比如我们发送ajax请求分页但是传统的会造成刷新 用户体验性不好
比如：https://test/killing?value='vnues'
但是传统的话这样会刷新  所以html5出来以后给history对象 加了无刷新api


❗️❗️❗️history包跟history对象不一样的 https://segmentfault.com/a/1190000010251949

history提供了
createBrowserHistory,
createHashHistory,
createMemoryHistory
三种路由模式
如果你使用React Router，他会为你自动创建history对象，所以你并不需要与history进行直接的交互。不过，理解不同类型的history依旧很重要，这样你能在项目中决定究竟是用哪个。



http://lynnelv.github.io/js-event-loop-browser



事件循环什么时候循环一轮结束

这时microtask队列已经为空，从上面的流程图可以知道，接下来主线程会去做一些UI渲染工作（不一定会做），然后开始下一轮event loop，执行setTimeout的回调，打印出setTimeout；


MacroTask（宏任务）
script全部代码

每一次Event Loop触发时：

1.执行完主执行线程中的任务。
2.取出micro-task中任务执行直到清空。
3.取出macro-task中一个任务执行。
4.取出micro-task中任务执行直到清空。
重复3和4。


我怎么看一轮循环了 卧槽 真的是需要天赋和理解吧  语文理解不过关  重复3和4就一轮循环了

也就是micro循环完以后就是一轮结束了 ❗️❗️