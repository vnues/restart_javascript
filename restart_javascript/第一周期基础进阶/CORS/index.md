！！！注意我们的请求如果不是跨域就不用走 cors 请求的 http://www.ruanyifeng.com/blog/2016/04/cors.html
如果存在跨域浏览器默认会走 cors 请求 然后看服务器允许不 也就是浏览器默认支持这种写法
这就是为什么存在 option s 请求的时候

```javascript
HTTP请求方法并不是只有GET和POST，只是最常用的。据RFC2616标准（现行的HTTP/1.1）得知，通常有以下8种方法：OPTIONS、GET、HEAD、POST、PUT、DELETE、TRACE和CONNECT。
OPTIONS请求方法的主要用途有两个： 1、获取服务器支持的HTTP请求方法；也是黑客经常使用的方法。
2、用来检查服务器的性能。例如：AJAX进行跨域请求时的预检，需要向另外一个域名的资源发送一个HTTP
OPTIONS请求头，用以判断实际发送的请求是否安全。
```

OPTIONS 也就是请求跨域才出现的 反过来你可以判断请求的 api 是不是在同个源里！！！很重要的 我猜实际开发中我公司就是前端请求的 api 就是不同的源 公司的前端页面是跑在另一台服务的应该 ---》还是看请求的 api ----这点星期一的时候再论证 看了下确实跑在同个源里 但是公司的前端确实起在另一个 node 服务上 不过多赘述

### CORS https://zhuanlan.zhihu.com/p/24411090

> CORS 是一个 W3C 标准，全称是"跨域资源共享"（Cross-origin resource sharing）。

- 它允许浏览器向跨源服务器，发出 XMLHttpRequest 请求，从而克服了 AJAX 只能同源使用的限制。

- CORS 需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE 浏览器不能低于 IE10。

- 浏览器将 CORS 请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。

只要同时满足以下两大条件，就属于简单请求。

```javascript
1) 请求方法是以下三种方法之一：

HEAD
GET
POST
（2）HTTP的头信息不超出以下几种字段：

Accept
Accept-Language
Content-Language
Last-Event-ID
Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain
```

凡是不同时满足上面两个条件，就属于非简单请求。

开发中 oock mock 数据就是起的 node 服务 必定会出现跨域，肯定设置了允许跨域的操作

```javascript
async function cors(ctx, next) {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  ctx.set(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length,Accept,Accept-Charset,Accept-Encoding,Authorization,X-Requested-With,Token"
  );
  ctx.set("Access-Control-Allow-Credentials", "true");
  ctx.set("Access-Control-Max-Age", "7200");
  if (ctx.request.method === "OPTIONS") {
    ctx.body = "OK";
    return;
  }
  await next();
}

module.exports = cors;
```

❗️❗️❗️ 所以说 cors 已经是我们开发中必用的 就是浏览器已经默认支持 所以我们看到时候应该看好是简单请求还是非简单请求

#### 简单请求

(cors 请求)
！！！注意我们的请求如果不是跨域就不用走 cors 请求的

> 对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，增加一个 Origin 字段。

浏览器对这两种请求的处理，是不一样的。

在出现 CORS 标准之前， 我们还只能通过 jsonp（jsonp 跨域请求详解）的形式去向“跨源”服务器去发送 XMLHttpRequest 请求，这种方式吃力不讨好，在请求方与接收方都需要做处理，而且请求的方式仅仅局限于 GET。所以 ，CORS 标准必然是大势所趋，并且市场上绝大多数浏览器都已经支持 CORS。（IE10 以上）

支持 CORS 请求的浏览器一旦发现 ajax 请求跨域，会对请求做一些特殊处理，对于已经实现 CORS 接口的服务端，接受请求，并做出回应。

有一种情况比较特殊，如果我们发送的跨域请求为“非简单请求”，浏览器会在发出此请求之前首先发送一个请求类型为 OPTIONS 的“预检请求”，验证请求源是否为服务端允许源，这些对于开发这来说是感觉不到的，由浏览器代理。

> 总而言之，客户端不需要对跨域请求做任何特殊处理。

意思就是客户端帮我们处理好了

### 简单请求和非简单请求

有没有注意到发送请求的时候有个 option 字段---那我们来深究下 一定要去验证自己的观点 而不是模糊大概

#### 非简单请求

进行非简单请求时候 ， 浏览器会首先发出类型为 OPTIONS 的“预检请求”，请求地址相同 ，
CORS 服务端对“预检请求”处理，并对 Response Header 添加验证字段，客户端接受到预检请求的返回值进行一次请求预判断，验证通过后，主请求发起。

