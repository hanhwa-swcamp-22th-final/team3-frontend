<script setup>
defineProps({
  targets: {
    type: Array,
    default: () => [],
  },
  selectedId: {
    type: String,
    default: '',
  },
  searchPlaceholder: {
    type: String,
    default: '팀원 검색...',
  },
})
</script>

<template>
  <section class="target-list-panel">
    <header class="target-list-panel__header">
      <p class="target-list-panel__eyebrow">팀원 목록</p>
    </header>

    <div class="target-list-panel__search">
      <input type="text" :placeholder="searchPlaceholder" />
    </div>

    <div class="target-list">
      <article
        v-for="target in targets"
        :key="target.id"
        class="target-card"
        :class="{ 'target-card--selected': String(target.id) === selectedId }"
      >
        <div class="target-card__top">
          <div class="target-card__identity">
            <div class="target-card__avatar" :class="`target-card__avatar--${target.avatarTone}`">
              {{ target.avatar }}
            </div>
            <div>
              <strong>{{ target.name }}</strong>
              <p>{{ target.code }} · {{ target.scoreHint }}</p>
            </div>
          </div>
          <span class="target-card__tier">{{ target.tier }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.target-list-panel {
  padding: 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
}

.target-list-panel__header {
  margin-bottom: 12px;
}

.target-list-panel__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.target-list-panel__search {
  margin-bottom: 10px;
}

.target-list-panel__search input {
  width: 100%;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
  color: var(--color-primary-800);
  background: var(--color-bg-surface);
  box-sizing: border-box;
}

.target-list {
  display: grid;
  gap: 10px;
}

.target-card {
  padding: 16px;
  border: 1px solid var(--color-border-soft);
  border-radius: 16px;
  background: #fcfbff;
}

.target-card--selected {
  border-color: var(--color-primary-300);
  background: var(--color-primary-100);
}

.target-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.target-card__identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.target-card__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-inverse);
  font-size: 20px;
  font-weight: 700;
}

.target-card__avatar--purple {
  background: #5f50d6;
}

.target-card__avatar--green {
  background: #269063;
}

.target-card__avatar--gold {
  background: #c08b00;
}

.target-card__top strong {
  color: var(--color-primary-800);
}

.target-card__top p {
  margin-top: 4px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.target-card__tier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 10px;
  border-radius: 10px;
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
  font-size: 13px;
  font-weight: 700;
}
</style>
