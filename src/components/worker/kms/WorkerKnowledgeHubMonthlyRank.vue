<script setup>
defineProps({
  ranking: { type: Array, required: true },
})

const medals = ['👑', '🥈', '🥉']

function tierClass(tier) {
  if (tier === 'S') return 'tier--s'
  if (tier === 'A') return 'tier--a'
  return 'tier--b'
}
</script>

<template>
  <div class="mr">
    <span class="mr__label">🏆 이달의 기여자 TOP 3</span>

    <div class="mr__list">
      <div v-for="(person, i) in ranking" :key="person.rank" class="mr__row">
        <div class="mr__left">
          <span class="mr__medal">{{ medals[i] }}</span>
          <span class="mr__avatar" :style="{ background: person.avatarColor }">
            {{ person.initial }}
          </span>
          <span class="mr__name">{{ person.name }}</span>
          <span class="mr__tier" :class="tierClass(person.tier)">{{ person.tier }}</span>
        </div>
        <span class="mr__count">{{ person.articles }}건</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mr {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mr__label {
  font-size: 13px;
  color: var(--color-text-muted);
}

.mr__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mr__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
  padding: 16px 20px;
}

.mr__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mr__medal {
  font-size: 20px;
  width: 28px;
  text-align: center;
}

.mr__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mr__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
}

.mr__tier {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  color: #ffffff;
}

.tier--s {
  background: #00BF95;
}

.tier--a {
  background: var(--color-primary-600);
}

.tier--b {
  background: #FFD166;
  color: var(--color-text-strong);
}

.mr__count {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text-strong);
  font-family: 'Inter', var(--font-family-base);
}
</style>
