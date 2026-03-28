<template>
  <div class="itinerary-page">
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="brand">
            <span class="logo">🦞</span>
            <span class="name">旅业云AI</span>
          </div>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </el-header>

      <el-main>
        <div class="page-header">
          <h2>行程管理</h2>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            创建行程
          </el-button>
        </div>

        <el-card>
          <el-table :data="itineraries" stripe>
            <el-table-column prop="destination" label="目的地" />
            <el-table-column prop="startDate" label="开始日期">
              <template #default="{ row }">
                {{ formatDate(row.startDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="endDate" label="结束日期">
              <template #default="{ row }">
                {{ formatDate(row.endDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="statusType(row.status)">
                  {{ statusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleView(row)">
                  查看
                </el-button>
                <el-button type="primary" link @click="handleEdit(row)">
                  编辑
                </el-button>
                <el-button type="danger" link @click="handleDelete(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-if="itineraries.length === 0" description="暂无行程" />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const itineraries = ref([
  {
    id: 1,
    destination: '三亚',
    startDate: '2026-04-01',
    endDate: '2026-04-05',
    status: 'planning'
  },
  {
    id: 2,
    destination: '云南',
    startDate: '2026-05-10',
    endDate: '2026-05-15',
    status: 'confirmed'
  }
])

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}

function statusType(status: string) {
  const types: Record<string, any> = {
    planning: 'warning',
    confirmed: 'success',
    completed: 'info',
    cancelled: 'danger'
  }
  return types[status] || 'info'
}

function statusText(status: string) {
  const texts: Record<string, string> = {
    planning: '规划中',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status] || status
}

function handleCreate() {
  ElMessage.info('创建行程功能开发中...')
}

function handleView(row: any) {
  ElMessage.info(`查看行程: ${row.destination}`)
}

function handleEdit(row: any) {
  ElMessage.info(`编辑行程: ${row.destination}`)
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(`确定删除行程"${row.destination}"吗？`, '提示', {
      type: 'warning'
    })
    itineraries.value = itineraries.value.filter((i) => i.id !== row.id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.el-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 0 40px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: bold;
  color: #FF6B35;
}

.el-main {
  padding: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}
</style>