总结：简单请求只需要 CORS 服务端在接受到携带 Origin 字段的跨域请求后，在 response header 中添加 Access-Control-Allow-Origin 等字段给浏览器做同源判断。

进行非简单请求时候 ， 浏览器会首先发出类型为 OPTIONS 的“预检请求”，请求地址相同 ，
CORS 服务端对“预检请求”处理，并对 Response Header 添加验证字段，客户端接受到预检请求的返回值进行一次请求预判断，验证通过后，主请求发起。
例如：发起 content-type=application/json 的非简单请求，这时候传参要注意为 json 字符串

通过上面叙述，我们得知借助 CORS 我们不必关心发出的请求是否跨域，浏览器会帮我们处理这些事情，但是服务端需要支持 CORS，服务端实现 CORS 的原理也很简单，在服务端完全可以对请求做上下文处理，已达到接口允许跨域访问的目的。

> > 由于现在浏览器默认支持 CORS 跨域请求 一一旦存在跨域 就会默认走 CORS 方式 默认帮我们 不需要我们再去处理，这也是 OPTIONS 的由来

XMLHttpRequest.withCredentials 属性是一个 Boolean 类型，它指示了是否该使用类似 cookies,authorization headers(头部授权)或者 TLS 客户端证书这一类资格证书来创建一个跨站点访问控制（cross-site Access-Control）请求。在同一个站点下使用 withCredentials 属性是无效的。

此外，这个指示也会被用做响应中 cookies 被忽视的标示。默认值是 false。

如果在发送来自其他域的 XMLHttpRequest 请求之前，未设置 withCredentials 为 true，那么就不能为它自己的域设置 cookie 值。而通过设置 withCredentials 为 true 获得的第三方 cookies，将会依旧享受同源策略，因此不能被通过 document.cookie 或者从头部相应请求的脚本等访问。

跨域请求一直是网页编程中的一个难题，在过去，绝大多数人都倾向于使用 JSONP 来解决这一问题。不过现在，我们可以考虑一下 W3C 中一项新的特性——CORS（Cross-Origin Resource Sharing）了。

#### XMLHTTPrequest2 的新特性

客户端
创建 XmlHttpRequest 对象
对于 CORS，Chrome、FireFox 以及 Safari，需要使用 XmlHttpRequest2 对象；而对于 IE，则需要使用 XDomainRequest；Opera 目前还不支持这一特性，但很快就会支持。

```javascript
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // "withCredentials"属性是XMLHTTPRequest2中独有的
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // 检测是否XDomainRequest可用
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // 看起来CORS根本不被支持
    xhr = null;
  }
  return xhr;
}

var xhr = createCORSRequest("GET", url);
if (!xhr) {
  throw new Error("CORS not supported");
}
```

in 操作符
"withCredentials"属性是 XMLHTTPRequest2 中独有的

事件处理
原先的 XmlHttpRequest 对象仅仅只有一个事件——onreadystatechange，用以通知所有的事件，而现在，我们除了这个事件之外又多了很多新的。

#### withCredentials Credentials 证书 文凭

标准的 CORS 请求不对 cookies 做任何事情，既不发送也不改变。如果希望改变这一情况，就需要将 withCredentials 设置为 true。

另外，服务端在处理这一请求时，也需要将 Access-Control-Allow-Credentials 设置为 true。这一点我们稍后来说。

```javascript
xhr.withCredentials = true;
```

withCredentials 属性使得请求包含了远程域的所有 cookies，但值得注意的是，这些 cookies 仍旧遵守“同域”的准则，因此从代码上你并不能从 document.cookies 或者回应 HTTP 头当中进行读取。

服务端
一个 CORS 请求可能包含多个 HTTP 头，甚至有多个请求实际发送，这对于客户端的开发者来说通常是透明的。因为浏览器已经负责实现了 CORS 最关键的部分；但是服务端的后台脚本则需要我们自己进行处理，因此我们还需要了解到服务端到底从浏览器那里收到了怎样的内容

http://newhtml.net/using-cors/

安全问题
跨域请求始终是网页安全中一个比较头疼的问题，CORS 提供了一种跨域请求方案，`但没有为安全访问提供足够的保障机制，如果你需要信息的绝对安全，不要依赖 CORS 当中的权限制度，应当使用更多其它的措施来保障，比如 OAuth2。`

前端查询 w3c 就对了

XMLHTTPrequest2 支持了 CORS 跨域方式 还支持了很多时间

