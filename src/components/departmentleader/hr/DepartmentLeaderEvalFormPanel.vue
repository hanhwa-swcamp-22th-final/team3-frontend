<script setup>
import { ref, watch, computed } from 'vue'
import { TIER_BADGE_STYLES as tierColors, scoreToStars } from '@/constants'

const props = defineProps({
  member: { type: Object, default: null },
})

const emit = defineEmits(['save', 'submit'])

// Local copy of evaluations so edits don't mutate prop directly
const localEvals = ref([])

watch(
  () => props.member,
  (m) => {
    if (!m) return
    localEvals.value = m.evaluations.map((e) => ({ ...e }))
  },
  { immediate: true },
)

function updateScore(idx, raw) {
  const score = Math.min(100, Math.max(0, Number(raw) || 0))
  localEvals.value[idx].score = score
  localEvals.value[idx].stars = scoreToStars(score)
}

function setStars(idx, stars) {
  localEvals.value[idx].stars = stars
}

const canSubmit = computed(() =>
  localEvals.value.every(
    (e) => e.score > 0 && String(e.comment).trim() !== '',
  ),
)

</script>

<template>
  <section v-if="member" class="eval-form">
    <!-- Member header -->
    <div class="eval-form__header">
      <div class="eval-form__avatar" :style="{ background: member.avatarColor }">
        {{ member.avatar }}
      </div>
      <div class="eval-form__member-info">
        <div class="eval-form__name-row">
          <span class="eval-form__name">{{ member.name }}</span>
          <span
            class="eval-form__tier-badge"
            :style="{ background: tierColors[member.tier]?.bg, color: tierColors[member.tier]?.text }"
          >{{ member.tier }}</span>
        </div>
        <span class="eval-form__meta">2차인 · {{ member.tier }}-Tier · {{ member.experience }}</span>
      </div>
    </div>

    <!-- AI recommendation -->
    <div class="eval-form__ai-box">
      <span class="eval-form__ai-label">AI 산출 정량 평균 점수 권고</span>
      <div class="eval-form__ai-scores">
        <div class="eval-form__ai-score">
          <span class="eval-form__ai-value">{{ member.aiRecommended.quantitative }}</span>
          <span class="eval-form__ai-kind">정량</span>
        </div>
        <div class="eval-form__ai-divider" />
        <div class="eval-form__ai-score">
          <span class="eval-form__ai-value">{{ member.aiRecommended.qualitative }}</span>
          <span class="eval-form__ai-kind">정성</span>
        </div>
        <div class="eval-form__ai-divider" />
        <div class="eval-form__ai-score">
          <span class="eval-form__ai-value">{{ member.aiRecommended.composite }}</span>
          <span class="eval-form__ai-kind">종합</span>
        </div>
      </div>
    </div>

    <!-- Evaluation categories -->
    <div class="eval-form__categories">
      <div
        v-for="(item, idx) in localEvals"
        :key="item.category"
        class="eval-category"
      >
        <div class="eval-category__title-row">
          <span class="eval-category__name">{{ item.category }}</span>
          <input
            class="eval-category__score"
            type="number"
            min="0"
            max="100"
            :value="localEvals[idx].score"
            @input="updateScore(idx, $event.target.value)"
          />
        </div>

        <!-- Stars -->
        <div class="eval-category__stars">
          <span
            v-for="s in 5"
            :key="s"
            class="eval-category__star"
            :class="{ 'eval-category__star--filled': s <= item.stars }"
            @click="setStars(idx, s)"
          >★</span>
        </div>

        <!-- Comment input -->
        <input
          v-model="localEvals[idx].comment"
          class="eval-category__input"
          type="text"
          :placeholder="`${item.category} 코멘트 입력...`"
        />
      </div>
    </div>

    <!-- Action buttons -->
    <div class="eval-form__actions">
      <span v-if="!canSubmit" class="eval-form__submit-hint">
        모든 항목의 점수와 코멘트를 입력해야 제출할 수 있습니다.
      </span>
      <button class="eval-form__btn eval-form__btn--save" @click="emit('save', localEvals)">
        임시저장
      </button>
      <button
        class="eval-form__btn eval-form__btn--submit"
        :disabled="!canSubmit"
        @click="emit('submit', localEvals)"
      >
        최종 제출
      </button>
    </div>
  </section>

  <section v-else class="eval-form eval-form--empty">
    <p>좌측 목록에서 팀원을 선택하세요.</p>
  </section>
</template>

<style scoped>
.eval-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.eval-form--empty {
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-size: 14px;
}

/* Header */
.eval-form__header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.eval-form__avatar {
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

.eval-form__member-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.eval-form__name-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.eval-form__name {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-primary-800);
}

.eval-form__tier-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 800;
}

.eval-form__meta {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* AI recommendation box */
.eval-form__ai-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  border-radius: 14px;
  background: #f0eeff;
}

.eval-form__ai-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary-700);
  white-space: nowrap;
}

.eval-form__ai-scores {
  display: flex;
  align-items: center;
  gap: 12px;
}

.eval-form__ai-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.eval-form__ai-value {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary-800);
}

.eval-form__ai-kind {
  font-size: 11px;
  color: var(--color-text-muted);
}

.eval-form__ai-divider {
  width: 1px;
  height: 28px;
  background: var(--color-border-default);
}

/* Categories */
.eval-form__categories {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.eval-category {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.eval-category__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.eval-category__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-primary-800);
}

.eval-category__score {
  width: 72px;
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-300);
  border-radius: 8px;
  padding: 4px 8px;
  background: var(--color-primary-50, #f5f3ff);
  outline: none;
  -moz-appearance: textfield;
  transition: border-color 0.15s;
}
.eval-category__score:focus {
  border-color: var(--color-primary-500);
}
.eval-category__score::-webkit-inner-spin-button,
.eval-category__score::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

/* Stars */
.eval-category__stars {
  display: flex;
  gap: 4px;
}

.eval-category__star {
  font-size: 22px;
  color: #ddd;
  cursor: pointer;
  line-height: 1;
  transition: color 0.1s;
}

.eval-category__star--filled {
  color: #f5a623;
}

.eval-category__star:hover {
  color: #f5c060;
}

/* Comment input */
.eval-category__input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
  font-size: 13px;
  color: var(--color-text-default);
  background: var(--color-bg-surface-muted);
  box-sizing: border-box;
  outline: none;
}
.eval-category__input::placeholder {
  color: var(--color-text-muted);
}
.eval-category__input:focus {
  border-color: var(--color-primary-400);
}

/* Action buttons */
.eval-form__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 4px;
  flex-wrap: wrap;
}

.eval-form__submit-hint {
  flex: 1;
  font-size: 12px;
  color: #e05a5a;
  text-align: left;
}

.eval-form__btn {
  height: 42px;
  padding: 0 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s;
}
.eval-form__btn:hover {
  opacity: 0.85;
}

.eval-form__btn--save {
  background: var(--color-bg-surface-muted);
  color: var(--color-text-default);
  border: 1px solid var(--color-border-default);
}

.eval-form__btn--submit {
  background: var(--color-primary-600);
  color: #fff;
}

.eval-form__btn--submit:disabled {
  background: var(--color-border-default);
  color: var(--color-text-muted);
  cursor: not-allowed;
  opacity: 1;
}
</style>
