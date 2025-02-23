<template>
  <div class="user-list-view">
    <h2>用户列表</h2>

    <table class="user-table">
      <thead>
        <tr>
          <th>用户ID</th>
          <th>用户名</th>
          <th>邮箱</th>
          <th>注册日期</th>
          <th>埋点</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>
            <a @click="goToUserDetail(user.id)" class="user-link">{{ user.name }}</a>
          </td>
          <td>{{ user.email }}</td>
          <td>{{ formatDate(user.registeredAt, 'YYYY-MM-DD') }}</td>
          <td>
            <button @click="viewUserTimeline(user.id)" class="track-button">查看埋点</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/format'

const users = ref([])
const searchQuery = ref('')
const router = useRouter()

const goToUserDetail = (userId) => {
  router.push({
    name: 'user-detail',
    params: { id: userId }
  })
}

const userType = ref('all')

onMounted(() => {
  users.value = [
    {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      registeredAt: new Date(),
      visitCount: 156,
      lastVisit: new Date(),
      type: 'loyal'  // 铁粉
    },
    {
      id: 2,
      name: 'Bob',
      email: 'bob@example.com',
      registeredAt: new Date(),
      visitCount: 2,
      lastVisit: '2023-12-01',
      type: 'churn'  // 流失用户
    },
    {
      id: 3,
      name: 'Charlie',
      email: 'charlie@example.com',
      registeredAt: new Date(),
      visitCount: 89,
      lastVisit: new Date(),
      type: 'loyal'
    }
  ]
})

const setUserType = (type) => {
  userType.value = type
}

const filteredUsers = computed(() => {
  let result = users.value

  // 先按用户类型筛选
  if (userType.value !== 'all') {
    result = result.filter(user => user.type === userType.value)
  }

  // 再按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  return result
})

const viewUserTimeline = (userId) => {
  router.push({ name: 'user-timeline', params: { id: userId } })
}
</script>

<style scoped>
.user-list-view {
  padding: 20px;
}

.search-input {
  margin-bottom: 20px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}

.user-table {
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

.track-button {
  padding: 6px 12px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.track-button:hover {
  background-color: #40a9ff;
}

.user-link {
  color: #1890ff;
  cursor: pointer;
}

.user-link:hover {
  text-decoration: underline;
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

.filter-tag:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.filter-tag.active {
  background: #1890ff;
  color: white;
}
</style>