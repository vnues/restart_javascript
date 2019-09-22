## 数组去重

### 双层循环

```javascript
  
var array = [1, 1, '1', '1'];

function unique(array) {
    // res用来存储结果
    var res = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
        for (var j = 0, resLen = res.length; j < resLen; j++ ) {
            if (array[i] === res[j]) {
                break;
            }
        }
        // 如果array[i]是唯一的，那么执行完循环，j等于resLen
        // 比如我外层循环到index:3那么我就要去判断下 我之前的3个元素会不会重复 如果都没有此时内层循环就为 j===resLen 那么我就可以push上去了 其它就不必要了
        if (j === resLen) {
            res.push(array[i])
        }
    }
    return res;
}

console.log(unique(array)); // [1, "1"]

```

### 使用了indexOf方法优化内层循环 <---喜欢这种

```javascript
var array = [1, 1, '1'];
function unique(array) {
    var res = [];
    for (var i = 0, len = array.length; i < len; i++) {
        var current = array[i];
        // [1,2,3].indexOf(3)
        // 没找到就返回-1
        // 🤔 妙啊！！！
        if (res.indexOf(current) === -1) {
            res.push(current)
        }
    }
    return res;
}

console.log(unique(array));
```
> 去重的操作  有重复的元素直接丢弃


### 排序后去重
> 试想我们先将要去重的数组使用 sort 方法排序后，相同的值就会被排在一起，然后我们就可以只判断当前元素与上一个元素是否相同，相同就说明重复，不相同就添加进 res，让我们写个 demo：

```javascript
var array = [1, 1, '1'];

function unique(array) {
    var res = [];
    var sortedArray = array.concat().sort();
    var seen;
    for (var i = 0, len = sortedArray.length; i < len; i++) {
        // 如果是第一个元素或者相邻的元素不相同
        if (!i || seen !== sortedArray[i]) {
            res.push(sortedArray[i])
        }
        seen = sortedArray[i];
    }
    return res;
}

console.log(unique(array));
```
如果我们对一个已经排好序的数组去重，这种方法效率肯定高于使用 indexOf。

### ES6版本的去重

> 随着 ES6 的到来，去重的方法又有了进展，比如我们可以使用 Set 和 Map 数据结构，以 Set 为例，ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。


Array.from() 方法从一个类似数组或可迭代对象中创建一个新的，浅拷贝的数组实例。

```javascript
var array = [1, 2, 1, 1, '1'];

function unique(array) {
   return Array.from(new Set(array));  // 操作就是通过new Set()生成Set实例 Set要求成员的值是唯一的，所以内部会帮我们做处理 感觉Set的就是为去重而生的
}

console.log(unique(array)); // [1, 2, "1"]
```

```javascript
function unique(array) {
    return [...new Set(array)];
}
```