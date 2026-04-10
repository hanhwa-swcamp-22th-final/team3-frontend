<script setup>
import { ref, computed, onMounted } from 'vue'
import PresetList        from '@/components/admin/scm/PresetList.vue'
import PresetDetailPanel from '@/components/admin/scm/PresetDetailPanel.vue'
import { ADMIN_API_BASE } from '@/constants'
import { useAuthStore }   from '@/stores/auth'

const authStore  = useAuthStore()
const presets    = ref([])
const selectedId = ref(null)
const isCreating = ref(false)

const selectedPreset = computed(() =>
  isCreating.value ? null : presets.value.find(p => p.configId === selectedId.value) ?? null
)

const onSelect = (id) => {
  isCreating.value = false
  selectedId.value = id
}

const onCreate = () => {
  isCreating.value = true
  selectedId.value = null
}

async function fetchPresets() {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/api/v1/industry/presets`, {
      headers: { Authorization: `Bearer ${authStore.accessToken}` },
    })
    const json = await res.json()
    if (json.success && json.data) {
      presets.value = json.data
      if (!isCreating.value && json.data.length > 0 && selectedId.value === null) {
        selectedId.value = json.data[0].configId
      }
    }
  } catch (e) {
    console.error('Failed to fetch industry presets:', e)
  }
}

const onSave = async (formData) => {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/api/v1/industry/preset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: JSON.stringify(formData),
    })
    const json = await res.json()
    if (json.success) {
      isCreating.value = false
      selectedId.value = null
      await fetchPresets()
      if (presets.value.length > 0) {
        selectedId.value = presets.value[presets.value.length - 1].configId
      }
    } else {
      alert(json.message ?? '프리셋 생성에 실패했습니다.')
    }
  } catch (e) {
    console.error('Failed to create preset:', e)
    alert('프리셋 생성 중 오류가 발생했습니다.')
  }
}

const onDelete = async (preset) => {
  if (!confirm(`"${preset.industryPresetName}" 프리셋을 삭제하시겠습니까?`)) return
  try {
    const res = await fetch(`${ADMIN_API_BASE}/api/v1/industry/preset`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: JSON.stringify(preset),
    })
    const json = await res.json()
    if (json.success) {
      selectedId.value = null
      await fetchPresets()
      if (presets.value.length > 0) {
        selectedId.value = presets.value[0].configId
      }
    } else {
      alert(json.message ?? '프리셋 삭제에 실패했습니다.')
    }
  } catch (e) {
    console.error('Failed to delete preset:', e)
    alert('프리셋 삭제 중 오류가 발생했습니다.')
  }
}

const onUpdate = async (formData) => {
  try {
    const res = await fetch(`${ADMIN_API_BASE}/api/v1/industry/preset`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.accessToken}`,
      },
      body: JSON.stringify(formData),
    })
    const json = await res.json()
    if (json.success) {
      selectedId.value = formData.configId
      await fetchPresets()
    } else {
      alert(json.message ?? '프리셋 수정에 실패했습니다.')
    }
  } catch (e) {
    console.error('Failed to update preset:', e)
    alert('프리셋 수정 중 오류가 발생했습니다.')
  }
}

onMounted(fetchPresets)
</script>

<template>
  <div class="admin-preset">
    <PresetList
      :presets="presets"
      :selectedId="selectedId"
      @select="onSelect"
      @create="onCreate"
    />
    <PresetDetailPanel
      :preset="selectedPreset"
      :creating="isCreating"
      @save="onSave"
      @cancel="isCreating = false; if (presets.length > 0) selectedId = presets[0].configId"
      @delete="onDelete"
      @update="onUpdate"
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
}
</style>
