<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import KnowledgeHubHeader from '@/components/kms/common/knowledge-hub/KnowledgeHubHeader.vue'
import KnowledgeHubFeed from '@/components/kms/common/knowledge-hub/KnowledgeHubFeed.vue'
import KnowledgeHubContributors from '@/components/kms/common/knowledge-hub/KnowledgeHubContributors.vue'
import KnowledgeHubAiPanel from '@/components/kms/common/knowledge-hub/KnowledgeHubAiPanel.vue'
import WorkerKnowledgeAddModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeAddModal.vue'
import KnowledgeDetailModal from '@/components/kms/common/knowledge-hub/KnowledgeDetailModal.vue'
import { ARTICLE_CATEGORY_LABEL, ARTICLE_CATEGORY_OPTIONS } from '@/constants'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'

const HUB_PAGE_SIZE = 4
const CATEGORY_VALUE_MAP = Object.fromEntries(
  ARTICLE_CATEGORY_OPTIONS.map((option) => [option.label, option.value]),
)
const route = useRoute()

function normalizePageQuery(value) {
  const parsed = Number.parseInt(Array.isArray(value) ? value[0] : value, 10)
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1
  }
  return parsed
}

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
    score: dto.contributionScore ?? 0,
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
const totalPages        = ref(1)
const hubStats          = ref({
  totalArticles: 0,
  newThisMonth: 0,
  averageViewCount: 0,
  newThisMonthChange: 0,
  averageViewCountChange: 0,
})
const isArticleSubmitting = ref(false)
const isPageQueryReady = ref(false)
const currentFeedQuery = ref({
  categoryKey: 'all',
  keyword: '',
  page: normalizePageQuery(route.query.p),
  pageSize: HUB_PAGE_SIZE,
})

// ── 데이터 로드 ────────────────────────────────────────────────
onMounted(async () => {
  await Promise.allSettled([
    loadHubStats(),
    loadArticlesPage(),
    loadBookmarks(),
    loadContributors(),
    loadRecommendations(),
  ])
  isPageQueryReady.value = true
})
const visibleArticles = computed(() => knowledgeArticles.value)

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

async function loadBookmarks() {
  try {
    const res = await knowledgeArticleApi.getMyBookmarks()
    bookmarkArticles.value = (res.data.data ?? [])
      .filter((dto) => dto.articleStatus === 'APPROVED')
      .map(mapToFeedItem)
      .map((item) => ({ ...item, isBookmarked: true }))
  } catch (e) {
    console.error('[KMS] 북마크 목록 로드 실패:', e)
  }
}

function filterBookmarkArticles(keyword = '') {
  const normalizedKeyword = keyword.trim().toLowerCase()
  if (!normalizedKeyword) {
    return bookmarkArticles.value
  }

  return bookmarkArticles.value.filter((article) =>
    [article.title, article.equipment, article.author, article.category]
      .join(' ')
      .toLowerCase()
      .includes(normalizedKeyword),
  )
}

async function loadArticlesPage(query = currentFeedQuery.value) {
  currentFeedQuery.value = { ...currentFeedQuery.value, ...query }

  if (currentFeedQuery.value.categoryKey === 'bookmarked') {
    const filtered = filterBookmarkArticles(currentFeedQuery.value.keyword)
    totalPages.value = Math.max(1, Math.ceil(filtered.length / HUB_PAGE_SIZE))
    const page = Math.min(Math.max(currentFeedQuery.value.page, 1), totalPages.value)
    const start = (page - 1) * HUB_PAGE_SIZE
    knowledgeArticles.value = filtered.slice(start, start + HUB_PAGE_SIZE)
    return
  }

  const params = {
    articleStatus: 'APPROVED',
    page: Math.max(currentFeedQuery.value.page - 1, 0),
    size: currentFeedQuery.value.pageSize ?? HUB_PAGE_SIZE,
  }

  if (currentFeedQuery.value.categoryKey === 'popular') {
    params.sort = 'popular'
  } else if (currentFeedQuery.value.categoryKey !== 'all') {
    params.category = CATEGORY_VALUE_MAP[currentFeedQuery.value.categoryKey]
  }

  if (currentFeedQuery.value.keyword) {
    params.searchType = 'articleTitle'
    params.keyword = currentFeedQuery.value.keyword
  }

  try {
    const res = await knowledgeArticleApi.getPagedArticles(params)
    const pageData = res.data.data ?? {}
    totalPages.value = Math.max(pageData.totalPages ?? 0, 1)
    knowledgeArticles.value = (pageData.items ?? []).map(mapToFeedItem)
  } catch (e) {
    console.error('[KMS] 문서 페이지 목록 로드 실패:', e)
    knowledgeArticles.value = []
    totalPages.value = 1
  }
}

async function loadContributors() {
  try {
    const res = await knowledgeArticleApi.getContributors(5)
    monthlyRanking.value = (res.data.data ?? []).map(mapToContributor)
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

// ── 모달 상태 ──────────────────────────────────────────────────
const showAddModal = ref(false)


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
    await loadArticlesPage()
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
    await loadArticlesPage()
  } catch (e) {
    console.error('[KMS] 임시저장 실패:', e)
    window.alert(e.response?.data?.message ?? '임시 저장에 실패했습니다.')
  } finally {
    isArticleSubmitting.value = false
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
      await knowledgeArticleApi.removeBookmark(article.id)
    } else {
      await knowledgeArticleApi.addBookmark(article.id)
    }

    await Promise.allSettled([loadBookmarks(), loadArticlesPage()])

    if (selectedArticle.value?.id === article.id) {
      selectedArticle.value = { ...selectedArticle.value, isBookmarked: !article.isBookmarked }
    }
  } catch (e) {
    console.error('[KMS] 북마크 처리 실패:', e)
    window.alert('북마크 처리에 실패했습니다.')
  }
}

function closeModal() {
  showAddModal.value = false
}

function handleFeedQueryChange(query) {
  void loadArticlesPage(query)
}
</script>

<template>
  <div class="kh-content">
    <!-- Header Stats -->
    <KnowledgeHubHeader :cards="headerCards" />

    <!-- Main Grid: Feed (left) + Sidebar (right) -->
    <div class="kh-grid">
      <KnowledgeHubFeed
        :categories="knowledgeCategories"
        :articles="visibleArticles"
        :total-pages="totalPages"
        :page-query-ready="isPageQueryReady"
        @open-write="showAddModal = true"
        @open-detail="openDetailModal"
        @toggle-bookmark="toggleBookmark"
        @query-change="handleFeedQueryChange"
      />

      <div class="kh-sidebar">
        <KnowledgeHubContributors :ranking="monthlyRanking" />
        <KnowledgeHubAiPanel
          :recommendations="aiRecommendations"
          @open-detail="openRecommendedArticle"
        />
      </div>
    </div>

    <!-- Modals -->
    <WorkerKnowledgeAddModal
      v-if="showAddModal"
      :submitting="isArticleSubmitting"
      @close="closeModal"
      @submit="handleAddArticle"
      @saveDraft="handleSaveDraft"
    />

    <!-- 지식 상세 모달 -->
    <KnowledgeDetailModal
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
