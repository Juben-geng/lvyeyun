<template>
  <div class="login-page">
    <div class="login-container">
      <div class="brand">
        <span class="logo">🦞</span>
        <h1>旅业云AI</h1>
        <p>旅游行业专属AI平台</p>
      </div>

      <el-card class="login-card">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="邮箱登录" name="email">
            <el-form ref="emailFormRef" :model="emailForm" :rules="emailRules">
              <el-form-item prop="email">
                <el-input
                  v-model="emailForm.email"
                  placeholder="请输入邮箱"
                  prefix-icon="User"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="emailForm.password"
                  type="password"
                  placeholder="请输入密码"
                  prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleEmailLogin"
                  :loading="loading"
                  style="width: 100%"
                >
                  登录
                </el-button>
              </el-form-item>
              <div class="register-link">
                <span>还没有账号？</span>
                <el-button type="primary" link @click="activeTab = 'register'">
                  立即注册
                </el-button>
              </div>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="微信登录" name="wechat">
            <div class="wechat-login">
              <p>请使用微信扫码登录</p>
              <div class="qr-placeholder">
                <el-icon :size="60"><QrCode /></el-icon>
                <p>二维码加载中...</p>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="注册" name="register">
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules">
              <el-form-item prop="name">
                <el-input
                  v-model="registerForm.name"
                  placeholder="请输入姓名"
                  prefix-icon="User"
                />
              </el-form-item>
              <el-form-item prop="email">
                <el-input
                  v-model="registerForm.email"
                  placeholder="请输入邮箱"
                  prefix-icon="Message"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="registerForm.password"
                  type="password"
                  placeholder="请输入密码"
                  prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="handleRegister"
                  :loading="loading"
                  style="width: 100%"
                >
                  注册
                </el-button>
              </el-form-item>
              <div class="register-link">
                <span>已有账号？</span>
                <el-button type="primary" link @click="activeTab = 'email'">
                  立即登录
                </el-button>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { QrCode } from '@element-plus/icons-vue'
import { authApi } from '@/api'

const router = useRouter()
const activeTab = ref('email')
const loading = ref(false)

const emailFormRef = ref<FormInstance>()
const emailForm = reactive({
  email: '',
  password: ''
})

const emailRules: FormRules = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const registerFormRef = ref<FormInstance>()
const registerForm = reactive({
  name: '',
  email: '',
  password: ''
})

const registerRules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

async function handleEmailLogin() {
  if (!emailFormRef.value) return
  await emailFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const res = await authApi.login({
        email: emailForm.email,
        password: emailForm.password
      })
      localStorage.setItem('lvyeyun_token', res.data.token)
      ElMessage.success('登录成功')
      router.push('/')
    } catch (error: any) {
      ElMessage.error(error.response?.data?.error || '登录失败')
    } finally {
      loading.value = false
    }
  })
}

async function handleRegister() {
  if (!registerFormRef.value) return
  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const res = await authApi.register({
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password
      })
      localStorage.setItem('lvyeyun_token', res.data.token)
      ElMessage.success('注册成功')
      router.push('/')
    } catch (error: any) {
      ElMessage.error(error.response?.data?.error || '注册失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FF6B35 0%, #f093fb 100%);
}

.login-container {
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.brand {
  text-align: center;
  margin-bottom: 40px;
  color: #fff;
}

.logo {
  font-size: 64px;
  display: block;
  margin-bottom: 10px;
}

.brand h1 {
  font-size: 32px;
  margin: 10px 0;
}

.brand p {
  font-size: 16px;
  opacity: 0.9;
}

.login-card {
  padding: 20px;
}

.wechat-login {
  text-align: center;
  padding: 40px 0;
}

.qr-placeholder {
  margin-top: 20px;
  color: #999;
}

.register-link {
  text-align: center;
  margin-top: 16px;
}
</style>
