JSON对象包含两个方法: 用于解析 JavaScript Object Notation  (JSON) 的 parse() 方法，以及将对象/值转换为 JSON字符串的 stringify() 方法。除了这两个方法, JSON这个对象本身并没有其他作用，也不能被调用或者作为构造函数调用。



JSON.parse方法不一定只单单转化json对象

```javascript
JSON.parse('{}');              // {}
JSON.parse('true');            // true
JSON.parse('"foo"');           // "foo"
JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
JSON.parse('null');            // null
JSON.parse('1');               //  1
```

如果单单想成只转化为{}这种 就会很奇怪 思维


# 还有注意序列化的概念

JSON 是一种语法，用来序列化对象、数组、数值、字符串、布尔值和 null 。它基于 JavaScript 语法，但与之不同：JavaScript不是JSON，JSON也不是JavaScript。参考 JSON：并不是JavaScript 的子集。


可以序列很多种类型  这也是合理化的

❗️❗️序列化对象 ！！！就会知道不单单针对于对象