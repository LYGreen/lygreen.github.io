---
title: 'Pandas 笔记(3): 统计函数与映射操作'
description: 'Python 数据处理库使用方法'
author: LYGreen
date: 2026-03-03T16:20:46+08:00
updated: 2026-03-06T09:34:01+08:00
category: 数据分析
tags: ['Pandas', 'Python']
---

## 统计函数

常见的统计函数有：
|函数|作用|
|---|---|
|```.sum()```|求和|
|```.mean()```|平均值|
|```.median()```|中位数|
|```.max()```|最大值|
|```.min()```|最小值|
|```.std()```|标准差|
|```.count()```|非空个数|
|```.unique()```|去重值|
|```.value_counts()```|统计频次|

例如：
```python
import pandas as pd

ds = pd.DataFrame({
    "a": [5, 3, 6],
    "b": [9, 5, 6],
    "c": [1, 8, 0],
    "d": [2, 6, 1],
    "e": [7, 1, 3],
})

print(ds.mean())
```
输出：
```
a    4.666667
b    6.666667
c    3.000000
d    3.000000
e    3.666667
dtype: float64
```

> 统计函数也可以用在具体某一列，例如：```ds.a.sum()```，输出：```14```

## 描述
使用```.describe()```可以查看常见的统计信息，例如：
```python
ds = pd.DataFrame({
    "a": [5, 3, 6],
    "b": [9, 5, 6],
    "c": [1, 8, 0],
    "d": [2, 6, 1],
    "e": [7, 1, 3],
})

print(ds.describe())
```
输出：
```
              a         b         c         d         e
count  3.000000  3.000000  3.000000  3.000000  3.000000
mean   4.666667  6.666667  3.000000  3.000000  3.666667
std    1.527525  2.081666  4.358899  2.645751  3.055050
min    3.000000  5.000000  0.000000  1.000000  1.000000
25%    4.000000  5.500000  0.500000  1.500000  2.000000
50%    5.000000  6.000000  1.000000  2.000000  3.000000
75%    5.500000  7.500000  4.500000  4.000000  5.000000
max    6.000000  9.000000  8.000000  6.000000  7.000000
```
> 这里的```25%, 50%, 75%```是分位数（Quantiles）

## 映射操作

### map()
```.map()```修改单元格，只能用于 Series，代码示例：
```python
s = pd.Series([1, 2, 3])
s = s.map(lambda x: x * 10)
print(s)
```
输出：
```
0    10
1    20
2    30
dtype: int64
```
也可以用字典映射，例如：
```python
s = pd.Series(['a', 'b', 'c', 'a', 'c', 'c', 'b'])
s = s.map({
    'a': 1,
    'b': 2,
    'c': 3
})
print(s)
```
输出：
```
0    1
1    2
2    3
3    1
4    3
5    3
6    2
dtype: int64
```

### apply()
```apply()```可用于 Series 和 DataFrame，可以作用于一整行或一整列，也可以作用于每一个元素，例如：
```python
s = pd.DataFrame({
    "a": [5, 3, 6],
    "b": [9, 5, 6],
    "c": [1, 8, 0],
    "d": [2, 6, 1],
    "e": [7, 1, 3],
})
s = s.apply(lambda x: x.max())
print(s)
```
输出：
```
a    6
b    9
c    8
d    6
e    7
dtype: int64
```

## 资源
- Gemini
- ChatGPT
- [Kaggle Course](https://www.kaggle.com/code/residentmario/summary-functions-and-maps)
