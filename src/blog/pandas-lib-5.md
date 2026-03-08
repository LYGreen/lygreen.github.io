---
title: 'Pandas 笔记(5): 数据类型与缺省值'
description: 'Python 数据处理库使用方法'
author: LYGreen
date: 2026-03-08T16:55:27+08:00
updated: 2026-03-08T16:55:27+08:00
category: 数据分析
tags: ['Pandas', 'Python']
---

## 数据类型

### 常见数据类型

|类型|含义|示例|
|---|---|---|
|```int64```|整数|1, 2, 3|
|```float64```|浮点数|3.14|
|```object```|字符串或混合类型|"Alice"|
|```bool```|布尔值|True / False|
|```datetime64[ns]```|时间|2026-01-01|
|```category```|分类变量|Yes / No|

### 数据举例
```python
import numpy as np

df = pd.DataFrame
```
输出：
```
    name  age  score  passed
0  Alice   20   90.5    True
1    Bob   21   88.0   False
```

### 查看所有列类型
使用```.dtypes```查看所有列类型，例如：
```python
df.dtypes
```
输出：
```
name          str
age         int64
score     float64
passed       bool
dtype: object
```

### 查看某一列类型
使用```.column.dtypes```或```['column'].dtypes```查看某一列类型
```python
df.name.dtypes
# 或
df["name"].dtypes
```
输出：
```
str
```

### 查看详细信息
使用```.info()```查看详细信息，例如：
```python
df.info()
```
输出：
```
<class 'pandas.DataFrame'>
RangeIndex: 2 entries, 0 to 1
Data columns (total 4 columns):
 #   Column  Non-Null Count  Dtype
---  ------  --------------  -----
 0   name    2 non-null      str
 1   age     2 non-null      int64
 2   score   2 non-null      float64
 3   passed  2 non-null      bool
dtypes: bool(1), float64(1), int64(1), str(1)
memory usage: 182.0 bytes
None
```

### 类型转换
使用```.astype()```进行类型转换，例如：
```python
df.score.astype("int")
# 或
df["score"].astype("int")
```
输出：
```python
0    90 
1    88
Name: score, dtype: int64
```

## 缺省值

### 表示方式
|表示|含义|
|---|---|
|```NaN```|数值缺失|
|```None```|Python 空值|
|```NaT```|时间类型缺失|

### 示例数据
```python
import numpy as np

df = pd.DataFrame({
    "name": ["Alice", "Bob", None],
    "score": [90, np.nan, 85]
})

print(df)
```
输出：
```
    name  score
0  Alice   90.0
1    Bob    NaN
2    NaN   85.0
```

### 判断某一项是否缺失
使用```.isna()```或```.isnull()```判断某一项数据是否有缺失，例如：
```python
df.isna()
# 或
df.isnull()
```
输出：
```
    name  score
0  False  False
1  False   True
2   True  False
```
> ```.isna()```和```.isnull()```实际上是返回一张和原数据大小一样的表(也就是一个 ```DataFrame```)，然后把有数据的项设置为 True，无数据的项设置为 False
### 判断缺项总行数
```python
df.isna().sum()
```
输出：
```
name     1
score    1
dtype: int64
```

### 缺失项与索引

- 举个例子：```df[df.isnull()]```
```df.isnull()```返回一张只有 True / False 表，把这个表放到 ```df``` 的索引当中，此时遇到 True 项就保留原值，遇到 False 项就改为 ```NaN```，此处由于 True 的项本来原本数据的值就是 ```NaN```，因此这里的结果是一张全是 ```NaN``` 的表
> 可以对照 ```df[df.notnull()]```
```python
df[df.isnull()]
```
输出：
```
  name  score
0  NaN    NaN
1  NaN    NaN
2  NaN    NaN
```

- 另一个例子：```df[pd.isnull(df['name'])]```
```pd.isnull(df['name'])```返回一个只有 True / False 的单列(也就是 ```Series```)，把这个单列放到```df```的索引当中，遇到 True 的时候则保留该行，遇到 False 的时候则去掉该行

```python
df[pd.isnull(df['name'])]
```
输出：
```
  name  score
2  NaN   85.0
```

### 处理缺省值
- 丢掉缺失的行
使用```.dropna()```删除包含缺省值的行，例如：
```python
df.dropna()
```
输出：
```
    name  score
0  Alice   90.0
```

- 填充丢失的行
使用```.fillna()```进行填充丢失的行，例如：
```python
df.fillna()
```
输出：
```
    name  score
0  Alice   90.0
1    Bob    0.0
2      0   85.0
```

- 代替值
使用```.replace()``来代替值，例如：
```python
df.replace(np.nan, 'Unknown')
```
输出：
```
      name    score
0    Alice     90.0
1      Bob  Unknown
2  Unknown     85.0
```

## 资源
- Gemini
- ChatGPT
- [Kaggle Course: Pandas - Data Types and Missing Values](https://www.kaggle.com/code/residentmario/data-types-and-missing-values#Introduction)
