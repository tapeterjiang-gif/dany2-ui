# Dany 2 UI 定版 · 2026-11-02

- 屏幕：502×410 px，1.96英寸AMOLED；纯黑底与圆角适配。
- 六个功能页面：温度、相对湿度、CO₂、PM2.5/PM10、Qingping添加、Matter添加；另含开关机与屏保设计。
- 字体：Roboto Regular 400、Roboto SemiBold 600、Noto Sans CJK SC Regular 400；附原始SIL OFL许可与版本来源。
- PM参考图：999 / 999 μg/m³，极差档。两项量程0–999，按Roboto实际字宽动态排版；短组合108px，2+3/3+2位99px，3+3位84px。
- 评级指示器：温度7档、相对湿度3档、CO₂ 3档、PM 6档；玻璃高光已减弱，配套完整状态及独立底色/高光。
- 状态栏图标：Wi-Fi四档、蓝牙一个、空电池；电量填充与时间由程序绘制。
- 趋势图：程序绘制，仅交付单柱与双柱柱顶圆角、坐标与指南；文字和数字也由程序绘制。
- 主介绍页直接展示切图、坐标、字体和接入指南，附离线下载与交互动效。按钮切换800ms；手势吸附220–300ms。
- 产品效果：六个功能页面及开关机状态的正视、斜视，共16张。

监测数据为设计示例；Matter二维码和配对码为演示，实机应由设备生成。Qingping二维码为App下载链接。产品效果为照片合成参考。

当前公开页面：https://tapeterjiang-gif.github.io/dany2-ui/

## 开发与离线使用

直接打开 index.html，或运行 python3 -m http.server 8000。页面、字体与素材均可本地使用。

- index.html：设计说明、交互演示、组件预览和开发指南。
- motion.js：整页滑动与分层动效。
- pm-text-layout.js / pm-type-demo.js：PM动态测宽与排版演示。
- assets/：当前PNG、开源字体、许可和下载包。
- motion-assets/：网页动效所用透明图层，不作为设备端趋势图交付。
- design/：当前页面参考、开发组件和规格资料。

字体许可见 assets/fonts/Roboto-OFL.txt 与 assets/fonts/NotoSansCJKsc-LICENSE.txt。发布来源为main分支根目录，GitHub Pages自动部署。
