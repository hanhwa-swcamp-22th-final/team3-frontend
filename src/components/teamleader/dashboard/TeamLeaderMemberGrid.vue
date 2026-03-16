<script setup>
import TeamLeaderMemberCard from '@/components/teamleader/dashboard/TeamLeaderMemberCard.vue'

defineProps({
  members: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="member-grid-section">
    <header class="member-grid-section__header">
      <div>
        <p class="member-grid-section__eyebrow">팀원 별 성과 현황</p>
        <h2 class="member-grid-section__title">이번달 기준 팀원 상태</h2>
      </div>
      <span class="member-grid-section__caption">이번달 기준</span>
    </header>

    <div class="member-grid">
      <TeamLeaderMemberCard
          v-for="member in members"
          :key="member.id"
          :member="member"
      />
    </div>
  </section>
</template>


<style scoped>
.member-grid-section {
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
}

.member-grid-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.member-grid-section__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-500);
}

.member-grid-section__title {
  margin-top: 6px;
  font-size: 18px;
  color: var(--color-primary-800);
}

.member-grid-section__caption {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

@media (max-width: 900px) {
  .member-grid {
    grid-template-columns: 1fr;
  }
}
</style>
