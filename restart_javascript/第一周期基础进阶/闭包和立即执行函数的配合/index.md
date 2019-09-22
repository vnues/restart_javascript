

### 通过闭包实现封装常量？？？

### 通过闭包如何防止变量污染



### JS中使用闭包来定义常量

```javascript
var Class = (function () {
    var UPPER_BOUND = 100; //定义了常量
    var Test = {};
    //定义了一个静态方法，获取常量的方法
    Test.getUPPER_BOUND = function() {
        return UPPER_BOUND; 
    }
    return Test; // 存在引用Test 形成了闭包 这个函数
})();

var k = Class.getUPPER_BOUND();
console.log(k);


```