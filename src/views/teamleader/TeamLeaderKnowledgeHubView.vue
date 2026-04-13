<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ARTICLE_CATEGORY_LABEL } from '@/constants'
import TeamLeaderKnowledgeHubHeader from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubHeader.vue'
import TeamLeaderKnowledgeHubFeed from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubFeed.vue'
import TeamLeaderKnowledgeHubContributors from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubContributors.vue'
import TeamLeaderKnowledgeHubMentoring from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubMentoring.vue'
import TeamLeaderKnowledgeHubAiPanel from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubAiPanel.vue'
import TeamLeaderKnowledgeWriteModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeWriteModalWrapper.vue'
import TeamLeaderKnowledgeDetailModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeDetailModal.vue'
import TeamLeaderKnowledgeMentoringReviewModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeMentoringReviewModalWrapper.vue'
import TeamLeaderKnowledgeMentoringRequestModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeMentoringRequestModalWrapper.vue'

// 백엔드 미구현 항목만 mock 유지
import {
  knowledgeHubSummaryCards,
  knowledgeHubMentoring,
  knowledgeHubMentoringRequestDefaults,
  knowledgeWriteModalOptions,
} from '@/mocks/teamleader'

import knowledgeArticleApi from '@/services/knowledgeArticleApi'

const authStore = useAuthStore()
const authorId = computed(() => Number(authStore.userInfo?.employeeId))

// ── 날짜 포맷 헬퍼 ─────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}.${dd}`
}

// ── 백엔드 DTO → 피드 카드 shape ────────────────────────────────
function mapToFeedItem(dto) {
  return {
    id:           dto.articleId,
    title:        dto.articleTitle,
    category:     ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? dto.articleCategory,
    equipment:    dto.equipmentName ?? '',
    date:         formatDate(dto.createdAt),
    author:       dto.authorName ?? '',
    authorInitial: dto.authorName?.[0] ?? '?',
    authorTier:   '-',
    views:        dto.viewCount ?? 0,
    comments:     dto.commentCount ?? 0,
    isPopular:    (dto.viewCount ?? 0) > 50,
    isBookmarked: false,
    status:       dto.articleStatus,
    commentList:  [],
  }
}

// ── 백엔드 DTO → 기여자 shape ────────────────────────────────────
function mapToContributor(dto, index) {
  return {
    rank:        dto.rank ?? index + 1,
    name:        dto.authorName ?? '',
    initial:     dto.authorName?.[0] ?? '?',
    tier:        '-',
    articles:    dto.articleCount ?? 0,
    avatarColor: '#5B4FCF',
  }
}

// ── 백엔드 DTO → AI 추천 shape ───────────────────────────────────
function mapToRecommendation(dto) {
  return { id: dto.articleId, title: dto.articleTitle }
}

// ── 카테고리 탭 (백엔드 enum 기준) ──────────────────────────────
const knowledgeCategories = [
  { key: 'all',    label: '전체' },
  { key: 'popular', label: '인기' },
  { key: 'latest',  label: '최신' },
  { key: 'bookmarked', label: '내 북마크' },
  { key: '장애조치', label: '장애조치' },
  { key: '공정개선', label: '공정개선' },
  { key: '설비운영', label: '설비운영' },
  { key: '안전',    label: '안전' },
  { key: '기타',    label: '기타' },
]

// ── API 상태 ─────────────────────────────────────────────────────
const articles         = ref([])
const contributors     = ref([])
const aiRecommendations = ref([])

// ── 통계 / 멘토링 (백엔드 미구현 → mock 유지) ─────────────────────
const statState = reactive({ totalArticles: 1284, newThisMonth: 42, pendingApproval: 7 })
const mentoringState = reactive({
  ongoing: [...knowledgeHubMentoring.ongoing],
  pending: [...knowledgeHubMentoring.pending],
})

const summaryCards = computed(() =>
  knowledgeHubSummaryCards.map((card) => {
    if (card.key === 'totalArticles')  return { ...card, value: `${statState.totalArticles.toLocaleString()}건` }
    if (card.key === 'newThisMonth')   return { ...card, value: `${statState.newThisMonth}건` }
    if (card.key === 'pendingApproval') return { ...card, value: `${statState.pendingApproval}건` }
    return card
  })
)

// ── 데이터 로드 ───────────────────────────────────────────────────
onMounted(async () => {
  await Promise.allSettled([
    loadArticles(),
    loadContributors(),
    loadRecommendations(),
  ])
})

async function loadArticles() {
  try {
    const res = await knowledgeArticleApi.getArticles({ page: 0, size: 20, status: 'APPROVED' })
    articles.value = (res.data.data ?? [])
      .filter((dto) => dto.articleStatus === 'APPROVED')
      .map(mapToFeedItem)
  } catch (e) {
    console.error('[KMS] 문서 목록 로드 실패:', e)
  }
}

async function loadContributors() {
  try {
    const res = await knowledgeArticleApi.getContributors(5)
    contributors.value = (res.data.data ?? []).map(mapToContributor)
  } catch (e) {
    console.error('[KMS] 기여자 랭킹 로드 실패:', e)
  }
}

