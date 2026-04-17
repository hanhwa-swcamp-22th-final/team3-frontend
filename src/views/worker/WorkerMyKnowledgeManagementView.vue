<script setup>
import { ref, computed, onMounted } from 'vue'
import { ARTICLE_CATEGORY_LABEL, ARTICLE_STATUS_LABEL } from '@/constants'
import WorkerKnowledgeManagementHeader from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeManagementHeader.vue'
import WorkerKnowledgeManagementOverallCount from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeManagementOverallCount.vue'
import WorkerMyKnowledgeList from '@/components/kms/worker/my-knowledge-management/WorkerMyKnowledgeList.vue'
import WorkerKnowledgeEditHistory from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeEditHistory.vue'
import WorkerKnowledgeAddModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeAddModal.vue'
import WorkerKnowledgeDetailModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeDetailModal.vue'
import WorkerKnowledgeEditModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeEditModal.vue'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'


// ── 날짜 포맷 헬퍼 ─────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}

// ── 백엔드 DTO → 내 문서 카드 shape ────────────────────────────
function mapToMyArticle(dto) {
  const isDeleted = Boolean(dto.deleted)
  return {
    id:           dto.articleId,
    title:        dto.articleTitle,
    category:     ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? dto.articleCategory,
    categoryEnum: dto.articleCategory,   // 수정 모달 초기화용
    equipment:    dto.equipmentName ?? '',
    equipmentId:  dto.equipmentId ?? null, // 수정 모달 초기화용
    status:       isDeleted ? '삭제대기' : (ARTICLE_STATUS_LABEL[dto.articleStatus] ?? dto.articleStatus),
    rawStatus:    dto.articleStatus,
    date:         formatDate(dto.updatedAt ?? dto.createdAt),
    summary:      dto.articleContent ? dto.articleContent.slice(0, 120) : '',
    content:      dto.articleContent ?? '',
    views:           dto.viewCount ?? 0,
    reuses:          dto.reuseCount ?? 0,
    rejectionReason: dto.articleRejectionReason ?? '',
    deletionReason:  dto.articleDeletionReason ?? '',
    isDeleted,
  }
}

// ── 백엔드 DTO → 통계 counts shape ─────────────────────────────
function mapToOverallCount(dto) {
  const approved = dto.approvedCount ?? dto.approved ?? 0
  const pending  = dto.pendingCount  ?? dto.pending  ?? 0
  const rejected = dto.rejectedCount ?? dto.rejected ?? 0
  const draft    = dto.draftCount    ?? dto.draft    ?? 0
  const total    = dto.total ?? (approved + pending + rejected + draft)
  return {
    total,
    totalSub:    '',
    approved,
    approvedSub: '',
    pending,
    pendingSub:  '',
    rejected,
    rejectedSub: '',
    draft,
    draftSub:    '',
  }
}

// ── 백엔드 DTO → 수정 이력 shape ───────────────────────────────
function mapToHistoryItem(dto) {
  return {
    id:     dto.articleId,
    title:  dto.articleTitle,
    date:   formatDate(dto.updatedAt ?? dto.createdAt),
    status: ARTICLE_STATUS_LABEL[dto.articleStatus] ?? dto.articleStatus,
  }
}

// ── 상태 ────────────────────────────────────────────────────────
const overallCount    = ref({
  total: 0,
  totalSub: '',
  approved: 0,
  approvedSub: '',
  pending: 0,
  pendingSub: '',
  rejected: 0,
  rejectedSub: '',
  draft: 0,
  draftSub: '',
})
const myArticles      = ref([])
const editHistory     = ref([])
const isArticleSubmitting = ref(false)

const showAddModal    = ref(false)
const showDetailModal = ref(false)
const showEditModal   = ref(false)
const selectedArticle = ref(null)

// ── 데이터 로드 ────────────────────────────────────────────────
onMounted(async () => {
  await Promise.allSettled([
    loadStats(),
    loadArticles(),
    loadHistory(),
  ])
})

