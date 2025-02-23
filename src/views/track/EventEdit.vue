<template>
  <div class="event-edit">
    <div class="page-header">
      <h2>编辑事件</h2>
    </div>

    <div class="edit-form">
      <div class="form-content">
        <div class="form-item">
          <label>事件名称</label>
          <input v-model="eventForm.name" type="text" placeholder="例如：view_product" />
          <small>使用下划线命名，例如：click_button, view_page</small>
        </div>

        <div class="form-item">
          <label>事件描述</label>
          <input v-model="eventForm.description" type="text" placeholder="请输入事件描述" />
        </div>

        <div class="form-item">
          <label>事件类型</label>
          <select v-model="eventForm.type">
            <option value="pv">页面浏览</option>
            <option value="click">点击事件</option>
            <option value="custom">自定义事件</option>
          </select>
        </div>

        <div class="form-item">
          <label>事件属性</label>
          <div class="properties-list">
            <div v-for="(prop, index) in eventForm.properties" :key="index" class="property-item">
              <input v-model="prop.key" type="text" placeholder="属性名" />
              <select v-model="prop.type">
                <option value="string">字符串</option>
                <option value="number">数字</option>
                <option value="boolean">布尔值</option>
                <option value="object">对象</option>
              </select>
              <input v-model="prop.description" type="text" placeholder="属性描述" />
              <label class="required-checkbox">
                <input type="checkbox" v-model="prop.required" />
                必填
              </label>
              <button class="remove-btn" @click="removeProperty(index)" v-if="eventForm.properties.length > 1">
                删除
              </button>
            </div>
          </div>
          <button class="add-btn" @click="addProperty">添加属性</button>
        </div>

        <div class="form-actions">
          <button class="cancel-btn" @click="cancel">取消</button>
          <button class="save-btn" @click="saveEvent" :disabled="!isValid">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 表单数据
const eventForm = ref({
  name: '',
  description: '',
  type: 'custom',
  properties: []
})

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
    description: '',
    required: false
  })
}

// 移除属性
const removeProperty = (index) => {
  eventForm.value.properties.splice(index, 1)
}

// 加载事件数据
const loadEventData = async () => {
  const eventId = route.params.id
  // 实际项目中这里需要调用API获取事件数据
  // 这里使用模拟数据
  const mockEvent = {
    id: eventId,
    name: 'view_product',
    description: '用户查看商品详情',
    type: 'pv',
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
        required: false
      },
      {
        key: 'price',
        type: 'number',
        description: '商品价格',
        required: true
      }
    ]
  }

  eventForm.value = { ...mockEvent }
}

// 保存事件
const saveEvent = async () => {
  if (!isValid.value) return

  try {
    // 实际项目中这里需要调用API保存数据
    console.log('保存事件:', eventForm.value)

    // 保存成功后返回列表页
    router.push('/track/list')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

// 取消编辑
const cancel = () => {
  router.back()
}

// 组件挂载时加载数据
onMounted(() => {
  loadEventData()
})
</script>

<style scoped>
.event-edit {
  padding: 20px;
}

.edit-form {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.form-item input[type="text"],
.form-item select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.form-item small {
  display: block;
  margin-top: 4px;
  color: #666;
}

.properties-list {
  margin-bottom: 12px;
}

.property-item {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr auto auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.required-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.add-btn {
  background: #52c41a;
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

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.save-btn,
.cancel-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background: #1890ff;
  color: white;
}

.save-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}

.cancel-btn {
  background: white;
  border: 1px solid #d9d9d9;
}

button:hover:not(:disabled) {
  opacity: 0.8;
}
</style>