<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import TeamLeaderKnowledgeHubHeader from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubHeader.vue'
import TeamLeaderKnowledgeHubFeed from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubFeed.vue'
import TeamLeaderKnowledgeHubContributors from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubContributors.vue'
import TeamLeaderKnowledgeHubMentoring from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubMentoring.vue'
import TeamLeaderKnowledgeHubAiPanel from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubAiPanel.vue'
import WorkerMentoringAcceptModal from '@/components/kms/common/knowledge-hub/worker/WorkerMentoringAcceptModal.vue'
import WorkerMentoringRequestModal from '@/components/kms/common/knowledge-hub/worker/WorkerMentoringRequestModal.vue'
import WorkerKnowledgeAddModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeAddModal.vue'
import TeamLeaderKnowledgeDetailModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeDetailModal.vue'

import { ARTICLE_CATEGORY_LABEL } from '@/constants'

// 백엔드 미구현 항목만 mock 유지
import {
  ongoingMentoring,
  mentoringRequests,
  mentoringRequestFormDefaults,
} from '@/mocks/worker/workerKnowledgeHubData'

import knowledgeArticleApi from '@/services/knowledgeArticleApi'
import { filterVisibleKmsAuthors } from '@/utils/kmsAuthorFilter'

const authStore = useAuthStore()
const authorId  = computed(() => Number(authStore.userInfo?.employeeId))

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
    authorTier: '-',
    views: dto.viewCount ?? 0,
    isPopular: (dto.viewCount ?? 0) > 50,
    isBookmarked: false,
    status: dto.articleStatus,
  }
}

// ── 백엔드 DTO → 기여자 shape 변환 ─────────────────────────────
function mapToContributor(dto, index) {
  return {
    rank: dto.rank ?? index + 1,
    name: dto.employeeName ?? '',
    initial: dto.employeeName?.[0] ?? '?',
    tier: '-',
    articles: dto.articleCount ?? 0,
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
  { key: 'latest',  label: '최신' },
  { key: 'bookmarked', label: '내 북마크' },
  { key: '장애조치',   label: '장애조치' },
  { key: '공정개선',   label: '공정개선' },
  { key: '설비운영',   label: '설비운영' },
  { key: '안전',       label: '안전' },
  { key: '기타',       label: '기타' },
]

// ── API 상태 ────────────────────────────────────────────────────
const knowledgeArticles = ref([])
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
    loadContributors(),
    loadRecommendations(),
  ])
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
    const res = await knowledgeArticleApi.getArticles({ page: 0, size: 20, status: 'APPROVED' })
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

// ── 멘토링 데이터 (백엔드 미구현, mock 유지) ───────────────────
const mentoringData = computed(() => ({
  ongoing: ongoingMentoring.map((m) => ({
    id: m.id,
    mentor: m.mentorInitial,
    mentee: m.menteeInitial,
    field: m.field,
    status: m.status,
  })),
  pending: mentoringRequests.map((r) => ({
    id: r.id,
    name: r.field,
    requester: r.name,
    summary: r.message,
  })),
}))

// ── 모달 상태 ──────────────────────────────────────────────────
const showAcceptModal  = ref(false)
const showRequestModal = ref(false)
const showAddModal     = ref(false)
const selectedRequest  = ref(null)

function handleAcceptClick(request) {
  selectedRequest.value = request
  showAcceptModal.value = true
}

function handleRequestClick() {
  showRequestModal.value = true
}

function confirmAccept() {
  showAcceptModal.value = false
  selectedRequest.value = null
}

function submitRequest() {
  showRequestModal.value = false
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
    content:       '',
    views:         article.views,
  }
  try {
    const res = await knowledgeArticleApi.getArticleDetail(article.id)
    const dto = res.data.data ?? {}
    selectedArticle.value = {
      id:            dto.articleId,
      title:         dto.articleTitle ?? article.title,
      category:      ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? article.category,
      equipment:     dto.equipmentName ?? article.equipment,
      date:          article.date,
      author:        dto.authorName ?? article.author,
      authorInitial: dto.authorName?.[0] ?? article.authorInitial,
      content:       dto.articleContent ?? '',
      views:         dto.viewCount ?? article.views,
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
    views: 0,
  })
}

function closeModal() {
  showAcceptModal.value  = false
  showRequestModal.value = false
  showAddModal.value     = false
  selectedRequest.value  = null
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
        :articles="knowledgeArticles"
        @open-write="showAddModal = true"
        @open-detail="openDetailModal"
      />

      <div class="kh-sidebar">
        <TeamLeaderKnowledgeHubContributors :ranking="monthlyRanking" />
        <TeamLeaderKnowledgeHubMentoring
          :mentoring="mentoringData"
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
    <WorkerMentoringAcceptModal
      v-if="showAcceptModal && selectedRequest"
      :request="selectedRequest"
      @close="closeModal"
      @accept="confirmAccept"
    />
    <WorkerMentoringRequestModal
      v-if="showRequestModal"
      :defaults="mentoringRequestFormDefaults"
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
