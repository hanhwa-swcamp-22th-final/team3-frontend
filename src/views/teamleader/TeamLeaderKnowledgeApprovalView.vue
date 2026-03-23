<script setup>
import { computed, ref } from 'vue'
import { BaseStatCardGrid } from '@/components/common/base'
import TeamLeaderKnowledgeApprovalQueue from '@/components/kms/teamleader/knowledge-approval/TeamLeaderKnowledgeApprovalQueue.vue'
import TeamLeaderKnowledgeApprovalReviewPanel from '@/components/kms/teamleader/knowledge-approval/TeamLeaderKnowledgeApprovalReviewPanel.vue'
import { knowledgeApprovalItems } from '@/mocks/teamleader'

const items = ref([...knowledgeApprovalItems])
const activeFilter = ref('all')
const selectedId = ref(items.value[0]?.id ?? null)
const reviewNote = ref(items.value[0]?.reviewComment ?? '')

const stats = computed(() => ({
  pending: items.value.length,
  approvedThisMonth: 31,
  rejectionRate: '8.3%',
}))

const statCards = computed(() => [
  {
    label: '승인 대기',
    value: `${stats.value.pending}건`,
    tone: 'danger',
  },
  {
    label: '이번달 승인',
    value: `${stats.value.approvedThisMonth}건`,
    tone: 'success',
  },
  {
    label: '반려율',
    value: stats.value.rejectionRate,
    tone: 'warning',
  },
])

const filters = computed(() => {
  const newCount = items.value.filter((item) => item.type === '신규').length
  const editCount = items.value.filter((item) => item.type === '수정').length

  return [
    { key: 'all', label: '전체', count: items.value.length },
    { key: 'new', label: '신규', count: newCount },
    { key: 'edit', label: '수정', count: editCount },
  ]
})

const filteredItems = computed(() => {
  if (activeFilter.value === 'new') {
    return items.value.filter((item) => item.type === '신규')
  }
  if (activeFilter.value === 'edit') {
    return items.value.filter((item) => item.type === '수정')
  }
  return items.value
})

const selectedItem = computed(() => filteredItems.value.find((item) => item.id === selectedId.value) ?? filteredItems.value[0] ?? null)

function syncSelectedItem() {
  if (!filteredItems.value.some((item) => item.id === selectedId.value)) {
    selectedId.value = filteredItems.value[0]?.id ?? null
  }
  reviewNote.value = selectedItem.value?.reviewComment ?? ''
}

function changeFilter(filterKey) {
  activeFilter.value = filterKey
  syncSelectedItem()
}

function selectItem(id) {
  selectedId.value = id
  reviewNote.value = selectedItem.value?.reviewComment ?? ''
}

function removeCurrentItem(nextComment) {
  if (!selectedItem.value) {
    return
  }

  items.value = items.value.filter((item) => item.id !== selectedItem.value.id)
  reviewNote.value = nextComment
  selectedId.value = filteredItems.value[0]?.id ?? items.value[0]?.id ?? null
  syncSelectedItem()
}

function handleApprove() {
  removeCurrentItem('승인 완료')
}

function handleHold() {
  const current = selectedItem.value
  if (!current) {
    return
  }
  current.reviewComment = reviewNote.value || '보류 처리됨'
}

function handleReject() {
  removeCurrentItem('반려 처리')
}
</script>

<template>
  <section class="teamleader-knowledge-approval-view">
    <BaseStatCardGrid class="teamleader-knowledge-approval-view__stats" :cards="statCards" />

    <section class="teamleader-knowledge-approval-view__grid">
      <TeamLeaderKnowledgeApprovalQueue
        :items="filteredItems"
        :filters="filters"
        :active-filter="activeFilter"
        :selected-id="selectedId"
        @change-filter="changeFilter"
        @select-item="selectItem"
      />

      <TeamLeaderKnowledgeApprovalReviewPanel
        :item="selectedItem"
        :review-note="reviewNote"
        @update:review-note="reviewNote = $event"
        @approve="handleApprove"
        @hold="handleHold"
        @reject="handleReject"
      />
    </section>
  </section>
</template>

<style scoped>
.teamleader-knowledge-approval-view {
  width: 100%;
  min-width: 0;
  padding: 12px 10px 18px;
  box-sizing: border-box;
  background: var(--color-bg-app);
  display: grid;
  gap: 16px;
}

.teamleader-knowledge-approval-view__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.teamleader-knowledge-approval-view__grid {
  display: grid;
  grid-template-columns: minmax(340px, 0.9fr) minmax(0, 1.25fr);
  gap: 16px;
  align-items: start;
}

@media (max-width: 1180px) {
  .teamleader-knowledge-approval-view__stats,
  .teamleader-knowledge-approval-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
