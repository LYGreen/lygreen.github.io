---
title: '机器学习笔记(5): 过拟合与欠拟合'
description: '记录机器学习的学习过程'
author: LYGreen
date: 2026-02-23T19:50:57+08:00
updated: 2026-02-23T19:50:57+08:00
category: 人工智能
tags: ['AI', 'Python', '机器学习']
---

## 过拟合与欠拟合

### 欠拟合

__欠拟合（Underfitting）__: 模型在训练的数据集上表现得就很差，没有捕捉到数据的基本规律。

产生的原因：
- 模型太简单
- 特征太少
- 训练的时间不够

在决策树中可能是因为树的深度过少

### 过拟合

__过拟合（Overfitting）__：模型在训练的数据集上表现得很完美，但是遇到新数据的时候表现得却很差。

产生的原因：
- 模型太复杂
- 数据量太小，模型记住了噪声
- 学习速率过高，训练迭代次数过多

在决策树中可能是因为树的深度过深

## 实例（Kaggle 课程）
```python
from sklearn.metrics import mean_absolute_error
from sklearn.tree import DecisionTreeRegressor

def get_mae(max_leaf_nodes, train_X, val_X, train_y, val_y):
    model = DecisionTreeRegressor(max_leaf_nodes=max_leaf_nodes, random_state=0)
    model.fit(train_X, train_y)
    preds_val = model.predict(val_X)
    mae = mean_absolute_error(val_y, preds_val)
    return(mae)

# compare MAE with differing values of max_leaf_nodes
for max_leaf_nodes in [5, 50, 500, 5000]:
    my_mae = get_mae(max_leaf_nodes, train_X, val_X, train_y, val_y)
    print("Max leaf nodes: %d  \t\t Mean Absolute Error:  %d" %(max_leaf_nodes, my_mae))
```
输出：
```
Max leaf nodes: 5                Mean Absolute Error:  347380
Max leaf nodes: 50               Mean Absolute Error:  258171
Max leaf nodes: 500              Mean Absolute Error:  243495
Max leaf nodes: 5000             Mean Absolute Error:  255575
```
这里可以看到，叶子节点为 500 时，平均绝对错误最小

## 资源
ChatGPT
Gemini
[Kaggle Course](https://www.kaggle.com/code/dansbecker/underfitting-and-overfitting)
