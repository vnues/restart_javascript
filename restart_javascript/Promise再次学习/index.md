不是写了xxx.then()方法就会去执行的 
只有resolve才会去注册这个回调函数 --- 注意这样思考🤔
Promise 新建后就会立即执行。

Promise不是异步的

```javascript

let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved

```

上面代码中，Promise 新建后立即执行，所以首先输出的是Promise。然后，then方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以resolved最后输出。


> Promise是JS异步编程中的重要概念，异步抽象处理对象，是目前比较流行Javascript异步编程解决方案之一

我明白了 就以ajax为例

```javascript

$.get(url, (data) => {
    console.log(data)
)

```
大致是这样一个过程 就是我们我们发起了一个请求 然后挂起 等它响应完了 就往这个任务队列注册这个回调函数  过程是这样的

那么promise也是这样的 所以我们的then函数是个异步函数

还有我突然很好奇ajax+promise的封装


promise还是还得继续研究的



为什么我这个对象是promise对象 一样可以调它的then函数 即使里面的状态我不关系好像是这样的   --- 实际是这样的吗 我猜不是这样想的


### import() 动态加载 不是异步加载
import()返回一个 Promise 对象

```javascript

button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});

// 异步加载 这个TrackerDynamic实际就是这个加载函数 运行返回这个对象
// import()返回一个 Promise 对象
// 然后会把我们想要拿到的真正对象在resolve执行传递过来 比如上述我们需要的tracker
// 内部不知道怎么进行实现 还是得好好研究promise

```


前面介绍过，import命令会被 JavaScript 引擎静态分析，先于模块内的其他语句执行（import命令叫做“连接” binding 其实更合适）。所以，下面的代码会报错。

```javascript

// 报错
if (x === 2) {
  import MyModual from './myModual';
}

```

上面代码中，引擎处理import语句是在编译时，这时不会去分析或执行if语句，所以import语句放在if代码块之中毫无意义，因此会报句法错误，而不是执行时错误。也就是说，import和export命令只能在模块的顶层，不能在代码块之中（比如，在if代码块之中，或在函数之中）。

这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。如果import命令要取代 Node 的require方法，这就形成了一个障碍。因为require是运行时加载模块，import命令无法取代require的动态加载功能。


```javascript


const path = './' + fileName;
const myModual = require(path);

```



上面的语句就是动态加载，require到底加载哪一个模块，只有运行时才知道。import命令做不到这一点。


> 还有我觉得一些初始化配置以及重复操作 可以用promise封装一下

