(function (window) {

    function getDistance(x1, y1, x2, y2) {
        let dis = Math.abs((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        return dis;
    }

    function getShortest(arr, x, y) {
        const LINK_DOTS = 5;
        let dis,
            shortest = [],
            hasChange;
        for (let i = 0, length = arr.length; i < length; ++i) {
            hasChange = false;
            dis = getDistance(arr[i].x, arr[i].y, x, y);
            if (shortest.length < LINK_DOTS) {
                shortest.push({
                    index: i,
                    dis
                });
                hasChange = true;
            } else {
                for (let j = shortest.length - 1; j >= 0; --j) {
                    if (dis < shortest[j].dis) {
                        shortest.splice(j, 1, {
                            index: i,
                            dis
                        });
                        hasChange = true;
                        break;
                    }
                }
            }
            if (hasChange) {
                shortest.sort(function (pre, next) {
                    return pre.dis < next.dis ? -1 : 1;
                });
            }
        }

        return shortest;
    }

    class Dot {
        constructor(radius, x, y, useCache, opacticy, container, idx) {
            this.x = x || Math.random() * 1000;
            this.y = y || Math.random() * 600;
            this.radius = radius || 2;
            this.opacticy = opacticy || 0.5;
            this.color = 'rgba(0,0,0,' + this.opacticy + ')';
            this.container = container || null;
            this.idx = idx || -1;
            this.angle = Math.random() * Math.PI * 2;

            this.CANVAS_HEIGHT = document.documentElement.clientHeight || document.body.clientHeight,
            this.CANVAS_WIDTH = document.documentElement.clientWidth || document.body.clientWidth;

            this.cacheCanvas = document.createElement('canvas');
            this.cacheCtx = this.cacheCanvas.getContext('2d');
            this.cacheCanvas.width = this.radius * 2;
            this.cacheCanvas.height = this.radius * 2;
            (this.useCache = useCache) && this.setCache();
        }

        setCache() {
            this.cacheCtx.beginPath();
            this.cacheCtx.arc(this.radius, this.radius, this.radius, 0, 2 * Math.PI, false);
            this.cacheCtx.fillStyle = this.color;
            this.cacheCtx.fill();
        }

        draw(ctx) {
            if (this.useCache) {
                ctx.drawImage(this.cacheCanvas, this.x - this.radius, this.y - this.radius);
                return;
            }

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        link(ctx) {
            // 连接点的数目
            if (!this.container) return;
            const shortest = getShortest(this.container, this.x, this.y);
            for (let i = 0,length = shortest.length; i < length; ++i) {
                ctx.beginPath();
                ctx.moveTo(this.container[shortest[i].index].x, this.container[shortest[i].index].y);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        move(ctx) {
            let deltaX = Math.cos(this.angle / 2 * Math.PI * 360),
                deltaY = Math.sin(this.angle / 2 * Math.PI * 360);

            this.x = this.x + deltaX * 1;
            this.y = this.y + deltaY * 1;

            if (this.x < 0 || this.y < 0 || this.x > this.CANVAS_WIDTH || this.y > this.CANVAS_HEIGHT) {
                this.angle = this.angle + Math.PI / 2;
            }

            this.link(ctx);
            this.draw(ctx);
        }
    }

    class DotBackground {
        constructor(selector, config) {

            if(typeof selector === 'string') {
                this.canvas = document.querySelector(selector);
                if(this.canvas.tagName.toLowerCase() !== 'canvas') {
                    throw new Error('指定元素不是canvas元素');
                }
            } else if(typeof selector === 'object') {
                if(selector.tagName.toLowerCase() !== 'canvas') {
                    throw new Error('指定元素不是canvas元素');
                } else {
                    this.canvas = selector;
                }
            }

            this.ctx = this.canvas.getContext('2d');

            this.CANVAS_HEIGHT = document.documentElement.clientHeight || document.body.clientHeight,
            this.CANVAS_WIDTH = document.documentElement.clientWidth || document.body.clientWidth;

            this.canvas.height = this.CANVAS_HEIGHT;
            this.canvas.width = this.CANVAS_WIDTH;

            this.config = {
                dotSum: 40,
                dotRadius: 3,
                dotOpacity: 0.3,
                useCahe: true,
            };

            if(typeof config === 'object') {
                for(let key in config) {
                    this.config[key] = config[key]
                }
            }

            this.container = [];
            this.init();
        }

        init() {
            let config = this.config,
                container = this.container;
            for (let i = 0; i < config.dotSum; ++i) {
                container[i] = new Dot(
                    config.dotRadius,
                    Math.random() * this.CANVAS_WIDTH,
                    Math.random() * this.CANVAS_HEIGHT,
                    config.useCahe,
                    config.dotOpacity,
                    container,
                    i
                );
            }

            this.animate();
        }

        animate() {

            let ctx = this.ctx,
                container = this.container,
                that = this;

            animation();

            function animation() {
                ctx.clearRect(0, 0, that.CANVAS_WIDTH, that.CANVAS_WIDTH);
                container.forEach(dot => {
                    dot.move(ctx);
                });
                window.requestAnimationFrame(animation);
            }
        }
    }

    window.DotBackground = DotBackground;

})(window);