---
title: 连接 MongoDB Atlas 时遇到的 srv 无法解析问题
description: 在连接 MongoDB Atlas 时遇到的 srv 解析问题的解决方法
author: LYGreen
date: 2025-11-16T16:34:24+08:00
updated: 2025-11-16T17:00:10+08:00
category: 数据库
tags: ['MongoDB', 'Node.js']
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
