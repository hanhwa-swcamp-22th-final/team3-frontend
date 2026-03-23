<script setup>
import TeamAlertCard from '@/components/dashboard/teamleader/TeamLeaderAlertCard.vue'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="alert-feed">
    <header class="alert-feed__header">
      <div>
        <p class="alert-feed__eyebrow">팀 알림</p>
        <h2 class="alert-feed__title">즉시 확인이 필요한 이벤트</h2>
      </div>
    </header>

    <div class="alert-feed__grid">
      <TeamAlertCard
          v-for="item in items"
          :key="item.id"
          :item="item"
      />
    </div>
  </section>
</template>

<style scoped>
.alert-feed {
  padding: 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
}

.alert-feed__header {
  margin-bottom: 14px;
}

.alert-feed__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.alert-feed__title {
  margin-top: 6px;
  font-size: 18px;
  color: var(--color-primary-800);
}

.alert-feed__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 1200px) {
  .alert-feed__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .alert-feed__grid {
    grid-template-columns: 1fr;
  }
}
</style>