```javascript

/**
 * Created by xiejs on 2017/6/8
 */
import * as Tracker from 'sa-sdk-javascript';
// 异步加载 这个TrackerDynamic实际就是这个加载函数 运行返回这个对象
// import()返回一个 Promise 对象
// 然后会把我们想要拿到的真正对象在resolve执行传递过来 比如上述我们需要的tracker
// 内部不知道怎么进行实现 还是得好好研究promise
const TrackerDynamic = () => import('sa-sdk-javascript');

interface Fake {
  track: typeof Tracker.track;
  logout: typeof Tracker.logout;
  login: typeof Tracker.login;
}

import { getCookie, getJWT } from './util';

const config: any = {
  sdk_url: 'https://baseqcdn.pandateacher.com/sensor/vtrack.min.js',
  name: 'tracker',
  server_url: 'https://sensorpub.pandateacher.com:4006/sa?project=production',
  config_url:
    'https://sensorpub.pandateacher.com:4006/config/?project=production',
  vtrack_js_file: 'https://baseqcdn.pandateacher.com/sensor/vendor.min.js',
  vtrack_css_file: 'https://baseqcdn.pandateacher.com/sensor/vendor.min.css',
  web_url: 'https://sensorpub.pandateacher.com:4007/?project=production',
  heatmap: {},
  is_track_single_page: true,
};
// 一些`初始化配置或者公共操作`（公共的config）我们使用Promise封装一下 再暴露给用户使用 -- 这是个不错的idea
// TrackerDynamic Tracker是Promise类型
const trackerLoaded: Promise<typeof Tracker | Fake> = new Promise((rs, rj) => {
  const jwt = getJWT();
  // 生产、预发布、测试环境
  if (process.env.NODE_ENV !== 'development') {
    // aync语法糖实际表示这个函数generator函数
    setTimeout(async () => {
      // 神策分析 SDK 初始化成功后
      // 问题来了 怎么初始化
      // 为什么还要多走这一步TrackerDynamic
      // 真正要拿到的tracker对象
      TrackerDynamic().then(tracker => {
        tracker.init(config); // 同步的
        if (jwt && jwt.oid) {
          tracker.login(jwt.oid); // 设置用户标识
        }
        // 如果需要调用 login 来重新设置用户标识，必须在此之前调用
        tracker.quick('autoTrack'); // 用于采集 $pageview 事件
        rs(tracker);
      });
    }, 300);
  } else {
    const track: typeof Tracker.track = (event, options) => {
      console.log(
        `[sensor-tracker]: The event is ${event},\n and the options:`
      );
      console.table(options);
    };
    const fake: Fake = {
      track,
      logout() {}, // 用于dev环境下 实际没啥作用 作为占位符而已
      login() {}, // 占位符
    };
    rs(fake);
  }
});

export function patchTracker(tracker: typeof Tracker) {
  const old = tracker;
  const jwt = getJWT();
  let track: typeof Tracker.track = function(event, options) {
    tracker.logout();
    tracker.login(jwt.oid);
    const result = tracker.track(event, options);
    tracker.logout();
    tracker.login(jwt.sub);
    return result;
  };
  if (process.env.NODE_ENV === 'development') {
    const track: typeof Tracker.track = (event, options) => {
      console.log(
        `[sensor-tracker]: The event is ${event},\n and the options: ${options}`
      );
    };
    const fake: Fake = {
      track,
      logout() {}, // dev环境也同样需要暴露这个方法 不过以占位符形式存在的
      login() {},
    };
  }
  return {
    track,
  };
}

export function makeTracker(defaultPayload: any) {
  !defaultPayload && (defaultPayload = {});
  return function(event: string, payload: any) {
    !payload && (payload = {});
    let result = Object.assign({}, payload, defaultPayload);
    console.log(result);
    trackerLoaded.then(tracker => {
      tracker.track(event, result);
    });
  };
}

export default trackerLoaded;


```


// 因为有resolve所以很方便啊




## 就是有一个问题 什么时候推入任务队列


就是你要想清楚一个场景:

我们都知道，javascript从诞生之日起就是一门单线程的非阻塞的脚本语言。这是由其最初的用途来决定的：与浏览器交互。

单线程意味着，javascript代码在执行的任何时候，都只有一个主线程来处理所有的任务。

而非阻塞则是当代码需要进行一项异步任务（无法立刻返回结果，需要花一定时间才能返回的任务，如I/O事件）的时候，主线程会挂起（pending）这个任务，然后在异步任务返回结果的时候再根据一定规则去执行相应的回调。

单线程是必要的，也是javascript这门语言的基石，原因之一在其最初也是最主要的执行环境——浏览器中，我们需要进行各种各样的dom操作。试想一下 如果javascript是多线程的，那么当两个线程同时对dom进行一项操作，例如一个向其添加事件，而另一个删除了这个dom，此时该如何处理呢？因此，为了保证不会 发生类似于这个例子中的情景，javascript选择只用一个主线程来执行代码，这样就保证了程序执行的一致性。

然而，使用web worker技术开的多线程有着诸多限制，例如：所有新线程都受主线程的完全控制，不能独立执行。这意味着这些“线程” 实际上应属于主线程的子线程。另外，`这些子线程并没有执行I/O操作的权限，只能为主线程分担一些诸如计算等任务。`所以严格来讲这些线程并没有完整的功能，也因此这项技术并非改变了javascript语言的单线程本质。


1.执行栈与事件队列
当javascript代码执行的时候会将不同的变量存于内存中的不同位置：堆（heap）和栈（stack）中来加以区分。其中，堆里存放着一些对象。而栈中则存放着一些基础类型变量以及对象的指针。 但是我们这里说的执行栈和上面这个栈的意义却有些不同。

我们知道，当我们调用一个方法的时候，js会生成一个与这个方法对应的执行环境（context），又叫执行上下文。这个执行环境中存在着这个方法的私有作用域，上层作用域的指向，方法的参数，这个作用域中定义的变量以及这个作用域的this对象。 而当一系列方法被依次调用的时候，因为js是单线程的，同一时间只能执行一个方法，于是这些方法被排队在一个单独的地方。这个地方被称为执行栈。


