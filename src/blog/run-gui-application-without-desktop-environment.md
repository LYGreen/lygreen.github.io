---
title: linux在不安装桌面环境的情况下运行gui程序
description: linux实现不安装桌面环境，运行gui程序
author: LYGreen
date: 2025-8-10T18:51:43+08:00
updated: 2025-10-16T12:06:18+08:00
category: Linux
tags: ['Arch Linux']
---
在linux做开发的时候，可能会需要开发gui程序，比如opencv，但是桌面环境太大了，会比较占资源，所以这里会尝试不安装桌面环境来启动gui程序

## 安装所需要的包
这里用的是Arch Linux，所以用的是pacman包管理工具

### 安装xorg相关包
xorg是运行gui程序所需要的包
```bash
sudo pacman -Sy xorg-server xorg-apps xorg-xinit xorg-xclock xorg-xeyes xorg-xcalc
```
* xorg-server：X 服务器核心
* xorg-apps：Xorg 工具集
* xorg-xinit：启动 X 服务器的工具（startx）
* xorg-xclock, xorg-xeyes, xorg-xcalc: xorg 示例程序

### 安装窗口管理器
窗口管理器（Window Manager, WM）是负责管理窗口外观和行为的一个软件层，此处使用i3窗口管理器
```bash
sudo pacman -Sy i3
```

## 配置启动脚本
1. 创建文件 ```~/.xinitrc``` ，这个文件是运行startx命令的时候所需要执行的脚本
```bash
vim ~/.xinitrc
```
2. 在里面写入需要执行的命令：```exec i3```，保存

## 启动xorg并运行gui程序

### 启动xorg
1. 此处终端为tty1
```bash
startx
```
2. 启动之后的界面是这样，一片黑，什么也没有，但是已经成功启动xorg了
![](/img-run-gui-application-without-desktop-environment/img0.png)

### 运行gui程序
1. 切换到终端tty2，按住 ```Ctrl + Alt + F2``` 进行切换，运行命令
```bash
export DISPLAY=:0 # 指定显示号，这个显示号也就是 tty1 终端那边的显示
xclock
```
2. 切换到终端tty1，```Ctrl + Alt + F1``` ，此时会看到一个gui程序显示了出来
![](/img-run-gui-application-without-desktop-environment/img1.png)
::: info
在opencv开发过程中能正常显示gui，默认不是全屏，窗口可以进行拖动
:::

## X11转发
1. 编辑文件 ```/etc/ssh/sshd_config``` ，开启x11转发，重启服务
```bash
sudo vim /etc/ssh/sshd_config # 把 '#X11Forwarding yes' 的 '#' 去掉，保存
systemctl restart sshd # 重启 sshd 服务
```
2. 本机下载ssh客户端和xserver，这里使用的是[PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)和[VcXsrv](https://vcxsrv.com/)
3. 打开vcxsrv，会在后台运行一个x服务器(设置全部默认即可)  
![](/img-run-gui-application-without-desktop-environment/img2.png)
4. 运行putty，打开x11转发  
![](/img-run-gui-application-without-desktop-environment/img3.png)
5. 输入ip连接到arch linux
6. 接下来运行xclock，可以看到有小窗口弹了出来
```bash
xclock
```
![](/img-run-gui-application-without-desktop-environment/img4.png)

### 参考
* [ChatGPT](https://chatgpt.com/)
* [安装 Linux 图形界面](https://yuweizzz.github.io/post/install_gui_in_linux/)
