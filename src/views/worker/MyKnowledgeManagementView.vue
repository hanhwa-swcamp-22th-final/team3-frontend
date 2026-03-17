<script setup>
import { ref } from 'vue'
import WorkerKnowledgeManagementHeader from '@/components/worker/kms/WorkerKnowledgeManagementHeader.vue'
import WorkerKnowledgeManagementOverallCount from '@/components/worker/kms/WorkerKnowledgeManagementOverallCount.vue'
import WorkerMyKnowledgeList from '@/components/worker/kms/WorkerMyKnowledgeList.vue'
import WorkerKnowledgeApprovalStatus from '@/components/worker/kms/WorkerKnowledgeApprovalStatus.vue'
import WorkerKnowledgeEditHistory from '@/components/worker/kms/WorkerKnowledgeEditHistory.vue'
import WorkerKnowledgeAddModal from '@/components/worker/kms/WorkerKnowledgeAddModal.vue'

import {
  knowledgeOverallCount,
  myKnowledgeArticles,
  approvalStatus,
  editHistory,
} from '@/mocks/worker/workerMyKnowledgeData'

const showAddModal = ref(false)

function handleAddArticle() {
  showAddModal.value = false
}

function handleSaveDraft() {
  showAddModal.value = false
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
      <WorkerMyKnowledgeList :articles="myKnowledgeArticles" />

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
