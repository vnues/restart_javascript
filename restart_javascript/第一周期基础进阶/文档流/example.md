❗️ 我们是否想过`没有CSS`对 HTML 标签元素的影响，那么我们的标签在浏览器是什么样形式存在的？CSS 对 HTML 标签元素到底产生了什么影响？又做了什么规则限定？来聊聊吧！！！

> CSS 作为一门标记性语言，但是它的简单易学，很多开发者都不知道它是一门语言，**语言的东西必定具备诸多概念**，但是我们会往往忽略这些概念，确实，就算你不知道这些概念，你仅仅知道这些样式是干什么的，都能写出一张复杂的页面，所以我们不止要做到会用，而且**要理解实质性的原理**而不是只知道这些样式是仅仅做什么的，所以痛定思痛，好好温故而知新吧

## 流（Normal flow）

> Normal flow 直译为正常流，但是为什么称为`文档流`，倒是很好奇，会给人别人容易产生误会，所以一下的介绍中，我们都是以流的形式称呼

**`流：“流”实际上是 CSS世界中的一种基本的定位和布局机制，可以理解为现实世界的一套物理规则，“流”跟现实世界的“水流”有异曲同工的表现。`**

### CSS 世界

> 有同学可能听到 CSS 世界这个概念似懂非懂，这个概念出自**`张鑫旭大佬的《CSS世界》`**,我的理解是世界就是一张我们布局完的网页，而如何形成这个世界就是 CSS 去规定的

那通过这个`流`我们来理解 CSS 的元素在这个流是怎么`布局的`,首先来看看 CSS 流布局（`你可以理解为标签元素在流默认以什么形式布局的`）中，我们的 HTML 的`<div>`和`<span>`正好是 CSS 中块级元素和内联级元素的代表，你可以把 div 理解成`水`，span 是`木块`，如图：

