---
title: '机器学习笔记(2): 决策树'
description: '记录机器学习的学习过程'
author: LYGreen
date: 2026-02-15T15:31:12+08:00
updated: 2026-02-15T15:31:12+08:00
category: 人工智能
tags: ['AI', '人工智能', '机器学习']
---

## 决策树
__决策树（Decision Tree）__ 是一种模仿人类决策过程的算法。从顶部的“根节点”开始，根据数据的特征不断进行“是非题”式的判断，最后在“叶子节点”得到结论。


### 结构
决策树由 3 个部分组成：
- __根节点 (Root Node)__： 包含全部样本的起点，是第一个分裂的特征。
- __内部节点 (Internal Nodes)__： 表示一个特征或属性的测试（例如：“温度是否高于 30°C？”）。
- __叶子节点 (Leaf Nodes)__： 最终的输出结果（类别或数值），不再进一步分裂。

![](/img-machine-learning-2/img0.png)
![](/img-machine-learning-2/img1.png)

### 构建
构建决策树的核心是 __选择最优特征进行划分__ 。常用指标有：
- __信息增益 (Information Gain)__： 基于熵（Entropy）。熵越高越混乱，算法的目标是降低熵。
- __基尼系数 (Gini Impurity)__： 衡量随机抽取两个样本类别不一致的概率。基尼系数越小，样本纯度越高（常用于 CART 算法）。
- __均方误差 (MSE)__： 常用于回归树，旨在减少预测值与真实值之间的偏差。

> 在决策树和信息论的语境下，熵（Entropy） 是衡量系统“混乱程度”或“不确定性”的度量单位。
> 简单来说：熵越高，信息越杂乱；熵越低，信息越纯净。

### 优缺点
优点：
- __可视化强__：与神经网络相比，可以一眼看出模型是怎么做决定的。
- __无需复杂处理__： 对缺失值不太敏感，不需要像线性回归那样进行数据标准化。
- __非线性建模__： 能捕捉特征之间复杂的非线性关系。

缺点：
- __过拟合__：会尝试记住每一个细节，如果数太深，在面对新数据的时候表现会很差
- __对噪声敏感__:对噪声数据较为敏感，可能导致模型性能下降。
- __不稳定__：数据的小变化可能导致生成完全不同的树。

## 示例
安装依赖库：
```bash
pip install scikit-learn
```

加载数据集（scikit-learn自带了鸢尾花数据集）：
```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import pandas as pd

# 加载鸢尾花数据集
iris = load_iris()
X = iris.data
y = iris.target

# 将数据集分为训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 打印数据
df = pd.DataFrame(X, columns=iris.feature_names) # 鸢尾花的物理维度
df['target'] = y # 0, 1, 2 代表 3 个品种
print(df.head()) # 打印前五个数据
```

训练：
```python
# 创建决策树分类器
clf = DecisionTreeClassifier()

# 训练模型
clf.fit(X_train, y_train)
```

预测与评估：
```python
# 对测试集进行预测
y_pred = clf.predict(X_test)

# 计算准确率
accuracy = accuracy_score(y_test, y_pred)
print(f"模型准确率: {accuracy:.2f}")
```

输出结果：
```
模型准确率: 1.00
```

## 资源
[菜鸟教程：决策树](https://www.runoob.com/ml/ml-decision-tree.html)  
[kaggle](https://www.kaggle.com/code/dansbecker/basic-data-exploration)
