# 粒子背景
用Canvas实现的粒子背景，相连最近的n个粒子会以一条细线连起来。

# 在线演示
http://139.199.14.123/canvasdots

# 动图Demo
![demo](http://pco615n7k.bkt.clouddn.com/canvas%E7%B2%92%E5%AD%90.gif)

# 用法
引入`particle.js`文件
```html
<script src="particle.js"></script>
```

使用`new`构造一个实例，并且传入一个`<canvas>`元素的选择器或者是DOM节点，同时也可以传入一个`config`进行配置。

```html
<script src="particle.js"></script>
<script>
    let config = {
        dotSum: 40, // 粒子数
        dotRadius: 3, // 粒子半径
        dotOpacity: 0.3, // 粒子透明度
        useCahe: true, // 是否使用缓存改善性能
    };

    let app = new DotBackground('#app', config);
    // or
    let canvas = document.querySelector('#app'),
        app = new DotBackground(canvas, config);
</script>
```