![](https://user-gold-cdn.xitu.io/2019/7/15/16bf5cfcc675ff0c?w=704&h=420&f=png&s=93459)

举个例子：

```html
style>
    .demo {
      height: 100px;
      background: lightblue;
    }
    .span1 {
      background: red;
    }
  </style>
  <body>
    <div class="demo">div</div>
    <span class="span1">span</span>
    <span class="span1">span</span>
  </body>
```

效果图：

![](https://user-gold-cdn.xitu.io/2019/7/15/16bf5e7dae3e17b3?w=1494&h=320&f=png&s=34020)

👆 上述的 div 占满了一整行(`没有声明width:100%的情况下`)，像`水`一样铺满容器,而 span 则是像木头一样`依次排列`

**`所以总结一句：所谓“流”，就是CSS中引导元素排列和定位的一条看不见的“水流”，在这个流中，我们的块级元素和内联级元素默认都有与其对应的排列和定位`**

### 流是如何影响整个 CSS 世界的

> CSS2.1 时代，我们直接称 CSS 为“流的世界”真是一点儿也不为过，整个 CSS 世界几乎就是围绕“流”来建立的，那么流是如何影响整个 CSS 世界的呢？

- 因为 CSS 世界的基石是 HTML，所以只要让 HTML **`默认`**的表现符合“流”，那么整个 CSS 世界就可以被“流”统治，而事实就是如此！

- 特殊布局与流的破坏。如果全部都是以默认的“流”来渲染，我们只能实现类似 W3C
  那样的文档网页，但是，`实际的网页是有很多复杂的布局的，怎么办？可以通过破坏“流”来实现特殊布局。实际上，还是和“流”打交道。`

- 流向的改变。默认的流向是“一江春水向东流”，以及“飞流直下三千尺”。然而，这
  种流向我们是可以改变的，可以让 CSS 的展现更为丰富。`❗️因此，“文档流从左往右自上而下”这种说法是不严谨的，大家一定要纠正过来。`

### 什么是流体布局

❗️`流体布局`不是什么新技术，实际开发中我们已经百分百使用过的，而且是必备的技巧

> 世界的形成需要我们去搭建(布局)，在`流的世界中`当然用流的方式去搭建（布局）了,**`所谓“流体布局”，指的是利用元素“流”的特性实现的各类布局效果。因为“流”本身具有自适应特性，所以“流体布局”往往都是具有自适应性的。但是，“流体布局”并不等同于 “自适应布局”。“自适应布局”是对凡是具有自适应特性的一类布局的统称，“流体布局”要狭窄得多。例如，表格布局也可以设置为100%自适应，但表格和“流”不是一路的，并不属于“流体布局”`**

![](https://user-gold-cdn.xitu.io/2019/7/15/16bf5e7dae3e17b3?w=1494&h=320&f=png&s=34020)

比如上述这个 demo 就是流体布局的一种体现

\***\*`CSS 中最常用的魔法石，也就是最常使用的 HTML 标签，是<div>，而<div>是典型的 具有“流”特性的元素，因此，曾经风靡的“DIV+CSS 布局”，实际上指的就是这里的“流体 布局”。`\*\***

### CSS 新世界——CSS3

#### 布局更为丰富

- 移动端的崛起，催生了 CSS3 媒介查询以及许多响应式布局特性的出现，如图片元素
  的 srcset 属性、CSS 的 object-fit 属性

- 弹性盒子布局（flexible box layout）终于熬出了头

- 格栅布局（grid layout）姗姗来迟

#### 视觉表现长足进步

- 圆角、阴影和渐变让元素更有质感

- transform 变换让元素有更多可能。

- filter 滤镜和混合模式让 Web 轻松变成在线的 Photoshop；

- animation 让动画变得非常简单

## 盒模型

❗️ 假设我们 HTMl 标签元素在没有`CSS的影响下`，是以什么形式存在的，`有人可能会想到以盒子形式存在的`,实际则不然，HTMl 标签元素在浏览器中具体的存在形式是被 CSS 所定义的，也就是说的`盒模型`，就相当于出来一种`MSS标记性语言（虚拟的语言）`定义 HTML 标签元素为圆形模型

> MDN 是这样定义的：CSS 基础框盒模型是 CSS 规范的一个模块，`它定义了一种长方形的盒`子——包括它们各自的内边距（padding）与外边距（margin ）`，并根据`视觉格式化模型`(算法机制)`来生成元素，对其进行布置、编排、布局（lay out）。常被直译为盒子模型、盒模型或框模型。

❗️HTML 标签元素在 CSS 规则下是盒子形式存在，如果没有被 CSS 影响，HTML 标签元素可能不是以`盒子`形式存在，并且，CSS 世界存在`流(CSS世界中的一种基本的定位和布局机制)`，`在流的多个规则下，盒子就具备不同的规则，不同的规则（比如BFC、IFC、FFC、GFC）影响着盒子的排列，所以我们把这种盒子也叫做正常流的盒子`👇 我们会在 CSS 规则中讲到

举个例子：

```html
    .demo {
      height: 100px;
      background: lightblue;
    }
  </style>
  <body>
    <div class="demo">div</div>
  </body>
```

![](https://user-gold-cdn.xitu.io/2019/7/15/16bf61d56e6e47c6?w=718&h=436&f=png&s=102443)

如 👆 的图可以看出，这个就是盒模型

**盒模型分为 IE 盒模型和 W3C 标准盒模型。我们在 👇 下面会讲述到，先来看看盒子是怎么形成的吧**

### 视觉格式化模型(visual formatting model)

❗️ 视觉格式化模不是一种盒模型类型，而是一种算法机制,具体可以去看看[W3C](https://www.w3.org/TR/CSS22/visuren.html#visual-model-intro)

> CSS 视觉格式化模型（visual formatting model）是用来处理和在视觉媒体上显示文档时使用的计算规则。该模型是 CSS 的基础概念之一

### 盒子的生成

> MDN 解释：盒子的生成是 CSS 视觉格式化模型的一部分，用于从文档元素生成盒子。盒子有不同的类型，不同类型的盒子的`格式化方法（也叫格式化上下文）`也有所不同。`盒子的类型取决于 CSS display 属性。`

❗️ 我们来理解上面 👆 这句话吧，盒子的生成是通过`视觉格式化模型`，而生成的盒子处于格式化上下文，因为`有不同的格式化上下文`,`格式化上下文(formatting context) 是定义 盒子环境 的规则`，不同 格式化上下文(formatting context)下的盒子有不同的表现。`也就是盒子通过视觉格式化模型出生，出生后被一种规则限制`,可能有同学对格式化上下文有点难以理解，没关系，我也懵逼，`所以接下来会在👇CSS规则章节讲到`

### W3C 标准盒模型：

> 属性 width,height 只包含内容 content，不包含 border 和 padding。

举个例子：

```html
<style>
  .demo {
    width: 200px;
    height: 100px;
    padding: 20px 20px;
    background: lightblue;
    border: 10px solid red;
  }
</style>
<body>
  <div class="demo">div</div>
</body>
```

效果图：

![](https://user-gold-cdn.xitu.io/2019/7/15/16bf62d7cc0aee25?w=1678&h=618&f=png&s=307956)

可以看到`标准盒模型中， width = 内容的宽度、height = 内容的高度`，如上图中 height 等于内容的高度为 100px，width 等于内容的宽度为 100px

### IE 盒模型：

> 属性 width,height 包含 border 和 padding，指的是 content+padding+border。

举个例子：

```html
 .demo {
      box-sizing: border-box; /* 代表为IE盒模型 */
      width: 200px;
      height: 100px;
      padding: 20px 20px;
      background: lightblue;
      border: 10px solid red;
    }
  </style>
  <body>
    <div class="demo">div</div>
  </body>
```

效果图：

![](https://user-gold-cdn.xitu.io/2019/7/15/16bf62c8944f9ee8?w=1562&h=624&f=png&s=266944)

可以看到，IE 盒模型中，`width = border + padding + 内容的宽度,height = border + padding + 内容的高度`,如上图`height = border 10px*2+ padding20px*2 + 内容的高度40px=100px,width = border 10px*2 + padding 20px*2+ 内容的宽度 140px=200px`

### box-sizing 属性更改盒模型

❗️CSS 中的 `box-sizing`属性定义了 user agent 应该如何计算一个元素的总宽度和总高度。

> IE 模型不是一无所用，开发中我们有时候会改变 padding 的值，这样会影响到整个盒子的`区域面积`，我们还得手动计算改 width 或者 height，这样显然影响效率，这时候 IE 盒模型的作用就来了，我们只要按照设计师给的盒子固定区域，写死，给我写死就行！！！,我们将盒子转化为 IE 盒模型，我们不管怎么改变 padding 或者 border，`区域面积永远固定在哪里`

```css
box-sizing:content-box /*（标准盒模型）*/
box-sizing:border-box /*（IE盒模型）*/
```

在 ie8+浏览器中使用哪个盒模型可以由 box-sizing(CSS 新增的属性)控制，默认值为 content-box，即标准盒模型；如果将 box-sizing 设为 border-box 则用的是 IE 盒模型。如果在 ie6,7,8 中 DOCTYPE 缺失会触发 IE 模式。在当前 W3C 标准中盒模型是可以通过 box-sizing 自由的进行切换的

## CSS 流的规则

> “流”之所以影响了整个 CSS 世界，就是因为影响了 CSS 世界的`基石 HTML`。
> 那具体是如何影响的呢？

### ❗️❗️❗️ 什么是格式化上下文（Fatting context）

前面我们反复讲到的`格式化上下文`到底是什么东东？查阅了[W3C](https://www.w3.org/TR/CSS22/visuren.html#normal-flow)得到的是这句话:`Boxes in the normal flow belong to a formatting context`意思是`正常流的盒子属于格式化上下文`，前面我们讲到不同 格式化上下文(formatting context)下的盒子有不同的表现，我们知道正常流的盒子属于格式化上下文，那么格式化上下文就是制定规则的区域，那么大家想想，想到规则会想起 CSS 的谁？也就是`流`,
在我的理解里:**`。FC就是我们的流，它是页面中的一块渲染区域，有一套渲染规则`**[如何理解块级格式化上下文 BFC(block formatting context)?](https://www.zhihu.com/question/28433480),那么流中具有不同的规则，比如`BFC、IFC、FFC、GFC`,下面我们逐个击破它们吧





### 块级元素和内联级元素

❗️ 在讲块级元素和内联元素之前，我们会这样想`块级元素：总是独占一行，表现为另起一行开始，而且其后的元素也必须另起一行显示`,`内联元素：和相邻的内联元素在同一行`，的确可以这样理解，但是有没有想过就是这些元素为什么会具备这些属性？`与其说具备这些属性，倒不如说HTML标签元素被不同的规则所影响，导致拥有不同的属性`

HTML 常见的标签有`<div>、<p>、<li>和<table>以及<span>、<img>、<strong> 和<em>等`。虽然标签种类繁多，但通常我们就把它们分为两类：块级元素（block-level element）和内联元素（inline element）。
