<script setup>
import WorkerSkillsRadarChart from '@/components/worker/dashboard/WorkerSkillsRadarChart.vue'
import DepartmentLeaderTierTimeline from '@/components/departmentleader/hr/DepartmentLeaderTierTimeline.vue'

defineProps({
  member: {
    type: Object,
    default: null,
  },
})

const tierBadgeStyle = {
  S: { bg: '#00BF95', text: '#fff' },
  A: { bg: '#5B4FCF', text: '#fff' },
  B: { bg: '#FFD166', text: '#855900' },
  C: { bg: '#EF476F', text: '#fff' },
}
</script>

<template>
  <section class="capability-detail">
    <div v-if="!member" class="capability-detail__empty">
      좌측 팀원 목록에서 팀원을 선택하세요.
    </div>

    <template v-else>
      <!-- Header -->
      <div class="capability-detail__header">
        <div class="capability-detail__identity">
          <div
            class="capability-detail__avatar"
            :style="{ background: member.avatarColor }"
          >
            {{ member.avatar }}
          </div>
          <div class="capability-detail__name-block">
            <div class="capability-detail__name-row">
              <span class="capability-detail__name">{{ member.name }}</span>
              <span
                class="capability-detail__tier-badge"
                :style="{
                  background: tierBadgeStyle[member.tier]?.bg,
                  color: tierBadgeStyle[member.tier]?.text,
                }"
              >
                {{ member.tier }}-TIER
              </span>
            </div>
            <span class="capability-detail__sub">
              {{ member.line }} · {{ member.experience }}
            </span>
          </div>
        </div>
        <span class="capability-detail__score">{{ member.score }}</span>
      </div>

      <div class="capability-detail__divider" />

      <!-- Score Summary -->
      <div class="capability-detail__scores">
        <div class="capability-detail__score-item capability-detail__score-item--primary">
          <span class="capability-detail__score-value">{{ member.quantitative }}</span>
          <span class="capability-detail__score-label">정량</span>
        </div>
        <div class="capability-detail__score-item capability-detail__score-item--mint">
          <span class="capability-detail__score-value">{{ member.qualitative }}</span>
          <span class="capability-detail__score-label">정성 (AI)</span>
        </div>
        <div class="capability-detail__score-item capability-detail__score-item--dark">
          <span class="capability-detail__score-value">{{ member.composite }}</span>
          <span class="capability-detail__score-label">종합</span>
        </div>
      </div>

      <div class="capability-detail__divider" />

      <!-- Radar + Skill Bars -->
      <WorkerSkillsRadarChart :skills="member.skills" />

      <!-- Tier Timeline -->
      <DepartmentLeaderTierTimeline :history="member.tierHistory" />
    </template>
  </section>
</template>

<style scoped>
.capability-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  height: 100%;
}

.capability-detail__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--color-text-muted);
}

/* Header */
.capability-detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.capability-detail__identity {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.capability-detail__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  flex-shrink: 0;
}

.capability-detail__name-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.capability-detail__name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.capability-detail__name {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.capability-detail__tier-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.capability-detail__sub {
  font-size: 13px;
  color: var(--color-text-muted);
}

.capability-detail__score {
  font-size: 52px;
  font-weight: 800;
  color: var(--color-primary-800);
  line-height: 1;
  flex-shrink: 0;
}

.capability-detail__divider {
  height: 1px;
  background: var(--color-border-muted);
}

/* Score Summary */
.capability-detail__scores {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.capability-detail__score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  border-right: 1px solid var(--color-border-muted);
}
.capability-detail__score-item:last-child {
  border-right: none;
}

.capability-detail__score-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}

.capability-detail__score-label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.capability-detail__score-item--primary .capability-detail__score-value {
  color: var(--color-primary-700);
}
.capability-detail__score-item--mint .capability-detail__score-value {
  color: var(--color-mint-500);
}
.capability-detail__score-item--dark .capability-detail__score-value {
  color: var(--color-primary-800);
}
</style>
