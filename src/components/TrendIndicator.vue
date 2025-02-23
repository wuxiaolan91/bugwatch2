<template>
  <div class="trend-indicator" :class="trendClass">
    <span class="value">{{ formattedValue }}</span>
    <div class="trend-icon">
      <svg v-if="trend === 'up'" viewBox="0 0 24 24" width="16" height="16">
        <path d="M7 14l5-5 5 5z" />
      </svg>
      <svg v-else-if="trend === 'down'" viewBox="0 0 24 24" width="16" height="16">
        <path d="M7 10l5 5 5-5z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="16" height="16">
        <path d="M5 12h14" />
      </svg>
    </div>
    <span v-if="showPercentage" class="percentage">
      {{ Math.abs(percentage).toFixed(1) }}%
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 当前值
  value: {
    type: Number,
    required: true
  },
  // 上一期值
  previousValue: {
    type: Number,
    default: null
  },
  // 是否显示百分比变化
  showPercentage: {
    type: Boolean,
    default: true
  },
  // 数值格式化选项
  format: {
    type: String,
    default: 'decimal' // 可选：'decimal', 'percentage'
  },
  // 小数位数
  decimals: {
    type: Number,
    default: 1
  }
})

// 计算趋势方向
const trend = computed(() => {
  if (!props.previousValue) return 'neutral'
  return props.value > props.previousValue ? 'up' :
    props.value < props.previousValue ? 'down' : 'neutral'
})

// 计算CSS类
const trendClass = computed(() => ({
  'trend-up': trend.value === 'up',
  'trend-down': trend.value === 'down',
  'trend-neutral': trend.value === 'neutral'
}))

// 计算百分比变化
const percentage = computed(() => {
  if (!props.previousValue) return 0
  return ((props.value - props.previousValue) / props.previousValue) * 100
})

// 格式化显示值
const formattedValue = computed(() => {
  const value = props.format === 'percentage' ? props.value * 100 : props.value
  return value.toFixed(props.decimals) + (props.format === 'percentage' ? '%' : '')
})
</script>

<style scoped>
.trend-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.value {
  font-size: 16px;
}

.trend-icon {
  display: flex;
  align-items: center;
}

.trend-icon svg {
  fill: currentColor;
}

.percentage {
  font-size: 12px;
}

/* 上升趋势样式 */
.trend-up {
  color: #52c41a;
}

/* 下降趋势样式 */
.trend-down {
  color: #ff4d4f;
}

/* 持平趋势样式 */
.trend-neutral {
  color: #8c8c8c;
}
</style>