<script setup>
defineProps({
  summary: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <section v-if="summary" class="first-evaluation-summary">
    <div class="first-evaluation-summary__header">
      <div>
        <p class="first-evaluation-summary__eyebrow">1차 평가 요약</p>
        <h3 class="first-evaluation-summary__title">팀리더 평가 내용 및 점수</h3>
      </div>
      <div class="first-evaluation-summary__scores">
        <div class="first-evaluation-summary__score">
          <strong>{{ summary.quantitativeScore }}</strong>
          <span>정량</span>
        </div>
        <div class="first-evaluation-summary__score">
          <strong>{{ summary.qualitativeScore }}</strong>
          <span>정성</span>
        </div>
        <div class="first-evaluation-summary__score">
          <strong>{{ summary.compositeScore }}</strong>
          <span>종합</span>
        </div>
      </div>
    </div>

    <div class="first-evaluation-summary__comment-card">
      <p class="first-evaluation-summary__comment-label">팀리더 정성 평가</p>
      <p class="first-evaluation-summary__comment">
        {{ summary.qualitativeComment }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.first-evaluation-summary {
  display: grid;
  gap: 14px;
  margin-bottom: 16px;
  padding: 18px;
  border: 1px solid #dcd6ff;
  border-radius: 20px;
  background: #faf8ff;
}

.first-evaluation-summary__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.first-evaluation-summary__eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.first-evaluation-summary__title {
  margin: 0;
  font-size: 18px;
  color: var(--color-primary-800);
}

.first-evaluation-summary__scores {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.first-evaluation-summary__score {
  min-width: 72px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e1dbff;
  text-align: center;
}

.first-evaluation-summary__score strong {
  display: block;
  font-size: 20px;
  color: var(--color-primary-800);
}

.first-evaluation-summary__score span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.first-evaluation-summary__comment-card {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e8e2ff;
}

.first-evaluation-summary__comment-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  color: #6a57d3;
}

.first-evaluation-summary__comment {
  margin: 0;
  line-height: 1.7;
  color: var(--color-primary-800);
}

@media (max-width: 720px) {
  .first-evaluation-summary__header {
    flex-direction: column;
  }
}
</style>
