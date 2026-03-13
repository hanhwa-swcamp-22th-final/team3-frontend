<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const autoLogin = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = '이메일과 비밀번호를 입력해주세요.'
    return
  }

  isLoading.value = true

  try {
    const res = await fetch(
      `http://localhost:3001/employees?employee_email=${encodeURIComponent(email.value)}`
    )
    const employees = await res.json()

    if (employees.length === 0) {
      errorMessage.value = '등록되지 않은 이메일입니다.'
      return
    }

    const employee = employees[0]

    if (employee.employee_password !== password.value) {
      errorMessage.value = '비밀번호가 일치하지 않습니다.'
      return
    }

    if (employee.is_locked) {
      errorMessage.value = '계정이 잠겨있습니다. 관리자에게 문의하세요.'
      return
    }

    authStore.login(employee)
    router.push({ name: 'Dashboard' })
  } catch {
    errorMessage.value = '서버에 연결할 수 없습니다.'
  } finally {
    isLoading.value = false
  }
}

function handleSsoLogin() {
  // TODO: implement SSO login logic
}
</script>

<template>
  <div class="login-page">
    <!-- Decorative background shapes -->
    <div class="bg-shape bg-shape--circle"></div>
    <div class="bg-shape bg-shape--rect"></div>

    <div class="login-card">
      <!-- Logo -->
      <div class="login-logo">
        <div class="login-logo__icon">SE</div>
        <h1 class="login-logo__title">S.E.T.O</h1>
        <p class="login-logo__subtitle">Smart Equipment & Talent Orchestrator</p>
      </div>

      <!-- Form -->
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="email">이메일</label>
          <input
            id="email"
            v-model="email"
            class="form-input"
            type="email"
            placeholder="name@seto.com"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">비밀번호</label>
          <input
            id="password"
            v-model="password"
            class="form-input"
            type="password"
            autocomplete="current-password"
          />
        </div>

        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

        <div class="form-checkbox">
          <input
            id="autoLogin"
            v-model="autoLogin"
            type="checkbox"
          />
          <label for="autoLogin">자동 로그인</label>
        </div>

        <button type="submit" class="btn btn--primary" :disabled="isLoading">
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="login-divider">
        <span>또는</span>
      </div>

      <!-- SSO Button -->
      <button class="btn btn--sso" @click="handleSsoLogin">
        <span class="btn__sso-icon">🏢</span>
        사내 SSO로 로그인
      </button>

      <!-- Footer link -->
      <a href="#" class="login-forgot">비밀번호 찾기</a>
    </div>
  </div>
</template>

<style scoped>
/* ── Page Layout ── */
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1147 0%, #2D1F6E 40%, #3a2a7a 100%);
  position: relative;
  overflow: hidden;
}

/* ── Decorative Background Shapes ── */
.bg-shape {
  position: absolute;
  opacity: 0.08;
}

.bg-shape--circle {
  width: 340px;
  height: 340px;
  border-radius: 50%;
  border: 50px solid #8b7fd4;
  bottom: 8%;
  left: -60px;
}

.bg-shape--rect {
  width: 160px;
  height: 160px;
  border-radius: 32px;
  border: 30px solid #8b7fd4;
  top: 12%;
  right: 8%;
  transform: rotate(15deg);
}

/* ── Login Card ── */
.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 20px;
  padding: 48px 40px 36px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Logo ── */
.login-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 36px;
}

.login-logo__icon {
  width: 56px;
  height: 56px;
  background: #2D1F6E;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.login-logo__title {
  font-size: 24px;
  font-weight: 700;
  color: #2D1F6E;
  margin: 0 0 4px;
  letter-spacing: 2px;
}

.login-logo__subtitle {
  font-size: 12px;
  color: #9992b8;
  margin: 0;
  letter-spacing: 0.5px;
}

/* ── Form ── */
.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #2D1F6E;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #E0DCFF;
  border-radius: 8px;
  font-size: 14px;
  color: #2D1F6E;
  background: #ffffff;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #5B4FCF;
  box-shadow: 0 0 0 3px rgba(91, 79, 207, 0.1);
}

/* ── Error Message ── */
.form-error {
  font-size: 13px;
  color: #EF476F;
  margin: 0 0 8px;
}

/* ── Checkbox ── */
.form-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 20px;
}

.form-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #2D1F6E;
  cursor: pointer;
}

.form-checkbox label {
  font-size: 13px;
  color: #5a5280;
  cursor: pointer;
}

/* ── Buttons ── */
.btn {
  width: 100%;
  height: 46px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn:active {
  transform: scale(0.99);
}

.btn--primary {
  background: #2D1F6E;
  color: #ffffff;
}

.btn--primary:hover {
  opacity: 0.92;
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--sso {
  background: #ffffff;
  color: #2D1F6E;
  border: 1.5px solid #E0DCFF;
}

.btn--sso:hover {
  background: #FAFBFF;
}

.btn__sso-icon {
  font-size: 12px;
  color: #2D1F6E;
}

/* ── Divider ── */
.login-divider {
  width: 100%;
  display: flex;
  align-items: center;
  margin: 16px 0;
}

.login-divider span {
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: #9992b8;
}

/* ── Forgot Password ── */
.login-forgot {
  margin-top: 16px;
  font-size: 13px;
  color: #5B4FCF;
  text-decoration: none;
}

.login-forgot:hover {
  text-decoration: underline;
}
</style>
