<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import RoleSidebar from '@/components/common/sidebar/RoleSidebar.vue'
import AdminSidebar from '@/components/common/sidebar/AdminSidebar.vue'
import { roleLabels } from '@/components/common/sidebar/menuConfig.js'

const authStore = useAuthStore()
const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: 'S.E.T.O',
  },
  subtitle: {
    type: String,
    default: 'SMART EQUIPMENT & TALENT ORCHESTRATOR',
  },
})

const profileName = computed(() => authStore.employee?.employee_name || 'User')
const profileRole = computed(() => roleLabels[authStore.role()] ?? authStore.role() ?? 'User')
const profileInitials = computed(() => {
  const role = authStore.role()
  return role ? role.slice(0, 2).toUpperCase() : 'U'
})
const isAdmin = computed(() => authStore.role() === 'admin')

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="dashboard-brand">
        <div class="dashboard-logo">SE</div>
        <div class="dashboard-brand-copy">
          <strong>{{ props.title }}</strong>
          <span>{{ props.subtitle }}</span>
        </div>
      </div>

      <div class="dashboard-actions">
        <div class="dashboard-profile">
          <div class="dashboard-avatar">{{ profileInitials }}</div>
          <div class="dashboard-profile-copy">
            <strong>{{ profileName }}</strong>
            <span>{{ profileRole }}</span>
          </div>
        </div>
        <button type="button" class="dashboard-logout" @click="handleLogout">
          로그아웃
        </button>
      </div>
    </header>

    <main class="dashboard-content">
      <AdminSidebar v-if="isAdmin" />
      <RoleSidebar v-else />

      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 80px;
  padding: 0 30px;
  border-top: 1px solid var(--color-border-default);
  border-bottom: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  position: sticky;
  top: 0;
  z-index: 100;
}

.dashboard-brand,
.dashboard-actions,
.dashboard-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dashboard-logo {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-800);
  color: var(--color-text-inverse);
  font-size: 24px;
  font-weight: 700;
}

.dashboard-brand-copy,
.dashboard-profile-copy {
  display: grid;
}

.dashboard-brand-copy strong,
.dashboard-profile-copy strong {
  font-size: 20px;
  color: var(--color-primary-800);
}

.dashboard-brand-copy span,
.dashboard-profile-copy span {
  font-size: 13px;
  color: var(--color-primary-300);
}

.dashboard-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-100);
  color: var(--color-primary-500);
  font-weight: 700;
}

.dashboard-logout {
  height: 38px;
  padding: 0 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 999px;
  background: var(--color-bg-surface);
  color: var(--color-primary-600);
  font-weight: 600;
  cursor: pointer;
}

.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-content {
  display: flex;
  flex: 1;
  margin-left: 14%;
}
</style>
