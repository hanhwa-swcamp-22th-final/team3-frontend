<script setup>
import { computed, ref, onMounted } from 'vue'
import { ARTICLE_CATEGORY_LABEL } from '@/constants'
import { BaseStatCardGrid } from '@/components/common/base'
import { BaseToast } from '@/components/common/base/overlay'
import TeamLeaderKnowledgeApprovalQueue from '@/components/kms/teamleader/knowledge-approval/TeamLeaderKnowledgeApprovalQueue.vue'
import TeamLeaderKnowledgeApprovalReviewPanel from '@/components/kms/teamleader/knowledge-approval/TeamLeaderKnowledgeApprovalReviewPanel.vue'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'
import { filterVisibleKmsAuthors } from '@/utils/kmsAuthorFilter'

// ── 날짜 포맷 헬퍼 ─────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}.${dd}`
}

function formatDateTime(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`
}

// ── 백엔드 DTO → 대기 큐 아이템 ─────────────────────────────────
function mapToQueueItem(dto) {
  return {
    id:     dto.articleId,
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
    authorTier:    dto.authorTier ?? '-',
    line:          '-',
    workCount:     '-',
    category:      ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? dto.articleCategory,
    equipment:     '-',
    tier:          '-',
    summary:       dto.articleContent ?? '',
    attachment:    '',
    approverName:  dto.approverName ?? '',
    updatedAt:     formatDateTime(dto.updatedAt),
    reviewComment: dto.articleApprovalOpinion ?? '',
  }
}

// ── 상태 ──────────────────────────────────────────────────────
const items      = ref([])
const statsData  = ref({ pendingCount: 0, approvedThisMonth: 0, rejectionRate: 0 })
const selectedId    = ref(null)
const reviewNote    = ref('')
const selectedDetail = ref(null)
const reviewError = ref('')
const isSubmitting = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null

// ── 통계 카드 ─────────────────────────────────────────────────
const statCards = computed(() => [
  { label: '승인 대기',    value: `${statsData.value.pendingCount ?? 0}건`,          tone: 'danger'  },
  { label: '이번달 승인',  value: `${statsData.value.approvedThisMonth ?? 0}건`,     tone: 'success' },
  { label: '반려율',       value: `${Number(statsData.value.rejectionRate ?? 0).toFixed(1)}%`, tone: 'warning' },
])

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
    await knowledgeArticleApi.processApproval('TL', selectedDetail.value.id, {
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
    await knowledgeArticleApi.processApproval('TL', selectedDetail.value.id, {
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
    await knowledgeArticleApi.processApproval('TL', selectedDetail.value.id, {
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
  <section class="teamleader-knowledge-approval-view">
    <BaseStatCardGrid class="teamleader-knowledge-approval-view__stats" :cards="statCards" />

    <section class="teamleader-knowledge-approval-view__grid">
      <TeamLeaderKnowledgeApprovalQueue
        :items="items"
        :selected-id="selectedId"
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
