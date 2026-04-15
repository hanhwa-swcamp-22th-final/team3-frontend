<script setup>
import KnowledgeHubContributors from '@/components/kms/common/knowledge-hub/teamleader/KnowledgeHubContributors.vue'

defineProps({
  contributors: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="side-panel">
    <KnowledgeHubContributors :ranking="contributors" />
  </div>
</template>

<style scoped>
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: var(--font-family-base);
}
</style>
