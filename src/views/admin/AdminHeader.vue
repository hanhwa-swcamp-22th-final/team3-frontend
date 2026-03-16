<script setup>
import { useAuthStore } from '@/stores/auth.js'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { employee } = storeToRefs(authStore)
</script>

<template>
  <header class="admin-header">
    <div class="admin-header__logo">
      <div class="admin-header__logo-box">SE</div>
      <div class="admin-header__logo-text">
        <span class="admin-header__logo-title">S.E.T.O</span>
        <span class="admin-header__logo-sub">SMART EQUIPMENT & TALENT ORCHESTRATOR</span>
      </div>
    </div>

    <div class="admin-header__user">
      <div class="admin-header__avatar">
        관
      </div>
      <div class="admin-header__info">
        <span class="admin-header__name">관리자</span>
        <span class="admin-header__role">Admin</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 58px;
  background-color: #FFFFFF;
  border-bottom: 2px solid #E0DCFF;
  flex-shrink: 0;
}

.admin-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-header__logo-box {
  width: 32px;
  height: 32px;
  background-color: #2D1F6E;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 900;
  flex-shrink: 0;
}

.admin-header__logo-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.admin-header__logo-title {
  font-size: 15px;
  font-weight: 900;
  color: #2D1F6E;
  line-height: 1;
}

.admin-header__logo-sub {
  font-size: 9px;
  font-weight: 400;
  color: #A89ED8;
  line-height: 1;
}

.admin-header__user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-header__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #F0EEFF;
  color: #5B4FCF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.admin-header__info {
  display: flex;
  flex-direction: column;
}

.admin-header__name {
  font-size: 12px;
  font-weight: 400;
  color: #2D1F6E;
  line-height: 1.3;
}

.admin-header__role {
  font-size: 10px;
  font-weight: 400;
  color: #A89ED8;
  line-height: 1.3;
}
</style>
