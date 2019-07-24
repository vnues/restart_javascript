### 概念问题：cookie 信息的构成

- name:一个唯一确定 cookie 的名称。cookie 名称是不区分大小写的，所以 myCookie 和 MyCookie
  被认为是同一个 cookie。然而，实践中最好将 cookie 名称看作是区分大小写的，因为某些服务器会这样处理 cookie。cookie 的名称必须是经过 URL 编码的。

- value(值):储存在 cookie 中的字符串值。值必须被 URL 编码

- domain(域):cookie 对于哪个域是有效的。所有向该域发送的请求中都会包含这个 cookie 信息。这个值
  可以包含子域（subdomain，如 www.wrox.com），也可以不包含它（如.wrox.com，则对于 wrox.com
  的所有子域都有效）。如果没有明确设定，那么这个域会被认作来自设置 cookie 的那个域。
  path(路径):对于指定域中的那个路径，应该向服务器发送 cookie。例如，你可以指定 cookie 只有从
  http://www.wrox.com/books/ 中才能访问，那么 http://www.wrox.com 的页面就不会发
  送 cookie 信息，即使请求都是来自同一个域的。

- expire(失效时间):表示 cookie 何时应该被删除的时间戳（也就是，何时应该停止向服务器发送这个
  cookie）。默认情况下，浏览器会话结束时即将所有 cookie 删除；不过也可以自己设置删除时间。
  这个值是个 GMT 格式的日期（Wdy, DD-Mon-YYYY HH:MM:SS GMT），用于指定应该删除
  cookie 的准确时间。因此，cookie 可在浏览器关闭后依然保存在用户的机器上。如果你设置的失
  效日期是个以前的时间，则 cookie 会被立刻删除

- secure 属性：Cookie 的 secure 属性用于限制 Web 页面仅在 HTTPS 安全连接时，才可以发送 Cookie。发送 Cookie 时，指定 secure 属性的方法如下所示。
  Set-Cookie: name=value; secure
  以上例子仅当在 https ：//Example Domain（HTTPS）安全连接的情况下才会进行 Cookie 的回收。也就是说，即使域名相同时 http : //Example Domain（HTTP） 也不会发生 Cookie 回收行为。当省略 secure 属性时，不论 HTTP 还是 HTTPS，都会对 Cookie 进行回收（接收）

- HttpOnly 属性
  Cookie 的 HttpOnly 属性是 Cookie 的扩展功能，它使 JavaScript 脚本无法获得 Cookie。其主要目的为防止跨站脚本攻击（Cross-sitescripting，XSS）对 Cookie 的信息窃取。
  发送指定 HttpOnly 属性的 Cookie 的方法如下所示。
  Set-Cookie: name=value; HttpOnly
  通过上述设置，通常从 Web 页面内还可以对 Cookie 进行读取操作。但使用 JavaScript 的 document.cookie 就无法读取附加 HttpOnly 属性后的 Cookie 的内容了。因此，也就无法在 XSS 中利用 JavaScript 劫持 Cookie 了。
  虽然是独立的扩展功能，但 Internet Explorer 6 SP1 以上版本等当下的主流浏览器都已经支持该扩展了。另外顺带一提，该扩展并非是为了防止 XSS 而开发的。

## cookie 不可跨域性质

cookie 不可跨域
我就几个例子你就懂了，当我打开百度的网页，我要设置一个 cookie 的时候，我的指令如下

```javascript
javascript: document.cookie = "myname=laihuamin;path=/;domain=.baidu.com";
复制代码javascript: document.cookie = "myname=huaminlai;path=/;domain=.google.com";
```

###

domain
这个是指的域名，这个代表的是，cookie 绑定的域名，如果没有设置，就会自动绑定到执行语句的当前域，还有值得注意的点，统一个域名下的二级域名也是不可以交换使用 cookie 的，比如，你设置 www.baidu.com 和 image.baidu.com,依旧是不能公用的

path 这个属性默认是'/'，这个值匹配的是 web 的路由，举个例子：
//默认路径
www.baidu.com
//blog 路径
www.baidu.com/blog 复制代码我为什么说的是匹配呢，就是当你路径设置成/blog 的时候，其实它会给/blog、/blogabc 等等的绑定 cookie
![]("./2.png")
![]("./3.png")

## 共享 cookie

> 首先纠正一个观点：不同域名是无法共享浏览器端本地信息，包括 cookies，这即是跨域问题。

