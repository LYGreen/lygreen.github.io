---
title: 'Pandas 笔记(1): 创建与读写'
description: 'Python 数据处理库使用方法'
author: LYGreen
date: 2026-02-13T16:30:46+08:00
updated: 2026-02-24T14:02:23+08:00
category: 数据分析
tags: ['Pandas', 'Python']
---

## 创建数据

### 使用 DataFrame 创建数据

#### 通过字典创建
```python
import pandas as pd

df = pd.DataFrame({
    "name": ["A", "B", "C"],
    "age": [20, 21, 22]
})

print(df)

```
输出：
```
  name  age
0    A   20
1    B   21
2    C   22
```

#### 从列表创建
```python
df = pd.DataFrame([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(df)

```

输出：
```
   0  1  2              
0  1  2  3
1  4  5  6
2  7  8  9
```

### 使用 Series 创建数据

```python
df = pd.Series([1, 2, 3], index=['A', 'B', 'C'], name='numbers')
print(df)
```

输出：
```
A    1
B    2
C    3
Name: numbers, dtype: int64
```

### 使用 numpy 创建数据

```python
import pandas as pd
import numpy as np

arr = np.random.randn(3, 3)
df = pd.DataFrame(arr, columns=["A", "B", "C"])
print(df)
```
输出：
```
          A         B         C
0 -0.132643 -0.430935 -0.051926
1 -1.337611 -1.457143 -0.088758
2  0.135328  1.975916  0.105259
```

### 参数
#### Dataframe
在创建数据的时候可以指定行名和列名，例如：
```python
df = pd.DataFrame([
    [1, 2, 3], 
    [4, 5, 6]
], columns=['a', 'b', 'c'], index=['first', 'second'])
print(df)
```
输出：
```
        a  b  c
first   1  2  3
second  4  5  6
```

#### Series
由于通过 Series 创建的数据只有一列，不能用 columns 参数，用的是 name，例如：
```python
df = pd.Series([1, 2, 3, 4, 5], name='A', index=['a', 'b', 'c', 'd', 'e'])
print(df)
```
输出：
```
a    1
b    2
c    3
d    4
e    5
Name: A, dtype: int64
```

## 读取数据

### 读取 CSV
```python
df = pd.read_csv("data.csv")
```

### 读取 Excel
```python
df = pd.read_excel("data.xlsx")
```

### 读取 JSON

```python
import sqlite3
import pandas as pd

conn = sqlite3.connect('database.db')
df = pd.read_sql("SELECT * FROM table_name", conn)
```

## 写入数据
写入数据的过程中如果不指定 index=False 则会把索引也写入进去

### 写入 CSV
```python
df.to_csv("output.csv", index=False)
```

### 写入 Excel
```python
df.to_excel("output.xlsx", index=False)
```

### 写入 JSON
```python
df.to_json("output.json")
```

### 写入 SQL

```python
df.to_sql("table_name", conn, if_exists="replace")
```

## 资源
ChatGPT
[Kaggle Course](https://www.kaggle.com/code/residentmario/creating-reading-and-writing)
