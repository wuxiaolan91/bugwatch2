<template>
  <div class="event-analysis">
    <div class="page-header">
      <h2>数据分析</h2>
      <div class="date-range">
        <button v-for="period in periods" :key="period.days"
          :class="['date-btn', { active: activePeriod === period.days }]" @click="changePeriod(period.days)">
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="stat-cards">
      <div class="stat-card" v-for="stat in stats" :key="stat.title">
        <div class="stat-header">
          <span class="stat-title">{{ stat.title }}</span>
          <span class="stat-icon" :style="{ background: stat.color }">{{ stat.icon }}</span>
        </div>
        <div class="stat-value">{{ formatNumber(stat.value) }}</div>
        <div class="stat-trend">
          <TrendIndicator :value="stat.current" :previous-value="stat.previous" :with-sign="true" format="percentage" />
          <span class="trend-label">较上期</span>
        </div>
      </div>
    </div>

    <!-- PV/UV 趋势图 -->
    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>PV/UV 趋势</h3>
          <div class="chart-actions">
            <select v-model="selectedMetric" class="metric-select">
              <option value="pv">浏览量(PV)</option>
              <option value="uv">访客数(UV)</option>
              <option value="both">PV/UV对比</option>
            </select>
          </div>
        </div>
        <div ref="trendChartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 页面分析 -->
    <div class="analysis-section">
      <div class="analysis-card">
        <h3>页面分析</h3>
        <table>
          <thead>
            <tr>
              <th>页面路径</th>
              <th>浏览量(PV)</th>
              <th>访客数(UV)</th>
              <th>平均停留时长</th>
              <th>跳出率</th>
              <th>转化率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="page in pageAnalysis" :key="page.path">
              <td>{{ page.path }}</td>
              <td>{{ formatNumber(page.pv) }}</td>
              <td>{{ formatNumber(page.uv) }}</td>
              <td>{{ formatDuration(page.avgDuration) }}</td>
              <td>{{ formatPercent(page.bounceRate) }}</td>
              <td>
                <TrendIndicator :value="page.conversionRate" :previous-value="page.previousRate" format="percentage" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 用户分布 -->
    <div class="distribution-section">
      <div class="distribution-cards">
        <div class="distribution-card">
          <h3>设备分布</h3>
          <div ref="deviceChartRef" class="pie-chart"></div>
        </div>
        <div class="distribution-card">
          <h3>地域分布</h3>
          <div ref="regionChartRef" class="pie-chart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { formatNumber, formatPercent, formatDate } from '@/utils/format'
import TrendIndicator from '@/components/TrendIndicator.vue'
import * as echarts from 'echarts'

// 时间范围选项
const periods = [
  { days: 0, label: '今天' },
  { days: 7, label: '近7天' },
  { days: 14, label: '近14天' },
  { days: 30, label: '近30天' }
]
const activePeriod = ref(0)

// 数据概览
const stats = ref([
  {
    title: '总浏览量(PV)',
    value: 23456,
    current: 0.15,
    previous: 0.12,
    color: '#1890ff',
    icon: '👁️'
  },
  {
    title: '访客数(UV)',
    value: 4567,
    current: 0.08,
    previous: 0.07,
    color: '#52c41a',
    icon: '👥'
  },
  {
    title: '平均停留时长',
    value: 325,
    current: 0.12,
    previous: 0.10,
    color: '#722ed1',
    icon: '⏱️'
  },
  {
    title: '跳出率',
    value: 0.35,
    current: -0.05,
    previous: 0.40,
    color: '#faad14',
    icon: '↩️'
  }
])

// 页面分析数据
const pageAnalysis = ref([
  {
    path: '/home',
    pv: 4567,
    uv: 1234,
    avgDuration: 245,
    bounceRate: 0.25,
    conversionRate: 0.45,
    previousRate: 0.42
  },
  {
    path: '/products',
    pv: 3456,
    uv: 987,
    avgDuration: 180,
    bounceRate: 0.30,
    conversionRate: 0.38,
    previousRate: 0.35
  },
  {
    path: '/cart',
    pv: 2345,
    uv: 765,
    avgDuration: 120,
    bounceRate: 0.15,
    conversionRate: 0.65,
    previousRate: 0.62
  }
])

// 趋势图相关
const selectedMetric = ref('both')
const trendChartRef = ref(null)
const deviceChartRef = ref(null)
const regionChartRef = ref(null)
let trendChart = null
let deviceChart = null
let regionChart = null

// 格式化时长
const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)
  updateTrendChart()
}

