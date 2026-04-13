<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ARTICLE_CATEGORY_LABEL } from '@/constants'
import { BaseToast } from '@/components/common/base/overlay'
import TeamLeaderKnowledgeApprovalQueue from '@/components/kms/teamleader/knowledge-approval/TeamLeaderKnowledgeApprovalQueue.vue'
import TeamLeaderKnowledgeApprovalReviewPanel from '@/components/kms/teamleader/knowledge-approval/TeamLeaderKnowledgeApprovalReviewPanel.vue'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'
import { filterVisibleKmsAuthors } from '@/utils/kmsAuthorFilter'

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
const items       = ref([])
const statsData   = ref({ pendingCount: 0, approvedThisMonth: 0, rejectionRate: 0 })
const activeFilter   = ref('all')
const selectedId     = ref(null)
const reviewNote     = ref('')
const selectedDetail = ref(null)
const reviewError    = ref('')
const isSubmitting   = ref(false)
const toast          = ref({ show: false, message: '', type: 'success' })
let toastTimer = null

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
    items.value = filterVisibleKmsAuthors(
      (res.data.data ?? []).map(mapToQueueItem),
      (item) => item.author,
    )
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
  reviewError.value = ''
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

function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

function normalizeErrorMessage(error, fallback) {
  return error.response?.data?.message ?? fallback
}

function validateReviewNote(action) {
  const note = reviewNote.value.trim()
  if (action === 'REJECT' && note.length < 10) {
    reviewError.value = '반려 처리에는 10자 이상의 심사 코멘트가 필요합니다.'
    return false
  }
  if (action === 'PENDING' && note.length === 0) {
    reviewError.value = '보류 처리에는 심사 코멘트를 입력해야 합니다.'
    return false
  }
  reviewError.value = ''
  return true
}

// ── 승인 처리 ─────────────────────────────────────────────────
async function handleApprove() {
  if (!selectedDetail.value || isSubmitting.value) return
  reviewError.value = ''
  isSubmitting.value = true
  try {
    await knowledgeArticleApi.processApproval('DL', selectedDetail.value.id, {
      status: 'APPROVE',
      reviewComment: reviewNote.value,
    })
    await Promise.allSettled([loadStats(), loadList()])
    showToast('승인 처리되었습니다.')
  } catch (e) {
    console.error('[KMS] 승인 처리 실패:', e)
    showToast(normalizeErrorMessage(e, '승인 처리에 실패했습니다.'), 'error')
  } finally {
    isSubmitting.value = false
  }
}

async function handleHold() {
  if (!selectedDetail.value || isSubmitting.value || !validateReviewNote('PENDING')) return
  isSubmitting.value = true
  try {
    await knowledgeArticleApi.processApproval('DL', selectedDetail.value.id, {
      status: 'PENDING',
      reviewComment: reviewNote.value,
    })
    await Promise.allSettled([loadStats(), loadList()])
    showToast('보류 처리되었습니다.')
  } catch (e) {
    console.error('[KMS] 보류 처리 실패:', e)
    showToast(normalizeErrorMessage(e, '보류 처리에 실패했습니다.'), 'error')
  } finally {
    isSubmitting.value = false
  }
}

async function handleReject() {
  if (!selectedDetail.value || isSubmitting.value || !validateReviewNote('REJECT')) return
  isSubmitting.value = true
  try {
    await knowledgeArticleApi.processApproval('DL', selectedDetail.value.id, {
      status: 'REJECT',
      reviewComment: reviewNote.value,
    })
    await Promise.allSettled([loadStats(), loadList()])
    showToast('반려 처리되었습니다.')
  } catch (e) {
    console.error('[KMS] 반려 처리 실패:', e)
    showToast(normalizeErrorMessage(e, '반려 처리에 실패했습니다.'), 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="dl-knowledge-approval-view">
    <section class="dl-knowledge-approval-view__stats">
      <article class="approval-stat-card">
        <p>승인 대기</p>
        <strong>{{ statsData.pendingCount ?? 0 }}건</strong>
      </article>
      <article class="approval-stat-card">
        <p>이번달 승인</p>
        <strong class="approval-stat-card__value--mint">{{ statsData.approvedThisMonth ?? 0 }}건</strong>
      </article>
      <article class="approval-stat-card">
        <p>반려율</p>
        <strong class="approval-stat-card__value--amber">{{ Number(statsData.rejectionRate ?? 0).toFixed(1) }}%</strong>
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
        :item="selectedDetail"
        :review-note="reviewNote"
        :error-message="reviewError"
        :is-submitting="isSubmitting"
        @update:review-note="reviewNote = $event"
        @approve="handleApprove"
        @hold="handleHold"
        @reject="handleReject"
      />
    </section>

    <BaseToast :show="toast.show" :message="toast.message" :type="toast.type" />
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
