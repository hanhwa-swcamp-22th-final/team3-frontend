<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROLE_ROUTE_MAP, LOGIN_MESSAGES, AUTH_ERROR_CODE_MAP } from '@/constants'
import { authApi } from '@/services/apiClient'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const autoLogin = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const demoAccounts = [
  { role: '관리자', name: 'admin', email: 'adminTest@test.com', password: 'password123!' },
  { role: 'HRM', name: '김하린', email: 'demo.hrm@seto.local', password: 'Demo1234!' },
  { role: 'DL', name: '박도현', email: 'demo.dl@seto.local', password: 'Demo1234!' },
  { role: 'TL', name: '이지훈', email: 'demo.tl.photo@seto.local', password: 'Demo1234!' },
  { role: '작업자', name: '강민준', email: 'demo.worker01@seto.local', password: 'Demo1234!' },
]

function applyDemoAccount(account) {
  email.value = account.email
  password.value = account.password
}

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = LOGIN_MESSAGES.EMPTY_FIELDS
    return
  }

  isLoading.value = true

  try {
    const res = await authApi.post('/api/v1/auth/login', {
      employeeEmail: email.value,
      password: password.value,
    })

    const { success, data } = res.data

    if (success && data?.accessToken) {
      authStore.login(data.accessToken)

      const dest = ROLE_ROUTE_MAP[authStore.role()] ?? 'Login'
      router.push({ name: dest })
    }
  } catch (error) {
    const errorCode = error.response?.data?.errorCode
    const messageKey = AUTH_ERROR_CODE_MAP[errorCode]

    if (messageKey && LOGIN_MESSAGES[messageKey]) {
      errorMessage.value = LOGIN_MESSAGES[messageKey]
    } else if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = LOGIN_MESSAGES.SERVER_ERROR
    }
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

    <div class="login-shell">
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

      <section class="demo-account-box" aria-label="시연용 계정">
        <div class="demo-account-box__header">
          <strong>시연용 계정</strong>
          <span>클릭 시 자동 입력</span>
        </div>
        <button
          v-for="account in demoAccounts"
          :key="account.email"
          type="button"
          class="demo-account"
          @click="applyDemoAccount(account)"
        >
          <span class="demo-account__role">{{ account.role }}</span>
          <span class="demo-account__info">
            <strong>{{ account.name }}</strong>
            <small>{{ account.email }}</small>
            <small>비밀번호: {{ account.password }}</small>
          </span>
        </button>
        <p class="demo-account-box__password">계정 클릭 시 로그인 폼에 자동 입력됩니다.</p>
      </section>
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
  padding: 40px;
  background: linear-gradient(135deg, #1a1147 0%, #2D1F6E 40%, #3a2a7a 100%);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
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

/* ── Login Shell ── */
.login-shell {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 28px;
  width: min(100%, 860px);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-family-base);
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
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: #2D1F6E;
  margin: 0 0 4px;
  letter-spacing: 2px;
}

.login-logo__subtitle {
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-regular);
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
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: #2D1F6E;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #E0DCFF;
  border-radius: 8px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  font-family: var(--font-family-base);
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
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
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
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  color: #5a5280;
  cursor: pointer;
}

/* ── Buttons ── */
.btn {
  width: 100%;
  height: 46px;
  border-radius: 10px;
  font-size: var(--font-size-base-plus);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-base);
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

/* ── Demo Accounts ── */
.demo-account-box {
  width: 100%;
  max-width: 360px;
  padding: 22px;
  border: 1px solid #E0DCFF;
  border-radius: 20px;
  background: rgba(250, 251, 255, 0.96);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
  box-sizing: border-box;
  font-family: var(--font-family-base);
}

.demo-account-box__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  color: #2D1F6E;
}

.demo-account-box__header strong {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.demo-account-box__header span {
  font-size: 12px;
  color: #8c84ad;
}

.demo-account {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 10px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: #ffffff;
  color: #2D1F6E;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, background 0.2s;
}

.demo-account:hover {
  border-color: #C8C0FF;
  background: #F6F4FF;
}

.demo-account__role {
  min-width: 58px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #2D1F6E;
  color: #ffffff;
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  text-align: center;
}

.demo-account__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.demo-account__info strong {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.demo-account__info small {
  font-size: 12px;
  color: #746c96;
}

.demo-account-box__password {
  margin: 4px 0 0;
  font-size: 12px;
  color: #5a5280;
}

@media (max-width: 860px) {
  .login-page {
    overflow-y: auto;
  }

  .login-shell {
    flex-direction: column;
    align-items: center;
  }

  .demo-account-box {
    max-width: 420px;
  }
}
</style>
