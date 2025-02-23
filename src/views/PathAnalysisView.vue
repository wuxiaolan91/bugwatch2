<template>
  <div class="path-analysis-view">
    <h2>业务关键路径转化流失分析</h2>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const chartContainer = ref(null)

onMounted(() => {
  if (chartContainer.value) {
    const chart = echarts.init(chartContainer.value)
    const option = {
      title: {
        text: '用户路径分析',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          if (params.dataType === 'edge') {
            return `${params.data.source} -> ${params.data.target}: ${params.data.value} 用户`
          }
          return `${params.name}: ${params.value} 用户`
        }
      },
      series: [
        {
          type: 'sankey',
          layout: 'none',
          emphasis: {
            focus: 'adjacency'
          },
          data: [
            { name: '首页' },
            { name: '产品页' },
            { name: '购物车' },
            { name: '结算' },
            { name: '支付' },
            { name: '完成' }
          ],
          links: [
            { source: '首页', target: '产品页', value: 1048 },
            { source: '产品页', target: '购物车', value: 735 },
            { source: '购物车', target: '结算', value: 580 },
            { source: '结算', target: '支付', value: 484 },
            { source: '支付', target: '完成', value: 300 }
            // Removed cyclic links
          ],
          lineStyle: {
            color: 'source',
            curveness: 0.5
          }
        }
      ]
    }
    chart.setOption(option)
  }
})
</script>

<style scoped>
.path-analysis-view {
  padding: 20px;
}

.chart-container {
  width: 100%;
  height: 600px;
}
</style>