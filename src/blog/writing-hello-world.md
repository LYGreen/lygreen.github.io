---
title: 各类编程语言编写 Hello World 教程
description: 编写各类编程语言的 Hello World
author: LYGreen
date: 2025-7-5T12:55:23+08:00
updated: 2025-7-13T22:23:30+08:00
category: 编程语言
tags: ['C', 'C 语言']
---

## Hello World
代码由 ```ChatGPT``` 编写

### 脚本语言
#### Python
```python
print('Hello World!')
```

#### JavaScript
```javascript
console.log("Hello World!");
```

#### Bash
```bash
echo "Hello, World!"
```

#### PowerShell
```powershell
White-Output "Hello, World!"
```

### 系统编程语言
#### C
```c
#include <stdio.h>

int main() {
    printf("Hello World!\n");
    return 0;
}
```
#### C++
```cpp
#include <iostream>

int main() {
    std::cout << "Hello World!" << std::endl;
    return 0;
}
```

#### Rust
```rust
fn main() {
    println!("Hello, World!");
}
```

#### Go
```go
package main
import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

#### Zig
```zig
const std = @import("std");

pub fn main() void {
    std.debug.print("Hello, World!\n", .{});
}
```

### 面向对象语言
#### Java
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

#### C#
```csharp
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}
```

#### Kotlin
```kotlin
fun main() {
    println("Hello, World!")
}
```

#### Swift
```swift
print("Hello, World!")
```

### 函数式语言
#### Haskell
```haskell
main = putStrLn "Hello, World!"
```

#### Lisp
```lisp
(format t "Hello, World!~%")
```

#### OCaml
```ocaml
print_endline "Hello, World!"
```

### Web & 标记语言
#### HTML + JavaScript
```html
<!DOCTYPE html>
<html>
<body>
  <script>
    document.write("Hello, World!");
  </script>
</body>
</html>
```

#### PHP
```php
<?php
echo "Hello, World!";
?>
```

#### TypeScript
```typescript
console.log("Hello, World!");
```

#### JSX / React
```jsx
function App() {
  return <h1>Hello, World!</h1>;
}
```

### 数据科学与教学语言
#### R
```r
print("Hello, World!")
```

#### Julia
```julia
println("Hello, World!")
```

#### MATLAB
```matlab
disp('Hello, World!')
```

### 低层语言
#### 汇编（x86 NASM, Linux）
```asm
section .data
    msg db "Hello, World!", 0xA
    len equ $ - msg

section .text
    global _start

_start:
    mov eax, 4          ; sys_write
    mov ebx, 1          ; stdout
    mov ecx, msg
    mov edx, len
    int 0x80

    mov eax, 1          ; sys_exit
    xor ebx, ebx
    int 0x80
```

#### 虚拟机 / 字节码语言
#### Lua
```lua
print("Hello, World!")
```

#### Dart
```dart
void main() {
  print('Hello, World!');
}
```

### 数据描述语言
#### YAML（非代码，仅描述）
```yaml
message: "Hello, World!"
```

#### JSON
```json
{
  "message": "Hello, World!"
}
```

## 结束语
如果你希望我为某种特定语言或环境写 Hello World，也可以告诉我，我会补上！
