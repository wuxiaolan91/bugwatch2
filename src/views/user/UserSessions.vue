<template>
  <div class="user-sessions">
    <div class="page-header">
      <h2>用户会话分析</h2>
    </div>

    <div class="filter-bar">
      <input v-model="searchQuery" placeholder="搜索会话" class="search-input" />
      <div class="filter-tags">
        <span class="filter-tag" :class="{ active: userType === 'loyal' }" @click="setUserType('loyal')">
          铁粉
        </span>
        <span class="filter-tag" :class="{ active: userType === 'churn' }" @click="setUserType('churn')">
          迅速流失用户
        </span>
        <span class="filter-tag" :class="{ active: userType === 'all' }" @click="setUserType('all')">
          全部用户
        </span>
      </div>
    </div>

    <div class="session-list">
      <table>
        <thead>
          <tr>
            <th>用户ID</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>会话时长</th>
            <th>时长进度</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="session in filteredSessions" :key="session.id" @click="goToTimeline(session.userId)"
            class="session-row">
            <td>{{ session.userId }}</td>
            <td>{{ formatDate(session.startTime) }}</td>
            <td>{{ formatDate(session.endTime) }}</td>
            <td>{{ formatDuration(session.duration) }}</td>
            <td>
              <div class="duration-progress">
                <div class="progress-bar" :style="{ width: getDurationPercentage(session.duration) + '%' }"
                  :title="formatDuration(session.duration)">
                </div>
              </div>
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'  // 添加 computed
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const router = useRouter()

// 修改 formatDate 函数
const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format)
}

// 模拟会话数据
const userType = ref('all')
const searchQuery = ref('')

const setUserType = (type) => {
  userType.value = type
}

// 修改 sessions 数据，添加用户类型
const sessions = ref([
  {
    id: 1,
    userId: 'user_001',
    startTime: '2024-01-20T10:00:00',
    endTime: '2024-01-20T10:00:05',
    duration: 5,
    userType: 'loyal'  // 添加用户类型
  },
  {
    id: 2,
    userId: 'user_002',
    startTime: '2024-01-20T11:15:00',
    endTime: '2024-01-20T11:15:12',
    duration: 12
  },
  {
    id: 3,
    userId: 'user_003',
    startTime: '2024-01-20T09:30:00',
    endTime: '2024-01-20T09:30:08',
    duration: 8
  },
  {
    id: 4,
    userId: 'user_004',
    startTime: '2024-01-20T13:00:00',
    endTime: '2024-01-20T13:15:00',
    duration: 900  // 15分钟
  },
  {
    id: 5,
    userId: 'user_005',
    startTime: '2024-01-20T14:20:00',
    endTime: '2024-01-20T14:20:06',
    duration: 6
  },
  {
    id: 6,
    userId: 'user_006',
    startTime: '2024-01-20T08:00:00',
    endTime: '2024-01-20T08:00:15',
    duration: 15
  },
  {
    id: 7,
    userId: 'user_007',
    startTime: '2024-01-20T16:00:00',
    endTime: '2024-01-20T16:20:00',
    duration: 1200  // 20分钟
  },
  {
    id: 8,
    userId: 'user_008',
    startTime: '2024-01-20T12:30:00',
    endTime: '2024-01-20T12:30:04',
    duration: 4
  },
  {
    id: 9,
    userId: 'user_009',
    startTime: '2024-01-20T15:00:00',
    endTime: '2024-01-20T15:00:25',
    duration: 25
  },
  {
    id: 10,
    userId: 'user_010',
    startTime: '2024-01-20T10:30:00',
    endTime: '2024-01-20T10:30:07',
    duration: 7
  },
  {
    id: 11,
    userId: 'user_011',
    startTime: '2024-01-20T13:45:00',
    endTime: '2024-01-20T14:00:00',
    duration: 900  // 15分钟
  },
  {
    id: 12,
    userId: 'user_012',
    startTime: '2024-01-20T09:15:00',
    endTime: '2024-01-20T09:15:03',
    duration: 3
  },
  {
    id: 13,
    userId: 'user_013',
    startTime: '2024-01-20T11:30:00',
    endTime: '2024-01-20T11:30:18',
    duration: 18
  },
  {
    id: 14,
    userId: 'user_014',
    startTime: '2024-01-20T14:00:00',
    endTime: '2024-01-20T14:00:09',
    duration: 9
  },
  {
    id: 15,
    userId: 'user_015',
    startTime: '2024-01-20T15:30:00',
    endTime: '2024-01-20T16:00:00',
    duration: 1800  // 30分钟
  },
  {
    id: 16,
    userId: 'user_016',
    startTime: '2024-01-20T08:30:00',
    endTime: '2024-01-20T08:30:05',
    duration: 5
  },
  {
    id: 17,
    userId: 'user_017',
    startTime: '2024-01-20T12:00:00',
    endTime: '2024-01-20T12:00:11',
    duration: 11
  },
  {
    id: 18,
    userId: 'user_018',
    startTime: '2024-01-20T16:30:00',
    endTime: '2024-01-20T16:30:06',
    duration: 6
  },
  {
    id: 19,
    userId: 'user_019',
    startTime: '2024-01-20T10:15:00',
    endTime: '2024-01-20T10:15:08',
    duration: 8
  },
  {
    id: 20,
    userId: 'user_020',
    startTime: '2024-01-20T13:15:00',
    endTime: '2024-01-20T13:15:14',
    duration: 14
  }
])

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const parts = []
  if (hours > 0) parts.push(`${hours}小时`)
  if (minutes > 0) parts.push(`${minutes}分钟`)
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}秒`)

  return parts.join(' ')
}

const getDurationPercentage = (duration) => {
  const maxDuration = Math.max(...sessions.value.map(s => s.duration))
  return (duration / maxDuration) * 100
}

const filteredSessions = computed(() => {
  let result = sessions.value

  if (userType.value !== 'all') {
    result = result.filter(session => {
      if (userType.value === 'loyal') {
        return session.duration >= 600  // 10分钟 = 600秒
      } else if (userType.value === 'churn') {
        return session.duration < 10     // 小于10秒
      }
      return true
    })
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(session =>
      session.userId.toLowerCase().includes(query)
    )
  }

  return result
})
const goToTimeline = (userId) => {
  router.push(`/user/timeline/${userId}`)
}
</script>

<style scoped>
.user-sessions {
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;
}

.session-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.duration-progress {
  width: 200px;
  height: 8px;
  background: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #1890ff;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  margin-bottom: 0;
}

.filter-tags {
  display: flex;
  gap: 12px;
}

.filter-tag {
  padding: 6px 16px;
  border-radius: 16px;
  background: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.session-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.session-row:hover {
  background-color: #f5f5f5;
}

.filter-tag:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.filter-tag.active {
  background: #1890ff;
  color: white;
}
</style>