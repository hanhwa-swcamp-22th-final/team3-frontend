<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ARTICLE_CATEGORY_LABEL, ARTICLE_STATUS_LABEL } from '@/constants'
import WorkerKnowledgeManagementHeader from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeManagementHeader.vue'
import WorkerKnowledgeManagementOverallCount from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeManagementOverallCount.vue'
import WorkerMyKnowledgeList from '@/components/kms/worker/my-knowledge-management/WorkerMyKnowledgeList.vue'
import WorkerKnowledgeApprovalStatus from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeApprovalStatus.vue'
import WorkerKnowledgeEditHistory from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeEditHistory.vue'
import WorkerKnowledgeAddModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeAddModal.vue'
import WorkerKnowledgeDetailModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeDetailModal.vue'
import WorkerKnowledgeEditModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeEditModal.vue'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'

const authStore = useAuthStore()
const authorId = computed(() => Number(authStore.userInfo?.employeeId))

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
  return {
    id:           dto.articleId,
    title:        dto.articleTitle,
    category:     ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? dto.articleCategory,
    categoryEnum: dto.articleCategory,   // 수정 모달 초기화용
    equipment:    dto.equipmentName ?? '',
    equipmentId:  dto.equipmentId ?? null, // 수정 모달 초기화용
    status:       ARTICLE_STATUS_LABEL[dto.articleStatus] ?? dto.articleStatus,
    date:         formatDate(dto.updatedAt ?? dto.createdAt),
    summary:      dto.articleContent ? dto.articleContent.slice(0, 120) : '',
    content:      dto.articleContent ?? '',
    views:        dto.viewCount ?? 0,
    comments:     dto.commentCount ?? 0,
    reuses:       dto.reuseCount ?? 0,
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
    draft,
    draftSub:    '',
  }
}

// ── 백엔드 DTO → 승인 현황 shape ───────────────────────────────
function mapToApprovalStatus(dto) {
  return {
    approved: dto.approvedCount ?? dto.approved ?? 0,
    pending:  dto.pendingCount  ?? dto.pending  ?? 0,
    rejected: dto.rejectedCount ?? dto.rejected ?? 0,
    draft:    dto.draftCount    ?? dto.draft    ?? 0,
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
const overallCount    = ref({ total: 0, totalSub: '', approved: 0, approvedSub: '', pending: 0, pendingSub: '', draft: 0, draftSub: '' })
const approvalStatus  = ref({ approved: 0, pending: 0, rejected: 0, draft: 0 })
const myArticles      = ref([])
const editHistory     = ref([])

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
    const res = await knowledgeArticleApi.getMyArticleStats(authorId.value)
    const dto = res.data.data ?? {}
    overallCount.value   = mapToOverallCount(dto)
    approvalStatus.value = mapToApprovalStatus(dto)
  } catch (e) {
    console.error('[KMS] 통계 로드 실패:', e)
  }
}

async function loadArticles() {
  try {
    const res = await knowledgeArticleApi.getMyArticles({ authorId: authorId.value, page: 0, size: 50 })
    myArticles.value = (res.data.data ?? []).map(mapToMyArticle)
  } catch (e) {
    console.error('[KMS] 내 문서 목록 로드 실패:', e)
  }
}

async function loadHistory() {
  try {
    const res = await knowledgeArticleApi.getMyArticleHistory(authorId.value)
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

function openEditModal(article) {
  selectedArticle.value = article
  showEditModal.value = true
}

async function handleAddArticle(data) {
  try {
    await knowledgeArticleApi.createArticle({
      authorId:    authorId.value,
      title:       data.title,
      category:    data.category,
      equipmentId: data.equipmentId,
      content:     data.content,
    })
    showAddModal.value = false
    await Promise.allSettled([loadStats(), loadArticles()])
  } catch (e) {
    console.error('[KMS] 문서 등록 실패:', e)
  }
}

async function handleSaveDraft(data) {
  try {
    await knowledgeArticleApi.saveDraft({
      authorId:    authorId.value,
      title:       data.title,
      category:    data.category,
      equipmentId: data.equipmentId,
      content:     data.content,
    })
    showAddModal.value = false
    await loadArticles()
  } catch (e) {
    console.error('[KMS] 임시저장 실패:', e)
  }
}

async function handleEditSubmit(data) {
  try {
    await knowledgeArticleApi.updateArticle(data.id, {
      authorId:    authorId.value,
      title:       data.title,
      category:    data.category,
      equipmentId: data.equipmentId,
      content:     data.content,
    })
    showEditModal.value = false
    await Promise.allSettled([loadStats(), loadArticles(), loadHistory()])
  } catch (e) {
    console.error('[KMS] 문서 수정 실패:', e)
  }
}

async function handleEditSaveDraft(data) {
  try {
    await knowledgeArticleApi.updateArticle(data.id, {
      authorId:    authorId.value,
      title:       data.title,
      category:    data.category,
      equipmentId: data.equipmentId,
      content:     data.content,
    })
    showEditModal.value = false
    await loadArticles()
  } catch (e) {
    console.error('[KMS] 임시저장(수정) 실패:', e)
  }
}
</script>

<template>
  <div class="mkm-content">
    <!-- Header -->
    <WorkerKnowledgeManagementHeader @openAddModal="showAddModal = true" />

    <!-- Overall Count Cards -->
    <WorkerKnowledgeManagementOverallCount :counts="overallCount" />

    <!-- Main Grid: List (left) + Sidebar (right) -->
    <div class="mkm-grid">
      <WorkerMyKnowledgeList
        :articles="myArticles"
        @detail="openDetailModal"
        @edit="openEditModal"
      />

      <div class="mkm-sidebar">
        <WorkerKnowledgeApprovalStatus :status="approvalStatus" />
        <WorkerKnowledgeEditHistory :history="editHistory" />
      </div>
    </div>

    <!-- Add Modal -->
    <WorkerKnowledgeAddModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @submit="handleAddArticle"
      @saveDraft="handleSaveDraft"
    />

    <!-- Detail Modal -->
    <WorkerKnowledgeDetailModal
      v-if="showDetailModal && selectedArticle"
      :article="selectedArticle"
      @close="showDetailModal = false"
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

.mkm-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
  align-items: start;
}

.mkm-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
