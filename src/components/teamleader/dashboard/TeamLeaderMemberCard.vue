<script setup>
defineProps({
  member: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="member-card">
    <div class="member-card__top">
      <div class="member-card__identity">
        <div class="member-card__avatar" :class="`member-card__avatar--${member.avatarTone}`">
          {{ member.avatar }}
        </div>

        <div class="member-card__copy">
          <div class="member-card__name-row">
            <strong>{{ member.name }}</strong>
            <span class="tier-badge" :class="`tier-badge--${member.tierTone}`">
              {{ member.tier }}
            </span>
          </div>
          <span class="member-card__code">{{ member.code }}</span>
        </div>
      </div>

      <strong class="member-card__score">{{ member.score }}</strong>
    </div>

    <div class="member-card__metrics">
      <div class="member-card__metric">
        <span>정량</span>
        <div class="member-card__bar-track">
          <div
              class="member-card__bar-fill member-card__bar-fill--primary"
              :style="{ width: member.quantitative }"
          ></div>
        </div>
        <strong>{{ member.quantitative }}</strong>
      </div>

      <div class="member-card__metric">
        <span>정성</span>
        <div class="member-card__bar-track">
          <div
              class="member-card__bar-fill member-card__bar-fill--mint"
              :style="{ width: member.qualitative }"
          ></div>
        </div>
        <strong>{{ member.qualitative }}</strong>
      </div>
    </div>

    <div class="member-card__bottom">
      <span>{{ member.tasks }}</span>
      <span class="member-card__delta" :class="`member-card__delta--${member.statusTone}`">
        {{ member.delta }}
      </span>
    </div>
  </article>
</template>


<style scoped>
.member-card {
  display: grid;
  gap: 18px;
  padding: 22px 24px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-soft);
}

.member-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.member-card__identity {
  display: flex;
  gap: 14px;
  min-width: 0;
}

.member-card__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-inverse);
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
}

.member-card__avatar--purple {
  background: #5f50d6;
}

.member-card__avatar--green {
  background: #269063;
}

.member-card__avatar--gold {
  background: #c08b00;
}

.member-card__copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.member-card__name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.member-card__name-row strong {
  font-size: 17px;
  color: var(--color-primary-800);
  line-height: 1.2;
}

.member-card__code {
  font-size: 13px;
  color: var(--color-text-muted);
}

.member-card__score {
  font-size: 52px;
  line-height: 1;
  color: var(--color-primary-300);
  flex-shrink: 0;
}

.tier-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}

.tier-badge--purple {
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
}

.tier-badge--gold {
  background: #ffda70;
  color: #855900;
}

.member-card__metrics {
  display: grid;
  gap: 10px;
}

.member-card__metric {
  display: grid;
  grid-template-columns: 40px 1fr 54px;
  gap: 10px;
  align-items: center;
  font-size: 15px;
  color: var(--color-primary-500);
}

.member-card__metric span,
.member-card__metric strong {
  white-space: nowrap;
}

.member-card__bar-track {
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: #eeebff;
}

.member-card__bar-fill {
  height: 100%;
  border-radius: 999px;
}

.member-card__bar-fill--primary {
  background: #5f50d6;
}

.member-card__bar-fill--mint {
  background: var(--color-mint-500);
}

.member-card__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 15px;
  color: var(--color-primary-500);
}

.member-card__delta {
  font-weight: 700;
}

.member-card__delta--success {
  color: var(--color-mint-500);
}

.member-card__delta--danger {
  color: var(--color-danger);
}

.member-card__delta--warning {
  color: var(--color-warning);
}

.member-card__delta--info {
  color: var(--color-info);
}

@media (max-width: 720px) {
  .member-card {
    padding: 18px;
  }

  .member-card__top {
    align-items: flex-start;
  }

  .member-card__score {
    font-size: 40px;
  }

  .member-card__metric {
    grid-template-columns: 36px 1fr 50px;
    font-size: 14px;
  }
}
</style>

