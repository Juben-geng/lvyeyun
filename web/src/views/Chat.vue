<template>
  <div class="chat-page">
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="back-button" @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon>
          </div>
          <div class="agent-info">
            <span class="icon">{{ currentAgent?.icon }}</span>
            <span class="name">{{ currentAgent?.name }}</span>
          </div>
        </div>
      </el-header>

      <el-main class="chat-main">
        <div class="messages" ref="messagesRef">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="['message', msg.role]"
          >
            <div class="message-avatar">{{ msg.role === 'user' ? '👤' : currentAgent?.icon }}</div>
            <div class="message-content">{{ msg.content }}</div>
          </div>
          <div v-if="loading" class="message assistant">
            <div class="message-avatar">{{ currentAgent?.icon }}</div>
            <div class="message-content">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>思考中...</span>
            </div>
          </div>
        </div>

        <div class="input-area">
          <el-input
            v-model="inputMessage"
            placeholder="输入消息..."
            :disabled="loading"
            @keyup.enter="sendMessage"
          >
            <template #append>
              <el-button :icon="Promotion" @click="sendMessage" :loading="loading" />
            </template>
          </el-input>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Promotion, Loading } from '@element-plus/icons-vue'
import { agentApi } from '@/api'

const route = useRoute()
const router = useRouter()
const agentId = computed(() => route.params.id as string)
const messages = ref<{ role: string; content: string }[]>([])
const inputMessage = ref('')
const loading = ref(false)
const messagesRef = ref<HTMLElement>()
const currentAgent = ref<any>(null)

const agents = ref([
  { id: 'lobster', name: '龙虾', icon: '🦞' },
  { id: 'orange', name: '小橙', icon: '🍊' },
  { id: 'blue', name: '小蓝', icon: '🗺️' },
  { id: 'gold', name: '小金', icon: '💰' },
  { id: 'warm', name: '小暖', icon: '🌟' },
  { id: 'care', name: '小心', icon: '❤️' },
  { id: 'green', name: '小绿', icon: '📋' }
])

onMounted(async () => {
  currentAgent.value = agents.value.find((a) => a.id === agentId.value)
  messages.value.push({
    role: 'assistant',
    content: `你好！我是${currentAgent.value?.name}，很高兴为您服务。有什么可以帮助您的？`
  })
  await scrollToBottom()
})

async function sendMessage() {
  if (!inputMessage.value.trim() || loading.value) return

  messages.value.push({
    role: 'user',
    content: inputMessage.value
  })
  const userMessage = inputMessage.value
  inputMessage.value = ''
  await scrollToBottom()

  loading.value = true
  try {
    const res = await agentApi.chat(agentId.value, userMessage)
    messages.value.push({
      role: 'assistant',
      content: res.data.response
    })
  } catch (error: any) {
    messages.value.push({
      role: 'assistant',
      content: '抱歉，我遇到了一些问题，请稍后重试。'
    })
  } finally {
    loading.value = false
    await scrollToBottom()
  }
}

async function scrollToBottom() {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}
</script>

<style scoped>
.el-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 16px;
}

.back-button {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.back-button:hover {
  background: #f5f5f5;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.agent-info .icon {
  font-size: 24px;
}

.agent-info .name {
  font-size: 18px;
  font-weight: bold;
}

.chat-main {
  display: flex;
  flex-direction: column;
  padding: 0;
  height: calc(100vh - 60px);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  max-width: 70%;
}

.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
}

.message.user .message-content {
  background: #FF6B35;
  color: #fff;
}

.message.assistant .message-content {
  background: #fff;
  color: #333;
}

.input-area {
  padding: 20px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
}
</style>
