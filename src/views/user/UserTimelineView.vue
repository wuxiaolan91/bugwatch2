<template>
  <div class="user-timeline-view">
    <h2>用户事件时间线</h2>
    <input v-model="searchQuery" placeholder="搜索事件" class="search-input" />
    <ul class="timeline">
      <li v-for="event in filteredEvents" :key="event.id" class="timeline-item">
        <div class="timeline-content">
          <div class="event-time">{{ formatDate(event.date, 'YYYY-MM-DD HH:mm') }}</div>
          <div class="event-details">
            <h3 class="event-name" :class="getEventTypeClass(event.type)">{{ event.name }}</h3>
            <p class="event-description">{{ event.description }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from '@/utils/format'

const userEvents = ref([])
const searchQuery = ref('')
const route = useRoute()
const userId = route.params.id

const getEventTypeClass = (type) => {
  return {
    'event-type-page': type === 'page',
    'event-type-action': type === 'action'
  }
}

onMounted(() => {
  userEvents.value = [
    {
      id: 1,
      name: 'page_view',
      description: '进入首页',
      date: '2024-01-20T14:20:00',
      type: 'page'
    },
    {
      id: 2,
      name: 'page_view',
      description: '进入商品列表页',
      date: '2024-01-20T14:22:30',
      type: 'page'
    },
    {
      id: 3,
      name: 'view_product',
      description: '查看商品详情 - iPhone 14',
      date: '2024-01-20T14:23:15',
      type: 'action'
    },
    {
      id: 4,
      name: 'add_to_cart',
      description: '添加购物车 - iPhone 14',
      date: '2024-01-20T14:25:30',
      type: 'action'
    },
    {
      id: 5,
      name: 'page_leave',
      description: '离开商品详情页',
      date: '2024-01-20T14:26:00',
      type: 'page'
    },
    {
      id: 6,
      name: 'page_view',
      description: '进入商品详情页 - AirPods Pro',
      date: '2024-01-20T14:28:45',
      type: 'page'
    },
    {
      id: 7,
      name: 'add_to_cart',
      description: '添加购物车 - AirPods Pro',
      date: '2024-01-20T14:29:20',
      type: 'action'
    },
    {
      id: 8,
      name: 'page_leave',
      description: '离开商品详情页',
      date: '2024-01-20T14:30:00',
      type: 'page'
    },
    {
      id: 9,
      name: 'page_view',
      description: '进入购物车页面',
      date: '2024-01-20T14:34:45',
      type: 'page'
    },
    {
      id: 10,
      name: 'start_checkout',
      description: '开始结算 - 2件商品',
      date: '2024-01-20T14:35:10',
      type: 'action'
    },
    {
      id: 11,
      name: 'page_view',
      description: '进入结算页面',
      date: '2024-01-20T14:35:30',
      type: 'page'
    },
    {
      id: 12,
      name: 'view_address',
      description: '查看收货地址列表',
      date: '2024-01-20T14:36:05',
      type: 'action'
    },
    {
      id: 13,
      name: 'select_payment',
      description: '选择支付方式 - 支付宝',
      date: '2024-01-20T14:37:30',
      type: 'action'
    },
    {
      id: 14,
      name: 'complete_purchase',
      description: '完成购买 - 订单号: 202401200001',
      date: '2024-01-20T14:38:45',
      type: 'action'
    },
    {
      id: 15,
      name: 'page_view',
      description: '进入支付成功页面',
      date: '2024-01-20T14:39:00',
      type: 'page'
    },
    {
      id: 16,
      name: 'page_leave',
      description: '离开支付成功页面',
      date: '2024-01-20T14:40:30',
      type: 'page'
    }
  ]
})

const filteredEvents = computed(() => {
  if (!searchQuery.value) {
    return userEvents.value
  }
  return userEvents.value.filter(event =>
    event.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style scoped>
.user-timeline-view {
  padding: 20px;
}

.search-input {
  margin-bottom: 20px;
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}

.timeline {
  list-style: none;
  padding: 0;
}

.timeline-item {
  margin-bottom: 20px;
  position: relative;
  padding-left: 20px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 10px;
  background: #1890ff;
  border-radius: 50%;
}

.timeline-content {
  display: flex;
  align-items: center;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
}

.event-time {
  flex: 0 0 150px;
  color: #999;
  font-size: 12px;
  text-align: right;
  margin-right: 20px;
}

.event-details {
  flex: 1;
}

.event-name {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.event-type-page {
  background-color: #e6f7ff;
  color: rgb(24, 144, 255, .65);
}

.event-type-action {
  background-color: #f6ffed;
  color: rgb(82, 196, 26, .8);
}

.event-description {
  display: inline-block;
  background-color: #f5f5f5;
  padding: 5px;
  border-radius: 4px;
  margin-top: 5px;
}
</style>