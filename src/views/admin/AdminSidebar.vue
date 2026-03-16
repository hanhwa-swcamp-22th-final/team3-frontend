<script setup>
import { RouterLink } from 'vue-router'

const menus = [
  { name: 'AdminEquipment',     label: '설비 관리',             icon: '⚙️' },
  { name: 'AdminSystemLog',     label: '시스템 로그',           icon: '🖥' },
  { name: 'AdminPermission',    label: '권한 관리',             icon: '🔐' },
  { name: 'AdminAlgorithm',     label: '알고리즘 설정',         icon: '🔢' },
  { name: 'AdminIndustryPreset',label: '산업군 프리셋',         icon: '🏭' },
  { name: 'AdminKeyword',       label: '도메인 키워드 관리',    icon: '📖' },
  { name: 'AdminProfile',       label: '프로필 조회/등록/수정', icon: '✏️' },
  { name: 'AdminKms',           label: 'KMS 지식허브',          icon: '📚' },
]
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-label">ADMIN</div>

    <nav class="sidebar-nav">
      <RouterLink
        v-for="menu in menus"
        :key="menu.name"
        :to="{ name: menu.name }"
        class="sidebar-menu-item"
        active-class="sidebar-menu-item--active"
      >
        <span class="sidebar-menu-item__icon">{{ menu.icon }}</span>
        <span class="sidebar-menu-item__label">{{ menu.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border-right: 1px solid #E0DCFF;
}

.sidebar-label {
  padding: 16px 8px 8px 20px;
  font-size: 11px;
  font-weight: 700;
  color: #9C95CE;
  letter-spacing: 0.66px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  gap: 2px;
}

.sidebar-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  color: #7A6FA8;
  text-decoration: none;
  font-size: 12px;
  border-radius: 6px;
  border-left: 3px solid transparent;
  transition: background-color 0.2s;
}

.sidebar-menu-item:hover {
  background-color: #F0EEFF;
  color: #5B4FCF;
}

.sidebar-menu-item--active {
  color: #5B4FCF;
  border-left-color: #5B4FCF;
  background-color: #FFFFFF;
}

.sidebar-menu-item__icon {
  font-size: 14px;
  width: 18px;
  text-align: center;
}

.sidebar-menu-item__label {
  font-weight: 400;
}
</style>
