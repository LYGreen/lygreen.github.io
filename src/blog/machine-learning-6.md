---
title: '机器学习笔记(6): 随机森林'
description: '记录机器学习的学习过程'
author: LYGreen
date: 2026-02-23T21:31:32+08:00
updated: 2026-02-23T21:31:32+08:00
category: 人工智能
tags: ['AI', 'Python', '机器学习']
---

## 随机森林

__随机森林（Random Forest）__ 是一种 __集成学习（Ensemble Learning）__ 算法。通过构建许多不相关的决策树，汇总结果，从而得到一个更准确、更稳健的模型。

### 工作方式

__随机采样数据__：从原始训练集中有放回地随机抽取样本。每棵树看到的数据都略有不同，有的树可能重点看了某些样本，而有的树没见过它们。
- 有放回抽样
- 每棵树用不同的数据子集

__随机选择特征__：在决策树分裂节点时，不是从所有特征中选最好的，而是先随机挑几个特征，再从这几个里面选最好的。这防止了某些强势特征主导所有决策树。
- 不用所有特征
- 只随机选一部分特征

> 这里的特征其实是数据集的列

__投票或平均__：
- 分类问题 -> 多数投票
- 回归问题 -> 结果取平均

随机森林相对于决策树来说解决了决策树容易过拟合的问题

## 优缺点

__优点__：
- 不容易过拟合
- 适合高维数据

__缺点__：
- 训练慢
- 模型体积大
- 计算开销稍大，内存占用稍大

## 数学本质
随机森林本质是在做：
$$ \text{Final Prediction} = \frac{1}{T} \sum_{t=1}^{T} h_t(x) $$
其中：
- $ T $ = 树的数量
- $ h_t(x) $ = 第 t 棵树的预测

## 实例（Kaggle课程代码）
加载数据集：
```python
import pandas as pd
    
# 加载数据
melbourne_file_path = './input/melb_data.csv' # 改了一下路径
melbourne_data = pd.read_csv(melbourne_file_path) 
# 过滤掉有缺失项的行
melbourne_data = melbourne_data.dropna(axis=0)
# 选择目标和特征
y = melbourne_data.Price
melbourne_features = ['Rooms', 'Bathroom', 'Landsize', 'BuildingArea', 
                        'YearBuilt', 'Lattitude', 'Longtitude']
X = melbourne_data[melbourne_features]

from sklearn.model_selection import train_test_split

# 用 train_test_split 函数讲数据集分成用于训练的和用于验证的
# random_state 参数保证每次运行时候训练的数据集和验证的数据集是一样的
train_X, val_X, train_y, val_y = train_test_split(X, y, random_state=0)
```
训练：
```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

forest_model = RandomForestRegressor(random_state=1)
forest_model.fit(train_X, train_y)
melb_preds = forest_model.predict(val_X)
print(mean_absolute_error(val_y, melb_preds))
```
输出：
```
191669.7536453626
```
对比 _机器学习笔记(4): 模型验证_ _验证没见过的数据_ 中的数据 ```254442.03163331182```，可以看到平均绝对错误小了很多

## 资源
ChatGPT
Gemini
[Kaggle Course](https://www.kaggle.com/code/dansbecker/random-forests)
