<script setup>
defineProps({
  ranking: { type: Array, default: () => [] },
})

function tierClass(tier) {
  if (tier === 'S') return 'contributors__tier--s'
  if (tier === 'A') return 'contributors__tier--a'
  return 'contributors__tier--b'
}
</script>

<template>
  <section class="contributors">
    <div class="contributors__head">
      <p class="contributors__eyebrow">기여 현황</p>
      <h3>이달의 기여자 TOP 3</h3>
    </div>

    <div class="contributors__list">
      <article v-for="person in ranking" :key="person.rank" class="contributors__row">
        <div class="contributors__left">
          <span class="contributors__rank">{{ person.rank }}</span>
          <span class="contributors__avatar" :style="{ background: person.avatarColor }">{{ person.initial }}</span>
          <div>
            <strong>{{ person.name }}</strong>
            <p>지식 {{ person.articles }}건</p>
          </div>
        </div>
        <div class="contributors__right">
          <span class="contributors__tier" :class="tierClass(person.tier)">{{ person.tier }}</span>
          <span class="contributors__points">{{ person.points }}</span>
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
  gap: 10px;
}

.contributors__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 14px 16px;
}

.contributors__left,
.contributors__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.contributors__rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f2efff;
  color: var(--color-primary-700);
  font-size: 12px;
  font-weight: 800;
}

.contributors__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
}

.contributors__left strong { color: var(--color-primary-800); }
.contributors__left p { margin-top: 3px; font-size: 12px; color: var(--color-text-muted); }

.contributors__tier {
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.contributors__tier--s { background: #00bf95; color: #fff; }
.contributors__tier--a { background: var(--color-primary-600); color: #fff; }
.contributors__tier--b { background: #ffd166; color: #2d237c; }

.contributors__points {
  font-size: 13px;
  font-weight: 700;
  color: #10a990;
}
</style>
