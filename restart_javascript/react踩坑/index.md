慎用componentWillUpdate componentWillProps... 这些不安全的周期函数

不要在render里面进行this.setState操作



结合上面分析的，钩子函数中的 setState 无法立马拿到更新后的值，所以前两次都是输出0，当执行到 setTimeout 里的时候，前面两个state的值已经被更新，由于 setState 批量更新的策略， this.state.val 只对最后一次的生效，为1，而在 setTimmout 中 setState 是可以同步拿到更新结果，所以 setTimeout 中的两次输出2，3，最终结果就为 0, 0, 2, 3 。
总结 :

setState 只在合成事件和钩子函数中是“异步”的，在原生事件和 setTimeout 中都是同步的。
setState的“异步”并不是说内部由异步代码实现，其实本身执行的过程和代码都是同步的，只是合成事件和钩子函数的调用顺序在更新之前，导致在合成事件和钩子函数中没法立马拿到更新后的值，形式了所谓的“异步”，当然可以通过第二个参数 setState(partialState, callback) 中的callback拿到更新后的结果。
setState 的批量更新优化也是建立在“异步”（合成事件、钩子函数）之上的，在原生事件和setTimeout 中不会批量更新，在“异步”中如果对同一个值进行多次 setState ， setState 的批量更新策略会对其进行覆盖，取最后一次的执行，如果是同时 setState 多个不同的值，在更新时会对其进行合并批量更新。

以上就是我看了部分代码后的粗浅理解，对源码细节的那块分析的较少，主要是想让大家理解setState在不同的场景，不同的写法下到底发生了什么样的一个过程和结果，希望对大家有帮助，由于是个人的理解和见解，如果哪里有说的不对的地方，欢迎大家一起指出并讨论。

作者：虹晨
链接：https://juejin.im/post/5b45c57c51882519790c7441
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。




Hooks 不管是高阶组件什么解决复杂业务 都离不开class

现在的一个场景就是我不想写class 而是写成一个函数 但是又可以使用react的特性 比如state那样


创建订阅及取消订阅   


## 代码分割

打包是个非常棒的技术，但随着你的应用增长，你的代码包也将随之增长。尤其是在整合了体积巨大的第三方库的情况下。你需要关注你代码包中所包含的代码，以避免因体积过大而导致加载时间过长。

为了避免搞出大体积的代码包，在前期就思考该问题并对代码包进行分割是个不错的选择。 代码分割是由诸如 Webpack，Rollup 和 Browserify（factor-bundle）这类打包器支持的一项技术，能够创建多个包并在运行时动态加载。

对你的应用进行代码分割能够帮助你“懒加载”当前用户所需要的内容，能够显著地提高你的应用性能。尽管并没有减少应用整体的代码体积，但你可以避免加载用户永远不需要的代码，并在初始加载的时候减少所需加载的代码量。


如何更新状态以及如何不更新
你不应该直接修改状态。可以在构造函数中定义状态值。直接使用状态不会触发重新渲染。React 使用this.setState()时合并状态。

```javascript
//  错误方式
this.state.name = "some name"
//  正确方式
this.setState({name:"some name"})

使用this.setState()的第二种形式总是更安全的，因为更新的props和状态是异步的。这里，我们根据这些 props 更新状态。
// 错误方式
this.setState({
    timesVisited: this.state.timesVisited + this.props.count
})
// 正确方式
this.setState((state, props) => {
    timesVisited: state.timesVisited + props.count
});
```


组合和继承的区别


https://juejin.im/post/5cf0733de51d4510803ce34e#heading-35


```javascript

setState(updater[, callback])


```


setState( )把state的变化插入队列，告诉React这个组件以及它的子组件需要根据更新后的state重新渲染。这个是你用来对事件处理和服务器响应来更新界面的主要方法
把setState( )更多视作为一个请求而不是一个立即执行的命令。为了追求更好的性能，React可能延迟它，把若干个更新放在一起执行。React不能保证状态变化是立即生效的。
setState( )不会永远立即更新组件。它可能是批处理或者延迟更新。这使得在setState( )之后立即读取this.state不会得到更新后的值。使用componentDidUpdate或者setState回调方式可以保证立刻触发更新。
setState( )总是会触发重新渲染除非shouldComponentUpdate( )返回false。如果使用了可变对象并且条件渲染逻辑不能在shouldComponentUpdate( )里实现，那仅在新状态和旧状态变化了的情况下才调用setState( )，这样避免不必要的重复渲染。
第一个参数是updater函数
(state, props) => stateChange
这种方式更新state是同步的
第二个参数是更新完成后的回调函数。一般情况下我们建议使用componentDidUpdate来处理更新后的逻辑。
你也可以传递一个对象而不是一个函数给setState( )



❗️❗️❗️
使用函数作为参数是同步  对象的话不一定 不是想的 而是可以通过函数参数拿到state  
通过callback的第一个参数可以拿到上一次的prevState，此时的prevState也是合并了前面多次setState计算的结果

```javascript

this.setState(...)
xxx

xxxx

this.setState(...)


```
应该是这样的场景



为什么建议传递给 setState 的参数是一个 callback 而不是一个对象
因为 this.props 和 this.state 的更新可能是异步的，不能依赖它们的值去计算下一个 state。而通过callback的第一个参数可以拿到上一次的prevState，此时的prevState也是合并了前面多次setState计算的结果



