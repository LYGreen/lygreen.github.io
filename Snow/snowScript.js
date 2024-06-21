document.addEventListener("DOMContentLoaded", () => {
    const snowContainer = document.querySelector(".snow-container");
    const snowCount = 250;

    for (let i = 0; i < snowCount; i++){
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";

        const size = Math.random() * 5 + 5 + 'px'; // 雪花大小
        const positionX = Math.random() * 96 + 2 + 'vw'; // 雪花水平位置
        const duration = Math.random() * 5 + 5 + 's'; // 雪花下落时间
        const delay = Math.random() * -20 + 's'; // 雪花延迟时间

        snowflake.style.width = size;
        snowflake.style.height = size;
        snowflake.style.left = positionX;
        snowflake.style.animationDuration = duration;
        snowflake.style.animationDelay = delay;

        snowContainer.appendChild(snowflake);
    }

});