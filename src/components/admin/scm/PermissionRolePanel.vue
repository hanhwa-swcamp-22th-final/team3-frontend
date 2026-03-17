<script setup>
defineProps({
  roleData:     { type: Object, required: true },
  selectedRole: { type: String, required: true },
})

const LEVEL_LABELS = ['Admin', 'HR', 'TL', 'LM', 'Tech']
</script>

<template>
  <div class="role-panel">

    <!-- 타이틀 -->
    <div class="panel-title">👤 {{ selectedRole }} 역할 정의</div>

    <!-- 역할 설명 카드 -->
    <div class="role-card">
      <div class="role-card-title">{{ roleData.title }}</div>
      <div class="role-card-desc">{{ roleData.desc }}</div>
    </div>

    <!-- 현재 계정 -->
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

    <!-- 권한 등급 바 -->
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
  background: #fff;
  border: 1.5px solid #E0DCFF;
  border-radius: 12px;
  padding: 21px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.panel-title {
  font-size: 12px;
  font-weight: 900;
  color: #7A6FA8;
}

.role-card {
  background: #F0EEFF;
  border: 1.5px solid #E0DCFF;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.role-card-title {
  font-size: 13px;
  font-weight: 700;
  color: #2D1F6E;
  line-height: 1.6;
}

.role-card-desc {
  font-size: 11px;
  color: #7A6FA8;
  line-height: 1.6;
}

.section-label {
  font-size: 11px;
  color: #A89ED8;
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
  background: #FAFBFF;
  border: 1.5px solid #E0DCFF;
  border-radius: 6px;
  padding: 0 13px;
  height: 58px;
}

.account-avatar {
  width: 28px;
  height: 28px;
  background: #2D1F6E;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  color: #fff;
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
  color: #2D1F6E;
}

.account-team {
  font-size: 11px;
  color: #A89ED8;
}

.account-status {
  font-size: 11px;
  color: #00BF95;
}

/* 권한 등급 바 */
.level-box {
  background: #FAFBFF;
  border: 1.5px solid #E0DCFF;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-label {
  font-size: 10px;
  color: #A89ED8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.level-bar-bg {
  width: 100%;
  height: 8px;
  background: #E0DCFF;
  border-radius: 4px;
  overflow: hidden;
}

.level-bar-fill {
  height: 100%;
  background: #5B4FCF;
  border-radius: 4px;
  transition: width 0.3s;
}

.level-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #A89ED8;
}
</style>
