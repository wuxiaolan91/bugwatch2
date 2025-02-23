<template>
  <div class="event-detail">
    <div class="page-header">
      <div class="header-left">
        <h2>事件详情</h2>
        <span class="event-name">{{ event.name }}</span>
      </div>
      <div class="header-actions">
        <button class="action-btn edit-btn" @click="editEvent">编辑事件</button>
        <button class="action-btn delete-btn" @click="deleteEvent">删除事件</button>
      </div>
    </div>

    <!-- 基本信息 -->
    <div class="detail-section">
      <h3>基本信息</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>事件描述</label>
          <div>{{ event.description }}</div>
        </div>
        <div class="info-item">
          <label>事件类型</label>
          <div>{{ getEventTypeName(event.type) }}</div>
        </div>
        <div class="info-item">
          <label>创建时间</label>
          <div>{{ formatDate(event.createdAt) }}</div>
        </div>
        <div class="info-item">
          <label>最近触发</label>
          <div>{{ formatDate(event.lastTriggered) }}</div>
        </div>
      </div>
    </div>

    <!-- 事件属性 -->
    <div class="detail-section">
      <h3>事件属性</h3>
      <table class="property-table">
        <thead>
          <tr>
            <th>属性名</th>
            <th>数据类型</th>
            <th>属性描述</th>
            <th>是否必填</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in event.properties" :key="prop.key">
            <td>{{ prop.key }}</td>
            <td>{{ prop.type }}</td>
            <td>{{ prop.description }}</td>
            <td>{{ prop.required ? '是' : '否' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 触发趋势 -->
    <div class="detail-section">
      <div class="section-header">
        <h3>触发趋势</h3>
        <div class="period-selector">
          <button v-for="period in periods" :key="period.days"
            :class="['period-btn', { active: activePeriod === period.days }]" @click="changePeriod(period.days)">
            {{ period.label }}
          </button>
        </div>
      </div>
      <div ref="trendChartRef" class="trend-chart"></div>
    </div>

    <!-- 触发记录 -->
    <div class="detail-section">
      <h3>最近触发记录</h3>
      <table class="trigger-table">
        <thead>
          <tr>
            <th>触发时间</th>
            <th>用户ID</th>
            <th>设备类型</th>
            <th>属性值</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in triggerRecords" :key="record.id">
            <td>{{ formatDate(record.timestamp, 'YYYY-MM-DD HH:mm:ss') }}</td>
            <td>{{ record.userId }}</td>
            <td>{{ record.deviceType }}</td>
            <td>
              <pre class="property-json">{{ JSON.stringify(record.properties, null, 2) }}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils/format'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()
const trendChartRef = ref(null)
let trendChart = null

// 时间范围选项
const periods = [
  { days: 7, label: '近7天' },
  { days: 14, label: '近14天' },
  { days: 30, label: '近30天' }
]
const activePeriod = ref(7)

// 模拟事件数据
const event = ref({
  id: 1,
  name: 'view_product',
  description: '用户查看商品详情',
  type: 'pv',
  createdAt: '2024-01-10T08:30:00',
  lastTriggered: '2024-01-20T15:45:30',
  properties: [
    {
      key: 'product_id',
      type: 'string',
      description: '商品ID',
      required: true
    },
    {
      key: 'category',
      type: 'string',
      description: '商品分类',
      required: true
    },
    {
      key: 'price',
      type: 'number',
      description: '商品价格',
      required: true
    },
    {
      key: 'source',
      type: 'string',
      description: '商品来源',
      required: false
    }
  ],
  trend: [
    { date: '2024-01-14', count: 1234 },
    { date: '2024-01-15', count: 1567 },
    { date: '2024-01-16', count: 1432 },
    { date: '2024-01-17', count: 1789 },
    { date: '2024-01-18', count: 1654 },
    { date: '2024-01-19', count: 1876 },
    { date: '2024-01-20', count: 1543 }
  ]
})

// 模拟触发记录
const triggerRecords = ref([
  {
    id: 1,
    timestamp: '2024-01-20T15:45:30',
    userId: 'user_123456',
    deviceType: 'iPhone 14',
    properties: {
      product_id: 'P001',
      category: '手机',
      price: 6999,
      source: '首页推荐'
    }
  },
  {
    id: 2,
    timestamp: '2024-01-20T15:43:22',
    userId: 'user_123457',
    deviceType: 'Chrome',
    properties: {
      product_id: 'P002',
      category: '电脑',
      price: 8999,
      source: '搜索结果'
    }
  }
])

// 事件类型名称映射
const getEventTypeName = (type) => {
  const typeMap = {
    pv: '页面浏览',
    click: '点击事件',
    custom: '自定义事件'
  }
  return typeMap[type] || type
}

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: event.value.trend.map(item => item.date),
      axisLabel: {
        formatter: (value) => formatDate(value, 'MM-DD')
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '触发次数',
        type: 'line',
        smooth: true,
        data: event.value.trend.map(item => item.count),
        areaStyle: {
          opacity: 0.1
        },
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#1890ff'
        }
      }
    ]
  }

  trendChart.setOption(option)
}

// 编辑事件
const editEvent = () => {
  router.push(`/track/edit/${event.value.id}`)
}

// 删除事件
const deleteEvent = () => {
  if (confirm('确定要删除这个事件吗？')) {
    router.push('/track/list')
  }
}

// 模拟不同时间范围的数据
const getTrendData = (days) => {
  // 模拟生成对应天数的数据
  const data = []
  const endDate = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate)
    date.setDate(date.getDate() - i)
    data.push({
      date: formatDate(date, 'YYYY-MM-DD'),
      count: Math.floor(Math.random() * 1000 + 1000) // 生成1000-2000之间的随机数
    })
  }
  return data
}

// 切换时间范围
const changePeriod = (days) => {
  activePeriod.value = days
  // 更新趋势数据
  event.value.trend = getTrendData(days)
  // 重新渲染图表
  initTrendChart()
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
</script>

<style scoped>
.event-detail {
  padding: 20px;
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

.event-name {
  color: #666;
  font-size: 14px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 12px;
  color: white;
}

.edit-btn {
  background: #1890ff;
}

.delete-btn {
  background: #ff4d4f;
}

.detail-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.info-item label {
  color: #666;
  margin-bottom: 8px;
  display: block;
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

.trend-chart {
  height: 400px;
  margin-top: 20px;
}

.period-selector {
  display: flex;
  gap: 8px;
}

.period-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.period-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.property-json {
  margin: 0;
  font-family: monospace;
  white-space: pre-wrap;
  font-size: 12px;
}

.action-btn:hover {
  opacity: 0.8;
}
</style>