<template>
    <div id="pink-flower">
        <canvas id="canvas"></canvas>
    </div>
</template>

<script lang="ts" setup>

import { onMounted, onUnmounted } from 'vue';

class Flower {
    private x: number;
    private y: number;
    private dx: number;
    private dy: number;

    constructor(x: number, y: number, dx: number = 0, dy: number = 0) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }

    public getPosition(): {x: number, y: number} {
        return {x: this.x, y: this.y};
    }

    public setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getVelocity(): {dx: number, dy: number} {
        return {dx: this.dx, dy: this.dy};
    }

    public setVelocity(dx: number, dy: number) {
        this.dx = dx;
        this.dy = dy;
    }

    public process(delta: number) {
        this.x += this.dx * delta;
        this.y += this.dy * delta;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const petalCount = 5;
        const offset = 4;

        for (let i = 0; i < petalCount; i++) {
            ctx.save();
            ctx.fillStyle = 'pink';
            ctx.beginPath();
            let angle = (Math.PI * 2 / petalCount) * i;
            let offsetX = Math.cos(angle) * offset;
            let offsetY = Math.sin(angle) * offset;
            ctx.arc(this.x + offsetX, this.y + offsetY, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

const maxCount = 25;
const minSpeed = 150;
const maxSpeed = 350;
const flowers: Array<Flower> = [];
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let lastTime: number = 0;

onMounted(() => {
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.addEventListener("contextmenu", canvasPreventContextmenu);
    window.addEventListener("resize", canvasResize);
    canvasResize();
    initialization();
    requestAnimationFrame(loop);
});

onUnmounted(() => {
    window.removeEventListener("resize", canvasResize);
    canvas.removeEventListener("contextmenu", canvasPreventContextmenu);
});

function canvasPreventContextmenu(e: MouseEvent) {
    e => e.preventDefault();
}

function canvasResize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function initialization() {
    for (let i = 0; i < maxCount; i++) {
        flowers.push(new Flower(
            Math.random() * canvas.clientWidth,
            Math.random() * canvas.clientHeight,
            (Math.random() * (maxSpeed - minSpeed) + minSpeed) * -1,
            Math.random() * (maxSpeed - minSpeed) + minSpeed
        ));
    }
}

function loop(now: number) {

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    process((now - lastTime) / 1000);
    draw();
    lastTime = now;

    requestAnimationFrame(loop);
}

function process(delta: number) {
    for (let i = 0; i < flowers.length; i++) {
        let {x, y} = flowers[i].getPosition();
        flowers[i].process(delta);
        if (x < 0 || x > canvas.clientWidth || y < 0 || y > canvas.clientHeight) {
            flowers[i] = createFlower();
        }
    }
}

function draw() {
    // const dpr = window.devicePixelRatio || 1;
    // ctx.shadowColor = 'rgba(0, 0, 0, 0.04)';
    // ctx.shadowOffsetX = 4 * dpr;
    // ctx.shadowOffsetY = 4 * dpr;
    // ctx.shadowBlur = 8 * dpr;
    
    for (let i = 0; i < flowers.length; i++) {
        flowers[i].draw(ctx);
    }
}

function createFlower() {
    let flower = new Flower(
        Math.random() * canvas.clientWidth,
        Math.random() * canvas.clientHeight,
        (Math.random() * (maxSpeed - minSpeed) + minSpeed) * -1,
        Math.random() * (maxSpeed - minSpeed) + minSpeed
    );
    
    let num = Math.random();
    let {x, y} = flower.getPosition();
    if (num < 0.5) {
        flower.setPosition(canvas.clientWidth, y);
    } else {
        flower.setPosition(x, 0);
    }

    return flower;
}

</script>

<style lang="scss" scoped>

#canvas {
    position: fixed;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    z-index: -100;
    pointer-events: none;
}

</style>
