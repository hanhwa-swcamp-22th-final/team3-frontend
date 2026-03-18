<script setup>
import { ref } from 'vue'
import WorkerKnowledgeManagementHeader from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeManagementHeader.vue'
import WorkerKnowledgeManagementOverallCount from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeManagementOverallCount.vue'
import WorkerMyKnowledgeList from '@/components/kms/worker/my-knowledge-management/WorkerMyKnowledgeList.vue'
import WorkerKnowledgeApprovalStatus from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeApprovalStatus.vue'
import WorkerKnowledgeEditHistory from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeEditHistory.vue'
import WorkerKnowledgeAddModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeAddModal.vue'
import WorkerKnowledgeDetailModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeDetailModal.vue'
import WorkerKnowledgeEditModal from '@/components/kms/worker/my-knowledge-management/WorkerKnowledgeEditModal.vue'

import {
  knowledgeOverallCount,
  myKnowledgeArticles,
  approvalStatus,
  editHistory,
} from '@/mocks/worker/workerMyKnowledgeData'

const showAddModal = ref(false)
const showDetailModal = ref(false)
const showEditModal = ref(false)
const selectedArticle = ref(null)

function handleAddArticle() {
  showAddModal.value = false
}

function handleSaveDraft() {
  showAddModal.value = false
}

function openDetailModal(article) {
  selectedArticle.value = article
  showDetailModal.value = true
}

function openEditModal(article) {
  selectedArticle.value = article
  showEditModal.value = true
}

function handleEditSubmit() {
  showEditModal.value = false
}

function handleEditSaveDraft() {
  showEditModal.value = false
}
</script>

<template>
  <div class="mkm-content">
    <!-- Header -->
    <WorkerKnowledgeManagementHeader @openAddModal="showAddModal = true" />

    <!-- Overall Count Cards -->
    <WorkerKnowledgeManagementOverallCount :counts="knowledgeOverallCount" />

    <!-- Main Grid: List (left) + Sidebar (right) -->
    <div class="mkm-grid">
      <WorkerMyKnowledgeList
        :articles="myKnowledgeArticles"
        @detail="openDetailModal"
        @edit="openEditModal"
      />

      <div class="mkm-sidebar">
        <WorkerKnowledgeApprovalStatus :status="approvalStatus" />
        <WorkerKnowledgeEditHistory :history="editHistory" />
      </div>
    </div>

    <!-- Add Modal -->
    <WorkerKnowledgeAddModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @submit="handleAddArticle"
      @saveDraft="handleSaveDraft"
    />

    <!-- Detail Modal -->
    <WorkerKnowledgeDetailModal
      v-if="showDetailModal && selectedArticle"
      :article="selectedArticle"
      @close="showDetailModal = false"
    />

    <!-- Edit Modal -->
    <WorkerKnowledgeEditModal
      v-if="showEditModal && selectedArticle"
      :article="selectedArticle"
      @close="showEditModal = false"
      @submit="handleEditSubmit"
      @saveDraft="handleEditSaveDraft"
    />
  </div>
</template>

<style scoped>
.mkm-content {
  flex: 1;
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  background: var(--color-bg-app);
}

.mkm-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
  align-items: start;
}

.mkm-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