本来我们的跨域是不不操作任何 COOKIE 或者凭证的 发送给服务端 如果需要发送凭证就要设置 xhr.withCredentials = true;

withCredentials 这个属性就是允不允许带上 cookies 看开发的项目好像没有这个 我猜测是它们不会跨域

概述
HTTP 是一个“无状态”协议，这意味着 Web 应用程序服务器在响应客户端请求时不会将多个请求链接到任何一个客户端。然而，许多 Web 应用程序的安全和正常运行都取决于系统能够区分用户并识别用户及其权限。

这就需要一些机制来为一个 HTTP 请求提供状态。它们使站点能够在会话期间对各用户做出适当的响应，从而保持跟踪用户在应用程序中的活动（请求和响应）。

②：token 存在哪儿都行，localstorage 或者 cookie。

浏览器中的 Storage 的 cookies 是什么 token 可以存在那里

本文将首先概述基于 cookie 的身份验证方式和基于 token 的身份验证方式，在此基础上对两种验证进行比较。
cookie 是源自站点并由浏览器存储在客户计算机上的简单文件。它们通常包含一个名称和一个值，用于将客户端标识为对站点具有特定许可权的特定用户。
cookie 与源域相连接的方式可以确保仅源域能够访问其中存储的信息。第三方服务器既不能读取也不能更改用户计算机上该域的 cookie 内容。

###Preflight Request 预检测
---> options

### 是否支持 CORS

检测是否支持 CORS 方式跨域检测 withCrendtials 和兼容 IEj 检测 XDR 对象就行

> 即使浏览器对 CORS 的支持程度并不都一样，但所有浏览器都支持简单的（非 Preflight 和不带凭据
> 的）请求，因此有必要实现一个跨浏览器的方案。检测 XHR 是否支持 CORS 的最简单方式，就是检查
> 是否存在 withCredentials 属性。再结合检测 XDomainRequest 对象是否存在，就可以兼顾所有浏
> 览器了

// 创造跨域请求的方法

```javascript
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true); // true参数干嘛用的  就是要开启异步
  } else if (typeof XDomainRequest != "undefined") {
    vxhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}
var request = createCORSRequest("get", "http://www.somewhere-else.com/page/");
if (request) {
  request.onload = function() {
    //对 request.responseText 进行处理
  };
  request.send();
}
```

我们发现我们的 cookie 下的存储在哪一个窗口都能看到 （我们就这样 一个窗口代表一个源（网站） 你想想 B 网站拿到你 A 网站的 cookie 轻而易举）

好像 token 拿不到 A 网站的 token 你只能在该浏览器窗口拿到 其它窗口拿不到 有点混乱了

现在不懂的是 cookie 和 token 的区别

（CORS 跨域）我已经知道 withCredentials 是对 cookie 来说的

现在浏览器都是 XMLHttpRequest2 了

浏览器默认情况下无法主动跨域向后端发送 cookie， 如果你要发送 cookie 给 server 的话, 就需要将 withCredentials 设置为 true 了.

但是,server 并不是随便就能接受并返回新的 cookie 给你的。 在 server 端,还需要设置. Access-Control-Allow-Credentials: true //浏览器允许跨域携带 cookie

这样 server 才能返回新的 cookie 给你. 但是，这还有一个问题,就是 cookie 还是遵循 same-origin policy 的。 所以, 你依旧无法使使用它.

最多是访问到它。即使你设置了 cors！所以很多时候你能访问到 cookie，即使在客户端做了修改它也不会改变，他的 CRUD 只能由 server 控制.

最好不要设置 cors，一方面不安全（出于开发时的便捷，你可以使用一些中间件的代理例如 proxyTable，帮你实现请求转发达到跨域请求的效果）。

另一方面 cookie 很多时候都是硬需求，还是老老实实的设置可访问的域，这样才能灵活使用 cookie

所以你想想非简单请求都要去一次 options 请求 所以生产环境不会出现跨域 就算出现也不会用 CORS 去解决 代理更好 --->性能优化了

#### cookie 和 token

以前的 cookie 估计和 token 一样都是存在浏览器下的 cookie

提问为什么后端可以帮我们塞 token --->同个源下

问题来了 如果我出现跨域 但是后端需要 token 验证那么 是不是需要 xhr.withCredentials = true;的支持啊

验证下吧 发现 axios.defaults.withCredentials = true; 只有 OPTIONS 状态 页面没有数据