当一个脚本第一次执行的时候，js引擎会解析这段代码，并将其中的同步代码按照执行顺序加入执行栈中，然后从头开始执行。如果当前执行的是一个方法，那么js会向执行栈中添加这个方法的执行环境，然后进入这个执行环境继续执行其中的代码。当这个执行环境中的代码 执行完毕并返回结果后，js会退出这个执行环境并把这个执行环境销毁，回到上一个方法的执行环境。。这个过程反复进行，直到执行栈中的代码全部执行完毕。


从图片可知，一个方法执行会向执行栈中加入这个方法的执行环境，在这个执行环境中还可以调用其他方法，甚至是自己，其结果不过是在执行栈中再添加一个执行环境。这个过程可以是无限进行下去的，除非发生了栈溢出，即超过了所能使用内存的最大值。


以上的过程说的都是同步代码的执行。那么当一个异步代码（如发送ajax请求数据）执行后会如何呢？前文提过，js的另一大特点是非阻塞，实现这一点的关键在于下面要说的这项机制——事件队列（Task Queue）。

js引擎遇到一个异步事件后并不会一直等待其返回结果，`而是会将这个事件挂起`，继续执行执行栈中的其他任务。当一个异步事件返回结果后，js会将这个事件加入与当前执行栈不同的另一个队列，我们称之为事件队列。被放入事件队列不会立刻执行其回调，而是等待当前执行栈中的所有任务都执行完毕， 主线程处于闲置状态时，主线程会去查找事件队列是否有任务。如果有，那么主线程会从中取出排在第一位的事件，并把这个事件对应的回调放入执行栈中，然后执行其中的同步代码...，如此反复，这样就形成了一个无限的循环。这就是这个过程被称为“事件循环（Event Loop）”的原因。



理解`而是会将这个事件挂起`❗️ 就是比如我setTimeout操作或者ajax请求 这些是异步操作 会挂起 等到他们执行完把对应的回调函数注册到任务队列去 promise对象也是一样 但执行到resolve或者reject会then的回调函数注册到任务队列里去

这就是我一直很好奇的`而是会将这个事件挂起`❗️   如何挂起我不知道  ？？？ 有待研究   


这也就是为啥什么不会阻塞     其实整个问题下来我是不懂如何将事件挂起 （相当于分了下子线程去处理）


dom事件也是异步操作 一点击马上就把回调函数注册  想想点击n次出现n次都是有顺序的


`所谓"回调函数"（callback），就是那些会被主线程挂起来的代码。异步任务必须指定回调函数，当主线程开始执行异步任务，就是执行对应的回调函数`


JavaScript语言的设计者意识到，这时主线程完全可以不管IO设备，挂起处于等待中的任务，先运行排在后面的任务。等到IO设备返回了结果，再回过头，把挂起的任务继续执行下去。


事件队列也叫任务队列



这个章节认识到Promise与事件循环


更加理解了挂起这个操作   还有就是执行一个异步操作相当于执行一个异步操作的回调函数 ====>挂起后等到完成就触发回调函数


`所谓"回调函数"（callback），就是那些会被主线程挂起来的代码。异步任务必须指定回调函数，当主线程开始执行异步任务，就是执行对应的回调函数`


HTML5标准规定了setTimeout()的第二个参数的最小值（最短间隔），不得低于4毫秒，如果低于这个值，就会自动增加。在此之前，老版本的浏览器都将最短间隔设为10毫秒。另外，对于那些DOM的变动（尤其是涉及页面重新渲染的部分），通常不会立即执行，而是每16毫秒执行一次。这时使用requestAnimationFrame()的效果要好于setTimeout()。


根据规范，事件循环是通过任务队列的机制来进行协调的。一个 Event Loop 中，可以有一个或者多个任务队列(task queue)，一个任务队列便是一系列有序任务(task)的集合；每个任务都有一个任务源(task source)，源自同一个任务源的 task 必须放到同一个任务队列，从不同源来的则被添加到不同队列。




事件队列也就是任务队列



1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。

（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。

（4）主线程不断重复上面的第三步。



函数执行栈又有异步任务和同步任务




Event Loop是由javascript宿主环境（像浏览器）来实现的;
WebAPIs是由C++实现的浏览器创建的线程，处理诸如DOM事件、http请求、定时器等异步事件;
JavaScript 的并发模型基于"事件循环";
Callback Queue(Event Queue 或者 Message Queue) 任务队列,存放异步任务的回调函数

作者：追风筝的人er
链接：https://juejin.im/post/5afbc62151882542af04112d
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



事件循环还得再去弄清楚到底怎么循环的
https://juejin.im/post/5afbc62151882542af04112d