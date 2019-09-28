```javascript
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };
```


review源代码的时候排除一些干扰信息 多问自己要做什么 为什么这样做

```javascript
   _.prototype[name] = function() {
        console.log(arguments);
        var args = [this._wrapped];
        push.apply(args, arguments);
        // 想想如果将别的函数是怎么挂载的
        // return func.apply(_, args);  目的就是要实现这一步 将面向对象的风格
        // 最终解析成可执行函数
        return chainResult(this, func.apply(_, args));
      };
```
```javascript
   _.prototype[name]=func
   // 因为要传递[this._wrapped]参数 所以外层再套一层function
```

### 再谈this
this的很重要的一点就是用来当做参数传值
```javascript
  var args = [this._wrapped];
```

```javascript
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    // 总结，_([1, 2, 3]) 返回一个对象，为 {_wrapped: [1, 2, 3]}，该对象的原型指向 _.prototype
    this._wrapped = obj; // 注意函数执行顺序 执行走的这步是在return new _(obj)内执行的 所以是🈶return的 还是debug好用
    // 每次执行_()都会产生  this._wrapped = obj; {_wrapped: [1, 2, 3]}
  };
```

还有感觉很奇怪的就真的奇怪别糊弄自己




review jquery  有个计划 

有必要重新刷nodejs