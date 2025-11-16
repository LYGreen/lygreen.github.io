---
title: 连接 MongoDB Atlas 时遇到的 srv 无法解析问题
description: 在连接 MongoDB Atlas 时遇到的 srv 解析问题的解决方法
createdTime: '2025/11/16 16:34:24'
updatedTime: '2025/11/16 17:00:10'
readingTime: 1
category:
  - 数据库
  - 其他问题
tag:
  - MongoDB
  - Node.js
hash: 374dac617ba07303c02b82cb30556d8b652b524c977d3057da304be88279df33
---
# 连接 MongoDB Atlas 出现的 srv 解析问题
## 问题描述
在连接 MongoDB Atlas 的时候，这里有一段官方的代码
![](/img-mongodb-srv-resolution/img0.png)
```javascript
const mongoose = require('mongoose');
const uri = "mongodb+srv://<username>:<db_password>@<server>/?appName=<name>";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);
```
用 nodejs 运行这段程序之后会遇到以下错误
![](/img-mongodb-srv-resolution/img1.png)
这是因为 ```_mongodb._tcp.xxxxx.xxxxx.mongodb.net``` 域名解析错误，找不到 ip 地址

## 解决方法
切换 DNS 服务器即可，在开头加上这两行代码
```javascript
const dns = require('dns');
dns.setServers(["8.8.8.8", "8.8.4.4"]);
```
此时数据库连接成功！
![](/img-mongodb-srv-resolution/img2.png)