// 更新趋势图
const updateTrendChart = () => {
  if (!trendChart) return

  const dates = getDateRange()
  const isToday = activePeriod.value === 0
  const formatStr = isToday ? 'HH:00' : 'MM-DD'

  // 生成模拟数据
  const generateData = (base, variance) => {
    return dates.map(() => base + Math.floor(Math.random() * variance))
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const date = formatDate(params[0].axisValue, formatStr)
        let html = `${date}<br/>`
        params.forEach(param => {
          const value = formatNumber(param.value)
          html += `${param.seriesName}: ${value}<br/>`
        })
        return html
      }
    },
    legend: {
      data: ['浏览量(PV)', '访客数(UV)']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        formatter: (value) => formatDate(value, formatStr)
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'PV',
        position: 'left',
        axisLabel: {
          formatter: (value) => formatNumber(value)
        }
      },
      {
        type: 'value',
        name: 'UV',
        position: 'right',
        axisLabel: {
          formatter: (value) => formatNumber(value)
        }
      }
    ],
    series: getSeries()
  }

  trendChart.setOption(option)
}

// 获取图表系列数据
const getSeries = () => {
  const pvData = [23456, 25678, 24567, 26789, 28901, 27654, 29876]
  const uvData = [12345, 13456, 12789, 14567, 15678, 14789, 16543]

  if (selectedMetric.value === 'pv') {
    return [{
      name: '浏览量(PV)',
      type: 'line',
      smooth: true,
      data: pvData,
      areaStyle: { opacity: 0.1 },
      itemStyle: { color: '#1890ff' }
    }]
  } else if (selectedMetric.value === 'uv') {
    return [{
      name: '访客数(UV)',
      type: 'line',
      smooth: true,
      data: uvData,
      areaStyle: { opacity: 0.1 },
      itemStyle: { color: '#52c41a' }
    }]
  } else {
    return [
      {
        name: '浏览量(PV)',
        type: 'line',
        smooth: true,
        data: pvData,
        areaStyle: { opacity: 0.1 },
        itemStyle: { color: '#1890ff' }
      },
      {
        name: '访客数(UV)',
        type: 'line',
        smooth: true,
        data: uvData,
        areaStyle: { opacity: 0.1 },
        itemStyle: { color: '#52c41a' },
        yAxisIndex: 1
      }
    ]
  }
}

// 初始化设备分布图
const initDeviceChart = () => {
  if (!deviceChartRef.value) return

  deviceChart = echarts.init(deviceChartRef.value)
  deviceChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: 45678, name: 'PC端' },
          { value: 34567, name: 'iOS' },
          { value: 23456, name: 'Android' },
          { value: 12345, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

// 初始化地域分布图
const initRegionChart = () => {
  if (!regionChartRef.value) return

  regionChart = echarts.init(regionChartRef.value)
  regionChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: [
          { value: 23456, name: '广东' },
          { value: 19876, name: '北京' },
          { value: 18765, name: '上海' },
          { value: 15678, name: '浙江' },
          { value: 12345, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

// 获取日期范围
const getDateRange = () => {
  const dates = []
  if (activePeriod.value === 0) {
    // 获取今天每小时的数据点
    for (let i = 0; i < 24; i++) {
      const date = new Date()
      date.setHours(i, 0, 0, 0)
      dates.push(date)
    }
  } else {
    // 获取最近N天的数据点
    for (let i = activePeriod.value - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date)
    }
  }
  return dates
}

// 切换时间范围
const changePeriod = (days) => {
  activePeriod.value = days
  // 实际项目中这里需要重新请求数据
}

// 监听窗口大小变化
const handleResize = () => {
  trendChart?.resize()
  deviceChart?.resize()
  regionChart?.resize()
}

// 监听指标选择变化
watch(selectedMetric, () => {
  updateTrendChart()
})

onMounted(() => {
  initTrendChart()
  initDeviceChart()
  initRegionChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  deviceChart?.dispose()
  regionChart?.dispose()
})
</script>

<style scoped>
.event-analysis {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-title {
  color: #666;
  font-size: 14px;
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.stat-value {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 8px;
}

.trend-label {
  color: #666;
  font-size: 12px;
}

.chart-section,
.analysis-section,
.distribution-section {
  margin-bottom: 24px;
}

.chart-card,
.analysis-card,
.distribution-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.metric-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-width: 150px;
}

.chart-container {
  height: 400px;
}

.distribution-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.pie-chart {
  height: 300px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background: #fafafa;
  font-weight: 500;
}
</style>