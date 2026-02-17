---
title: '机器学习笔记(3): 第一个模型'
description: '记录机器学习的学习过程'
author: LYGreen
date: 2026-02-17T18:17:22+08:00
updated: 2026-02-17T18:17:22+08:00
category: 人工智能
tags: ['AI', 'Python', '机器学习']
---

## 第一个模型

### 环境
安装好依赖：
```bash
pip install pandas scikit-learn
```

### 准备好数据集
这里有一个[ Kaggle 官方的数据集](https://www.kaggle.com/datasets/dansbecker/melbourne-housing-snapshot)，下载好之后放到```./input/```当中

代码：
```python
import pandas as pd

melbourne_file_path = './input/melb_data.csv'
melbourne_data = pd.read_csv(melbourne_file_path)

print(melbourne_data.columns)

```
输出结果：
```
Index(['Suburb', 'Address', 'Rooms', 'Type', 'Price', 'Method', 'SellerG',
       'Date', 'Distance', 'Postcode', 'Bedroom2', 'Bathroom', 'Car',
       'Landsize', 'BuildingArea', 'YearBuilt', 'CouncilArea', 'Lattitude',
       'Longtitude', 'Regionname', 'Propertycount'],
      dtype='str')
```

这个数据集有很多缺了项的行，通过打印可以看到
```python
print(melbourne_data.isna().any(axis=1))
```
输出：
```
0         True
1        False
2        False
3         True
4        False
         ...
13575     True
13576     True
13577     True
13578     True
13579     True
Length: 13580, dtype: bool
```

在这里暂时不处理缺失的项，直接把有缺省项的扔掉就可以了
```python
melbourne_data = melbourne_data.dropna(axis=0)
```

### 选择特征与预测值

选出输入给模型的列，还有让模型预测的列。这两个的作用是让模型能调整自己内部的参数，让自己能够输出正确的预测值
```python
X = melbourne_data[['Rooms', 'Bathroom', 'Landsize', 'Lattitude', 'Longtitude']]
y = melbourne_data.Price
```

### 构建模型

这里用决策树来构建一个模型

```python
from sklearn.tree import DecisionTreeRegressor

# 创建一个决策树模型
melbourne_model = DecisionTreeRegressor(random_state=1)

# 训练模型
melbourne_model.fit(X, y)
```

### 模型预测
```python
print("输入给模型的值")
print(X.head())
print("预测结果")
print(melbourne_model.predict(X.head()))
```

输出结果：
```
输入给模型的值
   Rooms  Bathroom  Landsize  Lattitude  Longtitude
1      2       1.0     156.0   -37.8079    144.9934
2      3       2.0     134.0   -37.8093    144.9944
4      4       1.0     120.0   -37.8072    144.9941
6      3       2.0     245.0   -37.8024    144.9993
7      2       1.0     256.0   -37.8060    144.9954
预测结果
[1035000. 1465000. 1600000. 1876000. 1636000.]
```

> 实际上数据集应该分成两份，一份用于训练，一份用于测试。但是这里直接用了训练的数据进行预测了，如果预测自己没见过的数据的话，准确率会变低

## 资源
[Kaggle Course](https://www.kaggle.com/code/dansbecker/your-first-machine-learning-model)