async function loadStats() {
  try {
    const res = await knowledgeArticleApi.getMyArticleStats()
    const dto = res.data.data ?? {}
    overallCount.value = mapToOverallCount(dto)
  } catch (e) {
    console.error('[KMS] 통계 로드 실패:', e)
  }
}

async function loadArticles() {
  try {
    const res = await knowledgeArticleApi.getMyArticles({ page: 0, size: 50 })
    myArticles.value = (res.data.data ?? []).map(mapToMyArticle)
  } catch (e) {
    console.error('[KMS] 내 문서 목록 로드 실패:', e)
  }
}

async function loadHistory() {
  try {
    const res = await knowledgeArticleApi.getMyArticleHistory()
    editHistory.value = (res.data.data ?? []).map(mapToHistoryItem)
  } catch (e) {
    console.error('[KMS] 수정 이력 로드 실패:', e)
  }
}

// ── 모달 핸들러 ────────────────────────────────────────────────
function openDetailModal(article) {
  selectedArticle.value = article
  showDetailModal.value = true
}

function openHistoryDetail(historyItem) {
  const matchedArticle = myArticles.value.find((article) => article.id === historyItem.id)
  if (matchedArticle) {
    openDetailModal(matchedArticle)
  }
}

// APPROVED 문서: startRevision 으로 복사본 ID를 먼저 받은 뒤,
// 복사본의 상세 내용을 직접 조회해서 모달에 넘김 (목록 API content 누락 방지)
// DRAFT / REJECTED: 바로 모달 열기
async function openEditModal(article) {
  if (article.status === '승인완료') {
    try {
      const revRes = await knowledgeArticleApi.startRevision(article.id)
      const revisionId = revRes.data.data   // Long revisionArticleId

      const detailRes = await knowledgeArticleApi.getArticleDetail(revisionId)
      const dto = detailRes.data.data ?? {}

      selectedArticle.value = {
        id:           revisionId,
        title:        dto.articleTitle ?? article.title,
        category:     ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? article.category,
        categoryEnum: dto.articleCategory ?? article.categoryEnum,
        equipment:    dto.equipmentName ?? article.equipment,
        equipmentId:  dto.equipmentId ?? article.equipmentId,
        status:       ARTICLE_STATUS_LABEL[dto.articleStatus] ?? article.status,
        rawStatus:    dto.articleStatus,
        content:      dto.articleContent ?? '',
        isRevision:   true,
        isDeleted:    Boolean(dto.deleted),
      }
      showEditModal.value = true
    } catch (e) {
      console.error('[KMS] 수정본 생성 실패:', e)
    }
  } else {
    selectedArticle.value = article
    showEditModal.value = true
  }
}

async function handleAddArticle(data) {
  if (isArticleSubmitting.value) {
    return
  }
  isArticleSubmitting.value = true
  try {
    await knowledgeArticleApi.createArticle({
      title:       data.title,
      category:    data.category,
      equipmentId: data.equipmentId,
      content:     data.content,
    })
    showAddModal.value = false
    await Promise.allSettled([loadStats(), loadArticles()])
  } catch (e) {
    console.error('[KMS] 문서 등록 실패:', e)
    window.alert(e.response?.data?.message ?? '문서 등록에 실패했습니다.')
  } finally {
    isArticleSubmitting.value = false
  }
}

async function handleSaveDraft(data) {
  if (isArticleSubmitting.value) {
    return
  }
  isArticleSubmitting.value = true
  try {
    await knowledgeArticleApi.saveDraft({
      title:       data.title,
      category:    data.category,
      equipmentId: data.equipmentId,
      content:     data.content,
    })
    showAddModal.value = false
    await loadArticles()
  } catch (e) {
    console.error('[KMS] 임시저장 실패:', e)
    window.alert(e.response?.data?.message ?? '임시 저장에 실패했습니다.')
  } finally {
    isArticleSubmitting.value = false
  }
}

