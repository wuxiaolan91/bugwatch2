<template>
  <div class="app-list">
    <div class="page-header">
      <h2>应用列表</h2>
      <router-link to="/apps/create" class="create-btn">
        创建应用
      </router-link>
    </div>

    <!-- 应用卡片列表 -->
    <div class="app-grid">
      <div v-for="app in apps" :key="app.id" class="app-card" :class="{ active: app.id === currentAppId }">
        <div class="app-icon" :style="{ background: app.color }">
          {{ app.name.charAt(0) }}
        </div>
        <div class="app-info">
          <div class="app-name">{{ app.name }}</div>
          <div class="app-desc">{{ app.description }}</div>
        </div>
        <div class="app-stats">
          <div class="stat-item">
            <span class="stat-label">今日PV</span>
            <span class="stat-value">{{ formatNumber(app.todayPv) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">今日错误</span>
            <span class="stat-value">{{ formatNumber(app.todayErrors) }}</span>
          </div>
        </div>
        <div class="app-actions">
          <button class="action-btn switch-btn" @click="switchApp(app)" v-if="app.id !== currentAppId">
            切换到此应用
          </button>
          <button class="action-btn edit-btn" @click="editApp(app)">编辑</button>
          <button class="action-btn delete-btn" @click="deleteApp(app.id)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatNumber } from '@/utils/format'

const router = useRouter()
const currentAppId = ref(1) // 当前选中的应用ID

// 模拟应用数据
const apps = ref([
  {
    id: 1,
    name: '易上岸',
    description: '公司主要电商业务平台',
    color: '#1890ff',
    todayPv: 156789,
    todayErrors: 23
  },
  {
    id: 2,
    name: '后台管理系统',
    description: '内部业务管理平台',
    color: '#52c41a',
    todayPv: 12345,
    todayErrors: 5
  },
  {
    id: 3,
    name: '移动端APP',
    description: '移动端原生应用',
    color: '#722ed1',
    todayPv: 89012,
    todayErrors: 15
  }
])

// 切换应用
const switchApp = (app) => {
  if (confirm(`确定要切换到应用"${app.name}"吗？`)) {
    currentAppId.value = app.id
    // 实际项目中这里需要:
    // 1. 调用API切换应用
    // 2. 更新全局状态
    // 3. 重新加载数据
  }
}

// 编辑应用
const editApp = (app) => {
  // 实际项目中跳转到编辑页面
  console.log('编辑应用:', app)
}

// 删除应用
const deleteApp = (id) => {
  if (confirm('确定要删除这个应用吗？此操作不可恢复！')) {
    apps.value = apps.value.filter(app => app.id !== id)
  }
}
</script>

<style scoped>
.app-list {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.create-btn {
  background: #1890ff;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.app-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.app-card.active {
  border: 2px solid #1890ff;
}

.app-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  margin-bottom: 16px;
}

.app-name {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
}

.app-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.app-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.stat-item {
  flex: 1;
}

.stat-label {
  display: block;
  color: #666;
  font-size: 12px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 500;
  color: #1890ff;
}

.app-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.switch-btn {
  background: #1890ff;
}

.edit-btn {
  background: #faad14;
}

.delete-btn {
  background: #ff4d4f;
}

.action-btn:hover {
  opacity: 0.8;
}
</style>