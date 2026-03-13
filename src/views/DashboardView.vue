<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1 class="dashboard-title">S.E.T.O Dashboard</h1>
      <div class="dashboard-user">
        <span class="dashboard-user__name">{{ authStore.employee?.employee_name }}</span>
        <span class="dashboard-user__role">{{ authStore.role() }}</span>
        <button class="btn-logout" @click="handleLogout">로그아웃</button>
      </div>
    </header>
    <main class="dashboard-content">
      <p>대시보드 페이지입니다. (준비 중)</p>
    </main>
  </div>
</template>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #FAFBFF;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background: #2D1F6E;
  color: #ffffff;
}

.dashboard-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
}

.dashboard-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dashboard-user__name {
  font-size: 14px;
}

.dashboard-user__role {
  font-size: 12px;
  padding: 2px 10px;
  background: #5B4FCF;
  border-radius: 12px;
}

.btn-logout {
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #2D1F6E;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-logout:hover {
  background: #F0EEFF;
}

.dashboard-content {
  padding: 40px 32px;
  font-size: 16px;
  color: #2D1F6E;
}
</style>