一开始在网上看了很多的跨域共享 cookie 的方法

```javascript
一级域名是 animail.com
二级域名是 www.animal.com, elephant.animal.com
三级域名是small.elephant.animal.com
以此类推…
```

## cookie 在父子域名下的行为

在子域名下，可以提交父域名的 cookie cookie 的父子作用域 news.164.com 和 sports.163.com 是 163.com 域名下的子域。

- 当 Cookie 的 domain 为 news.163.com，那么访问 news.163.com 的时候就会带上 Cookie；
- 当 Cookie 的 domain 为 163.com，那么访问 news.163.com 和 sports.163.com 就会带上 Cookie。

### 浏览器的缓存

❗️❗️❗️❗️ 单点登录需要后端的大力支持 同时注意单点登录就是说得简单点就是在一个多系统共存的环境下，用户在一处登录后，就不用在其他系统中登录，也就是用户的一次登录能得到其他所有系统的信任 <------用于这种场景

❗️❗️❗️❗️ 在单点方式的做法中 token 数据比 cookie 数据更有优势 有一点就是没有跨域限制

> 什么情况下会用到单点登录 不同系统或者不同域名的服务共用一个用户登录信息

单点登录 SSO（Single Sign On）说得简单点就是在一个多系统共存的环境下，用户在一处登录后，就不用在其他系统中登录，也就是用户的一次登录能得到其他所有系统的信任。单点登录在大型网站里使用得非常频繁，例如像阿里巴巴这样的网站，在网站的背后是成百上千的子系统，用户一次操作或交易可能涉及到几十个子系统的协作，如果每个子系统都需要用户认证，不仅用户会疯掉，各子系统也会为这种重复认证授权的逻辑搞疯掉。实现单点登录说到底就是要解决如何产生和存储那个信任，再就是其他系统如何验证这个信任的有效性，因此要点也就以下两个：

- 存储信任
- 验证信任

一个客户端访问服务端的子域名会不会跨域 cookie 你说的是可以携带子域名 是不是 cookie 可以在这子域名下跨域共用？

当用户访问子应用的时候，携带上这个 cookie，授权应用解密 cookie 并进行校验，校验通过则登录当前用户。 ？客户端做判断吗--->不是的 cookie 自动带上的 规则 cookie 下 默认会带上同源还有 path 一样的

我觉得是这样的 因为 cookie 跨域是不能共用的
但是如果是子域名 cookie 还是可以拿到的
之所以用 token 的形式就是 token 可以放在请求头 不会有跨域的干扰

### 典型 SSO 单点登录

## cookie 方式做单点登录 --- 以 Cookie 作为凭证媒介

首先，我们有两个域名要实现单点登录，同时我们需要一个中间的 Server。

- 我们有一个系统域名为 xulingbo.net,当我们登录的时候访问 xulingbo.net/wp-login 进行登录，登录成功之后将 Cookie 回写到 xulingbo 这个域名下。
- 我们还有一个系统域名为 javaWeb.com，当我们访问 inside-javaWeb 的时候，我们没有 Cookie，`（为什么会跳，是做了如果访问的是子域名，就会跳到中间层 jump 校验）`那么请求跳转到中间系统 jump。此时需要将当前域名带到参数中便于 jump 校验。这个 jump 系统是在 xulingbo 域下的即：jump.xulingbo.net。这时候就能拿到之前写在 xulingbo 域下的 Cookie（Set-Cookie）。

- jump 系统在收到了 xulingbo 域下的 Cookie 之后，取出 xulingbo 域下的 Cookie，并 redirect 请求 jump.inside-javaWeb.net(ump 中间层帮 jump.inside-javaWeb.net 写入 cookie),这个接口也是在 jump 系统中，请求后 jump 系统将 Cookie 回写到 inside-javaWeb 域名下，这样就实现了简易的单点登录。如下图所示：

缺点：但是这种方式不是很灵活，对于数据传输的安全性没有保障，并且在销毁 Cookie 的时候无能为力，只能全部遍历的销毁

### 基于 CAS 的 SSO 系统

CAS 可不是 java 中的 Compare-And-Swap，它是一个开源的单点登录系统(SSO)。实现的机制不算复杂但是思想十分灵巧。用 CAS 也可以快速实现单点登录。盗图一张说明 sso 单个域的登录和验证流程：
![]('./1.png')

???老 ajax 为啥相对路径
