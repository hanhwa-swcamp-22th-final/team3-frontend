<script setup>
import { ref, computed } from 'vue'
import TeamLeaderKnowledgeHubHeader from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubHeader.vue'
import TeamLeaderKnowledgeHubFeed from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubFeed.vue'
import TeamLeaderKnowledgeHubContributors from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubContributors.vue'
import TeamLeaderKnowledgeHubMentoring from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubMentoring.vue'
import TeamLeaderKnowledgeHubAiPanel from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubAiPanel.vue'
import WorkerMentoringAcceptModal from '@/components/kms/common/knowledge-hub/worker/WorkerMentoringAcceptModal.vue'
import WorkerMentoringRequestModal from '@/components/kms/common/knowledge-hub/worker/WorkerMentoringRequestModal.vue'
import WorkerKnowledgeAddModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeAddModal.vue'

import {
  knowledgeStats,
  knowledgeCategories,
  knowledgeArticles,
  monthlyRanking,
  ongoingMentoring,
  mentoringRequests,
  mentoringRequestFormDefaults,
  aiRecommendations,
} from '@/mocks/worker/workerKnowledgeHubData'

const headerCards = computed(() => [
  {
    key: 'total',
    label: '등록 지식 총',
    value: `${knowledgeStats.totalArticles.toLocaleString()}건`,
    helper: '',
  },
  {
    key: 'new',
    label: '이달 신규',
    value: `${knowledgeStats.newThisMonth}건`,
    helper: knowledgeStats.newThisMonthDiff ? `▲${knowledgeStats.newThisMonthDiff}` : '',
  },
  {
    key: 'my',
    label: '내 작성글',
    value: `${knowledgeStats.myArticles}`,
    helper: knowledgeStats.myArticlesDiff ? `▲${knowledgeStats.myArticlesDiff}` : '',
  },
])

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
    <TeamLeaderKnowledgeHubHeader :cards="headerCards" />

    <!-- Main Grid: Feed (left) + Sidebar (right) -->
    <div class="kh-grid">
      <TeamLeaderKnowledgeHubFeed
        :categories="knowledgeCategories"
        :articles="knowledgeArticles"
        @open-write="showAddModal = true"
      />

      <div class="kh-sidebar">
        <TeamLeaderKnowledgeHubContributors :ranking="monthlyRanking" />
        <TeamLeaderKnowledgeHubMentoring
          :mentoring="mentoringData"
          @review-request="handleAcceptClick"
          @open-request="handleRequestClick"
        />
        <TeamLeaderKnowledgeHubAiPanel :recommendations="aiRecommendations" />
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
