
表现层状态转换（英语：Representational State Transfer，缩写：REST）
# restful api 

比如一个用户的地址如下所示：
/users/jacksonation
这个地址代表了一个资源,对于这个资源的操作，主要体现在URL上，过去我们对用户的增删改查或许是如下这样设计的URL

```Javascript
POST /user/add?username=jacksontian 
GET /user/remove?username=jacksontian 
POST /user/update?username=jacksontian 
GET /user/get?username=jacksontian
```

操作行为主要体现在行为上，主要使用的请求方法是POST和GET,在restful设计中，它是这样的：

```javascript
POST /user/jacksontian 
DELETE /user/jacksontian PUT /user/jacksontian 
GET /user/jacksontian 
```



在RESTful架构中，每个网址代表一种资源（resource），所以网址中不能有动词，只能有名词，而且所用的名词往往与数据库的表格名对应。一般来说，数据库中的表都是同种记录的"集合"（collection），所以API中的名词也应该使用复数。

```js

200 OK - [GET]：服务器成功返回用户请求的数据，该操作是幂等的（Idempotent）。
201 CREATED - [POST/PUT/PATCH]：用户新建或修改数据成功。
202 Accepted - [*]：表示一个请求已经进入后台排队（异步任务）
204 NO CONTENT - [DELETE]：用户删除数据成功。
400 INVALID REQUEST - [POST/PUT/PATCH]：用户发出的请求有错误，服务器没有进行新建或修改数据的操作，该操作是幂等的。
401 Unauthorized - [*]：表示用户没有权限（令牌、用户名、密码错误）。
403 Forbidden - [*] 表示用户得到授权（与401错误相对），但是访问是被禁止的。
404 NOT FOUND - [*]：用户发出的请求针对的是不存在的记录，服务器没有进行操作，该操作是幂等的。
406 Not Acceptable - [GET]：用户请求的格式不可得（比如用户请求JSON格式，但是只有XML格式）。
410 Gone -[GET]：用户请求的资源被永久删除，且不会再得到的。
422 Unprocesable entity - [POST/PUT/PATCH] 当创建一个对象时，发生一个验证错误。
500 INTERNAL SERVER ERROR - [*]：服务器发生错误，用户将无法判断发出的请求是否成功。

```


区别好前端路由

与后端api  后端路由也是一个api 严格遵守restful-api


URL定位资源，用HTTP动词（GET,POST,DELETE,DETC）描述操作。  -- 精辟



RESTful架构有一些典型的设计误区。

- 最常见的一种设计错误，就是URI包含动词。因为"资源"表示一种实体，所以应该是名词，URI不应该有动词，动词应该放在HTTP协议中。

- 举例来说，某个URI是/posts/show/1，其中show是动词，这个URI就设计错了，正确的写法应该是/posts/1，然后用GET方法表示show。

- 如果某些动作是HTTP动词表示不了的，你就应该把动作做成一种资源。比如网上汇款，从账户1向账户2汇款500元，错误的URI是：



为了让你的URL更小、更简洁。为资源设置一个基本URL，将可选的、复杂的参数用查询字符串表示。


# 我的问题点

避免层级过深的URI
/在url中表达层级，用于按实体关联关系进行对象导航，一般根据id导航。

过深的导航容易导致url膨胀，不易维护，如 GET /zoos/1/areas/3/animals/4，尽量使用查询参数代替路径中的实体导航，如GET /animals?zoo=1&area=3；


像get请求  我们假设数据有很多状态，如果状态都放在url就不好维护了 所以用查询条件吧

相比于get请求 put post patch就不会出现因为它不是查询 所以不会出现那么多的组合情况


7. 错误处理
不要发生了错误但给2xx响应，客户端可能会缓存成功的http请求；
正确设置http状态码，不要自定义；
Response body 提供 1) 错误的代码（日志/问题追查）；2) 错误的描述文本（展示给用户）。
对第三点的实现稍微多说一点：

Java 服务器端一般用异常表示 RESTful API 的错误。API 可能抛出两类异常：业务异常和非业务异常。业务异常由自己的业务代码抛出，表示一个用例的前置条件不满足、业务规则冲突等，比如参数校验不通过、权限校验失败。非业务类异常表示不在预期内的问题，通常由类库、框架抛出，或由于自己的代码逻辑错误导致，比如数据库连接失败、空指针异常、除0错误等等。

业务类异常必须提供2种信息：

如果抛出该类异常，HTTP 响应状态码应该设成什么；
异常的文本描述；
在Controller层使用统一的异常拦截器：

设置 HTTP 响应状态码：对业务类异常，用它指定的 HTTP code；对非业务类异常，统一500；
Response Body 的错误码：异常类名
Response Body 的错误描述：对业务类异常，用它指定的错误文本；对非业务类异常，线上可以统一文案如“服务器端错误，请稍后再试”，开发或测试环境中用异常的 stacktrace，服务器端提供该行为的开关。


RESTful的设计里不存在成功的时候返回`errorCode`:0这样的内容.当然REST只是这是规范,可以根据业务调整