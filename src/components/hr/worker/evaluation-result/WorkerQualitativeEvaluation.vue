<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  evaluation: { type: Object, required: true },
})

const animated = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { animated.value = true })
  })
})
</script>

<template>
  <div class="ql">
    <div class="ql__header">
      <span class="ql__icon">💬</span>
      <h3 class="ql__title">정성 평가 항목별 내역</h3>
    </div>

    <!-- Evaluator info -->
    <div class="ql__evaluator">
      <div class="ql__avatar">{{ (evaluation?.evaluator || '-').charAt(0) }}</div>
      <span class="ql__evaluator-name">
        {{ evaluation?.evaluator ?? '-' }} ({{ evaluation?.evaluatorRole ?? '-' }})
      </span>
      <span class="ql__nlp">NLP 신뢰도 {{ evaluation?.nlpConfidence ?? '0.00' }}</span>
    </div>

    <hr class="ql__divider" />

    <!-- Category scores -->
    <div class="ql__categories">
      <div v-if="(evaluation?.categories || []).length === 0" class="ql__empty">
        정성 평가 데이터가 없습니다.
      </div>
      <div v-for="cat in (evaluation?.categories || [])" :key="cat.label" class="ql__cat">
        <div class="ql__cat-top">
          <span class="ql__cat-label">{{ cat.label }}</span>
          <span class="ql__cat-score">{{ cat.score }}점</span>
        </div>
        <div class="ql__bar-track">
          <div
            class="ql__bar-fill"
            :style="{ width: animated ? cat.score + '%' : '0%', background: cat.barColor }"
          ></div>
        </div>
        <div class="ql__tags">
          <span v-for="tag in (cat.tags || [])" :key="tag" class="ql__tag">{{ tag }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.ql {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ql__header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ql__icon {
  font-size: 16px;
}

.ql__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.ql__evaluator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ql__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary-200);
  color: var(--color-primary-800);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.ql__evaluator-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-strong);
}

.ql__nlp {
  margin-left: auto;
  font-size: 12px;
  font-weight: 600;
  color: var(--tier-s);
  background: var(--color-mint-100);
  padding: 3px 10px;
  border-radius: var(--radius-2xs);
}

.ql__divider {
  border: none;
  border-top: 1px solid var(--color-border-default);
  margin: 0;
}

.ql__categories {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ql__cat {
  background: var(--color-bg-surface-muted);
  border-radius: var(--radius-base);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ql__cat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ql__cat-label {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.ql__cat-score {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.ql__bar-track {
  height: 6px;
  background: var(--color-primary-200);
  border-radius: 3px;
  overflow: hidden;
}

.ql__bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.ql__tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ql__tag {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-default);
  background: var(--color-primary-100);
  padding: 2px 10px;
  border-radius: var(--radius-2xs);
}

</style>
