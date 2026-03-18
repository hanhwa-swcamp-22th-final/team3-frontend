<script setup>
import { ref } from 'vue'
import WorkerKnowledgeHubContentHeader from '@/components/kms/common/knowledge-hub/worker/WorkerKnowledgeHubContentHeader.vue'
import WorkerKnowledgeHubFeed from '@/components/kms/common/knowledge-hub/worker/WorkerKnowledgeHubFeed.vue'
import WorkerKnowledgeHubMonthlyRank from '@/components/kms/common/knowledge-hub/worker/WorkerKnowledgeHubMonthlyRank.vue'
import WorkerKnowledgeHubMentoringMatchingStatus from '@/components/kms/common/knowledge-hub/worker/WorkerKnowledgeHubMentoringMatchingStatus.vue'
import WorkerKnowledgeHubAIRecommendation from '@/components/kms/common/knowledge-hub/worker/WorkerKnowledgeHubAIRecommendation.vue'
import WorkerMentoringAcceptModal from '@/components/kms/common/knowledge-hub/worker/WorkerMentoringAcceptModal.vue'
import WorkerMentoringRequestModal from '@/components/kms/common/knowledge-hub/worker/WorkerMentoringRequestModal.vue'
import WorkerKnowledgeAddModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeAddModal.vue'

import {
  knowledgeStats,
  knowledgeArticles,
  monthlyRanking,
  ongoingMentoring,
  mentoringRequests,
  mentoringRequestFormDefaults,
  aiRecommendations,
} from '@/mocks/worker/workerKnowledgeHubData'

const showAcceptModal = ref(false)
const showRequestModal = ref(false)
const showAddModal = ref(false)
const selectedRequest = ref(null)

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

function handleAddArticle() {
  showAddModal.value = false
}

function handleSaveDraft() {
  showAddModal.value = false
}

function closeModal() {
  showAcceptModal.value = false
  showRequestModal.value = false
  showAddModal.value = false
  selectedRequest.value = null
}
</script>

<template>
  <div class="kh-content">
    <!-- Header Stats -->
    <WorkerKnowledgeHubContentHeader
      :total-articles="knowledgeStats.totalArticles"
      :new-this-month="knowledgeStats.newThisMonth"
      :new-this-month-diff="knowledgeStats.newThisMonthDiff"
      :my-articles="knowledgeStats.myArticles"
      :my-articles-diff="knowledgeStats.myArticlesDiff"
    />

    <!-- Main Grid: Feed (left) + Sidebar (right) -->
    <div class="kh-grid">
      <WorkerKnowledgeHubFeed :articles="knowledgeArticles" @openAddModal="showAddModal = true" />

      <div class="kh-sidebar">
        <WorkerKnowledgeHubMonthlyRank :ranking="monthlyRanking" />
        <WorkerKnowledgeHubMentoringMatchingStatus
          :ongoing-mentoring="ongoingMentoring"
          :mentoring-requests="mentoringRequests"
          @accept="handleAcceptClick"
          @request="handleRequestClick"
        />
        <WorkerKnowledgeHubAIRecommendation :recommendations="aiRecommendations" />
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
