<template>
  <div class="assistant-page">
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
        <h2>选择AI助手</h2>
        <el-row :gutter="20">
          <el-col v-for="agent in agents" :key="agent.id" :span="8">
            <el-card class="agent-card" shadow="hover" @click="selectAgent(agent)">
              <div class="agent-icon">{{ agent.icon }}</div>
              <h3>{{ agent.name }}</h3>
              <p>{{ agent.description }}</p>
              <el-tag>{{ agent.ability }}</el-tag>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { agentApi } from '@/api'

const router = useRouter()
const agents = ref([
  { id: 'lobster', name: '龙虾', icon: '🦞', description: '总指挥', ability: '协调' },
  { id: 'orange', name: '小橙', icon: '🍊', description: '需求采集', ability: '接待' },
  { id: 'blue', name: '小蓝', icon: '🗺️', description: '行程规划', ability: '定制' },
  { id: 'gold', name: '小金', icon: '💰', description: '比价报价', ability: '财务' },
  { id: 'warm', name: '小暖', icon: '🌟', description: '售后管家', ability: '客服' },
  { id: 'care', name: '小心', icon: '❤️', description: '情感伴侣', ability: '关系' },
  { id: 'green', name: '小绿', icon: '📋', description: '运营官', ability: '操作' }
])

onMounted(async () => {
  try {
    const res = await agentApi.getAgents()
    agents.value = res.data.map((a: any) => ({
      id: a.id,
      name: a.name,
      icon: a.icon,
      description: a.description || '',
      ability: a.ability || ''
    }))
  } catch (error) {
    console.error('获取Agent列表失败', error)
  }
})

function selectAgent(agent: any) {
  router.push(`/chat/${agent.id}`)
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

.agent-card {
  text-align: center;
  cursor: pointer;
  margin-bottom: 20px;
  transition: transform 0.2s;
}

.agent-card:hover {
  transform: translateY(-4px);
}

.agent-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.agent-card h3 {
  margin: 12px 0;
  font-size: 24px;
  color: #333;
}

.agent-card p {
  color: #666;
  margin-bottom: 12px;
}
</style>
