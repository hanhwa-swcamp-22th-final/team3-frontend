<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import TeamLeaderKnowledgeHubHeader from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubHeader.vue'
import TeamLeaderKnowledgeHubFeed from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubFeed.vue'
import TeamLeaderKnowledgeHubContributors from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubContributors.vue'
import TeamLeaderKnowledgeHubMentoring from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubMentoring.vue'
import TeamLeaderKnowledgeHubAiPanel from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubAiPanel.vue'
import TeamLeaderKnowledgeMentoringReviewModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeMentoringReviewModalWrapper.vue'
import WorkerMentoringRequestModal from '@/components/kms/common/knowledge-hub/worker/WorkerMentoringRequestModal.vue'
import WorkerKnowledgeAddModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeAddModal.vue'
import TeamLeaderKnowledgeDetailModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeDetailModal.vue'

import { ARTICLE_CATEGORY_LABEL } from '@/constants'

import knowledgeArticleApi from '@/services/knowledgeArticleApi'
import { filterVisibleKmsAuthors } from '@/utils/kmsAuthorFilter'

const authStore = useAuthStore()
const authorId  = computed(() => Number(authStore.userInfo?.employeeId))
const requesterRole = computed(() => 'WORKER')

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

function mapMyMentoringRequest(dto) {
  const status = String(dto.requestStatus ?? '').toUpperCase()
  return {
    id: dto.requestId,
    requestId: dto.requestId,
    status,
    name: dto.requestTitle ?? dto.mentoringField ?? '멘토링 요청',
    requester: status === 'ACCEPTED' ? '수락됨' : status === 'REJECTED' ? '종료됨' : '신청 대기',
    summary: dto.mentoringField ?? '-',
    requestedBy: dto.menteeName ?? authStore.userInfo?.employeeName ?? '-',
    requestedAt: formatDateTime(dto.requestedAt),
    priority: mapPriority(dto.requestPriority),
    reason: dto.requestContent ?? '',
    details: `희망 기간 ${dto.mentoringDurationWeeks ?? '-'}주 / 희망 빈도 ${dto.mentoringFrequency ?? '-'}`,
    purpose: dto.requestContent ?? '',
    field: dto.mentoringField ?? '',
    period: dto.mentoringDurationWeeks ? `${dto.mentoringDurationWeeks}주` : '',
    frequency: dto.mentoringFrequency ?? '',
    requestPriority: dto.requestPriority ?? 'MEDIUM',
    actionLabel: status === 'PENDING' ? '수정' : '상세',
  }
}

function mapMentoringSession(dto) {
  return {
    id: dto.mentoringId,
    mentor: dto.mentorName ?? '-',
    mentee: dto.menteeName ?? '-',
    field: dto.mentoringField ?? '-',
    status: dto.mentoringStatus === 'COMPLETED' ? '완료' : '진행중',
  }
}

function parseDurationWeeks(periodText) {
  const match = String(periodText ?? '').match(/(\d+)/)
  return match ? Number(match[1]) : null
}

// ── 백엔드 DTO → 피드 카드 shape 변환 ──────────────────────────
function mapToFeedItem(dto) {
  return {
    id: dto.articleId,
    title: dto.articleTitle,
    category: ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? dto.articleCategory,
    equipment: dto.equipmentName ?? '',
    date: formatDate(dto.createdAt),
    author: dto.authorName ?? '',
    authorInitial: dto.authorName?.[0] ?? '?',
    authorTier: dto.authorTier ?? 'C',
    views: dto.viewCount ?? 0,
    isPopular: (dto.viewCount ?? 0) > 50,
    isBookmarked: Boolean(dto.bookmarked),
    status: dto.articleStatus,
  }
}

// ── 백엔드 DTO → 기여자 shape 변환 ─────────────────────────────
function mapToContributor(dto, index) {
  return {
    rank: dto.rank ?? index + 1,
    name: dto.employeeName ?? '',
    initial: dto.employeeName?.[0] ?? '?',
    tier: dto.employeeTier ?? 'C',
    articles: dto.articleCount ?? 0,
    views: dto.totalViewCount ?? 0,
    avatarColor: '#5B4FCF',
  }
}

// ── 백엔드 DTO → AI 추천 shape 변환 ────────────────────────────
function mapToRecommendation(dto) {
  return {
    id: dto.articleId,
    title: dto.articleTitle,
  }
}

// ── 카테고리 탭 (백엔드 enum 기준) ─────────────────────────────
const knowledgeCategories = [
  { key: 'all',    label: '전체' },
  { key: 'popular', label: '인기' },
  { key: 'bookmarked', label: '내 북마크' },
  { key: '장애조치',   label: '장애조치' },
  { key: '공정개선',   label: '공정개선' },
  { key: '설비운영',   label: '설비운영' },
  { key: '안전',       label: '안전' },
  { key: '기타',       label: '기타' },
]

