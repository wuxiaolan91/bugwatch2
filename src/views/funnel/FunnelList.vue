<template>
  <div class="funnel-list">
    <div class="page-header">
      <h2>漏斗列表</h2>
      <router-link to="/funnel/create" class="create-btn">
        创建漏斗
      </router-link>
    </div>

    <div class="funnel-table">
      <table>
        <thead>
          <tr>
            <th>漏斗名称</th>
            <th>步骤数</th>
            <th>转化率</th>
            <th>昨日访问</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="funnel in funnels" :key="funnel.id">
            <td>{{ funnel.name }}</td>
            <td>{{ funnel.steps.length }}</td>
            <td>
              <TrendIndicator :value="funnel.conversionRate" :previous-value="funnel.previousRate"
                format="percentage" />
            </td>
            <td>{{ formatNumber(funnel.visitors) }}</td>
            <td>{{ formatDate(funnel.createdAt, 'YYYY-MM-DD HH:mm') }}</td>
            <td>
              <button class="action-btn view-btn" @click="viewDetails(funnel.id)">
                查看
              </button>
              <button class="action-btn edit-btn" @click="editFunnel(funnel.id)">
                编辑
              </button>
              <button class="action-btn delete-btn" @click="deleteFunnel(funnel.id)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate, formatNumber } from '@/utils/format'
import TrendIndicator from '@/components/TrendIndicator.vue'

const router = useRouter()

// 模拟数据
const funnels = ref([
  {
    id: 1,
    name: '注册转化漏斗',
    steps: [
      '访问注册页',
      '填写表单',
      '验证邮箱',
      '完成注册'
    ],
    conversionRate: 0.45,
    previousRate: 0.42,
    visitors: 12543,
    createdAt: '2024-01-10T08:30:00'
  },
  {
    id: 2,
    name: '购物车结算漏斗',
    steps: [
      '浏览商品',
      '加入购物车',
      '填写地址',
      '选择支付方式',
      '完成支付'
    ],
    conversionRate: 0.28,
    previousRate: 0.31,
    visitors: 8976,
    createdAt: '2024-01-12T15:20:00'
  },
  {
    id: 3,
    name: '会员升级漏斗',
    steps: [
      '访问会员页',
      '查看权益',
      '选择套餐',
      '支付升级'
    ],
    conversionRate: 0.15,
    previousRate: 0.12,
    visitors: 5432,
    createdAt: '2024-01-14T11:45:00'
  }
])

// 查看漏斗详情
const viewDetails = (id) => {
  router.push(`/funnel/detail/${id}`)
}

// 编辑漏斗
const editFunnel = (id) => {
  router.push(`/funnel/edit/${id}`)
}

// 删除漏斗
const deleteFunnel = (id) => {
  if (confirm('确定要删除这个漏斗吗？')) {
    funnels.value = funnels.value.filter(f => f.id !== id)
  }
}
</script>

<style scoped>
.funnel-list {
  padding: 20px;
  margin: 0 auto;
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
  transition: background-color 0.3s;
}

.create-btn:hover {
  background: #40a9ff;
}

.funnel-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

th {
  background: #fafafa;
  font-weight: 500;
  color: #262626;
}

tr:hover {
  background: #fafafa;
}

.action-btn {
  padding: 4px 8px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.3s;
}

.action-btn:hover {
  opacity: 0.8;
}

.view-btn {
  background: #52c41a;
  color: white;
}

.edit-btn {
  background: #faad14;
  color: white;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
}
</style>