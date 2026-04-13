<script setup>
import { computed, reactive, watch } from 'vue'
import { BaseFormModal } from '@/components/common/base'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  factoryLines: { type: Array, default: () => [] },
  processes: { type: Array, default: () => [] },
  environmentStandards: { type: Array, default: () => [] },
  environmentTypeOptions: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'close',
  'saveLine',
  'deleteLine',
  'saveProcess',
  'deleteProcess',
  'saveEnvironment',
  'deleteEnvironment',
])

const lineForm = reactive({
  factoryLineId: null,
  factoryLineCode: '',
  factoryLineName: '',
})

const processForm = reactive({
  equipmentProcessId: null,
  factoryLineId: '',
  equipmentProcessCode: '',
  equipmentProcessName: '',
})

const environmentForm = reactive({
  environmentStandardId: null,
  environmentType: 'GENERAL',
  environmentCode: '',
  environmentName: '',
  envTempMin: '',
  envTempMax: '',
  envHumidityMin: '',
  envHumidityMax: '',
  envParticleLimit: '',
})

const isLineEditMode = computed(() => !!lineForm.factoryLineId)
const isProcessEditMode = computed(() => !!processForm.equipmentProcessId)
const isEnvironmentEditMode = computed(() => !!environmentForm.environmentStandardId)
const selectedLineProcesses = computed(() =>
  props.processes.filter((process) => process.factoryLineId === lineForm.factoryLineId)
)
const showHumidityFields = computed(() => environmentForm.environmentType !== 'GENERAL')
const showParticleLimit = computed(() => environmentForm.environmentType === 'CLEANROOM')

function resetLineForm() {
  lineForm.factoryLineId = null
  lineForm.factoryLineCode = ''
  lineForm.factoryLineName = ''
}

function resetProcessForm() {
  processForm.equipmentProcessId = null
  processForm.factoryLineId = ''
  processForm.equipmentProcessCode = ''
  processForm.equipmentProcessName = ''
}

function resetEnvironmentForm() {
  environmentForm.environmentStandardId = null
  environmentForm.environmentType = 'GENERAL'
  environmentForm.environmentCode = ''
  environmentForm.environmentName = ''
  environmentForm.envTempMin = ''
  environmentForm.envTempMax = ''
  environmentForm.envHumidityMin = ''
  environmentForm.envHumidityMax = ''
  environmentForm.envParticleLimit = ''
}

function selectLine(line) {
  lineForm.factoryLineId = line.factoryLineId
  lineForm.factoryLineCode = line.factoryLineCode
  lineForm.factoryLineName = line.factoryLineName
  resetProcessForm()
  processForm.factoryLineId = line.factoryLineId
}

function selectProcess(process) {
  processForm.equipmentProcessId = process.equipmentProcessId
  processForm.factoryLineId = process.factoryLineId
  processForm.equipmentProcessCode = process.equipmentProcessCode
  processForm.equipmentProcessName = process.equipmentProcessName
}

function selectEnvironment(environment) {
  environmentForm.environmentStandardId = environment.environmentStandardId
  environmentForm.environmentType = environment.environmentType ?? 'GENERAL'
  environmentForm.environmentCode = environment.environmentCode ?? ''
  environmentForm.environmentName = environment.environmentName ?? ''
  environmentForm.envTempMin = environment.envTempMin ?? ''
  environmentForm.envTempMax = environment.envTempMax ?? ''
  environmentForm.envHumidityMin = environment.envHumidityMin ?? ''
  environmentForm.envHumidityMax = environment.envHumidityMax ?? ''
  environmentForm.envParticleLimit = environment.envParticleLimit ?? ''
}

function saveLine() {
  if (!lineForm.factoryLineCode.trim() || !lineForm.factoryLineName.trim()) return

  emit('saveLine', { ...lineForm })
  resetLineForm()
  resetProcessForm()
}

function saveProcess() {
  if (
    !processForm.factoryLineId ||
    !processForm.equipmentProcessCode.trim() ||
    !processForm.equipmentProcessName.trim()
  ) {
    return
  }

  emit('saveProcess', { ...processForm })
  resetProcessForm()
  processForm.factoryLineId = lineForm.factoryLineId ?? ''
}

function saveEnvironment() {
  const requiresHumidity = showHumidityFields.value
  const requiresParticleLimit = showParticleLimit.value

  if (
    !environmentForm.environmentType ||
    !environmentForm.environmentCode.trim() ||
    !environmentForm.environmentName.trim() ||
    environmentForm.envTempMin === '' ||
    environmentForm.envTempMax === '' ||
    (requiresHumidity &&
      (environmentForm.envHumidityMin === '' || environmentForm.envHumidityMax === '')) ||
    (requiresParticleLimit && environmentForm.envParticleLimit === '')
  ) {
    return
  }

  emit('saveEnvironment', {
    ...environmentForm,
    envHumidityMin: showHumidityFields.value ? environmentForm.envHumidityMin : null,
    envHumidityMax: showHumidityFields.value ? environmentForm.envHumidityMax : null,
    envParticleLimit: showParticleLimit.value ? environmentForm.envParticleLimit : null,
  })
  resetEnvironmentForm()
}

