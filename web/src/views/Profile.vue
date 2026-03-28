<template>
  <div class="profile-page">
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
        <el-card class="profile-card">
          <template #header>
            <div class="card-header">
              <span>个人中心</span>
            </div>
          </template>

          <div class="profile-info" v-if="user">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="用户ID">{{ user.id }}</el-descriptions-item>
              <el-descriptions-item label="姓名">{{ user.name }}</el-descriptions-item>
              <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
              <el-descriptions-item label="会员等级">
                <el-tag :type="memberTagType">{{ user.membership || 'free' }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="角色权限">
                <el-tag>{{ user.role || 'user' }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="注册时间">
                {{ user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-' }}
              </el-descriptions-item>
            </el-descriptions>

            <div class="actions">
              <el-button type="primary" @click="handleEdit">编辑资料</el-button>
              <el-button @click="handleLogout">退出登录</el-button>
            </div>
          </div>

          <div v-else class="no-user">
            <p>未登录，请先登录</p>
            <el-button type="primary" @click="$router.push('/login')">去登录</el-button>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api'

const router = useRouter()
const user = ref<any>(null)

const memberTagType = computed(() => {
  const level = user.value?.membership || 'free'
  const types: Record<string, any> = {
    free: 'info',
    silver: '',
    gold: 'warning',
    platinum: 'danger'
  }
  return types[level] || 'info'
})

onMounted(async () => {
  await loadProfile()
})

async function loadProfile() {
  try {
    const res = await authApi.getProfile()
    user.value = res.data
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

function handleEdit() {
  ElMessage.info('编辑功能开发中...')
}

function handleLogout() {
  localStorage.removeItem('lvyeyun_token')
  user.value = null
  ElMessage.success('退出成功')
  router.push('/')
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
  max-width: 800px;
  margin: 0 auto;
}

.actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
}

.no-user {
  text-align: center;
  padding: 40px;
}
</style>
