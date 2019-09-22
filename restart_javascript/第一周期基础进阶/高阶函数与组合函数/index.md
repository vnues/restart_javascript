> 高阶函数的使用思路正在于此，它其实是一个封装公共逻辑的过程

高阶函数是：

将函数作为参数传入或作为结果返回的函数 ！！！

### 使用情况 f(g(h()))

这种情况

### withLogin(withEnvironment(renderindex))

你想让一个函数具备某种能力 是不是通过函数 A 包裹 return 函数 B
但是你想想这个函数 B 用不用执行 答案是要的 不然 B 怎么具备能力

也就是这种形式 f(g(h()))

### 高阶函数 withLogin ，用来判断当前用户状态

```javascript

  (function() {
       // 用随机数的方式来模拟一个获取用户信息的方法
      var getLogin = function() {
      var a = parseint(Math . random() * 10).toFixe(O)) ;
      if (a % 2 == 0) {
      return { login : false }
      }
      return {
      login: txrue,
      userinfo : {
      nickname :'jake',
      vip : 11,
      userid:'666666'
          }
         }
      }
      var withLogin = function(basicFn) {
      var loginInfo = getLogin() ;
      // 将 loginInfo 参数的形式传入基础函数中
      return basicFn.bind(null, loginInfo);
      }
      window.withLogin = withLogin;

    })   
```




高阶函数也是解决代码复用的一种手段

```javascript
  // 登陆
  function login() {
    console.log('login ' + login);
}
// 注册
function resgister() {
    console.log('resgister ' + user);
}
// 抽离出来的中间函数
function wrapUser(Wrapfunc) {
    let Newfunc = () => {
       alert('ability')
       let user = localStorage.getItem('user');
       Wrapfunc(user);
    };
    return Newfunc;
}
// 调用
login = wrapUser(login);
resgister = wrapUser(resgister);
login();
resgister();

```

怎么让B具备某种能力 通过A高阶函数？那么A是怎么做到的
这样B就具备了  alert('ability')这种能力

```javascript
  // 抽离出来的中间函数
function wrapUser(Wrapfunc) {
    let Newfunc = () => {
       alert('ability')
       let user = localStorage.getItem('user');
       Wrapfunc(user);
    };
    return Newfunc;
}
```
这样子做到
调用形式g(fn)

上述就是实现的做法 


实际上高阶函数就是为了解决代码公共性 抽离代码使用的


接下来为了解决高阶函数嵌套多层 采用compose处理


❗️❗️❗️当你想到如果解决代码共用性或者让某个函数具备某种能力 其实第一种情况就是第二种情况特殊情况  就应该想到高阶函数


还是下述这种情况❗️❗️❗️


好像项目中很少使用高阶函数 不行 下次一定要做处理

比如我们经常写的window.apis.xxxx就可以用高阶函数处理



```javascript
   
function compose(...args) {
        var arity = args.length - 1;
        var tag = false;
        if (typeof args[arity] === "function") {
          tag = true;
        }
        if (arity > 1) {
          var param = args.pop(args[arity]);
          arity--;
          var newParam = args[arity].call(args[arity], param);
          args.pop(args[arity]);
          args.push(newParam); // 二维嵌套情况？
          return compose(...args);
        } else if (arity === 1) {
          if (!tag) {
            // 这一步干嘛的
            // 将操作目标放在最后一个参数 ，目标可 能是一个 函数
            // 也可 能是一个位，因此可针对不 同的情况做不同的处理
            // 如果传入的目标A不是函数 返回倒数第二个函数回去
            return args[0].bind(null, args[1]); //优雅呀这种方式
          } else {
            // wrapUser.call(null,args[1]) args[1]->login 传入null表示不改变this
            // 跟underscore对比就是不会去执行args
            return args[0].call(null, args[1]);
          }
        }
      }
```
### compose两种使用场景

### f(g(h))

```javascript
   // 调用形式 e(g(f(h))) 
      function compose(...args) {
        var arity = args.length - 1;
        var tag = false;
        if (typeof args[arity] === "function") {
          tag = true;
        }
        if (arity > 1) {
          var param = args.pop(args[arity]); // 先去除第一个函数A
          arity--;
          var newParam = args[arity].call(args[arity], param); // 执行完
          args.pop(args[arity]);// 拿出来
          args.push(newParam); // 把返回的结果push进去
          return compose(...args);
        } else if (arity === 1) {
          if (!tag) {
            return args[0].bind(null, args[1]);
          } else {
            return args[0].call(null, args[1]);
          }
        }
      }
      // 从右到左传入参数
      // 登陆
      function login(user,age) {
        console.log("login " + user,age);
      }
      // 注册
      function resgister(user) {
        console.log("resgister " + user);
      }
      // 抽离出来的中间函数
      function wrapUser(Wrapfunc) {
        let Newfunc = (age) => {
          // let user = localStorage.getItem("user");
          let user = "vnues";
          Wrapfunc(user,age);
        };
        return Newfunc;
      }
      function wrapConsole(func) {
        let Newfunc = () => {
          // let user = localStorage.getItem("user");
         let age=22
          func(age);
        };
        return Newfunc;
      }
      // 调用
      // debugger 最后的结果满足不了
      debugger
      login = compose(
        wrapConsole,
        wrapUser,
        login
      );
  
      login();
     //  resgister();
```

### f(g(h()))

```javascript
  function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function () {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result; 
    };
  };
```
从右到左传入
区分场景就是参数最后一个是否执行