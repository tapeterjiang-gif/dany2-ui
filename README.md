# Dany 2 UI · 2026-11-08 定稿

Dany 2空气检测仪的界面设计、产品效果与开发交付。502×410px，1.96英寸AMOLED，纯黑背景与圆角适配。

公开介绍：https://tapeterjiang-gif.github.io/dany2-ui/

## 页面

- index.html：监测界面、交互动效、开发组件与字体规格。
- configuration.html：Qingping App与Matter配置流程、状态及异常说明。
- screensaver.html：五行状态列表屏保、产品效果及完整开发交付。
- power.html：开关机界面与产品效果。

## 屏保定稿

依次显示温度、湿度、CO₂、PM2.5、PM10。读数50px，标题10px且水平/垂直居中；独立评级胶囊92×30px、文字16px。胶囊、读数与趋势图下沿对齐。趋势图24根单柱，按等级色绘制，平均线无黑色描边，底部显示HH:mm刻度，绘图区x252–461.98。

## 开发与离线使用

直接打开HTML，或运行 `python3 -m http.server 8000`。页面、字体与素材均可本地使用。

- assets/：当前PNG、产品效果、字体与ZIP下载包。
- assets/components/screensaver/：屏保字体、柱顶与胶囊蒙版、布局JSON、动态读数代码及绘制指南。
- motion-assets/、motion.js：网页演示图层及动效逻辑。
- design/：当前设计页面、配置流程、组件与规格资料。

字体为Roboto Regular/SemiBold及Noto Sans CJK SC，附原始SIL OFL许可。整页PNG为视觉参考；设备文字、时间及趋势图由程序绘制。屏幕不支持触摸，通过顶部触摸条点击和滑动。

监测数据、Matter二维码与配对码为演示，产品效果为照片合成。实机配对信息由设备生成。

GitHub Pages从main分支根目录发布。
