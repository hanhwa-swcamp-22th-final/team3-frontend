<script setup>
import { ref, computed, onMounted } from 'vue'
import { ARTICLE_CATEGORY_LABEL } from '@/constants'
import KmsStatCards from '@/components/admin/kms/KmsStatCardsWrapper.vue'
import KmsFeed      from '@/components/admin/kms/KmsFeed.vue'
import KmsSidePanel from '@/components/admin/kms/KmsSidePanel.vue'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'

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
    name:    dto.authorName ?? '',
    initial: dto.authorName?.[0] ?? '?',
    color:   '#5B4FCF',
    count:   dto.articleCount ?? 0,
  }
}

// ── 상태 ──────────────────────────────────────────────────────
const articles       = ref([])
const contributors   = ref([])
const recommendations = ref([])
const statsData      = ref({ pendingCount: 0, approvedThisMonth: 0, rejectionRate: 0 })

const selectedFilter    = ref('전체')
const selectedTagFilter = ref(null)

// ── 통계 카드 ─────────────────────────────────────────────────
const statCards = computed(() => [
  { label: '승인 대기',   value: String(statsData.value.pendingCount ?? 0),      unit: '건', trend: null },
  { label: '이번달 승인', value: String(statsData.value.approvedThisMonth ?? 0), unit: '건', trend: null },
  { label: '반려율',      value: Number(statsData.value.rejectionRate ?? 0).toFixed(1), unit: '%', trend: null },
])

// ── 데이터 로드 ───────────────────────────────────────────────
onMounted(async () => {
  await Promise.allSettled([
    loadArticles(),
    loadContributors(),
    loadRecommendations(),
    loadStats(),
  ])
})

async function loadArticles() {
  try {
    const res = await knowledgeArticleApi.getArticles({ page: 0, size: 20 })
    articles.value = (res.data.data ?? []).map(mapToFeedCard)
  } catch (e) {
    console.error('[KMS] 문서 목록 로드 실패:', e)
  }
}

async function loadContributors() {
  try {
    const res = await knowledgeArticleApi.getContributors(3)
    contributors.value = (res.data.data ?? []).map(mapToContributor)
  } catch (e) {
    console.error('[KMS] 기여자 랭킹 로드 실패:', e)
  }
}

async function loadRecommendations() {
  try {
    const res = await knowledgeArticleApi.getRecommendations()
    recommendations.value = (res.data.data ?? []).map((dto) => dto.articleTitle ?? '')
  } catch (e) {
    console.error('[KMS] AI 추천 로드 실패:', e)
  }
}

async function loadStats() {
  try {
    const res = await knowledgeArticleApi.getApprovalStats()
    statsData.value = res.data.data ?? {}
  } catch (e) {
    console.error('[KMS] 승인 통계 로드 실패:', e)
  }
}

// ── Admin 삭제 ─────────────────────────────────────────────────
async function handleDelete(articleId) {
  if (!confirm('이 문서를 삭제하시겠습니까?')) return
  try {
    await knowledgeArticleApi.deleteArticleByAdmin(articleId)
    articles.value = articles.value.filter((a) => a.id !== articleId)
  } catch (e) {
    console.error('[KMS] 문서 삭제 실패:', e)
  }
}
</script>

<template>
  <div class="kms-view">
    <!-- 상단 통계 카드 -->
    <KmsStatCards :items="statCards" />

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
        />
      </div>

      <!-- 우: 사이드 패널 -->
      <div class="kms-side-col">
        <KmsSidePanel
          :contributors="contributors"
          :recommendations="recommendations"
        />
      </div>
    </div>
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
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.kms-feed-col {
  flex: 1;
  min-width: 0;
}

.kms-side-col {
  width: 280px;
  flex-shrink: 0;
}
</style>
