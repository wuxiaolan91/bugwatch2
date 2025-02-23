<template>
  <div class="heatmap-view">
    <h2>网页热力图</h2>
    <p>颜色越深的区域就是用户点击越多的区域</p>
    <div id="heatmapContainer" class="heatmap-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
// import h337 from 'heatmap.js'

onMounted(() => {
  const heatmapContainer = document.getElementById('heatmapContainer')
  if (heatmapContainer) {
    const heatmapInstance = h337.create({
      container: heatmapContainer,
      radius: 20,
      maxOpacity: 0.5,
      minOpacity: 0,
      blur: 0.75
    })

    // Generate random data for demonstration
    const points = []
    const max = 100
    const width = heatmapContainer.offsetWidth
    const height = heatmapContainer.offsetHeight
    const len = 200

    for (let i = 0; i < len; i++) {
      const val = Math.floor(Math.random() * max)
      const point = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        value: val
      }
      points.push(point)
    }

    const data = {
      max: max,
      data: points
    }

    heatmapInstance.setData(data)
  }
})
</script>

<style scoped>
.heatmap-view {
  padding: 20px;
}

.heatmap-container {
  width: 100%;
  height: 600px;
  position: relative;
  background: url('/heatmap-bg.png') no-repeat center center;
  background-size: cover;
}

.heatmap {
  width: 100%;
  height: 600px;
  position: relative;
  background-color: #f0f0f0;
}
</style>