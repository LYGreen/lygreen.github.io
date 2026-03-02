---
title: 'Pandas 笔记(2): 索引、选择和赋值'
description: 'Python 数据处理库使用方法'
author: LYGreen
date: 2026-03-02T16:29:08+08:00
updated: 2026-03-02T16:29:08+08:00
category: 数据分析
tags: ['Pandas', 'Python']
---

## 基础索引（Basic Indexing）
- 选择一列，返回一个 Series: ```df['col']```
- 选择多列，返回一个 DataFrame: ```df[['col1', 'col2']]```
- 行切片选取：```df[0:3]```

> 行切片选取不支持单个值，例如 ```df[0]``` 会报错

## 核心访问器（Explict Accessors）

### 基于标签
语法：```df.loc[row_label, column_label]``` 或 ```df.loc[row, column_label]```
示例：
```python
# 选取第 1 行的 'column' 列
df.loc[1, 'column']

# 选取所有行的 'column2' 列
df.loc[:, 'column2']
```

> 使用行号检索时，范围是闭区间，例如 ```df.loc[0:2, 'column']``` 选取的范围是 0, 1, 2 行

### 基于位置
语法：```df.iloc[row_pos, column_pos]```
示例：
```python
# 选取最后一行
df.iloc[-1, :]

# 选中前 5 行，前 3 列
df.iloc[0:5, 0:3]
```

> 使用基于位置选取的时候，范围就是左闭右开区间了

### 布尔索引
- 单条件：```df[df['column'] > 5]```
- 多条件：必须使用位运算符 & (and), | (or), ~ (not)，且每个条件必须加括号。
多条件选取示例：
```python
# 账单 > 20 且是周六的记录
mask = (df['total_bill'] > 20) & (df['day'] == 'Sat')
print(df[mask])
```

### 高级函数索引

- ```.isin()```: 匹配列表中的多个值
```python
# 选取周六和周日的数据
df[df['day'].isin(['Sat', 'Sun'])]
```

- ```.query()```: 使用字符串表达式（类似于 SQL）
```python
# 上个示例转换成字符串表达式
df.query("total_bill > 20 and day == 'Sat'")
```

- ```.at``` 和 ```.iat```: 专门用于获取或修改单个单元格
```python
df.at[0, 'total_bill'] = 21
```

## 赋值

### 全量赋值
```python
# 新增 'test' 列，并且全部赋值为 True
df['test'] = True

# 将 'column' 列全部赋值为 'test'
df['column'] = 'test'
```

### 条件赋值
```python
# 价格超过 40 时等级为 VIP
df.loc[df['total_bill'] > 40, 'level'] = 'VIP'

# 其他的为 Normal
df.loc[df['total_bill'] <= 40, 'level'] = 'Normal'
```

### 逻辑赋值
使用 ```np.where```
```python
df['sex_short'] = np.where(df['sex'] == 'Male', 'M', 'F')

df.loc[df['smoker'] == 'Yes', 'total_bill'] += 5
```

### 字典映射赋值
- 使用 ```map```
```python
# 场景：把星期几翻译成中文
day_map = {'Sun': '周日', 'Sat': '周六', 'Fri': '周五', 'Thur': '周四'}
df['day_cn'] = df['day'].map(day_map)
```

- 使用 ```replace```
```python
# 场景：直接在原列上替换特定值
df['smoker'] = df['smoker'].replace({'Yes': 1, 'No': 0})
```
### 危险：链式赋值

```python
# 错误（可能不生效或报错）：
df[df['total_bill'] > 40]['tip'] = 0 

# 正确（显式定位）：
df.loc[df['total_bill'] > 40, 'tip'] = 0
```

## 示例
示例数据集：[tip.csv](https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv)