axios.defaults.withCredentials = true;
设置为 true 的时候只要 OPTIONS 状态，是设置 withCredential 为 true 的时候发送请求会要求服务器是否设置 Access-Control-Allow-Credentials: true
但是这里的后端很明显没有设置返回，所以才是 OPTIONS 状态就没有再请求了
并且 token 跟 withCredentials 无关 即使跨域 我们是把 token 写在请求头的 而不是 cookie

所以设置 withCredentials = true;想要把 cookie 发送给跨域后端 如果后端没有对此作出设置 就会是 OPTIONS 状态
但是我们现在都是用 token 验证 所以没必要再去管 cookie 了 故后端不会对这个作出设置

！！！出现 OPTIONS 我们知道是跨域的操作
OPTIONS 是预检测 如果预检测不通过是不会继续发送请求的

回答：如果发送的是带凭据的请求，但服务器的响应中没有包含这个头部，那么浏览器就不会把响应交给
JavaScript`（于是，responseText 中将是空字符串，status 的值为 0，而且会调用 onerror()事件处 理程序）`。另外，服务器还可以在 Preflight 响应中发送这个 HTTP 头部，表示允许源发送带凭据的请求。
支持 withCredentials 属性的浏览器有 Firefox 3.5+、Safari 4+和 Chrome。IE 10 及更早版本都不
支持

！！！注意一旦看到 OPTIONS 马上就想到跨域 这个用来分析最好

withCredentials 不是对 token 的而是 cookie 的

因为攻击者无法获取正确的 token 别的客户端（浏览器窗口）不能拿得到你的 token

像转账就是一个请求 操作这个请求 就是 所以得有权限才让人去操作

多站点使用
cookie 绑定到单个域。foo.com 域产生的 cookie 无法被 bar.com 域读取。使用 token 就没有这样的问题。这对于需要向多个服务获取授权的单页面应用程序尤其有用。
使用 token，使得用从 myapp.com 获取的授权向 myservice1.com 和 myservice2.com 获取服务成为可能。

### cookie 是怎么生成的

https://www.jianshu.com/p/ce9802589143

> 都是为了保存登陆信息

### cookie 和 token 的区别

1.背景介绍
由于 HTTP 是一种无状态协议,服务器没有办法单单从网络连接上面知道访问者的身份,为了解决这个问题,就诞生了 Cookie

Cookie 实际上是一小段的文本信息。客户端请求服务器，如果服务器需要记录该用户状态，就使用 response 向客户端浏览器颁发一个 Cookie

1.背景介绍由于 HTTP 是一种无状态协议,服务器没有办法单单从网络连接上面知道访问者的身份,为了解决这个问题,就诞生了 CookieCookie 实际上是一小段的文本信息。客户端请求服务器，如果服务器需要记录该用户状态，就使用 response 向客户端浏览器颁发一个 Cookie 客户端浏览器会把 Cookie 保存起来。当浏览器再请求该网站时，浏览器把请求的网址连同该 Cookie 一同提交给服务器。服务器检查该 Cookie，以此来辨认用户状态。服务器还可以根据需要修改 Cookie 的内容。实际就是颁发一个通行证，每人一个，无论谁访问都必须携带自己通行证。这样服务器就能从通行证上确认客户身份了。这就是 Cookie 的工作原理 cookie 可以让服务端程序跟踪每个客户端的访问，但是每次客户端的访问都必须传回这些 Cookie，如果 Cookie 很多，这无形地增加了客户端与服务端的数据传输量，而 Session 的出现正是为了解决这个问题。同一个客户端每次和服务端交互时，不需要每次都传回所有的 Cookie 值，而是只要传回一个 ID，这个 ID 是客户端第一次访问服务器的时候生成的，而且每个客户端是唯一的。这样每个客户端就有了一个唯一的 ID，客户端只要传回这个 ID 就行了，这个 ID 通常是 NANE 为 JSESIONID 的一个 Cookie。

也就是实际用 session 的话还是需要 cookie 的帮助 客户端存储一个 id 那么 session 怎么做判断

这就是为什么让自己学后端的原由了

使用 cookie 的缺点如果浏览器使用的是 cookie，那么所有的数据都保存在浏览器端，cookie 可以被用户禁止 cookie 不安全(对于敏感数据，需要加密)cookie 只能保存少量的数据(大约是 4k)，cookie 的数量也有限制(大约是几百个)，不同浏览器设置不一样，反正都不多 cookie 只能保存字符串对服务器压力小

