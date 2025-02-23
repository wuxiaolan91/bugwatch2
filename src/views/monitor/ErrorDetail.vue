<template>
  <div class="error-detail">
    <div class="page-header">
      <div class="header-left">
        <h2>错误详情</h2>
        <span class="error-type">{{ error.type }}</span>
      </div>
      <div class="header-actions">
        <button class="action-btn" @click="ignoreError">忽略此类错误</button>
      </div>
    </div>

    <!-- 错误信息 -->
    <div class="detail-section">
      <div class="error-message">
        <h3>错误信息</h3>
        <div class="code-block">{{ error.message }}</div>
      </div>

      <div class="error-stack">
        <h3>堆栈信息</h3>
        <pre class="code-block">{{ error.stack }}</pre>
      </div>
    </div>

    <!-- 错误上下文 -->
    <div class="detail-section">
      <h3>错误上下文</h3>
      <div class="context-grid">
        <div class="context-item">
          <label>页面路径</label>
          <div>{{ error.path }}</div>
        </div>
        <div class="context-item">
          <label>浏览器</label>
          <div>{{ error.browser }}</div>
        </div>
        <div class="context-item">
          <label>操作系统</label>
          <div>{{ error.os }}</div>
        </div>
        <div class="context-item">
          <label>设备类型</label>
          <div>{{ error.device }}</div>
        </div>
        <div class="context-item">
          <label>首次发生</label>
          <div>{{ formatDate(error.firstOccurred) }}</div>
        </div>
        <div class="context-item">
          <label>最近发生</label>
          <div>{{ formatDate(error.lastOccurred) }}</div>
        </div>
        <div class="context-item">
          <label>发生次数</label>
          <div>{{ error.count }} 次</div>
        </div>
        <div class="context-item">
          <label>影响用户</label>
          <div>{{ error.affectedUsers }} 人</div>
        </div>
      </div>
    </div>

    <!-- 用户行为回溯 -->
    <div class="detail-section">
      <h3>用户行为回溯</h3>
      <div class="timeline">
        <div v-for="(action, index) in error.userActions" :key="index" class="timeline-item">
          <div class="time">{{ formatDate(action.time, 'HH:mm:ss') }}</div>
          <div class="action">
            <div class="action-type">{{ action.type }}</div>
            <div class="action-detail">{{ action.detail }}</div>
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

// 错误详情数据
const error = ref({
  id: route.params.id,
  type: 'TypeError',
  message: "Cannot read property 'data' of undefined",
  stack: `TypeError: Cannot read property 'data' of undefined
    at processData (app.js:123:45)
    at async fetchUserData (app.js:67:23)
    at async mounted (UserProfile.vue:89:12)`,
  path: '/products/detail',
  browser: 'Chrome 120.0.0',
  os: 'Windows 11',
  device: 'Desktop',
  firstOccurred: '2024-01-20T08:30:00',
  lastOccurred: new Date().toISOString(),
  count: 23,
  affectedUsers: 15,
  userActions: [
    {
      time: new Date(Date.now() - 5000).toISOString(),
      type: '错误发生',
      detail: "Cannot read property 'data' of undefined"
    },
    {
      time: new Date(Date.now() - 15000).toISOString(),
      type: '点击事件',
      detail: '点击了"查看详情"按钮 (#view-detail-btn)'
    },
    {
      time: new Date(Date.now() - 30000).toISOString(),
      type: '页面跳转',
      detail: '从 /products 跳转到 /products/detail'
    },
    {
      time: new Date(Date.now() - 60000).toISOString(),
      type: 'API请求',
      detail: 'GET /api/products/list 200 OK'
    }
  ]
})

// 忽略错误
const ignoreError = () => {
  if (confirm('确定要忽略此类错误吗？后续将不再收集此类错误。')) {
    // 实际项目中这里需要调用API
    console.log('忽略错误:', error.value.id)
    router.push('/monitor/errors')
  }
}

// 加载错误详情
const loadErrorDetail = async () => {
  // 实际项目中这里需要调用API获取错误详情
  console.log('加载错误详情:', route.params.id)
}

onMounted(() => {
  loadErrorDetail()
})
</script>

<style scoped>
.error-detail {
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
  align-items: center;
  gap: 12px;
}

.error-type {
  background: #ff4d4f;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.detail-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.code-block {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  margin-top: 12px;
}

.context-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 16px;
}

.context-item label {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
  display: block;
}

.timeline {
  margin-top: 16px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-left: 2px solid #f0f0f0;
  padding-left: 20px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 50%;
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  transform: translateY(-50%);
}

.time {
  color: #666;
  font-size: 14px;
  min-width: 80px;
}

.action-type {
  font-weight: 500;
  margin-bottom: 4px;
}

.action-detail {
  color: #666;
  font-size: 14px;
}

.action-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.action-btn:hover {
  opacity: 0.8;
}
</style>