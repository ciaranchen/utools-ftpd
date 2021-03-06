# utools-ftpd

在特定文件夹启动FTP服务器，以实现PC和移动端的数据传输。

敲击`ftpd`进入配置界面。修改ftp服务器配置并启动或停止服务。

此外你还可以拖动文件夹进入utools，并选择`在此文件夹中启动ftp服务器`，来快速地启动一个FTP服务器。

默认用户名密码皆为`ftp`.

在手机上需要安装FTP客户端，用客户端去连接；安卓手机推荐「实简FTP」或「AndFTP」，在iOS手机上推荐「Documents by Readdle」或者「FTP Manager」。

不清楚如何连接FTP的话，在`https://github.com/ciaranchen/utools-ftpd#readme`有一些说明。

<!-- TODO: 服务器启动期间仍可以修改设置。 -->

## 如何连接FTP

本部分适用于第一次使用FTP客户端的人群。

使用FTP需要你的客户端与PC在同一个局域网内，且客户端能访问到主机。

### 安卓手机

推荐使用「AndFTP」。需要填写你主机的IP地址、用户名和端口。

![b264cf0fa98636f6a03443c7b53da16](README.assets/b264cf0fa98636f6a03443c7b53da16.jpg)

连接完成后如图。

![24165cc60eeb1c4184dc340272ab65c](README.assets/24165cc60eeb1c4184dc340272ab65c.jpg)


### iOS手机

推荐使用「Documents by Readdle」。

点击左侧「添加连接」，选择「FTP服务器」。

![6bd69b09c988a3f198c4364ff96a278](README.assets/6bd69b09c988a3f198c4364ff96a278.png)

输入主机、登录用户名、密码。

![489a0117e66a168c731b9c75c390065](README.assets/489a0117e66a168c731b9c75c390065.png)

完成后效果如下图。

![e1eb8052c05208f1a01881763fe169c](README.assets/e1eb8052c05208f1a01881763fe169c.png)

## 版本说明

> v1.0.0

只简单完成了代码。后期还应当：

1. 提供配置界面
2. 更好的选择文件夹方式

> v1.0.1

1. 添加在启动和退出时的showNotification
2. 添加运行后自动隐藏窗口和outPlugin
3. 设置默认用户为ftp。

> v1.0.2

添加描述和使用说明。

> v1.1.0

更改logo。
添加使用界面。

> v1.1.1

添加IP地址设置，不必额外设置PASV模式。
