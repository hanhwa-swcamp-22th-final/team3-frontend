<script setup>
import TeamLeaderNotificationFilterBar from '@/components/teamleader/hr/TeamLeaderNotificationFilterBar.vue'
import TeamLeaderNotificationList from '@/components/teamleader/hr/TeamLeaderNotificationList.vue'
import TeamLeaderNotificationAssistPanel from '@/components/teamleader/hr/TeamLeaderNotificationAssistPanel.vue'

const filters = [
  { key: 'all', label: '전체' },
  { key: 'fault', label: 'FAULT' },
  { key: 'warn', label: 'WARN' },
  { key: 'info', label: 'INFO' },
]

const activeFilter = 'all'

const headlineAlert = {
  title: 'WLD-01 진공 이상 감지 - 즉시 대응 필요',
  description: '용접기 이상 진동 · 설비 평점지수 0.23',
  actionLabel: '담당자 배정',
}

const notifications = [
  {
    id: 1,
    type: 'FAULT',
    title: 'WLD-01 - 용접기 이상 진동 감지',
    description: '설비 평점지수 0.23 · 즉시 점검',
    time: '방금 전',
    actionLabel: '대응',
    tone: 'fault',
    unread: true,
  },
  {
    id: 2,
    type: 'WARN',
    title: 'PRS-01 - 압력 센서 임계치 90% 도달',
    description: '예방 정비 권고 · 담당자: 황자현',
    time: '12분 전',
    actionLabel: '확인',
    tone: 'warn',
    unread: true,
  },
  {
    id: 3,
    type: 'INFO',
    title: '손창우 - S-Tier 달성 자동 등급',
    description: 'Overall 91점 AI 정성 평가 반영',
    time: '1시간 전',
    actionLabel: '보기',
    tone: 'info',
    unread: false,
  },
  {
    id: 4,
    type: '완료',
    title: 'ORD-0302 - 김신우 배정 확정',
    description: '자동차 샤프트 배치 가공 · 적합도 72%',
    time: '2시간 전',
    actionLabel: '보기',
    tone: 'success',
    unread: false,
  },
]

const assistPanel = {
  title: '빠른 재배정',
  subtitle: '대응 필요 설비',
  equipment: {
    code: 'WLD-01',
    line: '자동 용접기 - 2라인',
    assignee: '현재 담당: 임원석 (B-Tier)',
    status: 'FAULT',
  },
  candidates: [
    { id: 1, name: '손창우', tier: 'S', avatar: '손', avatarTone: 'purple', scoreLabel: '적합도 94%' },
    { id: 2, name: '황자현', tier: 'A', avatar: '황', avatarTone: 'green', scoreLabel: '적합도 71%' },
  ],
  actionLabel: '즉시 배정',
}
</script>

<template>
  <section class="teamleader-notification-view">
    <section class="teamleader-notification-view__headline">
      <div>
        <h1>{{ headlineAlert.title }}</h1>
        <p>{{ headlineAlert.description }}</p>
      </div>
      <button type="button">{{ headlineAlert.actionLabel }}</button>
    </section>

    <section class="teamleader-notification-view__content">
      <div class="teamleader-notification-view__main">
        <TeamLeaderNotificationFilterBar :filters="filters" :active-filter="activeFilter" />
        <TeamLeaderNotificationList :items="notifications" />
      </div>

      <TeamLeaderNotificationAssistPanel
        :title="assistPanel.title"
        :subtitle="assistPanel.subtitle"
        :equipment="assistPanel.equipment"
        :candidates="assistPanel.candidates"
        :action-label="assistPanel.actionLabel"
      />
    </section>
  </section>
</template>

<style scoped>
.teamleader-notification-view {
  width: 100%;
  min-width: 0;
  padding: 12px 10px;
  box-sizing: border-box;
  background: var(--color-bg-app);
}

.teamleader-notification-view__headline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
  padding: 18px 22px;
  border: 2px solid #ff5072;
  border-radius: 18px;
  background: #fff2f5;
}

.teamleader-notification-view__headline h1 {
  font-size: 26px;
  color: #db294d;
}

.teamleader-notification-view__headline p {
  margin-top: 6px;
  font-size: 15px;
  color: #dc627c;
}

.teamleader-notification-view__headline button {
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  background: #f3294f;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.teamleader-notification-view__content {
  display: grid;
  grid-template-columns: minmax(0, 1.95fr) minmax(300px, 1fr);
  gap: 16px;
  align-items: start;
}

.teamleader-notification-view__main {
  display: grid;
  gap: 12px;
}

@media (max-width: 1180px) {
  .teamleader-notification-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-notification-view {
    padding: 12px;
  }

  .teamleader-notification-view__headline {
    align-items: stretch;
    flex-direction: column;
  }

  .teamleader-notification-view__headline h1 {
    font-size: 21px;
  }
}
</style>
