<template>
  <div class="error-monitor">
    <div class="page-header">
      <h2>错误监控</h2>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-label">今日错误</span>
          <span class="stat-value">{{ todayTotal }}</span>
          <TrendIndicator :value="errorTrend" :previous-value="previousTrend" format="percentage" />
        </div>
        <div class="stat-item">
          <span class="stat-label">影响用户</span>
          <span class="stat-value">{{ affectedUsers }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">错误率</span>
          <span class="stat-value">{{ errorRate }}%</span>
        </div>
      </div>
    </div>

    <!-- 错误趋势图 -->
    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>错误趋势对比</h3>
          <div class="legend">
            <span class="legend-item">
              <span class="legend-color" style="background: #ff4d4f"></span>
              今日
            </span>
            <span class="legend-item">
              <span class="legend-color" style="background: #52c41a"></span>
              昨日
            </span>
          </div>
        </div>
        <div ref="trendChartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 错误排行榜 -->
    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>错误排行 TOP 5</h3>
          <div class="chart-actions">
            <select v-model="rankingType" class="ranking-select">
              <option value="page">按页面</option>
              <option value="error">按错误类型</option>
            </select>
          </div>
        </div>
        <div ref="rankingChartRef" class="chart-container ranking-chart"></div>
      </div>
    </div>

    <!-- 错误列表 -->
    <div class="error-list">
      <h3>最近错误</h3>
      <table>
        <thead>
          <tr>
            <th>错误信息</th>
            <th>错误类型</th>
            <th>页面路径</th>
            <th>浏览器</th>
            <th>发生次数</th>
            <th>最近发生</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="error in recentErrors" :key="error.id">
            <td class="error-message">{{ error.message }}</td>
            <td>{{ error.type }}</td>
            <td>{{ error.path }}</td>
            <td>{{ error.browser }}</td>
            <td>{{ error.count }}</td>
            <td>{{ formatDate(error.lastOccurred, 'HH:mm:ss') }}</td>
            <td>
              <button class="action-btn" @click="viewErrorDetail(error)">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { formatDate, formatNumber } from '@/utils/format'
import TrendIndicator from '@/components/TrendIndicator.vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'

// 统计数据
const todayTotal = ref(156)
const errorTrend = ref(0.15)
const previousTrend = ref(0.12)
const affectedUsers = ref(89)
const errorRate = ref(0.25)

// 生成24小时的错误数据
const generateHourlyData = (baseCount, variance) => {
  return Array.from({ length: 24 }, (_, hour) => {
    // 模拟工作时间段错误较多的情况
    const timeMultiplier = hour >= 9 && hour <= 18 ? 1.5 : 0.5
    return Math.floor((baseCount + Math.random() * variance) * timeMultiplier)
  })
}

// 今日和昨日的错误数据
const todayData = generateHourlyData(8, 5)
const yesterdayData = generateHourlyData(7, 4)

// 最近错误列表
const recentErrors = ref([
  {
    id: 1,
    message: "Cannot read property 'data' of undefined",
    type: 'TypeError',
    path: '/products/detail',
    browser: 'Chrome 120.0.0',
    count: 23,
    lastOccurred: new Date().toISOString()
  },
  {
    id: 2,
    message: "Failed to fetch API endpoint",
    type: 'NetworkError',
    path: '/api/users',
    browser: 'Firefox 121.0',
    count: 15,
    lastOccurred: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 3,
    message: "Unexpected token in JSON",
    type: 'SyntaxError',
    path: '/checkout',
    browser: 'Safari 17.0',
    count: 8,
    lastOccurred: new Date(Date.now() - 900000).toISOString()
  }
])

// 图表相关
const trendChartRef = ref(null)
const rankingChartRef = ref(null)
let trendChart = null
let rankingChart = null
const rankingType = ref('page')

// 页面错误数据
const pageErrorData = [
  { name: '/products/detail', value: 156, percent: 28 },
  { name: '/checkout', value: 89, percent: 16 },
  { name: '/user/profile', value: 67, percent: 12 },
  { name: '/cart', value: 45, percent: 8 },
  { name: '/order/confirm', value: 34, percent: 6 }
]

// 错误类型数据
const errorTypeData = [
  { name: 'TypeError', value: 234, percent: 32 },
  { name: 'NetworkError', value: 156, percent: 21 },
  { name: 'SyntaxError', value: 98, percent: 13 },
  { name: 'ReferenceError', value: 67, percent: 9 },
  { name: 'RangeError', value: 45, percent: 6 }
]

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const hour = params[0].axisValue
        return `${hour}<br/>
          今日: ${params[0].value} 次<br/>
          昨日: ${params[1].value} 次`
      }
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
      data: hours,
      axisLabel: {
        formatter: '{value}'
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '今日',
        type: 'line',
        data: todayData,
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: '#ff4d4f'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(255,77,79,0.3)'
            }, {
              offset: 1,
              color: 'rgba(255,77,79,0.1)'
            }]
          }
        }
      },
      {
        name: '昨日',
        type: 'line',
        data: yesterdayData,
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: '#52c41a'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(82,196,26,0.3)'
            }, {
              offset: 1,
              color: 'rgba(82,196,26,0.1)'
            }]
          }
        }
      }
    ]
  }

  trendChart.setOption(option)
}

// 查看错误详情
const viewErrorDetail = (error) => {
  router.push(`/monitor/error/${error.id}`)
}

// 监听窗口大小变化
const handleResize = () => {
  trendChart?.resize()
}

// 初始化排行榜图表
const initRankingChart = () => {
  if (!rankingChartRef.value) return

  rankingChart = echarts.init(rankingChartRef.value)
  updateRankingChart()
}

// 更新排行榜图表
const updateRankingChart = () => {
  const data = rankingType.value === 'page' ? pageErrorData : errorTypeData

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        const data = params[0].data
        return `${data.name}<br/>
          错误数: ${data.value}<br/>
          占比: ${data.percent}%`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: {
        formatter: function (value) {
          return value.length > 15 ? value.slice(0, 15) + '...' : value
        }
      }
    },
    series: [
      {
        name: '错误数',
        type: 'bar',
        data: data,
        itemStyle: {
          color: function (params) {
            // 颜色渐变，错误数越多颜色越深
            const colorList = ['#ffccc7', '#ffa39e', '#ff7875', '#ff4d4f', '#f5222d']
            return colorList[params.dataIndex]
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c} 次'
        }
      }
    ]
  }

  rankingChart.setOption(option)
}

// 监听排行类型变化
watch(rankingType, () => {
  updateRankingChart()
})

const router = useRouter()

onMounted(() => {
  initTrendChart()
  initRankingChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  rankingChart?.dispose()
})
</script>

<style scoped>
.error-monitor {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.header-stats {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.stat-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 500;
  margin: 8px 0;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.chart-container {
  height: 400px;
}

.ranking-chart {
  height: 300px;
}

.ranking-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-width: 120px;
}

.error-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
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

.error-message {
  color: #ff4d4f;
  font-family: monospace;
}

.action-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.action-btn:hover {
  opacity: 0.8;
}
</style>