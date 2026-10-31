# Dany 2 UI

Dany 2 空气检测仪的界面设计与产品效果展示。

**在线说明页：** https://tapeterjiang-gif.github.io/dany2-ui/

## 内容

- 温度、相对湿度、CO₂、PM2.5 / PM10，以及 Qingping、Matter 添加设备六套界面
- 正视与斜视共十二张产品效果图，可点击放大
- 502 × 410 原尺寸、4 倍高清 PNG 与透明切图
- 使用正式 Qingping Wordmark 的开机、关机状态页
- 使用正式 Q 品牌标识的 PNG favicon
- 适配手机的介绍页面，以及 PNG 资源下载

所有图像交付资源为 PNG；页面中的读数、评级与历史数据为设计示例。温度冷热感按 PMV 示意，不能仅凭温度推导。

## 文件结构

- index.html：离线及在线介绍页面，内含样式与交互
- assets/：页面图片、产品效果图和下载包
- design/：六套日常界面、开关机状态页的 PNG 定稿与切图
- .nojekyll：纯静态页面标记

## 本地浏览

直接打开 index.html，或在本目录运行 python3 -m http.server 8000，然后访问 http://localhost:8000/ 。页面不依赖外部字体、脚本或接口。

## GitHub Pages

发布来源：main 分支根目录。推送页面及资源更新后，由 GitHub Pages 自动发布。

评级依据参考：[环境评级指南](https://tapeterjiang-gif.github.io/environment_rating/)。

Matter 配置页的二维码与配对码为演示内容；Qingping 页两个二维码用于 App 下载。品牌素材参考：https://tapeterjiang-gif.github.io/qingping-brand/ 。
