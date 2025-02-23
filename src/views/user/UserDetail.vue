<template>
  <div class="user-detail">
    <div class="page-header">
      <h2>用户详情</h2>
    </div>

    <div class="detail-content">
      <!-- 基本信息 -->
      <div class="detail-section">
        <h3>基本信息</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>用户ID</label>
            <div>{{ userInfo.userId }}</div>
          </div>
          <div class="info-item">
            <label>注册时间</label>
            <div>{{ formatDate(userInfo.registerTime) }}</div>
          </div>
          <div class="info-item">
            <label>最近活跃</label>
            <div>{{ formatDate(userInfo.lastActiveTime) }}</div>
          </div>
          <div class="info-item">
            <label>设备信息</label>
            <div>{{ userInfo.deviceInfo }}</div>
          </div>
        </div>
      </div>

      <!-- 行为统计 -->
      <div class="detail-section">
        <h3>行为统计</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ userInfo.stats.pageViews }}</div>
            <div class="stat-label">页面浏览</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ userInfo.stats.events }}</div>
            <div class="stat-label">事件触发</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ userInfo.stats.avgDuration }}分钟</div>
            <div class="stat-label">平均访问时长</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ userInfo.stats.bounceRate }}%</div>
            <div class="stat-label">跳出率</div>
          </div>
        </div>
      </div>

      <!-- 最近事件 -->
      <div class="detail-section">
        <div class="section-header">
          <h3>最近事件</h3>
          <button class="view-timeline-btn" @click="viewTimeline">查看完整时间线</button>
        </div>
        <div class="recent-events">
          <div v-for="event in userInfo.recentEvents" :key="event.id" class="event-item">
            <div class="event-time">{{ formatDate(event.time) }}</div>
            <div class="event-content">
              <div class="event-name" :class="getEventTypeClass(event.type)">{{ event.name }}</div>
              <div class="event-description">{{ event.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const userId = route.params.id

const getEventTypeClass = (type) => {
  return {
    'event-type-page': type === 'page',
    'event-type-action': type === 'action'
  }
}

const userInfo = ref({
  userId: 'user_001',
  registerTime: '2024-01-01T10:00:00',
  lastActiveTime: '2024-01-20T15:30:00',
  deviceInfo: 'Chrome 120.0 / Windows 10',
  stats: {
    pageViews: 328,
    events: 156,
    avgDuration: 12,
    bounceRate: 25.5
  },
  recentEvents: [
    {
      id: 1,
      type: 'page',
      name: 'page_view',
      description: '进入商品详情页',
      time: '2024-01-20T15:30:00'
    },
    {
      id: 2,
      type: 'action',
      name: 'add_to_cart',
      description: '添加商品到购物车',
      time: '2024-01-20T15:29:00'
    },
    {
      id: 3,
      type: 'page',
      name: 'page_view',
      description: '进入购物车页面',
      time: '2024-01-20T15:28:00'
    }
  ]
})

const viewTimeline = () => {
  router.push(`/user/timeline/${userId}`)
}
</script>

<style scoped>
.user-detail {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.detail-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.info-item label {
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.stat-card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}

.stat-label {
  margin-top: 8px;
  color: #666;
}

.actions {
  margin-top: 24px;
  text-align: center;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.recent-events {
  margin-top: 16px;
}

.event-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.event-time {
  width: 150px;
  color: #999;
  font-size: 12px;
}

.event-content {
  flex: 1;
}

.event-name {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 4px;
}

.event-type-page {
  background-color: rgba(24, 144, 255, 0.1);
  color: rgb(24, 144, 255, .65);
}

.event-type-action {
  background-color: rgba(82, 196, 26, 0.1);
  color: rgb(82, 196, 26, .8);
}

.event-description {
  color: #666;
  font-size: 14px;
}

.view-timeline-btn {
  padding: 6px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.view-timeline-btn:hover {
  opacity: 0.9;
}
</style>