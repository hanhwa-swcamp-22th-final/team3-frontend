<script setup>
import { ref, onMounted } from 'vue'
import DepartmentLeaderMemberListPanel from '@/components/hr/departmentleader/team-capability/DepartmentLeaderMemberListPanel.vue'
import DepartmentLeaderCapabilityDetailPanel from '@/components/hr/departmentleader/team-capability/DepartmentLeaderCapabilityDetailPanel.vue'
import { fetchDlCapabilityMembers } from '@/services/departmentleader/capabilityApi'

const members = ref([])
const selectedMember = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    members.value = await fetchDlCapabilityMembers()
    if (members.value.length > 0) {
      selectedMember.value = members.value[0]
    }
  } catch (error) {
    console.error('Failed to load capability members:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="dl-capability-view">
    <div v-if="loading" class="dl-capability-view__loading">데이터를 불러오는 중...</div>

    <template v-else>
      <DepartmentLeaderMemberListPanel
        :members="members"
        :selected-id="selectedMember?.id ?? null"
        @select="selectedMember = $event"
      />
      <DepartmentLeaderCapabilityDetailPanel :member="selectedMember" />
    </template>
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

.dl-capability-view__loading {
  grid-column: 1 / -1;
  padding: 60px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
}
</style>
