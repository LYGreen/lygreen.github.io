---
title: '机器学习笔记(4): 模型验证'
description: '记录机器学习的学习过程'
author: LYGreen
date: 2026-02-17T19:30:39+08:00
updated: 2026-02-17T19:30:39+08:00
category: 人工智能
tags: ['AI', 'Python', '机器学习']
---

## 模型验证

__模型验证（Model Validation）__ 是通过评估模型在独立数据集上的性能，确保其泛化能力、准确性和稳定性，防止过拟合的核心技术。

### 平均绝对错误

平均绝对错误在数学计算上的公式是：$$MAE = \frac{1}{n} \sum_{i=1}^{n} |y_i - \hat{y}_i|$$

#### 验证见过的数据

这里用 __平均绝对错误（Mean Absolute Error, MAE）__ 进行验证

这里的内容是上一节的后续，这里 Kaggle 已经写好了加载数据集和训练的代码了，我们需要做的是验证数据
```python
# Data Loading Code Hidden Here
import pandas as pd

# Load data
melbourne_file_path = './input/melb_data.csv' # 这里路径我修改了一下
melbourne_data = pd.read_csv(melbourne_file_path) 
# Filter rows with missing price values
filtered_melbourne_data = melbourne_data.dropna(axis=0)
# Choose target and features
y = filtered_melbourne_data.Price
melbourne_features = ['Rooms', 'Bathroom', 'Landsize', 'BuildingArea', 
                        'YearBuilt', 'Lattitude', 'Longtitude']
X = filtered_melbourne_data[melbourne_features]

from sklearn.tree import DecisionTreeRegressor
# Define model
melbourne_model = DecisionTreeRegressor()
# Fit model
melbourne_model.fit(X, y)
```

接下来用平均绝对错误进行验证模型预测出来的值
```python
from sklearn.metrics import mean_absolute_error

predicted_home_prices = melbourne_model.predict(X)
print(mean_absolute_error(y, predicted_home_prices))
```
输出结果：
```
434.71594577146544
```

#### 验证没见过的数据

```python
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
import pandas as pd

melbourne_file_path = './input/melb_data.csv'
melbourne_data = pd.read_csv(melbourne_file_path) 

filtered_melbourne_data = melbourne_data.dropna(axis=0)

y = filtered_melbourne_data.Price
melbourne_features = ['Rooms', 'Bathroom', 'Landsize', 'BuildingArea', 
                        'YearBuilt', 'Lattitude', 'Longtitude']
X = filtered_melbourne_data[melbourne_features]

# 从数据集中分离训练数据和验证数据
train_X, val_X, train_y, val_y = train_test_split(X, y, random_state=1)

melbourne_model = DecisionTreeRegressor()

melbourne_model.fit(train_X, train_y)

val_predictions = melbourne_model.predict(val_X)
print(mean_absolute_error(val_y, val_predictions))

```
输出结果：
```
254442.03163331182
```

可以看到模型在预测自己见过的数据时，会准确一些，但是预测自己没见过的数据时，会变得不准确

## 资源
[Kaggle Course](https://www.kaggle.com/code/dansbecker/model-validation)