用 session 的缺点一般是寄生在 Cookie 下的，当 Cookie 被禁止，Session 也被禁止当然可以通过 url 重写来摆脱 cookie 当用户访问量很大时，对服务器压力大我们现在知道 session 是将用户信息储存在服务器上面,如果访问服务器的用户越来越多,那么服务器上面的 session 也越来越多, session 会对服务器造成压力，影响服务器的负载.如果 Session 内容过于复杂，当大量客户访问服务器时还可能会导致内存溢出。用户信息丢失,  或者说用户访问的不是这台服务器的情况下,就会出现数据库丢失.

cookie 和 session 的区别具体来说 cookie 机制采用的是在客户端保持状态的方案，而 session 机制采用的是在服务器端保持状态的方案。同时我们也看到，由于采用服务器端保持状态的方案在客户端也需要保存一个标识，`所以session机制可能需要借助于cookie机制来达到保存标识的目的cookie不是很安全`，别人可以分析存放在本地的 cookie 并进行 cookie 欺骗，考虑到安全应当使用 sessionsession 会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能，考虑到减轻服务器性能方面，应当使用 cookie 单个 cookie 保存的数据不能超过 4k,很多浏览器都限制一个站点最多保存 20 个 cookie。可以将登陆信息等重要信息存放为 session。
。

`因为token是被签名的，所以我们可以认为一个可以解码认证通过的token是由我们系统发放的`，其中带的信息是合法有效的；Token 机制相对于 Cookie 机制又有什么好处呢？
`支持跨域访问:Cookie是不允许垮域访问,这一点对Token机制是不存在的`,前提是传输的用户认证信息通过 HTTP 头传输.无状态(也称：服务端可扩展行):Token 机制在服务端不需要存储 session 信息，因为 Token 自身包含了所有登录用户的信息，只需要在客户端的 cookie 或本地介质存储状态信息.更适用 CDN: 可以通过内容分发网络请求你服务端的所有资料（如：javascript，HTML,图片等），而你的服务端只要提供 API 即可.去耦: 不需要绑定到一个特定的身份验证方案。Token 可以在任何地方生成，只要在你的 API 被调用的时候，你可以进行 Token 生成调用即可.更适用于移动应用: 当你的客户端是一个原生平台（iOS, Android，Windows 8 等）时，Cookie 是不被支持的（你需要通过 Cookie 容器进行处理），这时采用 Token 认证机制就会简单得多。

性能: 一次网络往返时间（通过数据库查询 session 信息）总比做一次 HMACSHA256 计算 的 Token 验证和解析要费时得多.不需要为登录页面做特殊处理: 如果你使用 Protractor 做功能测试的时候，不再需要为登录页面做特殊处理.基于标准化:你的 API 可以采用标准化的 JSON Web Token (JWT). 这个标准已经存在多个后端库（.NET, Ruby, Java,Python, PHP）和多家公司的支持（如：Firebase,Google, Microsoft）

所以现在很少用 session 和 cookie 做状态保存了吧 都是用 token

那么以前怎么用 cookie 和 session 做状态保存的

https://www.cnblogs.com/wxinyu/p/9154178.html

cookie session token 比较都是同级别的

但是目前主流是采用 token

https://www.liangzl.com/get-article-detail-126035.html 这篇讲的很好

cookie 实际就是服务端吧信息存储到浏览器这里 token session 可能借助它存储到这里
但一开始的 cookie 叫法是保存登陆信息 再把这个登陆信息发送给服务

cookie 即使一个浏览器的存储平台类型 localstorage 但是类型 session 和 token 信息存储到 cookie 是最好的
我们应该这样子区别好

原先有 cookie 信息 session 信息 token 信息的区别

而这里的 cookie 是指浏览器的存储平台 ---->这样把话讲明白就舒服了

这些就是干扰我们理解的信息
很多人理不清 就很奇怪 token session 放在 cookie 又说 cookie 和 session 的区别

实际说的是此 cookie 非 cookie 只是说的保存状态的方式

cookie
浏览器在本地按照一定规则存储一些文本字符串，每当浏览器像服务器发送请求时带这些字符串。服务器根据字符串判定浏览器的状态比如：登录、订单、皮肤。服务器就可以根据不同的 cookie 识别出不同的用户信息。浏览器和服务器 cookie 交互图如下。

https://www.cnblogs.com/monsterooo/p/6815392.html

这样子讲吧 cookie 是一个存储平台 然后早期的是把登陆信息啊什么的都保存到这个 cookie 平台下（会有多个 cookie 信息） 然后请求的时候把这个 cookie 信息带给服务器验证通过 后来觉得把信息放在客户端不好
然后就放在服务端 服务端需要客户端保存这个 id 保存到 cookie 去 token 也是

