<template>
  <div class="home-page">
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="brand">
            <span class="logo">🦞</span>
            <span class="name">旅业云AI</span>
          </div>
          <el-menu mode="horizontal" :default-active="activeMenu" class="nav-menu">
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/assistant">AI助手</el-menu-item>
            <el-menu-item index="/itinerary">行程管理</el-menu-item>
          </el-menu>
          <div class="user-actions">
            <template v-if="user">
              <el-dropdown @command="handleCommand">
                <el-button type="primary" link>
                  {{ user.name }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <el-button v-else type="primary" @click="$router.push('/login')">
              登录/注册
            </el-button>
          </div>
        </div>
      </el-header>

      <el-main>
        <div class="hero-section">
          <h1>旅游行业专属AI平台</h1>
          <p>七大智能Agent，一站式解决需求采集、行程规划、比价报价、售后管家</p>
          <div class="action-buttons">
            <el-button type="primary" size="large" @click="$router.push('/assistant')">
              开始使用
            </el-button>
            <el-button size="large" @click="$router.push('/login')">
              免费注册
            </el-button>
          </div>
        </div>

        <div class="agents-section">
          <h2>七大智能Agent</h2>
          <el-row :gutter="20">
            <el-col v-for="agent in agents" :key="agent.name" :span="6">
              <el-card class="agent-card" shadow="hover">
                <div class="agent-icon">{{ agent.icon }}</div>
                <h3>{{ agent.name }}</h3>
                <p>{{ agent.description }}</p>
                <el-button type="primary" link @click="chatWithAgent(agent.id)">
                  对话
                </el-button>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>

      <el-footer>
        <p>© 2026 旅业云AI · 智途科技</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { agentApi, authApi } from '@/api'

const router = useRouter()
const user = ref<any>(null)
const agents = ref([
  { id: 'lobster', name: '龙虾', icon: '🦞', description: '总指挥，协调所有Agent' },
  { id: 'orange', name: '小橙', icon: '🍊', description: '需求采集，前台接待' },
  { id: 'blue', name: '小蓝', icon: '🗺️', description: '行程规划，资深定制' },
  { id: 'gold', name: '小金', icon: '💰', description: '比价报价，操作财务' },
  { id: 'warm', name: '小暖', icon: '🌟', description: '售后管家，客服贴心' },
  { id: 'care', name: '小心', icon: '❤️', description: '情感伴侣，客户关系' },
  { id: 'green', name: '小绿', icon: '📋', description: '运营官，操作OP' }
])

const activeMenu = computed(() => router.currentRoute.value.path)

onMounted(async () => {
  const token = localStorage.getItem('lvyeyun_token')
  if (token) {
    try {
      const res = await authApi.getProfile()
      user.value = res.data
    } catch (error) {
      console.error('获取用户信息失败', error)
    }
  }
  loadAgents()
})

async function loadAgents() {
  try {
    const res = await agentApi.getAgents()
    agents.value = res.data.map((a: any) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      description: a.description || ''
    }))
  } catch (error) {
    console.error('获取Agent列表失败', error)
  }
}

function chatWithAgent(agentId: string) {
  const token = localStorage.getItem('lvyeyun_token')
  if (!token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  router.push(`/chat/${agentId}`)
}

function handleCommand(command: string) {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    localStorage.removeItem('lvyeyun_token')
    user.value = null
    ElMessage.success('退出成功')
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

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

.logo {
  font-size: 24px;
}

.nav-menu {
  flex: 1;
  margin: 0 40px;
  border-bottom: none;
}

.el-main {
  padding: 40px;
}

.hero-section {
  text-align: center;
  padding: 80px 0;
}

.hero-section h1 {
  font-size: 48px;
  margin-bottom: 20px;
  color: #333;
}

.hero-section p {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.agents-section {
  margin-top: 60px;
}

.agents-section h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
  color: #333;
}

.agent-card {
  text-align: center;
  margin-bottom: 20px;
}

.agent-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.agent-card h3 {
  margin: 12px 0;
  color: #333;
}

.agent-card p {
  color: #666;
  margin-bottom: 16px;
}

.el-footer {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>