function deleteLine(line) {
  emit('deleteLine', line)
  if (lineForm.factoryLineId === line.factoryLineId) {
    resetLineForm()
    resetProcessForm()
  }
}

function deleteProcess(process) {
  emit('deleteProcess', process)
  if (processForm.equipmentProcessId === process.equipmentProcessId) {
    resetProcessForm()
    processForm.factoryLineId = lineForm.factoryLineId ?? ''
  }
}

function deleteEnvironment(environment) {
  emit('deleteEnvironment', environment)
  if (environmentForm.environmentStandardId === environment.environmentStandardId) {
    resetEnvironmentForm()
  }
}

watch(
  () => environmentForm.environmentType,
  (type) => {
    if (type === 'GENERAL') {
      environmentForm.envHumidityMin = ''
      environmentForm.envHumidityMax = ''
      environmentForm.envParticleLimit = ''
      return
    }

    if (type === 'DRYROOM') {
      environmentForm.envParticleLimit = ''
    }
  }
)
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) return
    resetLineForm()
    resetProcessForm()
    resetEnvironmentForm()
  }
)
</script>

<template>
  <Teleport to="body">
    <BaseFormModal
      v-if="isOpen"
      title="라인/공정/환경 설정"
      width="1180px"
      @close="emit('close')"
    >
      <div class="manage-modal">
        <section class="panel">
          <div class="panel__header">
            <div>
              <h3>라인</h3>
              <p>설비가 배치되는 생산 라인을 관리합니다.</p>
            </div>
            <button type="button" class="panel__ghost" @click="resetLineForm">새 라인</button>
          </div>

          <div class="form-grid">
            <label>
              라인 코드
              <input v-model="lineForm.factoryLineCode" placeholder="예: LINE-01" />
            </label>
            <label>
              라인명
              <input v-model="lineForm.factoryLineName" placeholder="예: 1라인" />
            </label>
          </div>
          <button type="button" class="panel__primary" @click="saveLine">
            {{ isLineEditMode ? '라인 수정' : '라인 등록' }}
          </button>

          <div class="list">
            <div
              v-for="line in factoryLines"
              :key="line.factoryLineId"
              class="list-row"
              :class="{ 'list-row--active': lineForm.factoryLineId === line.factoryLineId }"
            >
              <button type="button" class="list-row__main" @click="selectLine(line)">
                <strong>{{ line.factoryLineName }}</strong>
                <span>{{ line.factoryLineCode }}</span>
              </button>
              <button type="button" class="list-row__danger" @click="deleteLine(line)">삭제</button>
            </div>
            <div v-if="factoryLines.length === 0" class="empty">등록된 라인이 없습니다.</div>
          </div>
        </section>

        <section class="panel">
          <div class="panel__header">
            <div>
              <h3>공정</h3>
              <p>선택한 라인에 속한 공정을 관리합니다.</p>
            </div>
            <button type="button" class="panel__ghost" @click="resetProcessForm">새 공정</button>
          </div>

          <div class="form-grid">
            <label>
              라인
              <select v-model="processForm.factoryLineId">
                <option value="" disabled>라인 선택</option>
                <option
                  v-for="line in factoryLines"
                  :key="line.factoryLineId"
                  :value="line.factoryLineId"
                >
                  {{ line.factoryLineName }}
                </option>
              </select>
            </label>
            <label>
              공정 코드
              <input v-model="processForm.equipmentProcessCode" placeholder="예: PROC-01" />
            </label>
            <label>
              공정명
              <input v-model="processForm.equipmentProcessName" placeholder="예: 조립 공정" />
            </label>
          </div>
          <button type="button" class="panel__primary" @click="saveProcess">
            {{ isProcessEditMode ? '공정 수정' : '공정 등록' }}
          </button>

          <div class="list">
            <div
              v-for="process in selectedLineProcesses"
              :key="process.equipmentProcessId"
              class="list-row"
              :class="{ 'list-row--active': processForm.equipmentProcessId === process.equipmentProcessId }"
            >
              <button type="button" class="list-row__main" @click="selectProcess(process)">
                <strong>{{ process.equipmentProcessName }}</strong>
                <span>{{ process.equipmentProcessCode }}</span>
              </button>
              <button type="button" class="list-row__danger" @click="deleteProcess(process)">삭제</button>
            </div>
            <div v-if="!lineForm.factoryLineId" class="empty">라인을 선택하면 공정 목록이 표시됩니다.</div>
            <div v-else-if="selectedLineProcesses.length === 0" class="empty">등록된 공정이 없습니다.</div>
          </div>
        </section>

        <section class="panel">
          <div class="panel__header">
            <div>
              <h3>환경 기준</h3>
              <p>설비에 연결할 온도, 습도, 입자 기준을 관리합니다.</p>
            </div>
            <button type="button" class="panel__ghost" @click="resetEnvironmentForm">새 기준</button>
          </div>

          <div class="form-grid form-grid--compact">
            <label>
              환경 유형
              <select v-model="environmentForm.environmentType">
                <option
                  v-for="type in environmentTypeOptions"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.label }}
                </option>
              </select>
            </label>
            <label>
              기준 코드
              <input v-model="environmentForm.environmentCode" placeholder="예: ENV-DRY-01" />
            </label>
            <label>
              기준명
              <input v-model="environmentForm.environmentName" placeholder="예: 드라이룸 기준" />
            </label>
            <label>
              최소 온도
              <input v-model.number="environmentForm.envTempMin" type="number" step="0.01" />
            </label>
            <label>
              최대 온도
              <input v-model.number="environmentForm.envTempMax" type="number" step="0.01" />
            </label>
            <label v-if="showHumidityFields">
              최소 습도
              <input v-model.number="environmentForm.envHumidityMin" type="number" step="0.01" />
            </label>
            <label v-if="showHumidityFields">
              최대 습도
              <input v-model.number="environmentForm.envHumidityMax" type="number" step="0.01" />
            </label>
            <label v-if="showParticleLimit">
              입자 허용치
              <input v-model.number="environmentForm.envParticleLimit" type="number" min="0" step="1" />
            </label>
          </div>
          <button type="button" class="panel__primary" @click="saveEnvironment">
            {{ isEnvironmentEditMode ? '환경 기준 수정' : '환경 기준 등록' }}
          </button>

          <div class="list">
            <div
              v-for="environment in environmentStandards"
              :key="environment.environmentStandardId"
              class="list-row"
              :class="{
                'list-row--active':
                  environmentForm.environmentStandardId === environment.environmentStandardId,
              }"
            >
              <button type="button" class="list-row__main" @click="selectEnvironment(environment)">
                <strong>{{ environment.environmentName }}</strong>
                <span>{{ environment.environmentCode }} / {{ environmentTypeOptions.find((type) => type.value === environment.environmentType)?.label ?? environment.environmentType }}</span>
              </button>
              <button type="button" class="list-row__danger" @click="deleteEnvironment(environment)">삭제</button>
            </div>
            <div v-if="environmentStandards.length === 0" class="empty">등록된 환경 기준이 없습니다.</div>
          </div>
        </section>
      </div>

      <template #footer>
        <div class="modal-footer">
          <button type="button" class="modal-footer__close" @click="emit('close')">닫기</button>
        </div>
      </template>
    </BaseFormModal>
  </Teleport>
