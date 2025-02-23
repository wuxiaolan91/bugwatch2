<template>
  <div class="event-management">
    <div class="page-header">
      <h2>事件管理</h2>
    </div>

    <!-- 创建事件表单 -->
    <div class="create-form">
      <h3>创建埋点事件</h3>
      <div class="form-content">
        <div class="form-item">
          <label>事件名称</label>
          <input v-model="eventForm.name" type="text" placeholder="例如：view_product" />
          <small>使用下划线命名，例如：click_button, view_page</small>
        </div>

        <div class="form-item">
          <label>事件描述</label>
          <input v-model="eventForm.description" type="text" placeholder="例如：用户查看商品详情" />
        </div>

        <div class="form-item">
          <label>事件类型</label>
          <select v-model="eventForm.type">
            <option value="pv">页面浏览(PV)</option>
            <option value="click">点击事件</option>
            <option value="custom">自定义事件</option>
          </select>
        </div>

        <div class="form-item">
          <label>事件属性</label>
          <div v-for="(prop, index) in eventForm.properties" :key="index" class="property-item">
            <input v-model="prop.key" type="text" placeholder="属性名" />
            <select v-model="prop.type">
              <option value="string">字符串</option>
              <option value="number">数字</option>
              <option value="boolean">布尔值</option>
            </select>
            <input v-model="prop.description" type="text" placeholder="属性描述" />
            <button class="remove-btn" @click="removeProperty(index)">删除</button>
          </div>
          <button class="add-btn" @click="addProperty">添加属性</button>
        </div>

        <div class="form-actions">
          <button class="submit-btn" @click="createEvent" :disabled="!isValid">创建事件</button>
        </div>
      </div>
    </div>

    <!-- 事件列表 -->
    <div class="event-list">
      <h3>已创建的事件</h3>
      <table>
        <thead>
          <tr>
            <th>事件名称</th>
            <th>事件描述</th>
            <th>事件类型</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in events" :key="event.id">
            <td>{{ event.name }}</td>
            <td>{{ event.description }}</td>
            <td>{{ getEventTypeName(event.type) }}</td>
            <td>{{ formatDate(event.createdAt) }}</td>
            <td>
              <button class="action-btn view-btn" @click="viewEvent(event)">查看</button>
              <button class="action-btn edit-btn" @click="editEvent(event)">编辑</button>
              <button class="action-btn delete-btn" @click="deleteEvent(event.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatDate } from '@/utils/format'
import { useRouter } from 'vue-router' // 添加这行

const router = useRouter() // 添加这行

// 表单数据
const eventForm = ref({
  name: '',
  description: '',
  type: 'custom',
  properties: []
})

// 模拟的事件列表数据
const events = ref([
  {
    id: 1,
    name: 'view_product',
    description: '用户查看商品详情',
    type: 'pv',
    properties: [
      { key: 'product_id', type: 'string', description: '商品ID' },
      { key: 'category', type: 'string', description: '商品分类' },
      { key: 'price', type: 'number', description: '商品价格' }
    ],
    createdAt: '2024-01-10T08:30:00'
  },
  {
    id: 2,
    name: 'add_to_cart',
    description: '用户添加商品到购物车',
    type: 'click',
    properties: [
      { key: 'product_id', type: 'string', description: '商品ID' },
      { key: 'quantity', type: 'number', description: '添加数量' }
    ],
    createdAt: '2024-01-12T15:20:00'
  },
  {
    id: 3,
    name: 'start_checkout',
    description: '用户开始结算',
    type: 'custom',
    properties: [
      { key: 'total_amount', type: 'number', description: '总金额' },
      { key: 'item_count', type: 'number', description: '商品数量' },
      { key: 'is_first_purchase', type: 'boolean', description: '是否首次购买' }
    ],
    createdAt: '2024-01-14T11:45:00'
  }
])

// 表单验证
const isValid = computed(() => {
  return eventForm.value.name &&
    eventForm.value.description &&
    eventForm.value.type &&
    eventForm.value.properties.every(p => p.key && p.type && p.description)
})

// 添加属性
const addProperty = () => {
  eventForm.value.properties.push({
    key: '',
    type: 'string',
    description: ''
  })
}

// 移除属性
const removeProperty = (index) => {
  eventForm.value.properties.splice(index, 1)
}

// 创建事件
const createEvent = () => {
  if (!isValid.value) return

  const newEvent = {
    id: events.value.length + 1,
    ...eventForm.value,
    createdAt: new Date().toISOString()
  }

  events.value.push(newEvent)
  resetForm()
}

// 重置表单
const resetForm = () => {
  eventForm.value = {
    name: '',
    description: '',
    type: 'custom',
    properties: []
  }
}

// 获取事件类型名称
const getEventTypeName = (type) => {
  const typeMap = {
    pv: '页面浏览',
    click: '点击事件',
    custom: '自定义事件'
  }
  return typeMap[type] || type
}

// 查看事件详情
const viewEvent = (event) => {
  router.push(`/track/detail/${event.id}`)
}

// 编辑事件
const editEvent = (event) => {
  router.push(`/track/edit/${event.id}`)
}

// 删除事件
const deleteEvent = (id) => {
  if (confirm('确定要删除这个事件吗？')) {
    events.value = events.value.filter(e => e.id !== id)
  }
}
</script>

<style scoped>
.event-management {
  padding: 20px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.create-form,
.event-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-content {
  max-width: 800px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-item input,
.form-item select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 4px;
}

.form-item small {
  color: #666;
  font-size: 12px;
}

.property-item {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr auto;
  gap: 8px;
  margin-bottom: 8px;
}

.add-btn {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn {
  background: #52c41a;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
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

.action-btn {
  padding: 4px 8px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.view-btn {
  background: #1890ff;
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

button:hover {
  opacity: 0.8;
}
</style>