// ── API 상태 ────────────────────────────────────────────────────
const knowledgeArticles = ref([])
const bookmarkArticles  = ref([])
const monthlyRanking    = ref([])
const aiRecommendations = ref([])
const hubStats          = ref({
  totalArticles: 0,
  newThisMonth: 0,
  averageViewCount: 0,
  newThisMonthChange: 0,
  averageViewCountChange: 0,
})

// ── 데이터 로드 ────────────────────────────────────────────────
onMounted(async () => {
  await Promise.allSettled([
    loadHubStats(),
    loadArticles(),
    loadBookmarks(),
    loadContributors(),
    loadRecommendations(),
    loadMyMentoringRequests(),
    loadMyMentorings(),
  ])
})

const visibleArticles = computed(() => {
  const merged = new Map()
  for (const article of knowledgeArticles.value) {
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
    knowledgeArticles.value = filterVisibleKmsAuthors(
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
    monthlyRanking.value = filterVisibleKmsAuthors(
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

// ── 헤더 카드 (통계 — 백엔드 미구현, mock 유지) ────────────────
const headerCards = computed(() => [
  {
    key: 'total',
    label: '등록 지식 총',
    value: `${Number(hubStats.value.totalArticles ?? 0).toLocaleString()}건`,
    helper: '',
  },
  {
    key: 'new',
    label: '이달 신규',
    value: `${Number(hubStats.value.newThisMonth ?? 0).toLocaleString()}건`,
    helper: formatTrend(hubStats.value.newThisMonthChange).text,
    tone: formatTrend(hubStats.value.newThisMonthChange).tone,
  },
  {
    key: 'avg',
    label: '평균 조회수',
    value: Number(hubStats.value.averageViewCount ?? 0).toFixed(1),
    helper: formatTrend(hubStats.value.averageViewCountChange, 1).text,
    tone: formatTrend(hubStats.value.averageViewCountChange, 1).tone,
  },
])

const mentoringState = ref({ ongoing: [], pending: [] })

const mentoringRequestDefaults = computed(() => ({
  requestId: null,
  myName: authStore.userInfo?.employeeName ?? '작업자',
  myInitial: authStore.userInfo?.employeeName?.[0] ?? '작',
  myAvatarColor: '#5B4FCF',
  myTitle: '멘토링 요청 신청자',
  modalTitle: '매칭 신청',
  modalDesc: '선택한 멘토에게 학습 목적과 희망 운영 조건을 전달합니다. 신청 후 수락되면 진행중 멘토링으로 전환되고 TL / GL에게 공유됩니다.',
  field: '정밀가공',
  period: '2주',
  frequency: '주 1회',
  purpose: '',
  requestDetails: '',
  operatingMemo: '',
}))

async function loadMyMentoringRequests() {
  try {
    const res = await knowledgeArticleApi.getMyMentoringRequests(authorId.value)
    mentoringState.value = {
      ...mentoringState.value,
      pending: (res.data.data ?? []).map(mapMyMentoringRequest),
    }
  } catch (e) {
    console.error('[KMS] 내 멘토링 요청 로드 실패:', e)
    mentoringState.value = { ...mentoringState.value, pending: [] }
  }
}

async function loadMyMentorings() {
  try {
    const res = await knowledgeArticleApi.getMenteeMentorings(authorId.value)
    mentoringState.value = {
      ...mentoringState.value,
      ongoing: (res.data.data ?? [])
        .filter((dto) => dto.mentoringStatus === 'IN_PROGRESS')
        .map(mapMentoringSession),
    }
  } catch (e) {
    console.error('[KMS] 내 진행 멘토링 로드 실패:', e)
    mentoringState.value = { ...mentoringState.value, ongoing: [] }
  }
}

// ── 모달 상태 ──────────────────────────────────────────────────
const showAcceptModal  = ref(false)
const showRequestModal = ref(false)
const showAddModal     = ref(false)
const selectedRequest  = ref(null)
const requestModalDefaults = ref(null)

function handleAcceptClick(request) {
  selectedRequest.value = request
  if (request.status === 'PENDING') {
    requestModalDefaults.value = {
      ...mentoringRequestDefaults.value,
      requestId: request.requestId,
      modalTitle: '멘토링 요청 수정',
      modalDesc: '이미 등록한 멘토링 요청 내용을 수정합니다. 수정 후에도 신청 상태는 유지됩니다.',
      field: request.field || mentoringRequestDefaults.value.field,
      period: request.period || mentoringRequestDefaults.value.period,
      frequency: request.frequency || mentoringRequestDefaults.value.frequency,
      purpose: request.purpose || '',
      requestDetails: request.reason || '',
      operatingMemo: request.details || '',
    }
    showRequestModal.value = true
    return
  }
  showAcceptModal.value = true
}

function handleRequestClick() {
  requestModalDefaults.value = { ...mentoringRequestDefaults.value }
  showRequestModal.value = true
}

function confirmAccept() {
  showAcceptModal.value = false
  selectedRequest.value = null
}

async function submitRequest(payload) {
  try {
    const body = {
      menteeId: authorId.value,
      articleId: null,
      mentoringField: payload.field,
      requestTitle: `${payload.field} 멘토링 요청`,
      requestContent: [payload.purpose, payload.requestDetails].filter(Boolean).join('\n\n'),
      mentoringDurationWeeks: parseDurationWeeks(payload.period),
      mentoringFrequency: payload.frequency,
      requestPriority: 'MEDIUM',
    }

    if (payload.requestId) {
      await knowledgeArticleApi.updateMentoringRequest(payload.requestId, body)
    } else {
      await knowledgeArticleApi.createMentoringRequest(body)
    }

    showRequestModal.value = false
    requestModalDefaults.value = null
    await Promise.allSettled([loadMyMentoringRequests(), loadMyMentorings()])
  } catch (e) {
    console.error('[KMS] 멘토링 요청 저장 실패:', e)
    window.alert(e.response?.data?.message ?? '멘토링 요청 저장에 실패했습니다.')
  }
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
    await loadArticles()
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

// ── 상세 모달 ─────────────────────────────────────────────────
const selectedArticle = ref(null)

async function openDetailModal(article) {
  // 목록 데이터로 즉시 열고, API로 본문 내용을 채움
  selectedArticle.value = {
    id:            article.id,
    title:         article.title,
    category:      article.category,
    equipment:     article.equipment,
    date:          article.date,
    author:        article.author,
    authorInitial: article.authorInitial,
    authorTier:    article.authorTier,
    content:       '',
    views:         article.views,
    isBookmarked:  Boolean(article.isBookmarked),
  }
  try {
    const res = await knowledgeArticleApi.getArticleDetail(article.id, { requesterId: authorId.value })
    const dto = res.data.data ?? {}
    selectedArticle.value = {
      id:            dto.articleId,
      title:         dto.articleTitle ?? article.title,
      category:      ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? article.category,
      equipment:     dto.equipmentName ?? article.equipment,
      date:          article.date,
      author:        dto.authorName ?? article.author,
      authorInitial: dto.authorName?.[0] ?? article.authorInitial,
      authorTier:    dto.authorTier ?? article.authorTier,
      content:       dto.articleContent ?? '',
      views:         dto.viewCount ?? article.views,
      isBookmarked:  Boolean(dto.bookmarked ?? article.isBookmarked),
    }
  } catch (e) {
    console.error('[KMS] 문서 상세 로드 실패:', e)
  }
}

function closeDetailModal() {
  selectedArticle.value = null
}

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

function closeModal() {
  showAcceptModal.value  = false
  showRequestModal.value = false
  showAddModal.value     = false
  selectedRequest.value  = null
  requestModalDefaults.value = null
}
</script>

<template>
  <div class="kh-content">
    <!-- Header Stats -->
    <TeamLeaderKnowledgeHubHeader :cards="headerCards" />

    <!-- Main Grid: Feed (left) + Sidebar (right) -->
    <div class="kh-grid">
      <TeamLeaderKnowledgeHubFeed
        :categories="knowledgeCategories"
        :articles="visibleArticles"
        @open-write="showAddModal = true"
        @open-detail="openDetailModal"
        @toggle-bookmark="toggleBookmark"
      />

      <div class="kh-sidebar">
        <TeamLeaderKnowledgeHubContributors :ranking="monthlyRanking" />
        <TeamLeaderKnowledgeHubMentoring
          :mentoring="mentoringState"
          pending-caption="내 신청 현황"
          pending-action-label="상세"
          @review-request="handleAcceptClick"
          @open-request="handleRequestClick"
        />
        <TeamLeaderKnowledgeHubAiPanel
          :recommendations="aiRecommendations"
          @open-detail="openRecommendedArticle"
        />
      </div>
    </div>

    <!-- Modals -->
    <TeamLeaderKnowledgeMentoringReviewModal
      v-if="showAcceptModal && selectedRequest"
      :request="selectedRequest"
      @close="closeModal"
      @confirm="confirmAccept"
    />
    <WorkerMentoringRequestModal
      v-if="showRequestModal"
      :defaults="requestModalDefaults ?? mentoringRequestDefaults"
      :submit-label="requestModalDefaults?.requestId ? '수정 완료' : '신청 보내기'"
      @close="closeModal"
      @submit="submitRequest"
    />
    <WorkerKnowledgeAddModal
      v-if="showAddModal"
      @close="closeModal"
      @submit="handleAddArticle"
      @saveDraft="handleSaveDraft"
    />

    <!-- 지식 상세 모달 -->
    <TeamLeaderKnowledgeDetailModal
      v-if="selectedArticle"
      :article="selectedArticle"
      @close="closeDetailModal"
      @toggle-bookmark="toggleBookmark"
    />
  </div>
</template>

<style scoped>
.kh-content {
  flex: 1;
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  background: var(--color-bg-app);
}

.kh-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
  align-items: start;
}

.kh-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
