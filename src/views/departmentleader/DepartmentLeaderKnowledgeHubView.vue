<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ARTICLE_CATEGORY_LABEL, ARTICLE_CATEGORY_OPTIONS } from '@/constants'
import KnowledgeHubHeader from '@/components/kms/common/knowledge-hub/KnowledgeHubHeader.vue'
import KnowledgeHubFeed from '@/components/kms/common/knowledge-hub/KnowledgeHubFeed.vue'
import KnowledgeHubAiPanel from '@/components/kms/common/knowledge-hub/KnowledgeHubAiPanel.vue'
import KnowledgeDetailModal from '@/components/kms/common/knowledge-hub/KnowledgeDetailModal.vue'
import KnowledgeHubContributors from "@/components/kms/common/knowledge-hub/KnowledgeHubContributors.vue";
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
    score:       dto.contributionScore ?? 0,
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
const articles          = ref([])
const bookmarkArticles  = ref([])
const contributors      = ref([])
const aiRecommendations = ref([])
const totalPages        = ref(1)
const hubStats          = ref({
  totalArticles: 0,
  newThisMonth: 0,
  averageViewCount: 0,
  newThisMonthChange: 0,
  averageViewCountChange: 0,
})
const isPageQueryReady = ref(false)
const currentFeedQuery = ref({
  categoryKey: 'all',
  keyword: '',
  page: normalizePageQuery(route.query.p),
  pageSize: HUB_PAGE_SIZE,
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
    loadArticlesPage(),
    loadBookmarks(),
    loadContributors(),
    loadRecommendations(),
  ])
  isPageQueryReady.value = true
})

const visibleArticles = computed(() => articles.value)

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
    articles.value = filtered.slice(start, start + HUB_PAGE_SIZE)
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
    articles.value = (pageData.items ?? []).map(mapToFeedItem)
  } catch (e) {
    console.error('[KMS] 문서 페이지 목록 로드 실패:', e)
    articles.value = []
    totalPages.value = 1
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
      title: data.title,
      category: data.category,
      equipmentId: data.equipmentId,
      content: data.content,
    })
    showWriteModal.value = false
    await loadArticlesPage()
  } catch (e) {
    console.error('[KMS] DL 문서 등록 실패:', e)
  }
}

async function handleSaveDraft(data) {
  try {
    await knowledgeArticleApi.saveDraft({
      title: data.title,
      category: data.category,
      equipmentId: data.equipmentId,
      content: data.content,
    })
    showWriteModal.value = false
    await loadArticlesPage()
  } catch (e) {
    console.error('[KMS] DL 임시저장 실패:', e)
  }
}

// ── 상세 모달 ─────────────────────────────────────────────────────
const showWriteModal  = ref(false)
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
    const res = await knowledgeArticleApi.getArticleDetail(article.id)
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

function handleFeedQueryChange(query) {
  void loadArticlesPage(query)
}

</script>

<template>
  <section class="dl-knowledge-view">
    <KnowledgeHubHeader :cards="summaryCards" />

    <section class="dl-knowledge-view__grid">
      <KnowledgeHubFeed
        :categories="knowledgeCategories"
        :articles="visibleArticles"
        :total-pages="totalPages"
        :page-query-ready="isPageQueryReady"
        @open-write="showWriteModal = true"
        @open-detail="openDetailModal"
        @toggle-bookmark="toggleBookmark"
        @query-change="handleFeedQueryChange"
      />

      <div class="dl-knowledge-view__sidebar">
        <KnowledgeHubContributors :ranking="contributors" />
        <KnowledgeHubAiPanel
          :recommendations="aiRecommendations"
          @open-detail="openRecommendedArticle"
        />
      </div>
    </section>

    <KnowledgeDetailModal
      v-if="selectedArticle"
      :article="selectedArticle"
      @close="closeDetailModal"
      @toggle-bookmark="toggleBookmark"
    />
  </section>
</template>

<style scoped>
.dl-knowledge-view {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 80px);
  padding: 20px 28px 28px;
  box-sizing: border-box;
  background: var(--color-bg-app);
  overflow: hidden;
}

.dl-knowledge-view__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.38fr) minmax(340px, 1fr);
  gap: 20px;
  align-items: start;
  height: 100%;
  min-height: 0;
  overflow: visible;
}

.dl-knowledge-view__sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  width: 100%;
  min-height: 0;
  overflow: visible;
}

@media (max-width: 1320px) {
  .dl-knowledge-view {
    padding: 16px 18px 24px;
  }

  .dl-knowledge-view__grid {
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.92fr);
    gap: 16px;
  }
}

@media (max-width: 1180px) {
  .dl-knowledge-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
