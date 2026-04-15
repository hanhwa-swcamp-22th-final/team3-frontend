<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  missions: { type: Array, default: () => [] },
  missionsLoading: { type: Boolean, default: false },
})
const emit = defineEmits(['hold', 'confirm'])

const pointPercent = computed(() => {
  const acc = props.item?.tierAccumulatedPoint ?? 0
  const target = props.item?.targetPromotionPoint ?? 0
  if (!target) return 0
  return Math.min(100, Math.round((acc / target) * 100))
})

const isProcessed = computed(() =>
  ['CONFIRMATION_OF_PROMOTION', 'TIER_APPLIED', 'SUSPENSION'].includes(props.item?.rawStatus)
)

const missionSummary = computed(() => {
  const missions = props.missions ?? []
  const completedCount = missions.filter((mission) => mission.completed).length

  return {
    totalCount: missions.length,
    completedCount,
    rewardPointTotal: missions.reduce((sum, mission) => sum + (mission.rewardPoint ?? 0), 0),
  }
})

const TIER_TONE = { S: 'gold', A: 'purple', B: 'green', C: 'green' }

function missionStatusLabel(status) {
  return {
    COMPLETED: '완료',
    IN_PROGRESS: '진행중',
  }[status] ?? status ?? '-'
}
</script>

<template>
  <article class="promo-detail">
    <!-- 헤더 -->
    <div class="promo-detail__top">
      <div
        class="promo-detail__avatar"
        :class="`promo-detail__avatar--${TIER_TONE[item.targetTier] ?? 'purple'}`"
      >
        {{ item.name?.[0] ?? '?' }}
      </div>
      <div class="promo-detail__name-block">
        <p class="promo-detail__name">{{ item.name }}</p>
        <p class="promo-detail__subtitle">{{ item.currentTier }}-Tier → {{ item.targetTier }}-Tier 승급 심사</p>
      </div>
      <span
        class="promo-detail__status-badge"
        :class="`promo-detail__status-badge--${item.rawStatus}`"
      >
        {{ item.statusLabel }}
      </span>
    </div>

    <!-- 포인트 요약 카드 -->
    <section class="promo-points-summary">
      <div class="promo-points-summary__header">
        <div>
          <p class="promo-points-summary__eyebrow">승급 포인트 현황</p>
          <h3 class="promo-points-summary__title">{{ item.targetTier }}-Tier 승급 요건</h3>
        </div>
        <div class="promo-points-summary__scores">
          <div class="promo-points-summary__score">
            <strong>{{ item.tierAccumulatedPoint ?? '-' }}</strong>
            <span>누적</span>
          </div>
          <div class="promo-points-summary__score promo-points-summary__score--target">
            <strong>{{ item.targetPromotionPoint ?? '-' }}</strong>
            <span>목표</span>
          </div>
        </div>
      </div>
      <div class="promo-points-summary__bar-wrap">
        <div class="promo-points-summary__bar" :style="{ width: pointPercent + '%' }" />
      </div>
      <p class="promo-points-summary__bar-label">달성률 {{ pointPercent }}%</p>
    </section>

    <section class="promo-detail__mission">
      <div class="promo-detail__section-head">
        <div>
          <p class="promo-detail__section-label">승급 미션 진행 현황</p>
          <p class="promo-detail__section-caption">현재 승급 포인트에 연결되는 미션 진행 상황입니다.</p>
        </div>
      </div>

      <div class="promo-mission-summary">
        <div class="promo-mission-summary__card">
          <span>총 미션</span>
          <strong>{{ missionSummary.totalCount }}</strong>
        </div>
        <div class="promo-mission-summary__card promo-mission-summary__card--success">
          <span>완료</span>
          <strong>{{ missionSummary.completedCount }}</strong>
        </div>
        <div class="promo-mission-summary__card">
          <span>보상 합계</span>
          <strong>{{ missionSummary.rewardPointTotal }}pt</strong>
        </div>
      </div>

      <div v-if="missionsLoading" class="promo-mission-state">
        미션 정보를 불러오는 중입니다.
      </div>
      <div v-else-if="!missions.length" class="promo-mission-state promo-mission-state--empty">
        현재 연결된 승급 미션이 없습니다.
      </div>
      <div v-else class="promo-mission-list">
        <article
          v-for="mission in missions"
          :key="mission.id"
          class="promo-mission-card"
          :class="{ 'promo-mission-card--completed': mission.completed }"
        >
          <div class="promo-mission-card__head">
            <div>
              <p class="promo-mission-card__title">{{ mission.title }}</p>
              <p class="promo-mission-card__meta">
                {{ mission.missionTypeLabel }} · {{ mission.upgradeToTier }}-Tier 미션
              </p>
            </div>
            <div class="promo-mission-card__badges">
              <span class="promo-mission-card__point">{{ mission.rewardPoint }}pt</span>
              <span
                class="promo-mission-card__status"
                :class="{ 'promo-mission-card__status--completed': mission.completed }"
              >
                {{ missionStatusLabel(mission.status) }}
              </span>
            </div>
          </div>

          <div class="promo-mission-card__progress-row">
            <span>{{ mission.currentValue }} / {{ mission.conditionValue }}</span>
            <span>{{ mission.progressRate }}%</span>
          </div>
          <div class="promo-mission-card__progress-track">
            <div
              class="promo-mission-card__progress-bar"
              :style="{ width: `${mission.progressRate}%` }"
            />
          </div>
        </article>
      </div>
    </section>

    <!-- 심사일 -->
    <p v-if="item.tierReviewedAt" class="promo-detail__reviewed-at">
      심사일: {{ item.tierReviewedAt?.slice(0, 10) ?? '-' }}
    </p>

    <!-- 액션 / 처리 결과 -->
    <div v-if="!isProcessed" class="promo-detail__actions">
      <button class="promo-detail__btn promo-detail__btn--hold" @click="emit('hold', { id: item.id })">
        보류
      </button>
      <button
        class="promo-detail__btn promo-detail__btn--confirm"
        @click="emit('confirm', { id: item.id })"
      >
        승급 확정
      </button>
    </div>
    <div
      v-else
      class="promo-detail__processed"
      :class="`promo-detail__processed--${item.rawStatus}`"
    >
      {{ item.rawStatus === 'SUSPENSION' ? '보류 처리됨' : '승급 확정 처리됨' }}
    </div>
  </article>
