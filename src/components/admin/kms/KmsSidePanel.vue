<script setup>
import TeamLeaderKnowledgeHubContributors from '@/components/kms/common/knowledge-hub/teamleader/TeamLeaderKnowledgeHubContributors.vue'

defineProps({
  contributors: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="side-panel">
    <TeamLeaderKnowledgeHubContributors :ranking="contributors" />
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
