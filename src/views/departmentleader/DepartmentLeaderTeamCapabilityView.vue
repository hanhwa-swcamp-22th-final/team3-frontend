<script setup>
import { ref } from 'vue'
import DepartmentLeaderMemberListPanel from '@/components/hr/departmentleader/team-capability/DepartmentLeaderMemberListPanel.vue'
import DepartmentLeaderCapabilityDetailPanel from '@/components/hr/departmentleader/team-capability/DepartmentLeaderCapabilityDetailPanel.vue'
import { capabilityMembers as members } from '@/mocks/departmentleader/teamCapability.js'

const selectedMember = ref(members[0])
</script>

<template>
  <section class="dl-capability-view">
    <DepartmentLeaderMemberListPanel
      :members="members"
      :selected-id="selectedMember?.id ?? null"
      @select="selectedMember = $event"
    />
    <DepartmentLeaderCapabilityDetailPanel :member="selectedMember" />
  </section>
</template>

<style scoped>
.dl-capability-view {
  width: 100%;
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  padding: 20px 28px 28px;
  background: var(--color-bg-app);
  align-items: start;
}
</style>
