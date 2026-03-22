<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
})

const emit = defineEmits(['hold', 'confirm'])

const comment = ref('')

watch(() => props.item.id, () => { comment.value = '' })
</script>

<template>
  <article class="promo-detail">
    <p class="promo-detail__title">🔍 심사 상세 — {{ item.name }}</p>

    <!-- 직원 정보 -->
    <div class="promo-detail__header">
      <span class="promo-detail__avatar" :style="{ background: item.avatarColor }">
        {{ item.name[0] }}
      </span>
      <div class="promo-detail__info">
        <p class="promo-detail__name">{{ item.name }}</p>
        <p class="promo-detail__subtitle">{{ item.currentTier }}-Tier → {{ item.targetTier }}-Tier 심사</p>
      </div>
      <span class="promo-detail__score">{{ item.totalScore }}점</span>
    </div>

    <!-- 요건 달성 현황 -->
    <div class="promo-detail__section">
      <p class="promo-detail__section-title">{{ item.targetTier }}-Tier 승급 요건 달성 현황</p>
      <div class="promo-detail__requirements">
        <div
          v-for="req in item.detail.requirements"
          :key="req.label"
          class="promo-req"
          :class="req.met ? 'promo-req--met' : 'promo-req--fail'"
        >
          <span class="promo-req__icon">{{ req.met ? '✓' : '✗' }}</span>
          <span class="promo-req__label">{{ req.label }}</span>
          <span class="promo-req__value">{{ req.current }}</span>
          <span v-if="req.met" class="promo-req__check">✓</span>
        </div>
      </div>
    </div>

    <!-- 심사 의견 -->
    <div class="promo-detail__section">
      <p class="promo-detail__section-title">심사 의견</p>
      <textarea
        v-if="!item.processedStatus"
        v-model="comment"
        class="promo-detail__textarea"
        placeholder="심사 의견을 입력하세요..."
      />
      <p v-else class="promo-detail__comment-readonly">{{ item.comment || '(의견 없음)' }}</p>
    </div>

    <!-- 이전 심사 이력 -->
    <div v-if="item.detail.history.length > 0" class="promo-detail__section">
      <p class="promo-detail__section-title">📋 이전 심사 이력</p>
      <div class="promo-detail__history">
        <p
          v-for="h in item.detail.history"
          :key="h.quarter"
          class="promo-detail__history-item"
        >{{ h.quarter }} · {{ h.result }} · 미달 {{ h.missingCount }}항목</p>
      </div>
    </div>

    <!-- 액션 버튼 / 처리 결과 -->
    <div v-if="!item.processedStatus" class="promo-detail__actions">
      <button class="promo-detail__btn promo-detail__btn--hold"    @click="emit('hold',    { id: item.id, comment: comment.trim() })">보류</button>
      <button
        class="promo-detail__btn promo-detail__btn--confirm"
        :disabled="!comment.trim()"
        @click="emit('confirm', { id: item.id, comment: comment.trim() })"
      >승급 확정</button>
    </div>
    <div
      v-else
      class="promo-detail__processed"
      :class="`promo-detail__processed--${item.processedStatus}`"
    >
      {{ item.processedStatus === 'confirm' ? '승급 확정 처리됨' : '보류 처리됨' }}
    </div>
  </article>
</template>

<style scoped>
.promo-detail {
  width: 340px;
  flex-shrink: 0;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.promo-detail__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}

/* 헤더 */
.promo-detail__header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.promo-detail__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-md);
  font-weight: 900;
  color: #fff;
  flex-shrink: 0;
}
.promo-detail__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}
.promo-detail__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.promo-detail__score {
  margin-left: auto;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

/* 섹션 */
.promo-detail__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.promo-detail__section-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
}

/* 요건 항목 */
.promo-detail__requirements {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.promo-req {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: var(--font-size-sm);
}
.promo-req--met  { background: #e3fbef; }
.promo-req--fail { background: #fff0f0; }

.promo-req__icon {
  font-weight: 900;
  font-size: var(--font-size-sm);
  width: 14px;
  flex-shrink: 0;
}
.promo-req--met  .promo-req__icon { color: var(--color-mint-500); }
.promo-req--fail .promo-req__icon { color: var(--color-danger); }

.promo-req__label {
  flex: 1;
  color: var(--color-primary-800);
  font-weight: var(--font-weight-semibold);
}
.promo-req__value {
  font-weight: var(--font-weight-bold);
}
.promo-req--met  .promo-req__value { color: var(--color-mint-500); }
.promo-req--fail .promo-req__value { color: var(--color-danger); }

.promo-req__check {
  color: var(--color-mint-500);
  font-weight: 900;
}

/* 심사 의견 */
.promo-detail__textarea {
  width: 100%;
  height: 72px;
  padding: 10px 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-primary-800);
  background: var(--color-bg-app);
  resize: none;
  box-sizing: border-box;
  outline: none;
}
.promo-detail__textarea:focus {
  border-color: var(--color-primary-400);
}
.promo-detail__comment-readonly {
  padding: 10px 12px;
  background: var(--color-bg-app);
  border-radius: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-primary-800);
  line-height: 1.5;
  min-height: 56px;
}

/* 이전 이력 */
.promo-detail__history {
  background: var(--color-bg-app);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.promo-detail__history-item {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* 액션 버튼 */
.promo-detail__actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}
.promo-detail__btn {
  flex: 1;
  height: 40px;
  border-radius: 8px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: none;
}
.promo-detail__btn--hold {
  background: var(--color-bg-app);
  color: var(--color-primary-600);
  border: 1.5px solid var(--color-border-default);
}
.promo-detail__btn--confirm {
  background: var(--color-mint-500);
  color: #fff;
}
.promo-detail__btn--confirm:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.promo-detail__processed {
  padding: 14px;
  border-radius: 10px;
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  margin-top: auto;
}
.promo-detail__processed--confirm {
  background: #e3fbef;
  color: #007a60;
  border: 1px solid var(--color-mint-500);
}
.promo-detail__processed--hold {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fbbf24;
}
</style>