</template>

<style scoped>
.manage-modal {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-items: stretch;
  min-height: 68vh;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  padding: 18px;
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background: linear-gradient(180deg, rgba(240, 238, 255, 0.42) 0%, rgba(255, 255, 255, 0) 100%);
}

.panel__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.panel__header h3 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 900;
  color: var(--color-primary-800);
}

.panel__header p {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.form-grid--compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.form-grid--compact label:nth-child(3) {
  grid-column: 1 / -1;
}

label {
  display: flex;
  flex-direction: column;
  gap: 7px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-800);
}

input,
select {
  height: 40px;
  min-width: 0;
  padding: 0 12px;
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  font-size: 13px;
  color: var(--color-primary-800);
  outline: none;
  box-sizing: border-box;
}

input:focus,
select:focus {
  border-color: var(--color-primary-600);
}


.panel__primary,
.panel__ghost,
.list-row__danger {
  height: 34px;
  padding: 0 14px;
  border-radius: var(--radius-2xs);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.panel__primary {
  align-self: flex-start;
  background: var(--color-primary-600);
  border: 3px solid var(--color-primary-500);
  color: var(--color-bg-surface);
}

.panel__ghost {
  background: var(--color-bg-surface);
  border: 3px solid var(--color-border-default);
  color: var(--color-text-secondary);
}

.list {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.list-row {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-border-muted);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
}

.list-row--active {
  border-color: var(--color-primary-500);
  background: var(--color-primary-100);
}

.list-row__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 10px 12px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.list-row__main strong {
  overflow: hidden;
  font-size: 13px;
  color: var(--color-primary-800);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-row__main span {
  overflow: hidden;
  font-size: 11px;
  color: var(--color-text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-row__danger {
  margin-right: 8px;
  border: 0;
  background: var(--color-equip-stopped-bg);
  color: var(--color-equip-stopped);
}

.empty {
  padding: 26px 0;
  text-align: center;
  font-size: 12px;
  color: var(--color-text-placeholder);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.modal-footer__close {
  height: 42px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  background: var(--color-primary-700);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}
</style>
