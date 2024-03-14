<template>
  <div style="">



    <div style="
        position: absolute;
        left: 1550px;
        top: 90px;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        padding: 20px 10px;
        z-index: 10;
      ">
      <div id="echarts4" style="width: 350px;; height: 240px"></div>
    </div>

    <div style="
        position: absolute;
        left: 1550px;
        top: 395px;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        padding: 0px 10px;
        z-index: 10;
      ">
      <div id="echarts5" style="width: 350px;; height: 360px"></div>
    </div>

    <div style="
        position: absolute;
        left: 1550px;
        top: 780px;
        background: rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        padding: 10px 20px;
        z-index: 10;
      ">
      <div id="echarts6" style="width:350px; height: 270px"></div>
    </div>

  </div>
</template>

<script>
import line from "./echarts/line.js";
import ring from "./echarts/ring.js";
import shuizhu from "./echarts/shuizhu.js";
// import shuzhu from "./echarts/shuzhu.js";
// import water from "./echarts/water.js";
// import linedan from "./echarts/linedan.js";
export default {
  name: "echarts",
  mounted: function () {
    // linedan("echarts1");
    // shuzhu("echarts2");

    // water("echarts3");

    line("echarts4");
    ring("echarts5");

    shuizhu("echarts6");

    // 和地球飞线类似图表   可以这这样一个大屏可视化案例，毕竟有些时候需要
    // 只保留一侧，其实很多项目都是类似方式
    // 保留四个，左右各两个，不用铺满类似HUD
    // 把一些图表，放在3D场景中，和某个建筑物关联，比如东方明珠的人流量，查看，是一个曲线图，感觉没问题




  },
};
</script>


<style scoped>
/* .container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: space-between;
} */

/* .item {
  background: #ffffff;
  width: 290px;
  height: 360px;
} */


</style>
