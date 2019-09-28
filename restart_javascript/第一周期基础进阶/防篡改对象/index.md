> 对 javascript 库来说，冻结对象是很有用的，因为 Javascript 库最怕有人（或者有意）的修改了库中的核心对象
> 冻结和密封能阻止这种现象的发生

> 实际上大神也是很接近的 相信自己

### 不可扩展对象 --不可以拓展属性 但是可以删除和修改

prevent ----> 预防和防止
Object.preventExtensions()方法可以改变这个行为，让你不能再给对象添加属性和方法

虽然不能给对象添加新成员，但已有的成员则丝毫不受影响。你仍然还可以修改和删除已有的成员。
另外，使用 Object.istExtensible()方法还可以确定对象是否可以扩展

### 密封的对象 --不能删除属性或者方法 不可拓展 属性值是可以修改的

> seal 密封

ECMAScript 5 为对象定义的第二个保护级别是密封对象（sealed object）。密封对象不可扩展，而
且已有成员的[[Configurable]]特性将被设置为 false。这就意味着不能删除属性和方法，因为不能
使用 Object.defineProperty()把数据属性修改为访问器属性，或者相反。属性值是可以修改
要密封对象，可以使用 Object.seal()方法

使用 Object.isSealed()方法可以确定对象是否被密封了。因为被密封的对象不可扩展，所以用
Object.isExtensible()检测密封的对象也会返回 false

### 冻结的对象 --最严格的防篡改级别做法

而且对象数据属性的[[Writable]]特性会被设置为 false
不可拓展不可删除 不可修改
ECMAScript 5 定义的 Object.freeze()方法可以用来冻结对象。

当然，也有一个 Object.isFrozen()方法用于检测冻结对象。因为冻结对象既是密封的又是不可
扩展的，所以用 Object.isExtensible()和 Object.isSealed()检测冻结对象将分别返回 false
和 true。

> 学习习惯加一 就是遇到那种晦涩难懂的 第一次理清楚 然后反复记忆 这才是学习方法之一
