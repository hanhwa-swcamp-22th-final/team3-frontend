<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getSidebarSectionsByRole } from '@/components/common/sidebar/menuConfig.js'

const route = useRoute()
const sections = computed(() => getSidebarSectionsByRole('admin'))

function isActive(target) {
  return route.name === target.name
}
</script>

<template>
  <aside class="admin-sidebar">
    <div v-for="section in sections" :key="section.key" class="admin-sidebar__section">
      <p class="admin-sidebar__title">{{ section.label }}</p>
      <nav class="admin-sidebar__nav">
        <RouterLink
          v-for="item in section.items"
          :key="item.label"
          :to="item.to"
          class="admin-sidebar__link"
          :class="{ 'admin-sidebar__link--active': isActive(item.to) }"
        >
          <span class="admin-sidebar__icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  width: 14%;
  min-width: 14%;
  padding: 18px 14px 28px;
  border-right: 1px solid var(--color-border-soft);
  background: var(--color-bg-surface);
  position: fixed;
  left: 0;
  top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;
  z-index: 99;
}

.admin-sidebar__section {
  margin-top: 24px;
}
.admin-sidebar__section:first-child {
  margin-top: 0;
}

.admin-sidebar__title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--color-primary-300);
}

.admin-sidebar__nav {
  display: grid;
  gap: 8px;
}

.admin-sidebar__link {
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

.admin-sidebar__link--active {
  color: var(--color-primary-700);
  background: var(--color-primary-100);
  border-radius: 6px;
}

.admin-sidebar__icon {
  width: 16px;
  display: inline-flex;
  justify-content: center;
}

@media (max-width: 1080px) {
  .admin-sidebar {
    width: 100%;
    min-width: 0;
    border-right: 0;
    border-bottom: 1px solid var(--color-border-soft);
  }

  .admin-sidebar__nav {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
</style>
