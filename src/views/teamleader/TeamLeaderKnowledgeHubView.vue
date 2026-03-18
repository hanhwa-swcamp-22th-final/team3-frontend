<script setup>
import { computed, reactive, ref } from 'vue'
import TeamLeaderKnowledgeHubHeader from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubHeader.vue'
import TeamLeaderKnowledgeHubFeed from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubFeed.vue'
import TeamLeaderKnowledgeHubContributors from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubContributors.vue'
import TeamLeaderKnowledgeHubMentoring from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubMentoring.vue'
import TeamLeaderKnowledgeHubAiPanel from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubAiPanel.vue'
import TeamLeaderKnowledgeWriteModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeWriteModalWrapper.vue'
import TeamLeaderKnowledgeDetailModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeDetailModal.vue'
import TeamLeaderKnowledgeMentoringReviewModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeMentoringReviewModalWrapper.vue'
import TeamLeaderKnowledgeMentoringRequestModal from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeMentoringRequestModalWrapper.vue'
import {
  knowledgeHubSummaryCards,
  knowledgeHubCategories,
  knowledgeHubArticles,
  knowledgeHubContributors,
  knowledgeHubMentoring,
  knowledgeHubMentoringRequestDefaults,
  knowledgeHubAiRecommendations,
  knowledgeWriteModalOptions,
} from '@/mocks/teamleader'

const showWriteModal = ref(false)
const selectedArticle = ref(null)
const selectedMentoringRequest = ref(null)
const showMentoringRequestModal = ref(false)
const publishedArticles = ref([...knowledgeHubArticles.map((article) => ({
  ...article,
  status: 'submitted',
}))])
const draftArticles = ref([])
const mentoringState = reactive({
  ongoing: [...knowledgeHubMentoring.ongoing],
  pending: [...knowledgeHubMentoring.pending],
})
const statState = reactive({
  totalArticles: 1284,
  newThisMonth: 42,
  pendingApproval: 7,
})

const summaryCards = computed(() => knowledgeHubSummaryCards.map((card) => {
  if (card.key === 'totalArticles') {
    return { ...card, value: `${statState.totalArticles.toLocaleString()}건` }
  }
  if (card.key === 'newThisMonth') {
    return { ...card, value: `${statState.newThisMonth}건` }
  }
  if (card.key === 'pendingApproval') {
    return { ...card, value: `${statState.pendingApproval}건` }
  }
  return card
}))

const articles = computed(() => [
  ...draftArticles.value,
  ...publishedArticles.value,
])

function openWriteModal() {
  showWriteModal.value = true
}

function closeWriteModal() {
  showWriteModal.value = false
}

function openDetailModal(article) {
  selectedArticle.value = article
}

function closeDetailModal() {
  selectedArticle.value = null
}

function submitDetailComment(body) {
  if (!selectedArticle.value) {
    return
  }

  const article = selectedArticle.value
  const nextId = Math.max(...(article.commentList ?? []).map((item) => item.id), 0) + 1
  const nextComment = {
    id: nextId,
    author: '최민정',
    date: '03.17 18:05',
    body,
  }

  article.commentList = [...(article.commentList ?? []), nextComment]
  article.comments = article.commentList.length

  const targetCollection = article.status === 'draft' ? draftArticles : publishedArticles
  const targetIndex = targetCollection.value.findIndex((item) => item.id === article.id)
  if (targetIndex !== -1) {
    targetCollection.value[targetIndex] = {
      ...targetCollection.value[targetIndex],
      commentList: [...article.commentList],
      comments: article.comments,
    }
    selectedArticle.value = targetCollection.value[targetIndex]
  }
}

function openMentoringReview(request) {
  selectedMentoringRequest.value = request
}

function closeMentoringReview() {
  selectedMentoringRequest.value = null
}

function confirmMentoringReview(request) {
  mentoringState.pending = mentoringState.pending.filter((item) => item.id !== request.id)
  closeMentoringReview()
}

function openMentoringRequestModal() {
  showMentoringRequestModal.value = true
}

function closeMentoringRequestModal() {
  showMentoringRequestModal.value = false
}

function submitMentoringRequest(payload) {
  const nextId = Math.max(...mentoringState.pending.map((item) => item.id), 0) + 1
  mentoringState.pending.unshift({
    id: nextId,
    name: payload.field,
    requester: 'TL-REQ',
    summary: payload.purpose,
    requestedBy: '최민정',
    requestedAt: '03.17 16:40',
    priority: '중간',
    reason: payload.purpose,
    details: payload.requestDetails,
  })
  showMentoringRequestModal.value = false
}

function handleSubmitKnowledge(payload) {
  const nextId = Math.max(
    ...publishedArticles.value.map((item) => item.id),
    ...draftArticles.value.map((item) => item.id),
    0
  ) + 1
  publishedArticles.value.unshift({
    id: nextId,
    code: `KMS-${2100 + nextId}`,
    title: payload.title,
    preview: payload.summary || payload.content.slice(0, 90),
    category: payload.category,
    equipment: payload.equipment,
    date: '03.17',
    author: '최민정',
    authorInitial: '최',
    authorTier: 'S',
    comments: 0,
    content: payload.content,
    commentList: [],
    isPopular: false,
    isSubscribed: true,
    status: 'submitted',
  })

  statState.totalArticles += 1
  statState.newThisMonth += 1
  statState.pendingApproval += 1
  closeWriteModal()
}

function handleDraftKnowledge(payload) {
  const nextId = Math.max(
    ...publishedArticles.value.map((item) => item.id),
    ...draftArticles.value.map((item) => item.id),
    0
  ) + 1
  draftArticles.value.unshift({
    id: nextId,
    code: `KMS-DRAFT-${2100 + nextId}`,
    title: payload.title || '임시 저장 문서',
    preview: payload.summary || payload.content.slice(0, 90) || '작성 중인 임시 저장 문서입니다.',
    category: payload.category,
    equipment: payload.equipment,
    date: '03.17',
    author: '최민정',
    authorInitial: '최',
    authorTier: 'S',
    comments: 0,
    content: payload.content,
    commentList: [],
    isPopular: false,
    isSubscribed: false,
    status: 'draft',
  })

  closeWriteModal()
}
</script>

<template>
  <section class="teamleader-knowledge-view">
    <TeamLeaderKnowledgeHubHeader :cards="summaryCards" />

    <section class="teamleader-knowledge-view__grid">
      <TeamLeaderKnowledgeHubFeed
        :categories="knowledgeHubCategories"
        :articles="articles"
        @open-write="openWriteModal"
        @open-detail="openDetailModal"
      />

      <div class="teamleader-knowledge-view__sidebar">
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
      @close="closeWriteModal"
      @draft="handleDraftKnowledge"
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
.teamleader-knowledge-view {
  width: 100%;
  min-width: 0;
  padding: 12px 10px 18px;
  box-sizing: border-box;
  background: var(--color-bg-app);
  display: grid;
  gap: 16px;
}

.teamleader-knowledge-view__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.92fr);
  gap: 16px;
  align-items: start;
}

.teamleader-knowledge-view__sidebar {
  display: grid;
  gap: 16px;
}

@media (max-width: 1180px) {
  .teamleader-knowledge-view__grid {
    grid-template-columns: 1fr;
  }
}
</style>
