#### 附件查看插件介绍
```
本插件，依赖jquery，layer（平台已经引入）
```
#### jsp页面引入js
```
<script type="text/javascript"  src="<common:webRoot />/resources/plugin/player/index.js"></script>
```
#### 使用方法
音频播放
```
$.playAudio(url);//直接传入url播放音频
$.playAudio(url, title);//第二个参数是layer顶部名称
```
视频播放
```
$.playVideo(url);//直接传入url播放视频
$.playVideo(url, poster);//第二个参数是视频未播放的背景图
$.playVideo(url, poster, title);//第二个参数是layer顶部名称
```
图片查看（暂时只查看一张）
```
$.showImage(url)//直接传入图片url地址
```