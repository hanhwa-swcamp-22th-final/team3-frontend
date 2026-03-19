<script setup>
import { computed, ref } from 'vue'
import TeamLeaderKnowledgeApprovalQueue from '@/components/kms/teamleader/knowledge-approval/TeamLeaderKnowledgeApprovalQueue.vue'
import TeamLeaderKnowledgeApprovalReviewPanel from '@/components/kms/teamleader/knowledge-approval/TeamLeaderKnowledgeApprovalReviewPanel.vue'
import { knowledgeApprovalItems } from '@/mocks/teamleader'
import { approvalStats } from '@/mocks/departmentleader/knowledgeApproval.js'

const items = ref([...knowledgeApprovalItems])
const activeFilter = ref('all')
const selectedId = ref(items.value[0]?.id ?? null)
const reviewNote = ref(items.value[0]?.reviewComment ?? '')

const stats = computed(() => ({
  pending: items.value.length,
  approvedThisMonth: approvalStats.approvedThisMonth,
  rejectionRate: approvalStats.rejectionRate,
}))

const filters = computed(() => {
  const newCount  = items.value.filter((item) => item.type === '신규').length
  const editCount = items.value.filter((item) => item.type === '수정').length
  return [
    { key: 'all',  label: '전체', count: items.value.length },
    { key: 'new',  label: '신규', count: newCount },
    { key: 'edit', label: '수정', count: editCount },
  ]
})

const filteredItems = computed(() => {
  if (activeFilter.value === 'new')  return items.value.filter((item) => item.type === '신규')
  if (activeFilter.value === 'edit') return items.value.filter((item) => item.type === '수정')
  return items.value
})

const selectedItem = computed(
  () => filteredItems.value.find((item) => item.id === selectedId.value) ?? filteredItems.value[0] ?? null,
)

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
  if (!selectedItem.value) return
  items.value = items.value.filter((item) => item.id !== selectedItem.value.id)
  reviewNote.value = nextComment
  selectedId.value = filteredItems.value[0]?.id ?? items.value[0]?.id ?? null
  syncSelectedItem()
}

function handleApprove() { removeCurrentItem('승인 완료') }
function handleReject()  { removeCurrentItem('반려 처리') }
function handleHold() {
  const current = selectedItem.value
  if (!current) return
  current.reviewComment = reviewNote.value || '보류 처리됨'
}
</script>

<template>
  <section class="dl-knowledge-approval-view">
    <section class="dl-knowledge-approval-view__stats">
      <article class="approval-stat-card">
        <p>승인 대기</p>
        <strong>{{ stats.pending }}건</strong>
      </article>
      <article class="approval-stat-card">
        <p>이번달 승인</p>
        <strong class="approval-stat-card__value--mint">{{ stats.approvedThisMonth }}건</strong>
      </article>
      <article class="approval-stat-card">
        <p>반려율</p>
        <strong class="approval-stat-card__value--amber">{{ stats.rejectionRate }}</strong>
      </article>
    </section>

    <section class="dl-knowledge-approval-view__grid">
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
.dl-knowledge-approval-view {
  width: 100%;
  min-width: 0;
  padding: 12px 10px 18px;
  box-sizing: border-box;
  background: var(--color-bg-app);
  display: grid;
  gap: 16px;
}

.dl-knowledge-approval-view__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.approval-stat-card {
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
  padding: 18px 20px;
  display: grid;
  gap: 10px;
}

.approval-stat-card p {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-300);
}

.approval-stat-card strong {
  font-size: var(--font-size-display);
  line-height: 1;
  color: #e7395f;
}

.approval-stat-card__value--mint  { color: #18b9a7; }
.approval-stat-card__value--amber { color: #f0b539; }

.dl-knowledge-approval-view__grid {
  display: grid;
  grid-template-columns: minmax(340px, 0.9fr) minmax(0, 1.25fr);
  gap: 16px;
  align-items: start;
}

@media (max-width: 1180px) {
  .dl-knowledge-approval-view__stats,
  .dl-knowledge-approval-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
