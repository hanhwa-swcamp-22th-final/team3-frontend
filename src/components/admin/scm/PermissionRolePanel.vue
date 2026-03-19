<script setup>
defineProps({
  roleData:     { type: Object, required: true },
  selectedRole: { type: String, required: true },
})

const LEVEL_LABELS = ['Admin', 'HR', 'TL', 'DL', 'Worker']
</script>

<template>
  <div class="role-panel">

    <div class="panel-title">👤 {{ selectedRole }} 역할 정의</div>

    <div class="role-card">
      <div class="role-card-title">{{ roleData.title }}</div>
      <div class="role-card-desc">{{ roleData.desc }}</div>
    </div>

    <div class="section-label">현재 {{ selectedRole }} 계정</div>
    <div class="account-list">
      <div v-for="acc in roleData.accounts" :key="acc.name" class="account-item">
        <div class="account-avatar">{{ acc.initial }}</div>
        <div class="account-info">
          <div class="account-name">{{ acc.name }}</div>
          <div class="account-team">{{ acc.team }}</div>
        </div>
        <div class="account-status">● 활성</div>
      </div>
    </div>

    <div class="level-box">
      <div class="level-label">권한 등급</div>
      <div class="level-bar-bg">
        <div class="level-bar-fill" :style="{ width: (roleData.level / 5 * 100) + '%' }"></div>
      </div>
      <div class="level-labels">
        <span v-for="lbl in LEVEL_LABELS" :key="lbl">{{ lbl }}</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.role-panel {
  width: 384px;
  flex-shrink: 0;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 21px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;

}

.panel-title {
  font-size: 12px;
  font-weight: 900;
  color: var(--color-text-secondary);
}

.role-card {
  background: var(--color-primary-100);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.role-card-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-800);
  line-height: 1.6;
}

.role-card-desc {
  font-size: 11px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.section-label {
  font-size: 11px;
  color: var(--color-text-placeholder);
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  padding: 0 13px;
  height: 58px;
}

.account-avatar {
  width: 28px;
  height: 28px;
  background: var(--color-primary-800);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  color: var(--color-white);
  flex-shrink: 0;
}

.account-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.account-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.account-team {
  font-size: 11px;
  color: var(--color-text-placeholder);
}

.account-status {
  font-size: 11px;
  color: var(--tier-s);
}

.level-box {
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-label {
  font-size: 10px;
  color: var(--color-text-placeholder);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.level-bar-bg {
  width: 100%;
  height: 8px;
  background: var(--color-border-default);
  border-radius: 4px;
  overflow: hidden;
}

.level-bar-fill {
  height: 100%;
  background: var(--color-primary-600);
  border-radius: 4px;
  transition: width 0.3s;
}

.level-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-placeholder);
}
</style>
