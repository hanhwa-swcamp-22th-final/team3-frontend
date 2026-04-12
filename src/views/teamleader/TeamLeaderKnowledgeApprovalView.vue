<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ARTICLE_CATEGORY_LABEL } from '@/constants'
import { BaseStatCardGrid } from '@/components/common/base'
import TeamLeaderKnowledgeApprovalQueue from '@/components/kms/teamleader/knowledge-approval/TeamLeaderKnowledgeApprovalQueue.vue'
import TeamLeaderKnowledgeApprovalReviewPanel from '@/components/kms/teamleader/knowledge-approval/TeamLeaderKnowledgeApprovalReviewPanel.vue'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'

const authStore = useAuthStore()

// ── 날짜 포맷 헬퍼 ─────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}.${dd}`
}

// ── 백엔드 DTO → 대기 큐 아이템 ─────────────────────────────────
function mapToQueueItem(dto) {
  return {
    id:     dto.articleId,
    type:   '신규',
    title:  dto.articleTitle,
    author: dto.authorName ?? '',
    date:   formatDate(dto.createdAt),
  }
}

// ── 백엔드 DTO → 리뷰 패널 아이템 ───────────────────────────────
function mapToReviewItem(dto) {
  return {
    id:            dto.articleId,
    title:         dto.articleTitle,
    date:          formatDate(dto.createdAt),
    author:        dto.authorName ?? '',
    authorInitial: dto.authorName?.[0] ?? '?',
    authorTier:    '-',
    line:          '-',
    workCount:     '-',
    category:      ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? dto.articleCategory,
    equipment:     '-',
    tier:          '-',
    summary:       dto.articleContent ?? '',
    attachment:    '',
    aiReview: {
      duplication: { label: '중복도',      value: '-',   helper: '-'   },
      reliability: { label: '정보 신뢰도', value: '-',   helper: '-'   },
      harmfulness: { label: '유해 콘텐츠', value: '없음', helper: '통과' },
      overall: '자동 검토 정보가 없습니다.',
    },
    reviewComment: dto.articleApprovalOpinion ?? '',
  }
}

// ── 상태 ──────────────────────────────────────────────────────
const items      = ref([])
const statsData  = ref({ pendingCount: 0, approvedThisMonth: 0, rejectionRate: 0 })
const activeFilter  = ref('all')
const selectedId    = ref(null)
const reviewNote    = ref('')
const selectedDetail = ref(null)

// ── 통계 카드 ─────────────────────────────────────────────────
const statCards = computed(() => [
  { label: '승인 대기',    value: `${statsData.value.pendingCount ?? 0}건`,          tone: 'danger'  },
  { label: '이번달 승인',  value: `${statsData.value.approvedThisMonth ?? 0}건`,     tone: 'success' },
  { label: '반려율',       value: `${Number(statsData.value.rejectionRate ?? 0).toFixed(1)}%`, tone: 'warning' },
])

// ── 필터 / 목록 ───────────────────────────────────────────────
const filters = computed(() => {
  const newCount  = items.value.filter((i) => i.type === '신규').length
  const editCount = items.value.filter((i) => i.type === '수정').length
  return [
    { key: 'all',  label: '전체', count: items.value.length },
    { key: 'new',  label: '신규', count: newCount },
    { key: 'edit', label: '수정', count: editCount },
  ]
})

const filteredItems = computed(() => {
  if (activeFilter.value === 'new')  return items.value.filter((i) => i.type === '신규')
  if (activeFilter.value === 'edit') return items.value.filter((i) => i.type === '수정')
  return items.value
})

// ── 데이터 로드 ───────────────────────────────────────────────
onMounted(async () => {
  await Promise.allSettled([loadStats(), loadList()])
})

async function loadStats() {
  try {
    const res = await knowledgeArticleApi.getApprovalStats()
    statsData.value = res.data.data ?? {}
  } catch (e) {
    console.error('[KMS] 승인 통계 로드 실패:', e)
  }
}

async function loadList() {
  try {
    const res = await knowledgeArticleApi.getApprovalList({ page: 0, size: 50 })
    items.value = (res.data.data ?? []).map(mapToQueueItem)
    if (items.value.length > 0) {
      const keepId = selectedId.value && items.value.some((i) => i.id === selectedId.value)
        ? selectedId.value
        : items.value[0].id
      await selectItem(keepId)
    } else {
      selectedId.value = null
      selectedDetail.value = null
      reviewNote.value = ''
    }
  } catch (e) {
    console.error('[KMS] 승인 목록 로드 실패:', e)
  }
}

async function selectItem(id) {
  selectedId.value = id
  selectedDetail.value = null
  try {
    const res = await knowledgeArticleApi.getApprovalDetail(id)
    selectedDetail.value = mapToReviewItem(res.data.data ?? {})
    reviewNote.value = selectedDetail.value.reviewComment ?? ''
  } catch (e) {
    console.error('[KMS] 승인 상세 로드 실패:', e)
  }
}

function changeFilter(filterKey) {
  activeFilter.value = filterKey
  const stillVisible = filteredItems.value.some((i) => i.id === selectedId.value)
  if (!stillVisible) {
    const first = filteredItems.value[0]
    if (first) selectItem(first.id)
    else { selectedId.value = null; selectedDetail.value = null; reviewNote.value = '' }
  }
}

// ── 승인 처리 ─────────────────────────────────────────────────
async function handleApprove() {
  if (!selectedDetail.value) return
  try {
    await knowledgeArticleApi.processApproval('TL', selectedDetail.value.id, {
      status: 'APPROVE',
      reviewComment: reviewNote.value,
    })
    await Promise.allSettled([loadStats(), loadList()])
  } catch (e) {
    console.error('[KMS] 승인 처리 실패:', e)
  }
}

async function handleHold() {
  if (!selectedDetail.value) return
  try {
    await knowledgeArticleApi.processApproval('TL', selectedDetail.value.id, {
      status: 'PENDING',
      reviewComment: reviewNote.value,
    })
    await Promise.allSettled([loadStats(), loadList()])
  } catch (e) {
    console.error('[KMS] 보류 처리 실패:', e)
  }
}

async function handleReject() {
  if (!selectedDetail.value) return
  try {
    await knowledgeArticleApi.processApproval('TL', selectedDetail.value.id, {
      status: 'REJECT',
      reviewComment: reviewNote.value,
    })
    await Promise.allSettled([loadStats(), loadList()])
  } catch (e) {
    console.error('[KMS] 반려 처리 실패:', e)
  }
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
        :item="selectedDetail"
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
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 14px;
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 80px);
  padding: 10px 10px 16px;
  box-sizing: border-box;
  background: var(--color-bg-app);
  overflow: hidden;
}

.teamleader-knowledge-approval-view__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.teamleader-knowledge-approval-view__grid {
  display: grid;
  grid-template-columns: minmax(340px, 0.9fr) minmax(0, 1.25fr);
  gap: 14px;
  align-items: stretch;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 1180px) {
  .teamleader-knowledge-approval-view__stats,
  .teamleader-knowledge-approval-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
