<script setup>
import { computed, ref, watch } from 'vue'
import TeamLeaderMemberCard from '@/components/dashboard/teamleader/TeamLeaderMemberCard.vue'

const props = defineProps({
  members: {
    type: Array,
    default: () => [],
  },
})

const currentPage = ref(1)
const pageSize = 4

const totalPages = computed(() => Math.max(1, Math.ceil(props.members.length / pageSize)))
const pagedMembers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return props.members.slice(start, start + pageSize)
})
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

watch(
  () => props.members.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  }
)
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
          v-for="member in pagedMembers"
          :key="member.id"
          :member="member"
      />
    </div>

    <div v-if="members.length > 0" class="member-grid-section__pagination">
      <button
        v-for="page in pageNumbers"
        :key="page"
        type="button"
        class="member-grid-section__page"
        :class="{ 'member-grid-section__page--active': currentPage === page }"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
    </div>
  </section>
</template>


<style scoped>
.member-grid-section {
  padding: 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
}

.member-grid-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
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
  gap: 12px;
}

.member-grid-section__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 14px;
}

.member-grid-section__page {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.member-grid-section__page--active {
  border-color: var(--color-primary-700);
  background: var(--color-primary-700);
  color: #fff;
}

@media (max-width: 900px) {
  .member-grid {
    grid-template-columns: 1fr;
  }
}
</style>
