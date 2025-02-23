<template>
  <div class="funnel-analysis">
    <div class="page-header">
      <div class="header-left">
        <h2>{{ funnel.name }}</h2>
        <span class="date-range">{{ formatDate(startDate) }} - {{ formatDate(endDate) }}</span>
      </div>
      <div class="header-right">
        <button class="date-btn" :class="{ active: activePeriod === 7 }" @click="changePeriod(7)">
          近7天
        </button>
        <button class="date-btn" :class="{ active: activePeriod === 14 }" @click="changePeriod(14)">
          近14天
        </button>
        <button class="date-btn" :class="{ active: activePeriod === 30 }" @click="changePeriod(30)">
          近30天
        </button>
      </div>
    </div>

    <div class="analysis-content">
      <!-- 转化概览 -->
      <div class="overview-card">
        <h3>转化概览</h3>
        <div class="overview-stats">
          <div class="stat-item">
            <div class="stat-label">总体转化率</div>
            <div class="stat-value">
              <TrendIndicator :value="funnel.overallRate" :previous-value="funnel.previousRate" format="percentage" />
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">访问人数</div>
            <div class="stat-value">{{ formatNumber(funnel.totalVisitors) }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">完成人数</div>
            <div class="stat-value">{{ formatNumber(funnel.completions) }}</div>
          </div>
        </div>
      </div>

      <!-- 漏斗图 -->
      <div class="funnel-visualization">
        <h3>漏斗可视化</h3>
        <div ref="funnelChartRef" class="chart-container"></div>
      </div>

      <!-- 转化趋势 -->
      <div class="trend-chart">
        <h3>转化趋势</h3>
        <div ref="trendChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { formatDate, formatNumber, formatPercent } from '@/utils/format'
import TrendIndicator from '@/components/TrendIndicator.vue'
import * as echarts from 'echarts'

// 模拟数据
const funnel = ref({
  id: 1,
  name: '注册转化漏斗',
  overallRate: 0.23,
  previousRate: 0.21,
  totalVisitors: 25678,
  completions: 5906,
  steps: [
    {
      name: '访问注册页',
      users: 25678,
      conversionRate: 1.0,
      trend: [100, 98, 95, 97, 99, 96, 98]
    },
    {
      name: '开始注册',
      users: 18234,
      conversionRate: 0.71,
      trend: [75, 70, 72, 68, 71, 69, 71]
    },
    {
      name: '填写表单',
      users: 12445,
      conversionRate: 0.48,
      trend: [52, 48, 50, 45, 47, 46, 48]
    },
    {
      name: '验证邮箱',
      users: 8876,
      conversionRate: 0.35,
      trend: [38, 35, 36, 33, 34, 35, 35]
    },
    {
      name: '完成注册',
      users: 5906,
      conversionRate: 0.23,
      trend: [25, 23, 24, 21, 22, 23, 23]
    }
  ]
})

// 日期范围
const activePeriod = ref(7)
const endDate = ref(new Date())
const startDate = computed(() => {
  const date = new Date(endDate.value)
  date.setDate(date.getDate() - activePeriod.value)
  return date
})

// 切换时间范围
const changePeriod = (days) => {
  activePeriod.value = days
  // 实际项目中这里需要重新请求数据
}

// 计算漏斗步骤宽度
const getStepWidth = (rate) => {
  return `${rate * 100}%`
}

// 计算流失人数
const getDropUsers = (stepIndex) => {
  const currentStep = funnel.value.steps[stepIndex]
  const nextStep = funnel.value.steps[stepIndex + 1]
  return currentStep.users - nextStep.users
}

// 计算流失率
const getDropRate = (stepIndex) => {
  const currentStep = funnel.value.steps[stepIndex]
  const nextStep = funnel.value.steps[stepIndex + 1]
  return 1 - (nextStep.users / currentStep.users)
}

// 获取步骤颜色
const getStepColor = (index) => {
  const colors = ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96']
  return colors[index % colors.length]
}

// 图表引用
const trendChartRef = ref(null)
const funnelChartRef = ref(null)
let trendChart = null
let funnelChart = null

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)
  const dates = getLast7Days()

  const option = {
    title: {
      text: '各步骤转化率趋势',
      subtext: '最近7天每个步骤的转化率变化',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      },
      subtextStyle: {
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let result = `${formatDate(params[0].axisValue, 'MM-DD')}<br/>`
        params.forEach(param => {
          const color = param.color
          const marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`
          result += `${marker}${param.seriesName}: ${formatPercent(param.value / 100)}<br/>`
        })
        return result
      }
    },
    legend: {
      show: true,
      top: 60,
      type: 'scroll',
      textStyle: {
        fontSize: 12
      },
      selected: funnel.value.steps.reduce((acc, step) => {
        // 默认只显示第一个和最后一个步骤
        acc[step.name] = step.name === funnel.value.steps[0].name ||
          step.name === funnel.value.steps[funnel.value.steps.length - 1].name
        return acc
      }, {})
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      top: 120
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        formatter: (value) => formatDate(value, 'MM-DD'),
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => formatPercent(value / 100),
        fontSize: 12
      },
      max: 100,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          opacity: 0.3
        }
      }
    },
    series: funnel.value.steps.map((step, index) => ({
      name: step.name,
      type: 'line',
      smooth: true,
      data: step.trend,
      symbolSize: 6,
      lineStyle: {
        width: 2
      },
      itemStyle: {
        color: getStepColor(index)
      },
      areaStyle: {
        opacity: 0.1,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: getStepColor(index)
          },
          {
            offset: 1,
            color: `${getStepColor(index)}00`
          }
        ])
      }
    }))
  }

  trendChart.setOption(option)
}

// 初始化漏斗图
const initFunnelChart = () => {
  if (!funnelChartRef.value) return

  funnelChart = echarts.init(funnelChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const nextValue = params.dataIndex < funnel.value.steps.length - 1
          ? funnel.value.steps[params.dataIndex + 1].users
          : null
        const dropUsers = nextValue ? params.value - nextValue : 0
        const dropRate = nextValue ? formatPercent(1 - nextValue / params.value) : '-'

        return `${params.name}<br/>
                用户数: ${formatNumber(params.value)}<br/>
                转化率: ${formatPercent(params.value / funnel.value.steps[0].users)}<br/>
                流失: ${nextValue ? formatNumber(dropUsers) : '-'} (${dropRate})`
      }
    },
    series: [
      {
        name: '漏斗转化',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: funnel.value.steps[0].users,
        minSize: '0%',
        maxSize: '100%',
        sort: 'none',
        gap: 2,
        label: {
          show: true,
          position: 'right',
          formatter: (params) => {
            return `${params.name}\n${formatPercent(params.value / funnel.value.steps[0].users)}`
          }
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 14
          }
        },
        data: funnel.value.steps.map((step, index) => ({
          value: step.users,
          name: step.name,
          itemStyle: {
            color: getStepColor(index)
          }
        }))
      }
    ]
  }

  funnelChart.setOption(option)
}

// 获取最近7天的日期
const getLast7Days = () => {
  const dates = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date)
  }
  return dates
}

// 监听窗口大小变化
const handleResize = () => {
  trendChart?.resize()
  funnelChart?.resize()
}

onMounted(() => {
  initTrendChart()
  initFunnelChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  funnelChart?.dispose()
})
</script>

<style scoped>
.funnel-analysis {
  padding: 20px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.date-range {
  color: #666;
  font-size: 14px;
}

.date-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
}

.date-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.analysis-content {
  display: grid;
  gap: 20px;
}

.overview-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.overview-stats {
  display: flex;
  gap: 40px;
  margin-top: 16px;
}

.stat-item {
  flex: 1;
}

.stat-label {
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 500;
}

.funnel-visualization {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.chart-container {
  height: 400px;
  width: 100%;
  margin-top: 20px;
}

.trend-chart {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.trend-legend,
.legend-item,
.legend-color {
  display: none;
}
</style>