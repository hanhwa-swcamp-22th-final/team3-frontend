<script setup>
defineProps({
  ranking: { type: Array, default: () => [] },
})

</script>

<template>
  <section class="contributors">
    <div class="contributors__head">
      <p class="contributors__eyebrow">기여 현황</p>
    </div>

    <div class="contributors__list">
      <article v-for="person in ranking" :key="person.rank" class="contributors__row">
        <div class="contributors__left">
          <span class="contributors__rank">{{ person.rank }}</span>
          <span class="contributors__avatar" :style="{ background: person.avatarColor }">{{ person.initial }}</span>
          <div>
            <strong>{{ person.name }}</strong>
          </div>
        </div>
        <div class="contributors__right">
          <p>지식 {{ person.articles }}건</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.contributors {
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
  padding: 20px;
  display: grid;
  gap: 12px;
}

.contributors__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.contributors__head h3 {
  margin-top: 6px;
  font-size: 20px;
  color: var(--color-primary-800);
}

.contributors__list {
  display: grid;
  gap: 6px;
}

.contributors__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 10px 12px;
}

.contributors__left,
.contributors__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contributors__rank {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f2efff;
  color: var(--color-primary-700);
  font-size: 11px;
  font-weight: 800;
}

.contributors__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 12px;
}

.contributors__left strong { color: var(--color-primary-800); }
.contributors__right p {
  margin: 0;
  font-size: 11px;
  color: var(--color-text-muted);
}
</style>
