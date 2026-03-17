<script setup>
import { ref, computed } from 'vue'
import PresetList        from '@/components/admin/scm/PresetList.vue'
import { INDUSTRY_PRESETS } from '@/mocks/admin/preset/presetData.js'

const presets    = ref(INDUSTRY_PRESETS.map(p => ({ ...p })))
const selectedId = ref('precision')

const selectedPreset = computed(() => presets.value.find(p => p.id === selectedId.value))
const activePreset   = computed(() => presets.value.find(p => p.active))

const onSelect = (id) => { selectedId.value = id }
const onSave   = ()   => { presets.value.forEach(p => { p.active = p.id === selectedId.value }) }
</script>

<template>
  <div class="admin-preset">
    <PresetList
      :presets="presets"
      :selectedId="selectedId"
      :activePreset="activePreset"
      @select="onSelect"
    />
  </div>
</template>

<style scoped>
.admin-preset {
  display: flex;
  flex-direction: row;
  gap: 23px;
  padding: 24px;
  flex: 1;
  min-width: 0;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  overflow: hidden;
  font-family: var(--font-family-base);
}
</style>
