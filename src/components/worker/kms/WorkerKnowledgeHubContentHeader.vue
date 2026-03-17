<script setup>
defineProps({
  totalArticles: { type: Number, default: 0 },
  newThisMonth: { type: Number, default: 0 },
  newThisMonthDiff: { type: Number, default: 0 },
  myArticles: { type: Number, default: 0 },
  myArticlesDiff: { type: Number, default: 0 },
})
</script>

<template>
  <div class="kh-header">
    <div class="kh-stat">
      <span class="kh-stat__label">등록 지식 총</span>
      <span class="kh-stat__value">{{ totalArticles.toLocaleString() }}건</span>
    </div>
    <div class="kh-stat">
      <span class="kh-stat__label">이달 신규</span>
      <span class="kh-stat__value">{{ newThisMonth }}건</span>
      <span v-if="newThisMonthDiff" class="kh-stat__diff kh-stat__diff--up">
        ▲{{ newThisMonthDiff }}
      </span>
    </div>
    <div class="kh-stat">
      <span class="kh-stat__label">내 작성글</span>
      <span class="kh-stat__value">{{ myArticles }}</span>
      <span v-if="myArticlesDiff" class="kh-stat__diff kh-stat__diff--up">
        ▲{{ myArticlesDiff }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.kh-header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.kh-stat {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kh-stat__label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.kh-stat__value {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-primary-800);
  font-family: 'Inter', var(--font-family-base);
}

.kh-stat__diff {
  font-size: 13px;
  font-weight: 600;
}

.kh-stat__diff--up {
  color: #00BF95;
}
</style>
