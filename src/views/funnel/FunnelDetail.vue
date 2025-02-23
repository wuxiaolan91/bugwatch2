<template>
  <div class="funnel-detail">
    <div class="page-header">
      <h2>漏斗详情</h2>
    </div>

    <div class="funnel-content">
      <div class="funnel-info">
        <h3>{{ funnelData.name }}</h3>
        <p class="description">{{ funnelData.description }}</p>
      </div>

      <div class="funnel-chart">
        <div v-for="(step, index) in funnelData.steps" :key="index" class="funnel-step">
          <div class="step-bar" :style="{ width: getStepWidth(step.count) + '%' }">
            <span class="step-name">{{ step.name }}</span>
            <span class="step-count">{{ step.count }}人</span>
          </div>
          <div v-if="index < funnelData.steps.length - 1" class="conversion-rate">
            转化率: {{ getConversionRate(index) }}%
          </div>
        </div>
      </div>

      <div class="funnel-stats">
        <div class="stat-card">
          <div class="stat-label">总体转化率</div>
          <div class="stat-value">{{ getTotalConversionRate() }}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">平均转化时长</div>
          <div class="stat-value">{{ funnelData.avgConversionTime }}分钟</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const funnelData = ref({
  name: '购物转化漏斗',
  description: '用户从浏览商品到完成购买的转化过程分析',
  avgConversionTime: 45,
  steps: [
    { name: '浏览商品', count: 1000 },
    { name: '加入购物车', count: 500 },
    { name: '开始结算', count: 200 },
    { name: '提交订单', count: 150 },
    { name: '完成支付', count: 100 }
  ]
})

const getStepWidth = (count) => {
  const maxCount = Math.max(...funnelData.value.steps.map(step => step.count))
  return (count / maxCount) * 100
}

const getConversionRate = (index) => {
  const currentStep = funnelData.value.steps[index]
  const nextStep = funnelData.value.steps[index + 1]
  return ((nextStep.count / currentStep.count) * 100).toFixed(1)
}

const getTotalConversionRate = () => {
  const firstStep = funnelData.value.steps[0]
  const lastStep = funnelData.value.steps[funnelData.value.steps.length - 1]
  return ((lastStep.count / firstStep.count) * 100).toFixed(1)
}
</script>

<style scoped>
.funnel-detail {
  padding: 20px;
}

.funnel-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.funnel-info {
  margin-bottom: 30px;
}

.description {
  color: #666;
  margin-top: 8px;
}

.funnel-chart {
  margin: 40px 0;
}

.funnel-step {
  margin-bottom: 20px;
}

.step-bar {
  background: #1890ff;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  color: white;
  transition: width 0.3s ease;
}

.conversion-rate {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}

.funnel-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.stat-card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}
</style>