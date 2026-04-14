<script setup>
import { ref, onMounted } from 'vue'
import knowledgeArticleApi from '@/services/knowledgeArticleApi'
import WorkerSkillGapChartAndStatus from '@/components/kms/worker/skill-gap/WorkerSkillGapChartAndStatus.vue'
import WorkerSkillGapAiAnalysisReport from '@/components/kms/worker/skill-gap/WorkerSkillGapAiAnalysisReport.vue'
import WorkerCustomizedLearningRecommendations from '@/components/kms/worker/skill-gap/WorkerCustomizedLearningRecommendations.vue'
import TeamLeaderKnowledgeDetailModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeDetailModal.vue'

import { ARTICLE_CATEGORY_LABEL } from '@/constants'

const loading = ref(true)
const currentTier = ref('C')
const targetTier = ref('B')
const skillGapSkills = ref([])
const skillGapSummary = ref({ currentOverall: 0, targetOverall: 0, totalGap: 0 })
const aiAnalysisReport = ref({
  summary: '',
  confidence: '0.00',
  gaps: [],
  prediction: {
    normalDate: '-',
    acceleratedDate: '-',
  },
})
const learningRecommendations = ref([])
const relatedKmsArticles = ref([])
const selectedArticle = ref(null)

onMounted(async () => {
  try {
    const response = await knowledgeArticleApi.getWorkerSkillGap()
    const data = response.data?.data ?? response.data
    currentTier.value = data.currentTier ?? 'C'
    targetTier.value = data.targetTier ?? currentTier.value
    skillGapSkills.value = data.skills
    skillGapSummary.value = data.summary
    aiAnalysisReport.value = data.report
    learningRecommendations.value = data.courses
    relatedKmsArticles.value = data.articles
  } catch (error) {
    console.error('Failed to load worker skill gap data:', error)
  } finally {
    loading.value = false
  }
})

async function openArticleDetail(article) {
  selectedArticle.value = {
    id: article.id,
    title: article.title,
    category: article.category ?? '',
    equipment: article.equipment ?? '',
    date: article.date ?? '',
    author: article.author ?? '',
    authorInitial: article.authorInitial ?? '?',
    authorTier: article.authorTier ?? 'C',
    content: article.preview ?? '',
    views: article.views ?? article.likes ?? 0,
    isBookmarked: Boolean(article.isBookmarked),
  }

  try {
    const response = await knowledgeArticleApi.getArticleDetail(article.id)
    const dto = response.data?.data ?? {}
    selectedArticle.value = {
      id: dto.articleId ?? article.id,
      title: dto.articleTitle ?? article.title,
      category: ARTICLE_CATEGORY_LABEL[dto.articleCategory] ?? article.category ?? '',
      equipment: dto.equipmentName ?? article.equipment ?? '',
      date: article.date ?? '',
      author: dto.authorName ?? article.author ?? '',
      authorInitial: dto.authorName?.[0] ?? article.authorInitial ?? '?',
      authorTier: dto.authorTier ?? article.authorTier ?? 'C',
      content: dto.articleContent ?? article.preview ?? '',
      views: dto.viewCount ?? article.views ?? article.likes ?? 0,
      isBookmarked: Boolean(dto.bookmarked ?? article.isBookmarked),
    }
  } catch (error) {
    console.error('Failed to load skill gap article detail:', error)
  }
}

function closeArticleDetail() {
  selectedArticle.value = null
}

async function toggleBookmark(article) {
  try {
    if (article.isBookmarked) {
      await knowledgeArticleApi.removeBookmark(article.id)
    } else {
      await knowledgeArticleApi.addBookmark(article.id)
    }

    const bookmarked = !article.isBookmarked
    relatedKmsArticles.value = relatedKmsArticles.value.map((item) => (
      item.id === article.id ? { ...item, isBookmarked: bookmarked } : item
    ))

    if (selectedArticle.value?.id === article.id) {
      selectedArticle.value = { ...selectedArticle.value, isBookmarked: bookmarked }
    }
  } catch (error) {
    console.error('Failed to toggle bookmark from skill gap:', error)
    window.alert('북마크 처리에 실패했습니다.')
  }
}
</script>

<template>
  <div class="sg-content">
    <div v-if="loading" class="sg-loading">데이터를 불러오는 중...</div>
    <div v-else-if="!skillGapSkills.length" class="sg-loading">스킬 데이터가 없습니다.</div>
    <div v-else class="sg-grid">
      <!-- Left: Radar Chart + Skill Status -->
      <WorkerSkillGapChartAndStatus
        :current-tier="currentTier"
        :target-tier="targetTier"
        :skills="skillGapSkills"
        :summary="skillGapSummary"
      />

      <!-- Center: AI Analysis Report -->
      <WorkerSkillGapAiAnalysisReport :report="aiAnalysisReport" />

      <!-- Right: Learning Recommendations -->
      <WorkerCustomizedLearningRecommendations
        :courses="learningRecommendations"
        :articles="relatedKmsArticles"
        @open-article="openArticleDetail"
      />
    </div>

    <TeamLeaderKnowledgeDetailModal
      v-if="selectedArticle"
      :article="selectedArticle"
      @close="closeArticleDetail"
      @toggle-bookmark="toggleBookmark"
    />
  </div>
</template>

<style scoped>
.sg-content {
  flex: 1;
  padding: 20px 28px 28px;
  min-width: 0;
  background: var(--color-bg-app);
}

.sg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: stretch;
}

.sg-grid > * {
  min-height: 100%;
}

.sg-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--color-text-muted);
}
</style>
