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

import {
  knowledgeWriteModalOptions,
} from '@/mocks/teamleader'

import knowledgeArticleApi from '@/services/knowledgeArticleApi'
import { filterVisibleKmsAuthors } from '@/utils/kmsAuthorFilter'

const authStore = useAuthStore()
const authorId = computed(() => Number(authStore.userInfo?.employeeId))
const requesterRole = computed(() => 'TEAMLEADER')

function formatTrend(value, digits = 0) {
  const numeric = Number(value ?? 0)
  const abs = Math.abs(numeric)
  const formatted = digits > 0 ? abs.toFixed(digits) : Math.round(abs).toLocaleString()

  if (numeric < 0) {
    return { text: `▼${formatted}`, tone: 'danger' }
  }

  return { text: `▲${formatted}`, tone: 'success' }
}

// ── 날짜 포맷 헬퍼 ─────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}.${dd}`
}

function formatDateTime(isoString) {
  if (!isoString) return '-'
  const d = new Date(isoString)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${mm}.${dd} ${hh}:${mi}`
}

function mapPriority(priority) {
  const labelMap = {
    HIGH: '높음',
    MEDIUM: '중간',
    LOW: '낮음',
  }
  return labelMap[String(priority ?? '').toUpperCase()] ?? '중간'
}

function mapPendingMentoringRequest(dto) {
  return {
    id: dto.requestId,
    name: dto.requestTitle ?? dto.mentoringField ?? '멘토링 요청',
    requester: dto.mentoringField ?? '-',
    summary: dto.requestContent ?? '',
    requestedBy: dto.menteeName ?? '-',
    requestedAt: formatDateTime(dto.requestedAt),
    priority: mapPriority(dto.requestPriority),
    reason: dto.requestContent ?? '',
    details: `희망 기간 ${dto.mentoringDurationWeeks ?? '-'}주 / 희망 빈도 ${dto.mentoringFrequency ?? '-'}`,
    actionLabel: '검토',
  }
}

function mapMentoringSession(dto) {
  return {
    id: dto.mentoringId,
    mentor: dto.mentorName ?? '-',
    mentee: dto.menteeName ?? '-',
    field: dto.mentoringField ?? '-',
    status: dto.mentoringStatus === 'COMPLETED' ? '완료' : '진행중',
    actionLabel: dto.mentoringStatus === 'IN_PROGRESS' ? '완료' : '',
  }
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
    authorTier:   dto.authorTier ?? 'C',
    views:        dto.viewCount ?? 0,
    isPopular:    (dto.viewCount ?? 0) > 50,
    isBookmarked: Boolean(dto.bookmarked),
    status:       dto.articleStatus,
  }
}

// ── 백엔드 DTO → 기여자 shape ────────────────────────────────────
function mapToContributor(dto, index) {
  return {
    rank:        dto.rank ?? index + 1,
    name:        dto.employeeName ?? '',
    initial:     dto.employeeName?.[0] ?? '?',
    tier:        dto.employeeTier ?? 'C',
    articles:    dto.articleCount ?? 0,
    views:       dto.totalViewCount ?? 0,
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
  { key: 'bookmarked', label: '내 북마크' },
  { key: '장애조치', label: '장애조치' },
  { key: '공정개선', label: '공정개선' },
  { key: '설비운영', label: '설비운영' },
  { key: '안전',    label: '안전' },
  { key: '기타',    label: '기타' },
]

// ── API 상태 ─────────────────────────────────────────────────────
const articles         = ref([])
const bookmarkArticles = ref([])
const contributors     = ref([])
const aiRecommendations = ref([])
const hubStats         = ref({
  totalArticles: 0,
  newThisMonth: 0,
  averageViewCount: 0,
  newThisMonthChange: 0,
  averageViewCountChange: 0,
})

// ── 통계 / 멘토링 ───────────────────────────────────────────────
const mentoringState = reactive({
  ongoing: [],
  pending: [],
})

const summaryCards = computed(() => [
  { key: 'totalArticles', label: '등록 지식 수', value: `${Number(hubStats.value.totalArticles ?? 0).toLocaleString()}건`, helper: '' },
  {
    key: 'newThisMonth',
    label: '이달 신규',
    value: `${Number(hubStats.value.newThisMonth ?? 0).toLocaleString()}건`,
    helper: formatTrend(hubStats.value.newThisMonthChange).text,
    tone: formatTrend(hubStats.value.newThisMonthChange).tone,
  },
  {
    key: 'avgViews',
    label: '평균 조회수',
    value: Number(hubStats.value.averageViewCount ?? 0).toFixed(1),
    helper: formatTrend(hubStats.value.averageViewCountChange, 1).text,
    tone: formatTrend(hubStats.value.averageViewCountChange, 1).tone,
  },
])

// ── 데이터 로드 ───────────────────────────────────────────────────
onMounted(async () => {
  await Promise.allSettled([
    loadHubStats(),
    loadArticles(),
    loadBookmarks(),
    loadContributors(),
    loadRecommendations(),
    loadMentoringPending(),
    loadMentoringOngoing(),
  ])
})

const visibleArticles = computed(() => {
  const merged = new Map()
  for (const article of articles.value) {
    merged.set(article.id, article)
  }
  for (const article of bookmarkArticles.value) {
    const existing = merged.get(article.id)
    merged.set(article.id, existing ? { ...existing, ...article, isBookmarked: true } : article)
  }
  return [...merged.values()]
})

async function loadHubStats() {
  try {
    const res = await knowledgeArticleApi.getHubStats()
    hubStats.value = res.data.data ?? {
      totalArticles: 0,
      newThisMonth: 0,
      averageViewCount: 0,
      newThisMonthChange: 0,
      averageViewCountChange: 0,
    }
  } catch (e) {
    console.error('[KMS] 허브 통계 로드 실패:', e)
  }
}

async function loadArticles() {
  try {
    const res = await knowledgeArticleApi.getArticles({
      page: 0,
      size: 20,
      status: 'APPROVED',
      requesterId: authorId.value,
      requesterRole: requesterRole.value,
    })
    articles.value = filterVisibleKmsAuthors(
      (res.data.data ?? [])
      .filter((dto) => dto.articleStatus === 'APPROVED')
      .map(mapToFeedItem),
      (item) => item.author,
    )
  } catch (e) {
    console.error('[KMS] 문서 목록 로드 실패:', e)
  }
}

async function loadBookmarks() {
  try {
    const res = await knowledgeArticleApi.getMyBookmarks(authorId.value)
    bookmarkArticles.value = filterVisibleKmsAuthors(
      (res.data.data ?? [])
        .filter((dto) => dto.articleStatus === 'APPROVED')
        .map(mapToFeedItem),
      (item) => item.author,
    ).map((item) => ({ ...item, isBookmarked: true }))
  } catch (e) {
    console.error('[KMS] 북마크 목록 로드 실패:', e)
  }
}

async function loadContributors() {
  try {
    const res = await knowledgeArticleApi.getContributors(5)
    contributors.value = filterVisibleKmsAuthors(
      (res.data.data ?? []).map(mapToContributor),
      (item) => item.name,
    )
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

async function loadMentoringPending() {
  try {
    const res = await knowledgeArticleApi.getPendingMentoringRequests(authorId.value)
    mentoringState.pending = (res.data.data ?? []).map(mapPendingMentoringRequest)
  } catch (e) {
    console.error('[KMS] TL 멘토링 요청 로드 실패:', e)
    mentoringState.pending = []
  }
}

async function loadMentoringOngoing() {
  try {
    const res = await knowledgeArticleApi.getMentorMentorings(authorId.value)
    mentoringState.ongoing = (res.data.data ?? [])
      .filter((dto) => dto.mentoringStatus === 'IN_PROGRESS')
      .map(mapMentoringSession)
  } catch (e) {
    console.error('[KMS] TL 진행 멘토링 로드 실패:', e)
    mentoringState.ongoing = []
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

async function openDetailModal(article) {
  selectedArticle.value = {
    id: article.id,
    title: article.title,
    category: article.category,
    equipment: article.equipment,
    date: article.date,
    author: article.author,
    authorInitial: article.authorInitial,
    authorTier: article.authorTier,
    content: '',
    views: article.views,
    isBookmarked: Boolean(article.isBookmarked),
  }
  try {
    const res = await knowledgeArticleApi.getArticleDetail(article.id, { requesterId: authorId.value })
    const dto = res.data.data ?? {}
    selectedArticle.value = {
      id: dto.articleId,
      title: dto.articleTitle ?? article.title,
      category: ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? article.category,
      equipment: dto.equipmentName ?? article.equipment,
      date: article.date,
      author: dto.authorName ?? article.author,
      authorInitial: dto.authorName?.[0] ?? article.authorInitial,
      authorTier: dto.authorTier ?? article.authorTier,
      content: dto.articleContent ?? '',
      views: dto.viewCount ?? article.views,
      isBookmarked: Boolean(dto.bookmarked ?? article.isBookmarked),
    }
  } catch (e) {
    console.error('[KMS] 문서 상세 로드 실패:', e)
  }
}

function closeDetailModal() { selectedArticle.value = null }

function openRecommendedArticle(item) {
  openDetailModal({
    id: item.id,
    title: item.title,
    category: '',
    equipment: '',
    date: '',
    author: '',
    authorInitial: '?',
    authorTier: 'C',
    views: 0,
    isBookmarked: false,
  })
}

async function toggleBookmark(article) {
  try {
    if (article.isBookmarked) {
      await knowledgeArticleApi.removeBookmark(article.id, authorId.value)
    } else {
      await knowledgeArticleApi.addBookmark(article.id, authorId.value)
    }

    await Promise.allSettled([loadArticles(), loadBookmarks()])

    if (selectedArticle.value?.id === article.id) {
      selectedArticle.value = { ...selectedArticle.value, isBookmarked: !article.isBookmarked }
    }
  } catch (e) {
    console.error('[KMS] 북마크 처리 실패:', e)
    window.alert('북마크 처리에 실패했습니다.')
  }
}

// ── 멘토링 모달 ────────────────────────────────────────────────
const selectedMentoringRequest = ref(null)

function openMentoringReview(request)  { selectedMentoringRequest.value = request }
function closeMentoringReview()        { selectedMentoringRequest.value = null }

async function confirmMentoringReview(request) {
  try {
    await knowledgeArticleApi.acceptMentoringRequest(request.id, {
      mentorId: authorId.value,
    })
    closeMentoringReview()
    await Promise.allSettled([loadMentoringPending(), loadMentoringOngoing()])
  } catch (e) {
    console.error('[KMS] TL 멘토링 수락 실패:', e)
    window.alert('멘토링 요청 수락에 실패했습니다.')
  }
}

async function rejectMentoringReview(request) {
  try {
    await knowledgeArticleApi.rejectMentoringRequest(request.id, {
      mentorId: authorId.value,
    })
    closeMentoringReview()
    await loadMentoringPending()
  } catch (e) {
    console.error('[KMS] TL 멘토링 거절 실패:', e)
    window.alert(e.response?.data?.message ?? '멘토링 요청 거절에 실패했습니다.')
  }
}

async function completeMentoring(item) {
  try {
    await knowledgeArticleApi.completeMentoring(item.id, {
      mentorId: authorId.value,
    })
    await Promise.allSettled([loadMentoringPending(), loadMentoringOngoing()])
  } catch (e) {
    console.error('[KMS] TL 멘토링 완료 실패:', e)
    window.alert(e.response?.data?.message ?? '멘토링 완료 처리에 실패했습니다.')
  }
}
</script>

<template>
  <section class="teamleader-knowledge-view">
    <TeamLeaderKnowledgeHubHeader :cards="summaryCards" />

    <section class="teamleader-knowledge-view__grid">
      <TeamLeaderKnowledgeHubFeed
        :categories="knowledgeCategories"
        :articles="visibleArticles"
        @open-write="showWriteModal = true"
        @open-detail="openDetailModal"
        @toggle-bookmark="toggleBookmark"
      />

      <div class="teamleader-knowledge-view__sidebar">
        <TeamLeaderKnowledgeHubContributors :ranking="contributors" />
        <TeamLeaderKnowledgeHubMentoring
          :mentoring="mentoringState"
          ongoing-action-label="완료"
          pending-caption="검토 요청"
          :request-button-visible="false"
          @review-request="openMentoringReview"
          @action-ongoing="completeMentoring"
        />
        <TeamLeaderKnowledgeHubAiPanel
          :recommendations="aiRecommendations"
          @open-detail="openRecommendedArticle"
        />
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
      @toggle-bookmark="toggleBookmark"
    />

    <TeamLeaderKnowledgeMentoringReviewModal
      v-if="selectedMentoringRequest"
      :request="selectedMentoringRequest"
      confirm-text="수락"
      :show-reject-button="true"
      reject-text="거절"
      @close="closeMentoringReview"
      @confirm="confirmMentoringReview"
      @reject="rejectMentoringReview"
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