所以说区分好 cookie session token 技术就是这样的 不要觉得放在 cookie 这个存储平台就觉得不可思议
一个是技术或者说方法 一个是存储平台

### cookie 怎么带过去给服务端

在浏览器访问服务器时由服务器返回一个 Set-Cookie 响应头，当浏览器解析这个响应头时设置 cookie

https://www.cnblogs.com/monsterooo/p/6815392.html

通过 Set-Cookie 响应头

### session_id 带过去给服务端 <-----通过 cookie 方式吧

将 sessionID（随机数） 通过 Cookie 发给客户端

### token 是放在请求头带给服务端的

觉得 token 是更加好的加密机制 但是觉得实际上跟 cookie 技术没什么区别的样子 都是放在本地存起来 只不过人家 token 加密更牛逼一些 然后传输啊方式给后端都一样的感觉
但是 token 信息是没有跨域限制 cookie 信息有 这是它们的区别

cookie 默认的生命周期在浏览器关闭后就结束了。其可以访问到的域名在创建的域名及其子域下，可以访问到的路径在创建的路径下及其子路径下，可以通过设置属性改变
Set-Cookie 响应头是服务器返回的响应头用来在浏览器种 cookie，一旦被种下，当浏览器访问符合条件的 url 地址时，会自动带上这个 cookie
Set-Cookie: cookie1=val1; Expires=?; Domain=?; Path=?

> ！！！注意设置你们没发现都是在请求头部设置吗 token 是 Authorization cookie 是 Set-Cookie

后端把 cookie 信息塞到 Set-Cookie 中

cookie 技术和 token 等的区别 也包含了 cookie 信息的区别

重新刷知三观！！！

放在 cookie 下的每次都会传给服务器 服务端通过 Set-Cookie 设置 cookie

所以就能得出 cookie 的特点：

服务器通过设置 Set-Cookie 响应头来设置 cookie

浏览器得到 cookie 后，每次同源的请求的请求头都会带上 cookie

服务器读取 cookie 就知道了登录用户的信息（如账户名等）

cookie 实际上存储在本地计算机的硬盘里

cookie 的最大储存量一般只有 4K

那么这里有个问题了 我们 token 放在 cookie 是不是每次都请求一次

那么我们如何设置 cookie 呢：
其实只要一句话：在响应头中设置 Set-Cookie 即可，详见 Set-Cookie MDN 。具体参数如下：

session
session 为何物？
session 是由 cookie 进行标记的。当需要记住用户时，比如前面说的登录，在服务端会设置一个响应头 Set-Cookie，返回给客户端，例如：Set-Cookie:SESSIONID=12345678；客户端接收到这个响应后，此后发送的每一个请求浏览器都会自动带上 Cookie 请求头，对应内容是 Cookie:SESSIONID=12345678。在服务端内存中存有 session，将客户端发送的请求中的 cookie 值与内存中的 session 进行对比，就可以识别这个客户端了，也就能避免上图中那种尴尬的情况。
但是这又会引发新的问题。
如果用 session 在服务端进行存储，会出现的情况是，在一个处理淘宝业务的服务器集群中，不同的服务器被分配处理的业务不同，他们都处于淘宝这个大域名下，每台服务器的内存中都保留着一份同样的 session，这就涉及到服务器之间 session 的复制。如若有 100 台服务器，每台服务器都有着同样的 session，那么 session 所占用的内存之多可以想象。服务器既要处理业务，还得维护 session 的同步，如此一来，服务器无法通过增加业务的方式进行扩张，不易进行横向扩展。
解决办法：将有状态的服务转化为无状态的服务
（1）共享 session
将 session 提取出来，集中存放（有点像开辟了一个 session 数据库的赶脚。。）

（2）token
服务是不需要进行存储，服务可以通过解析 token 里面的信息来判断是否登陆。token 里面是可以携带 cookie 解析出来的信息的。这种情况下，去掉了服务器存储的负担，只需要每次在服务端对 token 增加一个校验就可以了。

在学习 session 这块的同时，注意到，在高并发情况下，集群中服务器的分布是可以加以设计和优化的。就拿双十一的淘宝，同时那么多人访问，仍旧坚挺着，这是为什么？当业务量巨大的时候，同一个域名底下可以有一堆服务器处理大量复杂的业务，防止网站崩溃；这个时候就需要进行负载均衡的设计了

乱了乱了

👇 引入浏览器数据的缓存

平时经常会把前端浏览器的几种缓存方式拿来作比较，

