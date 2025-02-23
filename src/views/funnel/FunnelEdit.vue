<template>
  <div class="funnel-edit">
    <div class="page-header">
      <h2>编辑漏斗</h2>
    </div>

    <div class="edit-form">
      <div class="form-group">
        <label>漏斗名称（中文）</label>
        <input v-model="funnelData.name" type="text" class="form-input" placeholder="请输入漏斗中文名称" />
      </div>
      <div class="form-group">
        <label>漏斗名称（英文）</label>
        <input v-model="funnelData.nameEn" type="text" class="form-input" placeholder="请输入漏斗英文名称" />
      </div>
      <div class="form-group">
        <label>描述</label>
        <textarea v-model="funnelData.description" class="form-input"></textarea>
      </div>

      <div class="form-group">
        <label>漏斗步骤</label>
        <div class="steps-list">
          <div v-for="(step, index) in funnelData.steps" :key="index" class="step-item">
            <div class="step-header">
              <span class="step-number">步骤 {{ index + 1 }}</span>
              <button v-if="index > 0" @click="removeStep(index)" class="remove-btn">删除</button>
            </div>
            <input v-model="step.name" type="text" class="form-input" placeholder="步骤名称（中文）" />
            <input v-model="step.nameEn" type="text" class="form-input" placeholder="步骤名称（英文）" />
            <select v-model="step.eventType" class="form-input">
              <option value="page">页面浏览</option>
              <option value="action">用户行为</option>
            </select>
          </div>
        </div>
        <button @click="addStep" class="add-step-btn">添加步骤</button>
      </div>

      <div class="form-actions">
        <button @click="saveFunnel" class="save-btn">保存漏斗</button>
        <button @click="cancel" class="cancel-btn">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const funnelData = ref({
  name: '商品购买转化漏斗',
  nameEn: 'Product Purchase Funnel',
  description: '分析用户从浏览商品到最终完成购买的转化过程，识别流失节点',
  steps: [
    { 
      name: '浏览商品详情', 
      eventType: 'page',
      eventName: 'page_view',
      conditions: {
        path: '/product/detail'
      }
    },
    { 
      name: '加入购物车', 
      nameEn: 'Add to Cart',
      eventType: 'action',
      eventName: 'add_to_cart',
      conditions: {
        action: 'click',
        element: '.add-cart-btn'
      }
    },
    { 
      name: '进入购物车页面', 
      nameEn: 'View Cart',
      eventType: 'page',
      eventName: 'page_view',
      conditions: {
        path: '/cart'
      }
    },
    { 
      name: '开始结算', 
      nameEn: 'Start Checkout',
      eventType: 'action',
      eventName: 'start_checkout',
      conditions: {
        action: 'click',
        element: '.checkout-btn'
      }
    },
    { 
      name: '提交订单', 
      nameEn: 'Submit Order',
      eventType: 'action',
      eventName: 'submit_order',
      conditions: {
        action: 'click',
        element: '.submit-order-btn'
      }
    }
  ]
})

const addStep = () => {
  funnelData.value.steps.push({ 
    name: '', 
    nameEn: '',
    eventType: 'page' 
  })
}

const removeStep = (index) => {
  funnelData.value.steps.splice(index, 1)
}

const saveFunnel = () => {
  // 这里添加保存逻辑
  router.push('/funnel/list')
}

const cancel = () => {
  router.push('/funnel/list')
}
</script>

<style scoped>
.funnel-edit {
  padding: 20px;
}

.edit-form {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-bottom: 8px;
}

textarea.form-input {
  min-height: 100px;
  resize: vertical;
}

.steps-list {
  margin-bottom: 16px;
}

.step-item {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 16px;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.step-number {
  font-weight: 500;
}

.remove-btn {
  color: #ff4d4f;
  background: none;
  border: none;
  cursor: pointer;
}

.add-step-btn {
  width: 100%;
  padding: 8px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 24px;
}

.save-btn {
  padding: 8px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  padding: 8px 24px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:hover {
  opacity: 0.9;
}

.cancel-btn:hover {
  background: #e0e0e0;
}
</style>