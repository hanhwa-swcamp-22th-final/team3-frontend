<script setup>
import { computed, reactive, ref } from 'vue'
import TeamLeaderKnowledgeHubHeader from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubHeader.vue'
import TeamLeaderKnowledgeHubFeed from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubFeed.vue'
import TeamLeaderKnowledgeHubContributors from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubContributors.vue'
import TeamLeaderKnowledgeHubMentoring from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubMentoring.vue'
import TeamLeaderKnowledgeHubAiPanel from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubAiPanel.vue'
import TeamLeaderKnowledgeWriteModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeWriteModal.vue'
import TeamLeaderKnowledgeDetailModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeDetailModal.vue'
import TeamLeaderKnowledgeMentoringReviewModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeMentoringReviewModal.vue'
import TeamLeaderKnowledgeMentoringRequestModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeMentoringRequestModal.vue'
import {
  knowledgeHubCategories,
  knowledgeHubArticles,
  knowledgeHubMentoring,
  knowledgeHubMentoringRequestDefaults,
  knowledgeWriteModalOptions,
} from '@/mocks/teamleader'
import {
  knowledgeHubSummaryCards,
  knowledgeHubContributors,
  knowledgeHubAiRecommendations,
  knowledgeHubInitialStats,
} from '@/mocks/departmentleader/knowledgeHub'

const showWriteModal = ref(false)
const selectedArticle = ref(null)
const selectedMentoringRequest = ref(null)
const showMentoringRequestModal = ref(false)
const articles = ref([...knowledgeHubArticles])
const mentoringState = reactive({
  ongoing: [...knowledgeHubMentoring.ongoing],
  pending: [...knowledgeHubMentoring.pending],
})
const statState = reactive({ ...knowledgeHubInitialStats })

const summaryCards = computed(() =>
  knowledgeHubSummaryCards.map((card) => {
    if (card.key === 'totalArticles') return { ...card, value: `${statState.totalArticles.toLocaleString()}건` }
    if (card.key === 'newThisMonth')  return { ...card, value: `${statState.newThisMonth}건` }
    return card
  }),
)

function openDetailModal(article)  { selectedArticle.value = article }
function closeDetailModal()        { selectedArticle.value = null }

function submitDetailComment(body) {
  if (!selectedArticle.value) return
  const article = selectedArticle.value
  const nextId = Math.max(...(article.commentList ?? []).map((c) => c.id), 0) + 1
  article.commentList = [...(article.commentList ?? []), { id: nextId, author: '이수연', date: '03.17 18:05', body }]
  article.comments = article.commentList.length
  const idx = articles.value.findIndex((a) => a.id === article.id)
  if (idx !== -1) {
    articles.value[idx] = { ...articles.value[idx], commentList: [...article.commentList], comments: article.comments }
    selectedArticle.value = articles.value[idx]
  }
}

function openMentoringReview(request) { selectedMentoringRequest.value = request }
function closeMentoringReview()       { selectedMentoringRequest.value = null }
function confirmMentoringReview(request) {
  mentoringState.pending = mentoringState.pending.filter((i) => i.id !== request.id)
  closeMentoringReview()
}

function openMentoringRequestModal()  { showMentoringRequestModal.value = true }
function closeMentoringRequestModal() { showMentoringRequestModal.value = false }
function submitMentoringRequest(payload) {
  const nextId = Math.max(...mentoringState.pending.map((i) => i.id), 0) + 1
  mentoringState.pending.unshift({
    id: nextId,
    name: payload.field,
    requester: 'DL-REQ',
    summary: payload.purpose,
    requestedBy: '이수연',
    requestedAt: '03.17 16:40',
    priority: '중간',
    reason: payload.purpose,
    details: payload.requestDetails,
  })
  showMentoringRequestModal.value = false
}

function handleSubmitKnowledge(payload) {
  const nextId = Math.max(...articles.value.map((a) => a.id), 0) + 1
  articles.value.unshift({
    id: nextId,
    code: `KMS-${2100 + nextId}`,
    title: payload.title,
    preview: payload.summary || payload.content.slice(0, 90),
    category: payload.category,
    equipment: payload.equipment,
    date: '03.17',
    author: '이수연',
    authorInitial: '이',
    authorTier: 'A',
    comments: 0,
    content: payload.content,
    commentList: [],
    isPopular: false,
    isSubscribed: true,
  })
  statState.totalArticles += 1
  statState.newThisMonth += 1
  showWriteModal.value = false
}
</script>

<template>
  <section class="dl-knowledge-view">
    <TeamLeaderKnowledgeHubHeader :cards="summaryCards" />

    <section class="dl-knowledge-view__grid">
      <TeamLeaderKnowledgeHubFeed
        :categories="knowledgeHubCategories"
        :articles="articles"
        @open-write="showWriteModal = true"
        @open-detail="openDetailModal"
      />

      <div class="dl-knowledge-view__sidebar">
        <TeamLeaderKnowledgeHubContributors :ranking="knowledgeHubContributors" />
        <TeamLeaderKnowledgeHubMentoring
          :mentoring="mentoringState"
          @review-request="openMentoringReview"
          @open-request="openMentoringRequestModal"
        />
        <TeamLeaderKnowledgeHubAiPanel :recommendations="knowledgeHubAiRecommendations" />
      </div>
    </section>

    <TeamLeaderKnowledgeWriteModal
      v-if="showWriteModal"
      :options="knowledgeWriteModalOptions"
      @close="showWriteModal = false"
      @submit="handleSubmitKnowledge"
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
.dl-knowledge-view {
  width: 100%;
  min-width: 0;
  padding: 12px 10px 18px;
  box-sizing: border-box;
  background: var(--color-bg-app);
  display: grid;
  gap: 16px;
}

.dl-knowledge-view__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.92fr);
  gap: 16px;
  align-items: start;
}

.dl-knowledge-view__sidebar {
  display: grid;
  gap: 16px;
}

@media (max-width: 1180px) {
  .dl-knowledge-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
