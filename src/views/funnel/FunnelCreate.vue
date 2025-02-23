<template>
  <div class="funnel-create">
    <h2>创建漏斗</h2>

    <div class="funnel-form">
      <div class="form-group">
        <label>漏斗名称</label>
        <input v-model="funnelName" type="text" placeholder="请输入漏斗名称" class="form-control">
        <small class="help-text">例如：注册转化漏斗</small>
      </div>

      <div class="funnel-steps">
        <h3>漏斗步骤</h3>
        <div class="help-text">
          <p>事件名必须与代码中 track() 方法追踪的事件名完全一致</p>
          <p>例如：view_register_page, start_register, submit_form 等</p>
        </div>

        <div v-for="(step, index) in steps" :key="index" class="step-item">
          <div class="step-header">
            <span class="step-number">步骤 {{ index + 1 }}</span>
            <button v-if="steps.length > 2" @click="removeStep(index)" class="remove-btn">
              删除
            </button>
          </div>

          <input v-model="step.name" type="text" :placeholder="`请输入步骤${index + 1}名称（例如：查看注册页）`" class="form-control">
          <input v-model="step.event" type="text" :placeholder="`请输入步骤${index + 1}对应的事件名（例如：view_register_page）`"
            class="form-control">
        </div>

        <button @click="addStep" class="add-btn">
          添加步骤
        </button>
      </div>

      <div class="form-actions">
        <button @click="saveFunnel" class="save-btn" :disabled="!isValid">
          保存漏斗
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 漏斗名称
const funnelName = ref('')

// 漏斗步骤
const steps = ref([
  { name: '', event: '' },
  { name: '', event: '' }
])

// 添加步骤
const addStep = () => {
  steps.value.push({ name: '', event: '' })
}

// 删除步骤
const removeStep = (index) => {
  steps.value.splice(index, 1)
}

// 表单验证
const isValid = computed(() => {
  if (!funnelName.value) return false
  return steps.value.every(step => step.name && step.event)
})

// 保存漏斗
const saveFunnel = () => {
  if (!isValid.value) return

  const tracker = new window.Tracker({
    requestUrl: '/api/track',
    historyTracker: true,
    domTracker: true,
    jsError: true
  })

  // 创建漏斗
  tracker.createFunnel(
    funnelName.value,
    steps.value.map(step => step.event)
  )

  // 保存成功后跳转
  router.push('/funnel/list')
}
</script>

<style scoped>
.funnel-create {
  padding: 20px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.step-item {
  background: #f5f5f5;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.step-number {
  font-weight: bold;
}

.remove-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.save-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

button:hover {
  opacity: 0.9;
}

.help-text {
  color: #666;
  font-size: 0.9em;
  margin: 4px 0 12px;
}

.help-text p {
  margin: 4px 0;
}
</style>