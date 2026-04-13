<script setup>
import { computed, onMounted, ref } from 'vue'
import AlgorithmEquipmentList from '@/components/admin/scm/AlgorithmEquipmentList.vue'
import AlgorithmDetailPanel from '@/components/admin/scm/AlgorithmDetailPanel.vue'
import { BaseButton } from '@/components/common/base'
import { ADMIN_API_BASE } from '@/constants'
import { useAuthStore } from '@/stores/auth'

const ALGORITHM_API = `${ADMIN_API_BASE}/api/v1/algorithm-version`

const DEFAULT_POLICY_CONFIG = {
  equipment: {
    ageDecayLambda: 2.0,
    minEtaAge: 0.3,
    maintDecayLambda: 1.2,
    ageFactor: 0.12,
    maintFactor: 0.08,
    envFactor: 0.05,
    materialFactor: 0.1,
    eIdxMax: 1.3,
    baselineAgeFactor: 0.5,
    gradeBoundaryA: 0.33,
    gradeBoundaryB: 0.66,
  },
  score: {
    uphWeight: 0.35,
    yieldWeight: 0.45,
    leadTimeWeight: 0.2,
  },
  environment: {
    tempWeight: 0.4,
    humidityWeight: 0.3,
    particleWeight: 0.3,
  },
  material: {
    lotDefectThreshold: 0.6,
    shieldingRelief: 0.3,
  },
  challenge: {
    bonusScale: 50,
    bonusCap: 20,
  },
  qualitative: {
    contrastiveChunkWeight: 1.5,
    keywordSumCap: 0.6,
    contextDetailWeight: 1.05,
    contextDetailWithNumberWeight: 1.1,
    defaultGroupMean: 0,
    defaultGroupStd: 0.5,
    epsilon: 0.01,
    secondaryAdjustmentFactor: 0.5,
    secondaryAdjustmentCap: 0.5,
    internalRawMin: -1.76,
    internalRawMax: 1.76,
    tierS: 85,
    tierA: 70,
    tierB: 55,
  },
}

const authStore = useAuthStore()
const algorithmVersions = ref([])
const selectedAlgorithm = ref(null)
const form = ref(createEmptyForm())
const isLoading = ref(false)
const isSaving = ref(false)
const isReviewing = ref(false)
const policyReview = ref(null)
const errorMessage = ref('')
const searchQuery = ref('')

const isNew = computed(() => !form.value.algorithmVersionId)

const filteredAlgorithms = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  if (!keyword) return algorithmVersions.value

  return algorithmVersions.value.filter((item) => [
    item.versionNo,
    item.implementationKey,
    item.description,
  ].some((value) => String(value ?? '').toLowerCase().includes(keyword)))
})

const canSave = computed(() =>
  !isSaving.value
  && form.value.versionNo.trim()
  && form.value.implementationKey.trim()
)

function clonePolicyConfig(config = DEFAULT_POLICY_CONFIG) {
  return JSON.parse(JSON.stringify(config))
}

function mergePolicyConfig(source) {
  const target = clonePolicyConfig()

  function merge(targetNode, sourceNode) {
    Object.entries(sourceNode ?? {}).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        targetNode[key] = merge(targetNode[key] && typeof targetNode[key] === 'object' ? targetNode[key] : {}, value)
      } else {
        targetNode[key] = value
      }
    })
    return targetNode
  }

  return merge(target, source)
}

function parsePolicyConfig(value) {
  if (!value) return clonePolicyConfig()

  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value
    return mergePolicyConfig(parsed)
  } catch {
    return clonePolicyConfig()
  }
}

function stringifyPolicyConfig(value) {
  return JSON.stringify(value ?? {}, null, 2)
}

function currentPolicyConfigJson() {
  return stringifyPolicyConfig(form.value.policyConfig)
}

function createEmptyForm() {
  return {
    algorithmVersionId: null,
    versionNo: '',
    implementationKey: 'POLICY_V1',
    description: '',
    policyConfig: clonePolicyConfig(),
    isActive: true,
  }
}

function authHeaders(extraHeaders = {}) {
  return {
    ...extraHeaders,
    ...(authStore.accessToken ? { Authorization: `Bearer ${authStore.accessToken}` } : {}),
  }
}

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: authHeaders(options.headers ?? {}),
  })
  const json = await res.json().catch(() => ({}))

  if (!res.ok || json.success === false) {
    throw new Error(json.message ?? `API 요청에 실패했습니다. (${res.status})`)
  }

  return json.data
}

