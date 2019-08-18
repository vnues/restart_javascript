```javascript
   
   var Person = function () {
     console.log(this)
          this.name="hello"
          this.alert = function () {
            alert(this.name)
          }

        }
        var context = { name: "vnues" }
        var newContext=Person.bind(context)
        // console.log(newContext.alert())
        // console.log(context.alert())
        // console.log(Person.alert())
        console.log(Person())
        console.log(newContext())
        var boy = new Person()
        console.log(boy.alert())

```
bind()方法创建一个新的函数，在bind()被调用时，这个新函数的this被bind的第一个参数指定，其余的参数将作为新函数的参数供调用时使用。

❗️❗️❗️是返回一个新的函数 而不是像修改引用类型一样 永远修改Person的this指向
会返回一个新的函数 原来的Person还是原来那个样子


```javascript
  
   
   var Person = function () {
     console.log(this)
          this.name="hello"
          this.alert = function () {
            alert(this.name)
          }

        }
        var context = { name: "vnues" }
        Person=Person.bind(context)
        console.log(Person())
        var boy = new Person()
        console.log(boy.alert())

```




### es5的bind

function.bind(thisArg[, arg1[, arg2[, ...]]])

thisArg
调用绑定函数时作为this参数传递给目标函数的值。 如果使用new运算符构造绑定函数，则忽略该值。当使用bind在setTimeout中创建一个函数（作为回调提供）时，作为thisArg传递的任何原始值都将转换为object。如果bind函数的参数列表为空，执行作用域的this将被视为新函数的thisArg。

arg1, arg2, ...
当目标函数被调用时，预先添加到绑定函数的参数列表中的参数。

返回值
      返回一个原函数的拷贝，并拥有指定的this值和初始参数。

bind() 函数会创建一个新绑定函数（bound function，BF）。绑定函数是一个exotic function object（怪异函数对象，ECMAScript 2015中的术语），它包装了原函数对象。调用绑定函数通常会导致执行包装函数。
绑定函数具有以下内部属性：
[[BoundTargetFunction]] - 包装的函数对象
[[BoundThis]] - 在调用包装函数时始终作为this值传递的值。
[[BoundArguments]] - 列表，在对包装函数做任何调用都会优先用列表元素填充参数列表。
[[Call]] - 执行与此对象关联的代码。通过函数调用表达式调用。内部方法的参数是一个this值和一个包含通过调用表达式传递给函数的参数的列表。
当调用绑定函数时，它调用[[BoundTargetFunction]]上的内部方法[[Call]]，就像这样Call(boundThis, args)。其中，boundThis是[[BoundThis]]，args是[[BoundArguments]]加上通过函数调用传入的参数列表。

绑定函数也可以使用new运算符构造，它会表现为目标函数已经被构建完毕了似的。提供的this值会被忽略，但前置参数仍会提供给模拟函数。

var myFun = obj.fn; 
myFun.bind(null) 
obj.fn();
这里边
myFun.bind(null) 直接 改成 myFun() 效果是一样的吧，这个bind(null) 没起作用吧，
或者那三步直接改成
obj.fn.call(null) 
obj.fn(); 

review underscore我也发现了这个问题 就是bind函数第一个参数如果传入的是null，是无效的 非严格模式下运行function还是指向window