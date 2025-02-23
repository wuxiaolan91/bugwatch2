<template>
  <div class="dashboard-overview">
    <!-- 数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in dataCards" :key="card.title">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>{{ card.title }}</span>
              <el-tooltip :content="card.tip">
                <el-icon>
                  <InfoFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="card-content">
            <div class="number">{{ card.value }}</div>
            <div class="trend" :class="card.trend > 0 ? 'up' : 'down'">
              {{ Math.abs(card.trend) }}%
              <el-icon>
                <CaretTop v-if="card.trend > 0" />
                <CaretBottom v-else />
              </el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card>
          <template #header>事件趋势</template>
          <div class="chart-container">
            <LineChart :data="eventTrendData" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>用户行为分布</template>
          <div class="chart-container">
            <PieChart :data="userBehaviorData" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDashboardData } from '@/api/dashboard'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'

const dataCards = ref([
  { title: '今日PV', value: 0, trend: 0, tip: '页面访问量' },
  { title: '今日UV', value: 0, trend: 0, tip: '独立访客数' },
  { title: '转化率', value: '0%', trend: 0, tip: '目标转化率' },
  { title: '平均停留时间', value: '0分钟', trend: 0, tip: '用户平均访问时长' }
])

const eventTrendData = ref([])
const userBehaviorData = ref([])

const fetchDashboardData = async () => {
  try {
    const { data } = await getDashboardData()
    // 更新数据
    dataCards.value = data.cards
    eventTrendData.value = data.eventTrend
    userBehaviorData.value = data.userBehavior
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.dashboard-overview {
  padding: 20px;
}

.charts-row {
  margin-top: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.number {
  font-size: 24px;
  font-weight: bold;
}

.trend {
  display: flex;
  align-items: center;

  &.up {
    color: #67c23a;
  }

  &.down {
    color: #f56c6c;
  }
}

.chart-container {
  height: 300px;
}
</style>