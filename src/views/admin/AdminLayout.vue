<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { storeToRefs } from 'pinia'
import { roleLabels } from '@/components/common/menuConfig.js'
import AdminSidebar from '@/components/common/AdminSidebar.vue'

const authStore = useAuthStore()
const router = useRouter()
const { employee } = storeToRefs(authStore)

const profileName    = computed(() => employee.value?.employee_name || '관리자')
const profileRole    = computed(() => roleLabels[authStore.role()] ?? 'Admin')
const profileInitial = computed(() => profileName.value.slice(0, 1))

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="admin-layout">

    <!-- ── 헤더 (DashboardView 구조 그대로) ── -->
    <header class="admin-header">
      <div class="admin-brand">
        <div class="admin-logo">SE</div>
        <div class="admin-brand-copy">
          <strong>S.E.T.O</strong>
          <span>SMART EQUIPMENT &amp; TALENT ORCHESTRATOR</span>
        </div>
      </div>

      <div class="admin-actions">
        <div class="admin-profile">
          <div class="admin-avatar">{{ profileInitial }}</div>
          <div class="admin-profile-copy">
            <strong>{{ profileName }}</strong>
            <span>{{ profileRole }}</span>
          </div>
        </div>
        <button type="button" class="btn-logout" @click="handleLogout">로그아웃</button>
      </div>
    </header>

    <!-- ── 바디: 사이드바 + 콘텐츠 ── -->
    <div class="admin-body">
      <AdminSidebar />
      <main class="admin-content">
        <RouterView />
      </main>
    </div>

  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg-base, var(--bg-base));
}

/* 헤더 */
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 80px;
  padding: 0 30px;
  border-bottom: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  flex-shrink: 0;
}

.admin-brand,
.admin-actions,
.admin-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-logo {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-800, var(--primary));
  color: #fff;
  font-size: 24px;
  font-weight: 700;
}

.admin-brand-copy,
.admin-profile-copy {
  display: grid;
}

.admin-brand-copy strong,
.admin-profile-copy strong {
  font-size: 20px;
  color: var(--color-primary-800, var(--primary));
}

.admin-brand-copy span,
.admin-profile-copy span {
  font-size: 13px;
  color: var(--color-primary-300, var(--primary-light));
}

.admin-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-100, #f0eeff);
  color: var(--color-primary-500, var(--primary-light));
  font-weight: 700;
}

.btn-logout {
  height: 38px;
  padding: 0 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 999px;
  background: var(--color-bg-surface);
  color: var(--color-primary-600, var(--primary-light));
  font-weight: 600;
  cursor: pointer;
}

/* 바디 */
.admin-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.admin-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