async function loadRecommendations() {
  try {
    const res = await knowledgeArticleApi.getRecommendations()
    aiRecommendations.value = (res.data.data ?? []).map(mapToRecommendation)
  } catch (e) {
    console.error('[KMS] AI 추천 로드 실패:', e)
  }
}

async function handleAddArticle(data) {
  try {
    await knowledgeArticleApi.createArticle({
      authorId: authorId.value,
      title: data.title,
      category: data.category,
      equipmentId: data.equipmentId,
      content: data.content,
    })
    showWriteModal.value = false
    await loadArticles()
  } catch (e) {
    console.error('[KMS] TL 문서 등록 실패:', e)
  }
}

async function handleSaveDraft(data) {
  try {
    await knowledgeArticleApi.saveDraft({
      authorId: authorId.value,
      title: data.title,
      category: data.category,
      equipmentId: data.equipmentId,
      content: data.content,
    })
    showWriteModal.value = false
    await loadArticles()
  } catch (e) {
    console.error('[KMS] TL 임시저장 실패:', e)
  }
}

// ── 상세 모달 ─────────────────────────────────────────────────────
const showWriteModal = ref(false)
const selectedArticle = ref(null)

function openDetailModal(article) { selectedArticle.value = article }
function closeDetailModal()       { selectedArticle.value = null }

function submitDetailComment(body) {
  if (!selectedArticle.value) return
  const article = selectedArticle.value
  const nextId = Math.max(...(article.commentList ?? []).map((c) => c.id), 0) + 1
  article.commentList = [...(article.commentList ?? []), { id: nextId, author: '최민정', date: formatDate(new Date().toISOString()), body }]
  article.comments = article.commentList.length
  const idx = articles.value.findIndex((a) => a.id === article.id)
  if (idx !== -1) {
    articles.value[idx] = { ...articles.value[idx], commentList: [...article.commentList], comments: article.comments }
    selectedArticle.value = articles.value[idx]
  }
}

// ── 멘토링 모달 (백엔드 미구현 → mock 유지) ───────────────────────
const selectedMentoringRequest = ref(null)
const showMentoringRequestModal = ref(false)

function openMentoringReview(request)  { selectedMentoringRequest.value = request }
function closeMentoringReview()        { selectedMentoringRequest.value = null }
function confirmMentoringReview(request) {
  mentoringState.pending = mentoringState.pending.filter((i) => i.id !== request.id)
  closeMentoringReview()
}
function openMentoringRequestModal()   { showMentoringRequestModal.value = true }
function closeMentoringRequestModal()  { showMentoringRequestModal.value = false }
function submitMentoringRequest(payload) {
  const nextId = Math.max(...mentoringState.pending.map((i) => i.id), 0) + 1
  mentoringState.pending.unshift({ id: nextId, name: payload.field, requester: 'TL-REQ', summary: payload.purpose, requestedBy: '최민정', requestedAt: formatDate(new Date().toISOString()), priority: '중간', reason: payload.purpose, details: payload.requestDetails })
  showMentoringRequestModal.value = false
}
</script>

<template>
  <section class="teamleader-knowledge-view">
    <TeamLeaderKnowledgeHubHeader :cards="summaryCards" />

    <section class="teamleader-knowledge-view__grid">
      <TeamLeaderKnowledgeHubFeed
        :categories="knowledgeCategories"
        :articles="articles"
        @open-write="showWriteModal = true"
        @open-detail="openDetailModal"
      />

      <div class="teamleader-knowledge-view__sidebar">
        <TeamLeaderKnowledgeHubContributors :ranking="contributors" />
        <TeamLeaderKnowledgeHubMentoring
          :mentoring="mentoringState"
          @review-request="openMentoringReview"
          @open-request="openMentoringRequestModal"
        />
        <TeamLeaderKnowledgeHubAiPanel :recommendations="aiRecommendations" />
      </div>
    </section>

    <TeamLeaderKnowledgeWriteModal
      v-if="showWriteModal"
      :options="knowledgeWriteModalOptions"
      @close="showWriteModal = false"
      @draft="handleSaveDraft"
      @submit="handleAddArticle"
    />

    <TeamLeaderKnowledgeDetailModal
      v-if="selectedArticle"
      :article="selectedArticle"
      @close="closeDetailModal"
      @submit-comment="submitDetailComment"
    />

    <TeamLeaderKnowledgeMentoringReviewModal
      v-if="selectedMentoringRequest"
      :request="selectedMentoringRequest"
      @close="closeMentoringReview"
      @confirm="confirmMentoringReview"
    />

    <TeamLeaderKnowledgeMentoringRequestModal
      v-if="showMentoringRequestModal"
      :defaults="knowledgeHubMentoringRequestDefaults"
      @close="closeMentoringRequestModal"
      @submit="submitMentoringRequest"
    />
  </section>
</template>

<style scoped>
.teamleader-knowledge-view {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 80px);
  padding: 12px 10px 18px;
  box-sizing: border-box;
  background: var(--color-bg-app);
  overflow: hidden;
}

.teamleader-knowledge-view__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.92fr);
  gap: 16px;
  align-items: stretch;
  height: 100%;
  min-height: 0;
  overflow: visible;
}

.teamleader-knowledge-view__sidebar {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 16px;
  height: 100%;
  min-height: 0;
  overflow: visible;
}

@media (max-width: 1180px) {
  .teamleader-knowledge-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
