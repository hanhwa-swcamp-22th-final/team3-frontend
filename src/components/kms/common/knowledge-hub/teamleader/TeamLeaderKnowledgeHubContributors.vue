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
            <div class="contributors__name-row">
              <strong>{{ person.name }}</strong>
              <span class="contributors__tier" :class="`contributors__tier--${String(person.tier ?? 'C').toLowerCase()}`">{{ person.tier }}</span>
            </div>
          </div>
        </div>
        <div class="contributors__right">
          <p>게시글 {{ person.articles }}건</p>
          <p>조회수 {{ person.views ?? 0 }}회</p>
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
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
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

.contributors__left {
  min-width: 0;
  flex: 1;
}

.contributors__left > div {
  min-width: 0;
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

.contributors__left strong {
  color: var(--color-primary-800);
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contributors__name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.contributors__tier {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 800;
  flex-shrink: 0;
}

.contributors__tier--s { background: #00bf95; color: #fff; }
.contributors__tier--a { background: var(--color-primary-600); color: #fff; }
.contributors__tier--b { background: #ffd166; color: #2d237c; }
.contributors__tier--c { background: #ef476f; color: #fff; }

.contributors__right {
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
  min-width: 78px;
}

.contributors__right p {
  margin: 0;
  font-size: 11px;
  color: var(--color-text-muted);
  text-align: right;
  white-space: nowrap;
}
</style>
