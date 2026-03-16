<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getSidebarSectionsByRole } from '@/components/common/menuConfig.js'


const authStore = useAuthStore()
const route = useRoute()
const sections = computed(() => getSidebarSectionsByRole(authStore.role()))

function isActive(target) {
  return route.name === target.name
}
</script>

<template>
  <aside class="role-sidebar">
    <div v-for="section in sections" :key="section.key" class="role-sidebar__section">
      <p class="role-sidebar__title">{{ section.label }}</p>
      <nav class="role-sidebar__nav">
        <RouterLink
          v-for="item in section.items"
          :key="item.label"
          :to="item.to"
          class="role-sidebar__link"
          :class="{ 'role-sidebar__link--active': isActive(item.to) }"
        >
          <span class="role-sidebar__icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.role-sidebar {
  width: 304px;
  min-width: 304px;
  padding: 18px 14px 28px;
  border-right: 1px solid var(--color-border-soft);
  background: var(--color-bg-surface);
}

.role-sidebar__section{
  margin-top: 26px;
}

.role-sidebar__title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--color-primary-300);
}

.role-sidebar__nav {
  display: grid;
  gap: 8px;
}

.role-sidebar__link {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 8px;
  color: var(--color-primary-300);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
}

.role-sidebar__link--active {
  color: var(--color-primary-700);
}

.role-sidebar__icon {
  width: 16px;
  display: inline-flex;
  justify-content: center;
}

@media (max-width: 1080px) {
  .role-sidebar {
    width: 100%;
    min-width: 0;
    border-right: 0;
    border-bottom: 1px solid var(--color-border-soft);
  }

  .role-sidebar__nav {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
</style>
