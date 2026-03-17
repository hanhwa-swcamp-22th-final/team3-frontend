<script setup>
import { computed, reactive, ref } from 'vue'
import TeamLeaderKnowledgeHubHeader from '@/components/teamleader/kms/TeamLeaderKnowledgeHubHeader.vue'
import TeamLeaderKnowledgeHubFeed from '@/components/teamleader/kms/TeamLeaderKnowledgeHubFeed.vue'
import TeamLeaderKnowledgeHubContributors from '@/components/teamleader/kms/TeamLeaderKnowledgeHubContributors.vue'
import TeamLeaderKnowledgeHubMentoring from '@/components/teamleader/kms/TeamLeaderKnowledgeHubMentoring.vue'
import TeamLeaderKnowledgeHubAiPanel from '@/components/teamleader/kms/TeamLeaderKnowledgeHubAiPanel.vue'
import TeamLeaderKnowledgeWriteModal from '@/components/teamleader/kms/TeamLeaderKnowledgeWriteModal.vue'
import TeamLeaderKnowledgeDetailModal from '@/components/teamleader/kms/TeamLeaderKnowledgeDetailModal.vue'
import {
  knowledgeHubSummaryCards,
  knowledgeHubCategories,
  knowledgeHubArticles,
  knowledgeHubContributors,
  knowledgeHubMentoring,
  knowledgeHubAiRecommendations,
  knowledgeWriteModalOptions,
} from '@/mocks/teamleader'

const showWriteModal = ref(false)
const selectedArticle = ref(null)
const articles = ref([...knowledgeHubArticles])
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

function handleSubmitKnowledge(payload) {
  const nextId = Math.max(...articles.value.map((item) => item.id), 0) + 1
  articles.value.unshift({
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
    likes: 0,
    comments: 0,
    content: payload.content,
    commentList: [],
    isPopular: false,
    isSubscribed: true,
  })

  statState.totalArticles += 1
  statState.newThisMonth += 1
  statState.pendingApproval += 1
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
        <TeamLeaderKnowledgeHubMentoring :mentoring="knowledgeHubMentoring" />
        <TeamLeaderKnowledgeHubAiPanel :recommendations="knowledgeHubAiRecommendations" />
      </div>
    </section>

    <TeamLeaderKnowledgeWriteModal
      v-if="showWriteModal"
      :options="knowledgeWriteModalOptions"
      @close="closeWriteModal"
      @submit="handleSubmitKnowledge"
    />

    <TeamLeaderKnowledgeDetailModal
      v-if="selectedArticle"
      :article="selectedArticle"
      @close="closeDetailModal"
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

