<template>
  <div class="report-page">
    <!-- 报表配置区域 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>报表配置</span>
          <div class="header-actions">
            <el-button type="primary" @click="generateReport">生成报表</el-button>
            <el-button @click="saveAsTemplate">保存为模板</el-button>
            <el-button type="success" @click="exportData">导出数据</el-button>
          </div>
        </div>
      </template>

      <el-form :model="reportConfig" label-width="100px">
        <!-- 时间范围选择 -->
        <el-form-item label="时间范围">
          <el-date-picker v-model="reportConfig.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" :shortcuts="dateShortcuts" />
        </el-form-item>

        <!-- 指标选择 -->
        <el-form-item label="统计指标">
          <el-select v-model="reportConfig.metrics" multiple placeholder="请选择统计指标">
            <el-option v-for="metric in availableMetrics" :key="metric.value" :label="metric.label"
              :value="metric.value" />
          </el-select>
        </el-form-item>

        <!-- 维度选择 -->
        <el-form-item label="分析维度">
          <el-select v-model="reportConfig.dimensions" multiple placeholder="请选择分析维度">
            <el-option v-for="dimension in availableDimensions" :key="dimension.value" :label="dimension.label"
              :value="dimension.value" />
          </el-select>
        </el-form-item>

        <!-- 过滤条件 -->
        <el-form-item label="过滤条件">
          <div v-for="(filter, index) in reportConfig.filters" :key="index" class="filter-item">
            <el-select v-model="filter.field" placeholder="选择字段">
              <el-option v-for="field in filterFields" :key="field.value" :label="field.label" :value="field.value" />
            </el-select>
            <el-select v-model="filter.operator" placeholder="运算符">
              <el-option label="等于" value="eq" />
              <el-option label="大于" value="gt" />
              <el-option label="小于" value="lt" />
              <el-option label="包含" value="contains" />
            </el-select>
            <el-input v-model="filter.value" placeholder="输入值" />
            <el-button type="danger" @click="removeFilter(index)">删除</el-button>
          </div>
          <el-button type="primary" link @click="addFilter">添加过滤条件</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 报表展示区域 -->
    <el-card class="report-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>报表数据</span>
          <el-radio-group v-model="chartType">
            <el-radio-button label="table">表格</el-radio-button>
            <el-radio-button label="line">折线图</el-radio-button>
            <el-radio-button label="bar">柱状图</el-radio-button>
            <el-radio-button label="pie">饼图</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <!-- 表格视图 -->
      <el-table v-if="chartType === 'table'" :data="reportData" border style="width: 100%">
        <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop" :label="column.label" />
      </el-table>

      <!-- 图表视图 -->
      <div v-else class="chart-container">
        <component :is="currentChart" :data="reportData" :options="chartOptions" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getReportData, saveReportTemplate } from '@/api/report'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'

// 可用指标
const availableMetrics = [
  { label: '访问量(PV)', value: 'pv' },
  { label: '访客数(UV)', value: 'uv' },
  { label: '停留时间', value: 'duration' },
  { label: '跳出率', value: 'bounce_rate' },
  { label: '转化次数', value: 'conversion' }
]

// 可用维度
const availableDimensions = [
  { label: '日期', value: 'date' },
  { label: '小时', value: 'hour' },
  { label: '页面', value: 'page' },
  { label: '来源', value: 'source' },
  { label: '设备', value: 'device' }
]

// 过滤字段
const filterFields = [
  { label: '页面路径', value: 'page_path' },
  { label: '用户ID', value: 'user_id' },
  { label: '设备类型', value: 'device_type' },
  { label: '浏览器', value: 'browser' }
]

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]

// 报表配置
const reportConfig = ref({
  dateRange: [],
  metrics: [],
  dimensions: [],
  filters: []
})

// 图表类型
const chartType = ref('table')
const loading = ref(false)
const reportData = ref([])

// 添加过滤条件
const addFilter = () => {
  reportConfig.value.filters.push({
    field: '',
    operator: 'eq',
    value: ''
  })
}

// 删除过滤条件
const removeFilter = (index) => {
  reportConfig.value.filters.splice(index, 1)
}

// 生成报表
const generateReport = async () => {
  if (!reportConfig.value.metrics.length) {
    ElMessage.warning('请至少选择一个统计指标')
    return
  }

  loading.value = true
  try {
    const { data } = await getReportData(reportConfig.value)
    reportData.value = data
  } catch (error) {
    console.error('获取报表数据失败:', error)
    ElMessage.error('获取报表数据失败')
  } finally {
    loading.value = false
  }
}

// 保存为模板
const saveAsTemplate = async () => {
  try {
    await ElMessageBox.prompt('请输入模板名称', '保存模板', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(({ value }) => {
        return saveReportTemplate({
          name: value,
          config: reportConfig.value
        })
      })
    ElMessage.success('保存模板成功')
  } catch (error) {
    console.error('保存模板失败:', error)
  }
}

// 导出数据
const exportData = () => {
  // 实现导出逻辑
  const data = reportData.value
  const csvContent = convertToCSV(data)
  downloadCSV(csvContent, `report_${new Date().toISOString()}.csv`)
}

// 表格列配置
const tableColumns = computed(() => {
  if (!reportData.value.length) return []
  return Object.keys(reportData.value[0]).map(key => ({
    prop: key,
    label: key
  }))
})

// 当前图表组件
const currentChart = computed(() => {
  switch (chartType.value) {
    case 'line':
      return LineChart
    case 'bar':
      return BarChart
    case 'pie':
      return PieChart
    default:
      return null
  }
})

// 图表配置
const chartOptions = computed(() => {
  // 根据不同图表类型返回不同的配置
  return {
    // ... 图表配置项
  }
})
</script>

<style scoped>
.report-page {
  padding: 20px;
}

.config-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-item {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.chart-container {
  height: 400px;
}
</style>