```javascript
cookie; // (客户端)存储于访问者的计算机中的变量的大小是受限的，大概只允许4k
session; // (服务端)Session 在服务器端，默认被存在在服务器的一个文件里（不是内存），
localStorage; // （客户端） 缓存大小能到5m甚至更大 永不清除
sessionStorage; // （客户端） 缓存大小能到5m甚至更大 关闭浏览器窗口就会清除
```

它们都是数据缓存平台 --->可以这样理解

如果你把数据信息放在这个平台上，每个平台都有与之相关的规则 ---->应该这样总结
还有就是塞入 cookie 不一定是 cookie 信息 有可能是 token 还有 session_id

还有就是我们对比的 session cookie 和 token 的区别 是对方法的区别 而不是缓存平台

也就是既有 cookie 平台也有 cookie 方法

这些区别其实不是重要的 但是你应该知道 cookie 是个数据缓存平台 session_id 和 token 需要存进去

还有 session 需要借助 cookie 方法传给服务端

问题一 是不是存在 cookie 缓存平台的信息都会传给后端 还有后端怎么塞入 token 到 cookie 的？ Set_Cookie?

觉得 token 是每个窗口共享的或者登陆信息 因为多开浏览器窗口--->但是我是这个源里的就会被访问到的 不是这个源里的浏览器会隐藏

## cookie 和 session、localStorage、sessionStorage 的区别

四个都可以理解为数据缓存平台

然后数据有 cookie 数据 session 数据

实际我们的讲它们的区别 都是很泛的讨论 比如 cookie 可能是 cookie 缓存平台 可能是 cookie 数据 这样做区别的 所以我们不纠结分的很细 谁属于谁这种

https://www.cnblogs.com/andy-zhou/p/5360107.html

服务端设置 cookie

```javascript
var http = require("http");
var fs = require("fs");

http
  .createServer(function(req, res) {
    res.setHeader("status", "200 OK");
    res.setHeader("Set-Cookie", "isVisit=true;domain=.yourdomain.com;path=/;max-age=1000");
    res.write("Hello World");
    res.end();
  })
  .listen(8888);

console.log("running localhost:8888");
```

直接设置 Set-Cookie 过于原始，我们可以对 cookie 的设置过程做如下封装：

```javascript
var serilize = function(name, val, options) {
  if (!name) {
    throw new Error("coolie must have name");
  }
  var enc = encodeURIComponent;
  var parts = [];

  val = val !== null && val !== undefined ? val.toString() : "";
  options = options || {};
  parts.push(enc(name) + "=" + enc(val));
  // domain中必须包含两个点号
  if (options.domain) {
    parts.push("domain=" + options.domain);
  }
  if (options.path) {
    parts.push("path=" + options.path);
  }
  // 如果不设置expires和max-age浏览器会在页面关闭时清空cookie
  if (options.expires) {
    parts.push("expires=" + options.expires.toGMTString());
  }
  if (options.maxAge && typeof options.maxAge === "number") {
    parts.push("max-age=" + options.maxAge);
  }
  if (options.httpOnly) {
    parts.push("HTTPOnly");
  }
  if (options.secure) {
    parts.push("secure");
  }

  return parts.join(";");
};
```

需要注意的是，如果给 cookie 设置一个过去的时间，浏览器会立即删除该 cookie；此外 domain 项必须有两个点，

因此不能设置为 localhost:

> something that wasn’t made clear to me here and totally confused me for a while was that domain names must contain at least two dots (.),hence ‘localhost’ is invalid and the browser will refuse to set the cookie!

客户端的存取

浏览器有同源策略，像 localStorage 都是遵循这一策略，但是 cookie 就有所不同，在同域不同端口下，cookie 是可以共享的。举个栗子，我在 localhost:8080，设置了一个 cookie，为 age=18，然后我在 localhost:8089 是可以从 cookie 中拿到这个 age 值的。

有 两个 Http 头部和 Cookie 有关：Set-Cookie 和 Cookie。
Set-Cookie 由服务器发送，它包含在响应请求的头部中。它用于在客户端创建一个 Cookie
Cookie 头由客户端发送，包含在 HTTP 请求的头部中。注意，`只有 cookie 的 domain 和 path 与请求的 URL 匹配才会发送这个 cookie。`

