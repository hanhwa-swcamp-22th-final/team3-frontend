<script setup>
import { ref, computed, onMounted } from 'vue'
import { ARTICLE_CATEGORY_LABEL } from '@/constants'
import KmsFeed      from '@/components/admin/kms/KmsFeed.vue'
import KmsSidePanel from '@/components/admin/kms/KmsSidePanel.vue'
import TeamLeaderKnowledgeHubHeader from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubHeader.vue'
import TeamLeaderKnowledgeHubAiPanel from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubAiPanel.vue'
import TeamLeaderKnowledgeDetailModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeDetailModal.vue'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'
import { filterVisibleKmsAuthors } from '@/utils/kmsAuthorFilter'

function formatTrend(value, digits = 0) {
  const numeric = Number(value ?? 0)
  const abs = Math.abs(numeric)
  const formatted = digits > 0 ? abs.toFixed(digits) : Math.round(abs).toLocaleString()

  if (numeric < 0) {
    return `▼${formatted}`
  }

  return `▲${formatted}`
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
function mapToFeedCard(dto) {
  const categoryLabel = ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? dto.articleCategory ?? ''
  return {
    id:        dto.articleId,
    tags:      categoryLabel ? [categoryLabel] : [],
    date:      formatDate(dto.createdAt),
    rawDate:   dto.createdAt ?? '',
    title:     dto.articleTitle,
    summary:   dto.articleContent ? dto.articleContent.slice(0, 80) + '…' : '',
    author: {
      name:    dto.authorName ?? '',
      initial: dto.authorName?.[0] ?? '?',
      color:   '#5B4FCF',
    },
    views:      dto.viewCount ?? 0,
    comments:   dto.commentCount ?? 0,
    isPopular:  (dto.viewCount ?? 0) > 50,
    bookmarked: false,
  }
}

// ── 백엔드 DTO → 기여자 shape ────────────────────────────────────
const RANK_ICONS = ['👑', '🥈', '🥉']
function mapToContributor(dto, idx) {
  return {
    rank:    RANK_ICONS[idx] ?? String(idx + 1),
    name:    dto.employeeName ?? '',
    initial: dto.employeeName?.[0] ?? '?',
    color:   '#5B4FCF',
    articles: dto.articleCount ?? 0,
    views:   dto.totalViewCount ?? 0,
  }
}

// ── 상태 ──────────────────────────────────────────────────────
const articles       = ref([])
const contributors   = ref([])
const recommendations = ref([])
const hubStats       = ref({
  totalArticles: 0,
  newThisMonth: 0,
  averageViewCount: 0,
  newThisMonthChange: 0,
  averageViewCountChange: 0,
})
const selectedArticle = ref(null)

const selectedFilter    = ref('전체')
const selectedTagFilter = ref(null)

// ── 통계 카드 ─────────────────────────────────────────────────
const statCards = computed(() => [
  { label: '등록 지식 수', value: `${Number(hubStats.value.totalArticles ?? 0).toLocaleString()}건`, helper: '' },
  { label: '이달 신규', value: `${Number(hubStats.value.newThisMonth ?? 0).toLocaleString()}건`, helper: formatTrend(hubStats.value.newThisMonthChange), tone: Number(hubStats.value.newThisMonthChange ?? 0) < 0 ? 'danger' : 'success' },
  { label: '평균 조회수', value: Number(hubStats.value.averageViewCount ?? 0).toFixed(1), helper: formatTrend(hubStats.value.averageViewCountChange, 1), tone: Number(hubStats.value.averageViewCountChange ?? 0) < 0 ? 'danger' : 'success' },
])

// ── 데이터 로드 ───────────────────────────────────────────────
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
    articles.value = filterVisibleKmsAuthors(
      (res.data.data ?? []).map(mapToFeedCard),
      (item) => item.author.name,
    )
  } catch (e) {
    console.error('[KMS] 문서 목록 로드 실패:', e)
  }
}

