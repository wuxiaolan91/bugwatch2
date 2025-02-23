<template>
  <div class="app-create">
    <div class="page-header">
      <h2>创建应用</h2>
    </div>

    <div class="create-form">
      <div class="form-content">
        <div class="form-item">
          <label>应用名称</label>
          <input v-model="appForm.name" type="text" placeholder="请输入应用名称" />
        </div>

        <div class="form-item">
          <label>应用描述</label>
          <textarea v-model="appForm.description" placeholder="请输入应用描述"></textarea>
        </div>

        <div class="form-item">
          <label>应用类型</label>
          <select v-model="appForm.type">
            <option value="web">Web应用</option>
            <option value="mobile">移动应用</option>
            <option value="desktop">桌面应用</option>
          </select>
        </div>

        <div class="form-item">
          <label>主题颜色</label>
          <div class="color-picker">
            <div v-for="color in themeColors" :key="color" class="color-item"
              :class="{ active: appForm.color === color }" :style="{ background: color }"
              @click="appForm.color = color">
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="cancel-btn" @click="cancel">取消</button>
          <button class="save-btn" @click="createApp" :disabled="!isValid">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 表单数据
const appForm = ref({
  name: '',
  description: '',
  type: 'web',
  color: '#1890ff'
})

// 主题颜色选项
const themeColors = [
  '#1890ff', '#52c41a', '#722ed1', '#faad14', '#13c2c2',
  '#eb2f96', '#f5222d', '#fa541c', '#fa8c16', '#a0d911'
]

// 表单验证
const isValid = computed(() => {
  return appForm.value.name &&
    appForm.value.description &&
    appForm.value.type &&
    appForm.value.color
})

// 创建应用
const createApp = async () => {
  if (!isValid.value) return

  try {
    // 实际项目中这里需要调用API创建应用
    console.log('创建应用:', appForm.value)

    // 创建成功后返回列表页
    router.push('/apps')
  } catch (error) {
    console.error('创建失败:', error)
  }
}

// 取消创建
const cancel = () => {
  router.back()
}
</script>

<style scoped>
.app-create {
  padding: 20px;
}

.create-form {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-content {
  max-width: 600px;
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
}

.form-item textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  height: 100px;
  resize: vertical;
}

.color-picker {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-item {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-item.active {
  border: 2px solid #000;
  transform: scale(1.1);
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