async function fetchAlgorithms() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const data = await requestJson(ALGORITHM_API)
    algorithmVersions.value = Array.isArray(data) ? data : []

    if (!selectedAlgorithm.value && algorithmVersions.value.length > 0) {
      selectAlgorithm(algorithmVersions.value[0])
    }
  } catch (error) {
    console.error('Failed to load algorithm versions:', error)
    errorMessage.value = error.message ?? '알고리즘 버전 목록을 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

function selectAlgorithm(algorithm) {
  selectedAlgorithm.value = algorithm
  policyReview.value = null
  form.value = {
    algorithmVersionId: algorithm.algorithmVersionId,
    versionNo: algorithm.versionNo ?? '',
    implementationKey: algorithm.implementationKey ?? '',
    description: algorithm.description ?? '',
    policyConfig: parsePolicyConfig(algorithm.policyConfig),
    isActive: algorithm.isActive ?? false,
  }
}

function startCreate() {
  selectedAlgorithm.value = null
  policyReview.value = null
  form.value = createEmptyForm()
}

async function saveAlgorithm() {
  if (!canSave.value) return

  isSaving.value = true
  try {
    const body = {
      versionNo: form.value.versionNo.trim(),
      implementationKey: form.value.implementationKey.trim(),
      description: form.value.description?.trim() || null,
      policyConfig: currentPolicyConfigJson(),
      isActive: form.value.isActive,
    }
    const url = isNew.value ? ALGORITHM_API : `${ALGORITHM_API}/${form.value.algorithmVersionId}`
    const saved = await requestJson(url, {
      method: isNew.value ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    await fetchAlgorithms()
    const target = algorithmVersions.value.find((item) => item.algorithmVersionId === saved?.algorithmVersionId)
    if (target) selectAlgorithm(target)
  } catch (error) {
    console.error('Failed to save algorithm version:', error)
    alert(error.message ?? '알고리즘 정책 저장에 실패했습니다.')
  } finally {
    isSaving.value = false
  }
}


async function reviewAlgorithmPolicy() {
  isReviewing.value = true
  policyReview.value = null

  try {
    policyReview.value = await requestJson(`${ALGORITHM_API}/policy-review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ policyConfig: currentPolicyConfigJson() }),
    })
  } catch (error) {
    console.error('알고리즘 정책 AI 검토 실패:', error)
    alert(error.message ?? 'AI 정책 검토에 실패했습니다.')
  } finally {
    isReviewing.value = false
  }
}
async function deleteAlgorithm() {
  if (isNew.value) return
  if (!confirm('선택한 알고리즘 버전을 삭제할까요? 이미 평가기간에서 참조 중이면 삭제에 실패할 수 있습니다.')) return

  try {
    await requestJson(`${ALGORITHM_API}/${form.value.algorithmVersionId}`, { method: 'DELETE' })
    selectedAlgorithm.value = null
    form.value = createEmptyForm()
    await fetchAlgorithms()
  } catch (error) {
    console.error('Failed to delete algorithm version:', error)
    alert(error.message ?? '알고리즘 버전 삭제에 실패했습니다.')
  }
}

onMounted(fetchAlgorithms)
</script>

<template>
  <div class="admin-algorithm">
    <div class="page-header">
      <div>
        <h1 class="page-title">알고리즘 설정</h1>
        <p class="page-desc">알고리즘 버전별 배치 정책값을 항목 단위로 관리합니다.</p>
      </div>
      <div class="page-actions">
        <BaseButton variant="secondary" size="sm" @click="fetchAlgorithms">새로고침</BaseButton>
        <BaseButton variant="primary" size="sm" @click="startCreate">+ 새 버전</BaseButton>
      </div>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <div class="content">
      <AlgorithmEquipmentList
        :algorithms="filteredAlgorithms"
        :selected-id="form.algorithmVersionId"
        :search-query="searchQuery"
        :is-loading="isLoading"
        @search="searchQuery = $event"
        @select="selectAlgorithm"
      />

      <AlgorithmDetailPanel
        v-model="form"
        :is-new="isNew"
        :is-saving="isSaving"
        :is-reviewing="isReviewing"
        :policy-review="policyReview"
        @save="saveAlgorithm"
        @review="reviewAlgorithmPolicy"
        @delete="deleteAlgorithm"
        @reset-policy="form.policyConfig = clonePolicyConfig()"
      />
    </div>
  </div>
</template>

<style scoped>
.admin-algorithm {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  flex: 1;
  min-width: 0;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  overflow: hidden;
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1.5px solid var(--color-border-default);
  padding-bottom: 14px;
  flex-shrink: 0;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  color: var(--color-primary-800);
}

.page-desc {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--color-primary-300);
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-message {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid var(--color-danger, #ef476f);
  border-radius: var(--radius-xs);
  background: rgba(239, 71, 111, 0.08);
  color: var(--color-danger, #ef476f);
  font-size: 12px;
  font-weight: 700;
}

.content {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}
</style>