async function loadContributors() {
  try {
    const res = await knowledgeArticleApi.getContributors(3)
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
    recommendations.value = (res.data.data ?? []).map((dto) => ({
      id: dto.articleId,
      title: dto.articleTitle ?? '',
    }))
  } catch (e) {
    console.error('[KMS] AI 추천 로드 실패:', e)
  }
}

async function openDetailModal(article) {
  selectedArticle.value = {
    id: article.id,
    title: article.title,
    category: article.category,
    equipment: article.equipment,
    date: article.date,
    author: article.author?.name ?? article.author ?? '',
    authorInitial: article.author?.initial ?? article.authorInitial ?? '?',
    content: article.summary ?? '',
    preview: article.summary ?? '',
    views: article.views ?? 0,
  }

  try {
    const res = await knowledgeArticleApi.getArticleDetail(article.id)
    const dto = res.data.data ?? {}
    selectedArticle.value = {
      id: dto.articleId ?? article.id,
      title: dto.articleTitle ?? article.title,
      category: ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? article.category ?? '',
      equipment: dto.equipmentName ?? article.equipment ?? '',
      date: article.date ?? formatDate(dto.createdAt),
      author: dto.authorName ?? article.author?.name ?? article.author ?? '',
      authorInitial: dto.authorName?.[0] ?? article.author?.initial ?? article.authorInitial ?? '?',
      content: dto.articleContent ?? article.summary ?? '',
      preview: article.summary ?? '',
      views: dto.viewCount ?? article.views ?? 0,
    }
  } catch (e) {
    console.error('[KMS] 관리자 문서 상세 로드 실패:', e)
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
    summary: '',
    views: 0,
  })
}

// ── Admin 삭제 ─────────────────────────────────────────────────
async function handleDelete(articleId) {
  const deletionReason = window.prompt('삭제 사유를 입력하세요. (10자 이상)')
  if (deletionReason == null) return
  if (deletionReason.trim().length < 10) {
    window.alert('삭제 사유는 10자 이상 입력해야 합니다.')
    return
  }

  try {
    await knowledgeArticleApi.deleteArticleByAdmin(articleId, {
      deletionReason: deletionReason.trim(),
    })
    if (selectedArticle.value?.id === articleId) {
      closeDetailModal()
    }
    await Promise.allSettled([
      loadHubStats(),
      loadArticles(),
      loadContributors(),
      loadRecommendations(),
    ])
  } catch (e) {
    console.error('[KMS] 문서 삭제 실패:', e)
    window.alert('문서 삭제에 실패했습니다.')
  }
}
</script>

<template>
  <div class="kms-view">
    <TeamLeaderKnowledgeHubHeader :cards="statCards" />

    <!-- 메인 2열 레이아웃 -->
    <div class="kms-layout">
      <!-- 좌: 피드 -->
      <div class="kms-feed-col">
        <KmsFeed
          :articles="articles"
          :selectedFilter="selectedFilter"
          :selectedTagFilter="selectedTagFilter"
          @filterChange="selectedFilter = $event"
          @tagFilterChange="selectedTagFilter = $event"
          @delete="handleDelete"
          @open-detail="openDetailModal"
        />
      </div>

      <!-- 우: 사이드 패널 -->
      <div class="kms-side-col">
        <KmsSidePanel
          :contributors="contributors"
        />
        <TeamLeaderKnowledgeHubAiPanel
          :recommendations="recommendations"
          @open-detail="openRecommendedArticle"
        />
      </div>
    </div>

    <TeamLeaderKnowledgeDetailModal
      v-if="selectedArticle"
      :article="selectedArticle"
      @close="closeDetailModal"
    />
  </div>
</template>

<style scoped>
.kms-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--color-bg-app, #fafbff);
  flex: 1;
  min-width: 0;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  overflow-y: auto;
  font-family: var(--font-family-base);
}

.kms-layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
  align-items: flex-start;
  min-height: 0;
}

.kms-feed-col {
  min-width: 0;
  min-height: 0;
}

.kms-side-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

@media (max-width: 1200px) {
  .kms-layout {
    grid-template-columns: 1fr;
  }
}
</style>
