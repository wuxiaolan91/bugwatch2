<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { formatNumber } from '@/utils/format'
import TrendIndicator from '@/components/TrendIndicator.vue'
import * as echarts from 'echarts'
import { formatDate } from '@/utils/format';
// 时间范围选项
const periods = [
  { days: 7, label: '近7天' },
  { days: 14, label: '近14天' },
  { days: 30, label: '近30天' }
]
const activePeriod = ref(7)

// 数据卡片
const stats = ref([
  {
    title: '事件总数',
    value: 125678,
    current: 0.15,
    previous: 0.12,
    color: '#1890ff',
    icon: '📊'
  },
  {
    title: '活跃用户',
    value: 45234,
    current: 0.23,
    previous: 0.18,
    color: '#52c41a',
    icon: '👥'
  },
  {
    title: '转化次数',
    value: 8976,
    current: 0.08,
    previous: 0.09,
    color: '#722ed1',
    icon: '🎯'
  },
  {
    title: '平均停留时长',
    value: 325,
    current: 0.12,
    previous: 0.10,
    color: '#faad14',
    icon: '⏱️'
  }
])

// 热门事件数据 - 优化后的数据更真实
const topEvents = ref([
  {
    name: 'view_product',
    description: '查看商品详情',
    triggers: 58234,
    users: 32567,
    conversion: 0.45,
    previousConversion: 0.42,
    trend: [5234, 5892, 5534, 6287, 5932, 6423, 6234] // 上升趋势
  },
  {
    name: 'add_to_cart',
    description: '添加购物车',
    triggers: 23456,
    users: 15678,
    conversion: 0.28,
    previousConversion: 0.25,
    trend: [2345, 2156, 2467, 2845, 2678, 2956, 3067] // 稳定上升
  },
  {
    name: 'start_checkout',
    description: '开始结算',
    triggers: 12345,
    users: 8234,
    conversion: 0.15,
    previousConversion: 0.16,
    trend: [1234, 1445, 1356, 1234, 1567, 1445, 1356] // 波动
  },
  {
    name: 'complete_purchase',
    description: '完成购买',
    triggers: 5678,
    users: 4234,
    conversion: 0.08,
    previousConversion: 0.07,
    trend: [567, 623, 589, 645, 712, 734, 778] // 缓慢上升
  },
  {
    name: 'share_product',
    description: '分享商品',
    triggers: 3456,
    users: 2345,
    conversion: 0.05,
    previousConversion: 0.04,
    trend: [445, 467, 434, 389, 356, 378, 412] // 下降趋势
  }
])

// 选中的事件
const selectedEvent = ref('view_product')

// 图表相关
const trendChartRef = ref(null)
let trendChart = null

// 初始化趋势图 - 优化图表配置
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)
  const dates = getLast7Days()
  const currentEvent = topEvents.value.find(e => e.name === selectedEvent.value)

  const option = {
    title: {
      text: '事件触发趋势',
      subtext: currentEvent?.description,
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal'
      },
      subtextStyle: {
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const date = formatDate(params[0].axisValue, 'MM-DD')
        const value = formatNumber(params[0].value)
        const prevValue = params[0].dataIndex > 0 ? params[0].data[params[0].dataIndex - 1] : null
        let trend = ''
        if (prevValue) {
          const growth = ((params[0].value - prevValue) / prevValue * 100).toFixed(1)
          trend = `<br/>环比: ${growth > 0 ? '+' : ''}${growth}%`
        }
        return `${date}<br/>${params[0].seriesName}: ${value}${trend}`
      }
    },
    legend: {
      show: false
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      top: 60
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLabel: {
        formatter: (value) => formatDate(value, 'MM-DD'),
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => formatNumber(value),
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      }
    },
    series: [
      {
        name: currentEvent?.description || selectedEvent.value,
        type: 'line',
        smooth: true,
        data: getCurrentEventTrend(),
        symbolSize: 8,
        showSymbol: false, // 只在hover时显示数据点
        lineStyle: {
          width: 3,
          color: '#1890ff'
        },
        areaStyle: {
          opacity: 0.1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#1890ff'
            },
            {
              offset: 1,
              color: 'rgba(24,144,255,0.1)'
            }
          ])
        },
        emphasis: {
          focus: 'series',
          showSymbol: true,
          itemStyle: {
            color: '#1890ff',
            borderWidth: 2,
            borderColor: '#fff',
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowBlur: 10
          }
        }
      }
    ]
  }

  trendChart.setOption(option)
}

// 获取当前选中事件的趋势数据
const getCurrentEventTrend = () => {
  const event = topEvents.value.find(e => e.name === selectedEvent.value)
  return event ? event.trend : []
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

// 切换时间范围
const changePeriod = (days) => {
  activePeriod.value = days
  // 实际项目中这里需要重新请求数据
}

// 监听事件选择变化 - 优化更新逻辑
const watchEventChange = () => {
  if (trendChart) {
    const currentEvent = topEvents.value.find(e => e.name === selectedEvent.value)
    trendChart.setOption({
      title: {
        subtext: currentEvent?.description
      },
      series: [
        {
          name: currentEvent?.description || selectedEvent.value,
          data: getCurrentEventTrend()
        }
      ]
    })
  }
}

// 监听窗口大小变化
const handleResize = () => {
  trendChart?.resize()
}

onMounted(() => {
  initTrendChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
})

// 监听事件选择变化
watch(selectedEvent, watchEventChange)
</script>

<template>
  <div class="home-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>数据总览</h2>
      <div class="date-range">
        <button v-for="period in periods" :key="period.days"
          :class="['date-btn', { active: activePeriod === period.days }]" @click="changePeriod(period.days)">
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- 数据卡片 -->
    <div class="stat-cards">
      <div v-for="stat in stats" :key="stat.title" class="stat-card">
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

    <!-- 事件趋势图 -->
    <div class="chart-section">
      <div class="chart-card">
        <h3>事件趋势</h3>
        <div class="chart-filters">
          <select v-model="selectedEvent">
            <option v-for="event in topEvents" :key="event.name" :value="event.name">
              {{ event.description }}
            </option>
          </select>
        </div>
        <div ref="trendChartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 热门事件排行 -->
    <div class="ranking-section">
      <div class="ranking-card">
        <h3>热门事件排行</h3>
        <table>
          <thead>
            <tr>
              <th>排名</th>
              <th>事件名称</th>
              <th>触发次数</th>
              <th>用户数</th>
              <th>转化率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(event, index) in topEvents" :key="event.name">
              <td>
                <span class="rank-number" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</span>
              </td>
              <td>
                <div class="event-info">
                  <span class="event-name">{{ event.name }}</span>
                  <span class="event-desc">{{ event.description }}</span>
                </div>
              </td>
              <td>{{ formatNumber(event.triggers) }}</td>
              <td>{{ formatNumber(event.users) }}</td>
              <td>
                <TrendIndicator :value="event.conversion" :previous-value="event.previousConversion"
                  format="percentage" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 20px;
  margin: 0 auto;
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
  grid-template-columns: repeat(4, 1fr);
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
.ranking-section {
  margin-bottom: 24px;
}

.chart-card,
.ranking-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-filters {
  margin: 16px 0;
}

.chart-filters select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-width: 200px;
}

.chart-container {
  height: 400px;
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

.rank-number {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 12px;
  background: #f5f5f5;
  font-weight: 500;
}

.rank-number.top-3 {
  background: #1890ff;
  color: white;
}

.event-info {
  display: flex;
  flex-direction: column;
}

.event-name {
  font-weight: 500;
}

.event-desc {
  font-size: 12px;
  color: #666;
}
</style>
