# 判断后端传递过来的字段是否存在的情况

### &&
逻辑与，AND（&&）	expr1 && expr2	若 expr1 可转换为 true，则返回 expr2；否则，返回 expr1。

const a={
  b:{
    c；1
  }
}

这样的结构开发中是常见的  我们要判断a.b.c.d是否存在 首先得判断它的父级是否为空或者存在

想想一下如果a.b.c不存在这个字段d那么直接这样写a.b.c.d会报undefined而不是报红---道理原来是这样子的
js中万物皆对象 我们去访问存在的变量a然后访问不存在的属性是报undefined
 
所以写一个属性得判断父级存在不  如果父级值为undefined或者null 同样不能这样写c.a 否则就会报错


注意这里如果值undefined和null（不是字符串注意）性质一样 渲染出来就为空 ❗️❗️❗️


### 原理

```javascript
console.x`log(a)
VM479:1 Uncaught ReferenceError: a is not defined
```
> 好奇我们这个字段不存在  那为啥还可以这样写a.b.c

- 逻辑与，AND（&&）	expr1 && expr2	若 expr1 可转换为 true，则返回 expr2；否则，返回 expr1。

- 原理是访问对象属性是不会报错的 前提这个对象值不是undefined和null 如果是undefined和null用&&的作用就来了 还有值为undefined和null在页面的渲染效果是为空 -- 访问对象上不存在的属性 



还有注意了null 和undefined打印的话比如console alert是会经过toString的

但是如果现实在页面则为空  像这种

```javascript
 a?a:null
 b?b:undefined 我们这两种写法都行  通常是
```



这才是我们写a&&b.c判断字段存在的原理
为什么这样写不会报红   原理是访问对象属性是不会报错的 前提这个对象值不是undefined和null 如果是undefined和null用&&的作用就来了 还有值为undefined和null在页面的渲染效果是为空


### 总结
❗️❗️为什么会报错的原因就是没有对上一级判断 
因为 访问对象上不存在的属性 是会报undefiend（并不是报红）
如果一开始就a.b.c.d a.b.c为undefiend  undefiend.c 就会报错 原理就是这样

所以判断字段是否存在只要判断上一级的父级是否存在然后再配合逻辑运算符就行了

比如a&&a.c
a为undefined 你都不用担心a.c我们拿不到报错  因为都不会经过这一步
若存在 没有这个属性值 则为undefined 渲染在页面的效果为空 也正是我们需要的结果




❗️❗️所以一句话就是判断字段是否存在只要去判断父级是否存在配合逻辑&&运算符就行



最重要的这个性质避免我们报错的就是访问对象上不存在的属性 会报undefined❗️❗️


所以用逻辑&&运算符就行  但是三元运算符一样的效果】

只不过是可以简写而已 