// "수정 완료" → DRAFT / REJECTED / APPROVED복사본 모두 submitDraft (→ PENDING)
async function handleEditSubmit(data) {
  try {
    const submitPayload = {
      title:       data.title,
      category:    data.category,
      equipmentId: data.equipmentId,
      content:     data.content,
    }

    if (selectedArticle.value?.status === '승인대기') {
      await knowledgeArticleApi.updateArticle(data.id, submitPayload)
    } else {
      await knowledgeArticleApi.submitDraft(data.id, submitPayload)
    }

    showEditModal.value = false
    await Promise.allSettled([loadStats(), loadArticles(), loadHistory()])
  } catch (e) {
    console.error('[KMS] 문서 제출 실패:', e)
  }
}

// "임시 저장" → 수정 내용 유지 + DRAFT 전환
async function handleEditSaveDraft(data) {
  try {
    await knowledgeArticleApi.saveArticleAsDraft(data.id, {
      title:       data.title,
      category:    data.category,
      equipmentId: data.equipmentId,
      content:     data.content,
    })
    showEditModal.value = false
    await Promise.allSettled([loadStats(), loadArticles(), loadHistory()])
  } catch (e) {
    console.error('[KMS] 임시저장(수정) 실패:', e)
  }
}

async function handleDeleteArticle(article) {
  const confirmed = window.confirm(`'${article.title}' 문서를 삭제하시겠습니까?`)
  if (!confirmed) return

  try {
    await knowledgeArticleApi.deleteArticle(article.id)
    if (selectedArticle.value?.id === article.id) {
      showDetailModal.value = false
      selectedArticle.value = null
    }
    await Promise.allSettled([loadStats(), loadArticles(), loadHistory()])
  } catch (e) {
    console.error('[KMS] 문서 삭제 실패:', e)
    window.alert('문서 삭제에 실패했습니다.')
  }
}

async function handleRestoreArticle(article) {
  const confirmed = window.confirm(`'${article.title}' 문서를 복원하시겠습니까?`)
  if (!confirmed) return

  try {
    await knowledgeArticleApi.restoreArticle(article.id)
    if (selectedArticle.value?.id === article.id) {
      showDetailModal.value = false
      selectedArticle.value = null
    }
    await Promise.allSettled([loadStats(), loadArticles(), loadHistory()])
  } catch (e) {
    console.error('[KMS] 문서 복원 실패:', e)
    window.alert('문서 복원에 실패했습니다.')
  }
}
</script>

<template>
  <div class="mkm-content">
    <!-- Header -->
    <WorkerKnowledgeManagementHeader @openAddModal="showAddModal = true" />

    <!-- Overall Count Cards -->
    <WorkerKnowledgeManagementOverallCount :counts="overallCount" />

    <div class="mkm-main">
      <WorkerMyKnowledgeList
        :articles="myArticles"
        @detail="openDetailModal"
        @edit="openEditModal"
        @delete="handleDeleteArticle"
        @restore="handleRestoreArticle"
      />

      <WorkerKnowledgeEditHistory
        :history="editHistory"
        @open-detail="openHistoryDetail"
      />
    </div>

    <!-- Add Modal -->
    <WorkerKnowledgeAddModal
      v-if="showAddModal"
      :submitting="isArticleSubmitting"
      @close="showAddModal = false"
      @submit="handleAddArticle"
      @saveDraft="handleSaveDraft"
    />

    <!-- Detail Modal -->
    <WorkerKnowledgeDetailModal
      v-if="showDetailModal && selectedArticle"
      :article="selectedArticle"
      @close="showDetailModal = false"
      @edit="showDetailModal = false; openEditModal($event)"
      @delete="handleDeleteArticle"
      @restore="handleRestoreArticle"
    />

    <!-- Edit Modal -->
    <WorkerKnowledgeEditModal
      v-if="showEditModal && selectedArticle"
      :article="selectedArticle"
      @close="showEditModal = false"
      @submit="handleEditSubmit"
      @saveDraft="handleEditSaveDraft"
    />
  </div>
</template>

<style scoped>
.mkm-content {
  flex: 1;
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  background: var(--color-bg-app);
}

.mkm-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