</template>

<style scoped>
.promo-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 24px;
  padding: 24px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

/* 헤더 */
.promo-detail__top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.promo-detail__avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: 900;
  color: #fff;
  flex-shrink: 0;
}

.promo-detail__avatar--gold   { background: #c08b00; }
.promo-detail__avatar--purple { background: #5f50d6; }
.promo-detail__avatar--green  { background: #269063; }

.promo-detail__name-block { flex: 1; min-width: 0; }
.promo-detail__name {
  font-size: var(--font-size-lg);
  font-weight: 900;
  color: var(--color-primary-800);
  line-height: 1.4;
}
.promo-detail__subtitle {
  font-size: var(--font-size-xs);
  color: #a89ed8;
}

.promo-detail__status-badge {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
  flex-shrink: 0;
}

.promo-detail__status-badge--UNDER_REVIEW {
  background: #ede9fe;
  color: #6d28d9;
}

.promo-detail__status-badge--CONFIRMATION_OF_PROMOTION,
.promo-detail__status-badge--TIER_APPLIED {
  background: #d1fae5;
  color: #065f46;
}

.promo-detail__status-badge--SUSPENSION {
  background: #fef3c7;
  color: #92400e;
}

/* 포인트 요약 카드 */
.promo-points-summary {
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid #dcd6ff;
  border-radius: 20px;
  background: #faf8ff;
}

.promo-points-summary__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.promo-points-summary__eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.promo-points-summary__title {
  margin: 0;
  font-size: 18px;
  color: var(--color-primary-800);
}

.promo-points-summary__scores {
  display: flex;
  gap: 10px;
}

.promo-points-summary__score {
  min-width: 72px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e1dbff;
  text-align: center;
}

.promo-points-summary__score strong {
  display: block;
  font-size: 20px;
  color: var(--color-primary-800);
}

.promo-points-summary__score span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.promo-points-summary__score--target {
  border-color: #bdd5f8;
}

.promo-points-summary__score--target strong {
  color: #1d5dbf;
}

.promo-points-summary__bar-wrap {
  height: 8px;
  background: #e1dbff;
  border-radius: 4px;
  overflow: hidden;
}

.promo-points-summary__bar {
  height: 100%;
  background: linear-gradient(90deg, #7c6ee6, #5f50d6);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.promo-points-summary__bar-label {
  margin: 0;
  font-size: 12px;
  color: var(--color-primary-600);
  font-weight: 700;
  text-align: right;
}

/* 미션 섹션 */
.promo-detail__mission {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.promo-detail__section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.promo-detail__section-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}
.promo-detail__section-caption {
  margin: 2px 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.promo-mission-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.promo-mission-summary__card {
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--color-bg-app);
  border: 1px solid var(--color-border-default);
}
.promo-mission-summary__card span {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
.promo-mission-summary__card strong {
  font-size: var(--font-size-lg);
  color: var(--color-primary-800);
}
.promo-mission-summary__card--success {
  background: #eefcf6;
  border-color: #c6f6de;
}

.promo-mission-state {
  padding: 18px 16px;
  border-radius: 14px;
  background: var(--color-bg-app);
  border: 1px dashed var(--color-border-default);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.promo-mission-state--empty {
  text-align: center;
}

.promo-mission-list {
  display: grid;
  gap: 10px;
}
.promo-mission-card {
  display: grid;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid #ddd8fb;
  background: #f7f5ff;
}
.promo-mission-card--completed {
  border-color: #c6f6de;
  background: #eefcf6;
}
.promo-mission-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.promo-mission-card__title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}
.promo-mission-card__meta {
  margin: 4px 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
.promo-mission-card__badges {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.promo-mission-card__point,
.promo-mission-card__status {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}
.promo-mission-card__point {
  background: #ede9fe;
  color: #6d28d9;
}
.promo-mission-card__status {
  background: #fff3d6;
  color: #a16207;
}
.promo-mission-card__status--completed {
  background: #d1fae5;
  color: #065f46;
}
.promo-mission-card__progress-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}
.promo-mission-card__progress-track {
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: #e7e2ff;
}
.promo-mission-card__progress-bar {
  height: 100%;
  border-radius: 999px;
  background: #5f50d6;
}
.promo-mission-card--completed .promo-mission-card__progress-track {
  background: #d8f5e6;
}
.promo-mission-card--completed .promo-mission-card__progress-bar {
  background: #0f9f7b;
}

.promo-detail__reviewed-at {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

/* 액션 */
.promo-detail__actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: auto;
}

.promo-detail__btn {
  height: 42px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: none;
}

.promo-detail__btn--hold {
  background: var(--color-bg-surface);
  color: #92400e;
  border: 1.5px solid #fbbf24;
}

.promo-detail__btn--hold:hover { background: #fef3c7; }

.promo-detail__btn--confirm {
  background: var(--color-primary-600);
  color: #fff;
  border: 1.5px solid var(--color-primary-500);
}

.promo-detail__btn--confirm:hover { background: var(--color-primary-700); }

/* 처리 결과 */
.promo-detail__processed {
  padding: 14px;
  border-radius: 12px;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  margin-top: auto;
}

.promo-detail__processed--CONFIRMATION_OF_PROMOTION,
.promo-detail__processed--TIER_APPLIED {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.promo-detail__processed--SUSPENSION {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
}
</style>