1. 使用 Cookie 来管理状态
   HTTP 是无状态协议，说明它不能以状态来区分和管理请求和响应。也就是说，无法根据之前的状态进行本次的请求处理。
   不可否认，无状态协议当然也有它的优点。由于不必保存状态，自然可减少服务器的 CPU 及内存资源的消耗。从另一侧面来说，也正是因为 HTTP 协议本身是非常简单的，所以才会被应用在各种场景里
   我们登录淘宝的时候首先要登录，我们看到了一个商品点进去，进行了页面跳转/刷新，按照 HTTP 的无状态协议岂不是又要登录一次？

所以为了解决这个问题，Cookie 诞生了，在保留无状态协议这个特征的同时又要解决类似记录状态的矛盾问题。Cookie 技术通过在请求和响应报文中写入 Cookie 信息来控制客户端的状态。
Cookie 会根据从服务器端发送的响应报文内的一个叫做 Set-Cookie 的首部字段信息，通知客户端保存 Cookie。当下次客户端再往该服务器发送请求时，客户端会自动在请求报文中加入 Cookie 值后发送出去。
服务器端发现客户端发送过来的 Cookie 后，会去检查究竟是从哪一个客户端发来的连接请求，然后对比服务器上的记录，最后得到之前的状态信息。

https://zhuanlan.zhihu.com/p/27669892
https://zhuanlan.zhihu.com/p/63061864

cookie 的请求头部除了 set-cookie 的其它我们如果自定义 cookie 可能需要手动发送过去

就是不会自动把 cookie 所有数据设置到 cookie 请求头

首先必须明确一点，存储 cookie 是浏览器提供的功能。cookie 其实是存储在浏览器中的纯文本，浏览器的安装目录下会专门有一个 `cookie 文件夹`来存放各个域下设置的 cookie。

这个叫 cookie 文件夹

当网页要发 http 请求时，`浏览器会先检查是否有相应的cookie，有则自动添加在request header中的cookie字段中`。这些是浏览器自动帮我们做的，而且每一次 http 请求浏览器都会自动帮我们做。这个特点很重要，因为这关系到“什么样的数据适合存储在 cookie 中”

`存储在cookie中的数据，每次都会被浏览器自动放在http请求中`，如`果这些数据并不是每个请求都需要发给服务端的数据，浏览器这设置自动处理无疑增加了网络开销`；但如果这些数据是每个请求都需要发给服务端的数据（比如身份认证信息），浏览器这设置自动处理就大大免去了重复添加操作。所以对于那设置“每次请求都要携带的信息（最典型的就是身份认证信息）”就特别适合放在 cookie 中，其他类型的数据就不适合了。

也就是存在 cookie 文件夹的数据都会被带给服务器吗？

同域条件下，请求会带 cookie 到服务器上 然后还要要求 path

最后就是记住不一定就是 Set-Cookie 和 cookie 请求头一一对应 因为只要同源和 path 一样 就会被带过去 --就是这个规则

❗️❗️❗️ 这里我手动改了 group-goals 的 cookie path 为 '/' 然后就增加了这个 cookie 字段 token 就很好奇 token 在 cookie 数据那里 竟然没有被带过去

还有就是有些请求头不允许设置 不然就报错 比如 cookie 请求头

后端帮我们设置 cookie 我们可能需要这个 cookie 的信息 就解析出来 默认不操作 给后端判断的

httpOnly 的最常见应用场景，即防止网站被 XSS 攻击攻破后，利用 javascript 获取 cookie 中的敏感信息
原来是这个东西搞鬼 httpOnly
请求头 cookie 的 httpOnly 问题

Cookie 的 HttpOnly 属性是 Cookie 的扩展功能，它使 JavaScript 脚本无法获得 Cookie。其主要目的为防止跨站脚本攻击（Cross-sitescripting，XSS）对 Cookie 的信息窃取。
发送指定 HttpOnly 属性的 Cookie 的方法如下所示。
Set-Cookie: name=value; HttpOnly
通过上述设置，通常从 Web 页面内还可以对 Cookie 进行读取操作。但使用 JavaScript 的 document.cookie 就无法读取附加 HttpOnly 属性后的 Cookie 的内容了。因此，也就无法在 XSS 中利用 JavaScript 劫持 Cookie 了。
虽然是独立的扩展功能，但 Internet Explorer 6 SP1 以上版本等当下的主流浏览器都已经支持该扩展了。另外顺带一提，该扩展并非是为了防止 XSS 而开发的。

HttpOnly 不允许脚本去操作 Cookie document.cookie 就无法读取附加 HttpOnly 属性后的 Cookie 的内容了 因此，也就无法在 XSS 中利用 JavaScript 劫持 Cookie 了。

！！！而且我们还不能去手动设置 Cookie 请求头

没看清楚啊
