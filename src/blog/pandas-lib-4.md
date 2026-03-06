---
title: 'Pandas 笔记(4): 分组与排序'
description: 'Python 数据处理库使用方法'
author: LYGreen
date: 2026-03-06T07:57:28+08:00
updated: 2026-03-06T07:57:28+08:00
category: 数据分析
tags: ['Pandas', 'Python']
---

## Pandas 分组
分组用于 __按照某个列的值把数据分成多组，然后对每组做统计__。分组的核心思想是 __拆分 (Split)__、__应用 (Apply)__ 和 __合并 (Combine)__。

### 基本用法
- 单列分组：```df.groupby('column').func()``` 或 ```df.groupby('column')['apply_column'].func()```
- 多列分组：```df.groupby(['col1', 'col2']).func()``` 或 ```df.groupby(['col1', 'col2'])['apply_column'].func()```

### 示例代码

#### 数据
```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Alice","Alice","Bob","Bob","Cindy","Cindy"],
    "class": ["1","1","1","1","2","2"],
    "subject": ["Math","English","Math","English","Math","English"],
    "score": [90,85,88,80,92,87]
})
```
输出：
```
    name class  subject  score
0  Alice     1     Math     90
1  Alice     1  English     85
2    Bob     1     Math     88
3    Bob     1  English     80
4  Cindy     2     Math     92
5  Cindy     2  English     87
```
#### 计算每组平均值
```python
df.groupby("class")["score"].mean()
```
输出：
```
class
1    85.75
2    89.50
Name: score, dtype: float64
```

#### 计算每组数量
```python
df.groupby("class").count()

df.groupby("class").size()
```
输出：
```
       name  subject  score
class
1         4        4      4
2         2        2      2

class
1    4
2    2
dtype: int64
```

#### 多列分组
```python
df.groupby(["name", "class"])["score"].sum()
```
输出：
```
name   class
Alice  1        175
Bob    1        168
Cindy  2        179
Name: score, dtype: int64
```

#### 多种统计
```python
df.groupby(["class", "subject"])["score"].agg(["mean", "max", "min"])
```
输出：
```
               mean  max  min
class subject
1     English  82.5   85   80
      Math     89.0   90   88
2     English  87.0   87   87
      Math     92.0   92   92
```

#### 自定义统计函数
```python
df.groupby(["class", "subject"])["score"].agg(lambda x: x.max() - x.min())
```
输出：
```
class  subject
1      English    5
       Math       2
2      English    0
       Math       0
Name: score, dtype: int64
```

## Pandas 排序

### 基本用法
Pandas 主要提供两种排序方式：按 __索引__ 排序和按 __数值__ 排序。

- 按索引排序：```.sort_values("column")```
- 按数值排序：```.sort_index()```

> 参数：```ascending=False``` 代表降序，```ascending=True``` 代表升序(默认)

### 示例代码

#### 单列排序
```python
df.sort_values("score")
```
输出：
```
    name class  subject  score
3    Bob     1  English     80
1  Alice     1  English     85
5  Cindy     2  English     87
2    Bob     1     Math     88
0  Alice     1     Math     90
4  Cindy     2     Math     92
```

#### 降序排序
```python
df.sort_values("score", ascending=False)
```
输出：
```
    name class  subject  score
4  Cindy     2     Math     92
0  Alice     1     Math     90
2    Bob     1     Math     88
5  Cindy     2  English     87
1  Alice     1  English     85
3    Bob     1  English     80
```

#### 多列排序
```python
df.sort_values(["class", "score"])
```
输出：
```
    name class  subject  score
3    Bob     1  English     80
1  Alice     1  English     85
2    Bob     1     Math     88
0  Alice     1     Math     90
5  Cindy     2  English     87
4  Cindy     2     Math     92
```

## 分组与排序组合

```python
df.sort_values("score", ascending=False).groupby("class").head(1)
```
输出：
```
    name class subject  score
4  Cindy     2    Math     92
0  Alice     1    Math     90
2    Bob     1    Math     88
```
> 这里是先排序，再进行分组，可以换成 ```.head()``` 看步骤，例如：
> 1. 先排序
> ```df.sort_values("score", ascending=False).head()```
> 输出：
> ```
>     name class  subject  score
> 4  Cindy     2     Math     92
> 0  Alice     1     Math     90
> 2    Bob     1     Math     88
> 5  Cindy     2  English     87
> 1  Alice     1  English     85
> ```
> 
> 2. 再分组
> ```df.sort_values("score", ascending=False).groupby("name").> head()```
> 输出：
> ```
>     name class  subject  score
> 4  Cindy     2     Math     92
> 0  Alice     1     Math     90
> 2    Bob     1     Math     88
> 5  Cindy     2  English     87
> 1  Alice     1  English     85
> 3    Bob     1  English     80
> ```
> 
> 3. 只输出第一组
> ```df.sort_values("score", ascending=False).groupby("name").> head(1)```
> 输出：
> ```
>     name class subject  score
> 4  Cindy     2    Math     92
> 0  Alice     1    Math     90
> 2    Bob     1    Math     88
> ```

## 资源
- Gemini
- ChatGPT
- [Kaggle Course](https://www.kaggle.com/code/residentmario/grouping-and-sorting)
