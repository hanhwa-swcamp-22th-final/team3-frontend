<script setup>
import { ref, computed, watch } from 'vue'
import { BaseInput, BaseButton } from '@/components/common/base'

const props = defineProps({
  preset:   { type: Object,  default: null },
  creating: { type: Boolean, default: false },
})

const emit = defineEmits(['save', 'cancel', 'delete', 'update'])

/* ── 읽기 전용 모드: 가중치 표시 ── */
const weights = computed(() => {
  if (!props.preset) return []
  return [
    { label: 'V1 공정 복잡도',   value: Number(props.preset.weightV1) },
    { label: 'V2 품질 정밀도',   value: Number(props.preset.weightV2) },
    { label: 'V3 역량 요구도',   value: Number(props.preset.weightV3) },
    { label: 'V4 시공간 긴급도', value: Number(props.preset.weightV4) },
  ]
})

const maxWeight = computed(() => Math.max(...weights.value.map(w => w.value)))

const weightSum = computed(() => {
  const sum = weights.value.reduce((s, w) => s + w.value, 0)
  return Math.round(sum * 100) / 100
})

/* ── 생성 모드: 폼 데이터 ── */
const EMPTY_FORM = () => ({
  industryPresetName: '',
  weightV1: '',
  weightV2: '',
  weightV3: '',
  weightV4: '',
  alphaWeight: '',
  effectiveDate: '',
})

const form = ref(EMPTY_FORM())

watch(() => props.creating, (val) => {
  if (val) form.value = EMPTY_FORM()
})

const formWeightSum = computed(() => {
  const sum = [form.value.weightV1, form.value.weightV2, form.value.weightV3, form.value.weightV4]
    .map(v => parseFloat(v) || 0)
    .reduce((a, b) => a + b, 0)
  return Math.round(sum * 100) / 100
})

const isSumValid   = computed(() => formWeightSum.value === 1.0)
const isAlphaValid = computed(() => {
  const a = parseFloat(form.value.alphaWeight)
  return !isNaN(a) && a >= 0 && a <= 0.5
})
const isFormValid = computed(() =>
  form.value.industryPresetName.trim() !== '' &&
  isSumValid.value &&
  isAlphaValid.value &&
  form.value.effectiveDate !== ''
)

const handleSave = () => {
  emit('save', {
    industryPresetName: form.value.industryPresetName,
    weightV1: parseFloat(form.value.weightV1),
    weightV2: parseFloat(form.value.weightV2),
    weightV3: parseFloat(form.value.weightV3),
    weightV4: parseFloat(form.value.weightV4),
    alphaWeight: parseFloat(form.value.alphaWeight),
    effectiveDate: form.value.effectiveDate,
  })
}

/* ── 수정 모드 ── */
const isEditing = ref(false)
const editForm  = ref(EMPTY_FORM())

watch(() => props.preset, () => { isEditing.value = false })

const startEdit = () => {
  editForm.value = {
    industryPresetName: props.preset.industryPresetName,
    weightV1: String(props.preset.weightV1),
    weightV2: String(props.preset.weightV2),
    weightV3: String(props.preset.weightV3),
    weightV4: String(props.preset.weightV4),
    alphaWeight: String(props.preset.alphaWeight),
    effectiveDate: props.preset.effectiveDate ?? '',
  }
  isEditing.value = true
}

const cancelEdit = () => { isEditing.value = false }

const editWeightSum = computed(() => {
  const sum = [editForm.value.weightV1, editForm.value.weightV2, editForm.value.weightV3, editForm.value.weightV4]
    .map(v => parseFloat(v) || 0)
    .reduce((a, b) => a + b, 0)
  return Math.round(sum * 100) / 100
})

const isEditSumValid   = computed(() => editWeightSum.value === 1.0)
const isEditAlphaValid = computed(() => {
  const a = parseFloat(editForm.value.alphaWeight)
  return !isNaN(a) && a >= 0 && a <= 0.5
})
const isEditFormValid = computed(() =>
  editForm.value.industryPresetName.trim() !== '' &&
  isEditSumValid.value &&
  isEditAlphaValid.value &&
  editForm.value.effectiveDate !== ''
)

const handleUpdate = () => {
  emit('update', {
    configId: props.preset.configId,
    industryPresetName: editForm.value.industryPresetName,
    weightV1: parseFloat(editForm.value.weightV1),
    weightV2: parseFloat(editForm.value.weightV2),
    weightV3: parseFloat(editForm.value.weightV3),
    weightV4: parseFloat(editForm.value.weightV4),
    alphaWeight: parseFloat(editForm.value.alphaWeight),
    effectiveDate: editForm.value.effectiveDate,
  })
  isEditing.value = false
}

const handleDelete = () => {
  emit('delete', {
    configId: props.preset.configId,
    industryPresetName: props.preset.industryPresetName,
  })
}
</script>

<template>
  <!-- ── 생성 모드 ── -->
  <div v-if="creating" class="detail-panel">

    <div class="panel-title-row">
      <span class="panel-title">새 프리셋 생성</span>
    </div>

    <!-- 프리셋 이름 -->
    <div class="block">
      <span class="block-title">프리셋 이름</span>
      <div class="form-grid">
        <div class="form-field form-field--full">
          <label class="form-label">산업군 프리셋 이름</label>
          <BaseInput v-model="form.industryPresetName" placeholder="예: 반도체" />
        </div>
      </div>
    </div>

    <!-- V1~V4 가중치 -->
    <div class="block">
      <div class="block-title-row">
        <span class="block-title">변수 가중치 (V1~V4)</span>
        <span class="sum-badge" :class="isSumValid ? 'sum-badge--ok' : 'sum-badge--warn'">
          Σ = {{ formWeightSum.toFixed(2) }} {{ isSumValid ? '✓' : '≠ 1.0' }}
        </span>
      </div>
      <div class="form-grid">
        <div class="form-field">
          <label class="form-label">V1 공정 복잡도</label>
          <BaseInput v-model="form.weightV1" type="number" placeholder="예: 0.30" />
        </div>
        <div class="form-field">
          <label class="form-label">V2 품질 정밀도</label>
          <BaseInput v-model="form.weightV2" type="number" placeholder="예: 0.40" />
        </div>
        <div class="form-field">
          <label class="form-label">V3 역량 요구도</label>
          <BaseInput v-model="form.weightV3" type="number" placeholder="예: 0.20" />
        </div>
        <div class="form-field">
          <label class="form-label">V4 시공간 긴급도</label>
          <BaseInput v-model="form.weightV4" type="number" placeholder="예: 0.10" />
        </div>
      </div>
    </div>

    <!-- 신규성 가중치 (α) -->
    <div class="block">
      <span class="block-title">신규성 가중치 (α)</span>
      <div class="form-grid">
        <div class="form-field">
          <label class="form-label">α (0.0 ~ 0.5)</label>
          <BaseInput v-model="form.alphaWeight" type="number" placeholder="예: 0.10" />
        </div>
        <div class="form-field">
          <label class="form-label">초도 주문 가산점</label>
          <span class="form-calc">
            {{ form.alphaWeight ? `+${(parseFloat(form.alphaWeight) * 100).toFixed(0)}점` : '—' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 적용 시작일 -->
    <div class="block">
      <span class="block-title">적용 정보</span>
      <div class="form-grid">
        <div class="form-field">
          <label class="form-label">적용 시작일</label>
          <BaseInput v-model="form.effectiveDate" type="date" />
        </div>
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div class="form-footer">
      <span class="form-footer__desc">V1+V2+V3+V4 합계가 1.0이어야 저장됩니다.</span>
      <div class="form-footer__actions">
        <BaseButton variant="secondary" size="sm" @click="emit('cancel')">취소</BaseButton>
        <BaseButton variant="primary" size="sm" :disabled="!isFormValid" @click="handleSave">저장</BaseButton>
      </div>
    </div>

  </div>

  <!-- ── 읽기/수정 모드 ── -->
  <div v-else-if="preset" class="detail-panel">

    <div class="panel-title-row">
      <span class="panel-title">{{ preset.industryPresetName }} — 세부 파라미터</span>
      <span v-if="isEditing" class="badge-editing">수정 중</span>
    </div>

    <!-- ── 수정 모드 ── -->
    <template v-if="isEditing">

      <!-- 프리셋 이름 -->
      <div class="block">
        <span class="block-title">프리셋 이름</span>
        <div class="form-grid">
          <div class="form-field form-field--full">
            <label class="form-label">산업군 프리셋 이름</label>
            <BaseInput v-model="editForm.industryPresetName" />
          </div>
        </div>
      </div>

      <!-- V1~V4 가중치 -->
      <div class="block">
        <div class="block-title-row">
          <span class="block-title">변수 가중치 (V1~V4)</span>
          <span class="sum-badge" :class="isEditSumValid ? 'sum-badge--ok' : 'sum-badge--warn'">
            Σ = {{ editWeightSum.toFixed(2) }} {{ isEditSumValid ? '✓' : '≠ 1.0' }}
          </span>
        </div>
        <div class="form-grid">
          <div class="form-field">
            <label class="form-label">V1 공정 복잡도</label>
            <BaseInput v-model="editForm.weightV1" type="number" />
          </div>
          <div class="form-field">
            <label class="form-label">V2 품질 정밀도</label>
            <BaseInput v-model="editForm.weightV2" type="number" />
          </div>
          <div class="form-field">
            <label class="form-label">V3 역량 요구도</label>
            <BaseInput v-model="editForm.weightV3" type="number" />
          </div>
          <div class="form-field">
            <label class="form-label">V4 시공간 긴급도</label>
            <BaseInput v-model="editForm.weightV4" type="number" />
          </div>
        </div>
      </div>

      <!-- 신규성 가중치 (α) -->
      <div class="block">
        <span class="block-title">신규성 가중치 (α)</span>
        <div class="form-grid">
          <div class="form-field">
            <label class="form-label">α (0.0 ~ 0.5)</label>
            <BaseInput v-model="editForm.alphaWeight" type="number" />
          </div>
          <div class="form-field">
            <label class="form-label">초도 주문 가산점</label>
            <span class="form-calc">
              {{ editForm.alphaWeight ? `+${(parseFloat(editForm.alphaWeight) * 100).toFixed(0)}점` : '—' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 적용 시작일 -->
      <div class="block">
        <span class="block-title">적용 정보</span>
        <div class="form-grid">
          <div class="form-field">
            <label class="form-label">적용 시작일</label>
            <BaseInput v-model="editForm.effectiveDate" type="date" />
          </div>
        </div>
      </div>

    </template>

    <!-- ── 읽기 모드 ── -->
    <template v-else>

      <!-- Block 1: V1~V4 가중치 -->
      <div class="block">
        <div class="block-title-row">
          <span class="block-title">변수 가중치 (V1~V4)</span>
          <span class="sum-badge" :class="weightSum === 1.0 ? 'sum-badge--ok' : 'sum-badge--warn'">
            Σ = {{ weightSum.toFixed(2) }} {{ weightSum === 1.0 ? '✓' : '' }}
          </span>
        </div>
        <div v-for="w in weights" :key="w.label" class="weight-row">
          <span class="weight-label">{{ w.label }}</span>
          <div class="weight-bar-wrap">
            <div class="weight-bar-fill" :style="{ width: (w.value / maxWeight * 100) + '%' }" />
          </div>
          <span class="weight-value">{{ w.value.toFixed(2) }}</span>
        </div>
        <span class="weight-sum">Σ = {{ weightSum.toFixed(2) }}</span>
      </div>

      <!-- Block 2: 신규성 가중치 (α) -->
      <div class="block">
        <span class="block-title">신규성 가중치 (α)</span>
        <div class="info-row">
          <span class="info-label">α 가중치</span>
          <span class="info-value">{{ Number(preset.alphaWeight).toFixed(2) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">초도 주문 가산점</span>
          <span class="info-value info-value--accent">
            +{{ (Number(preset.alphaWeight) * 100).toFixed(0) }}점
          </span>
        </div>
      </div>

      <!-- Block 3: 적용 정보 -->
      <div class="block">
        <span class="block-title">적용 정보</span>
        <div class="info-row">
          <span class="info-label">적용 시작일</span>
          <span class="info-value">{{ preset.effectiveDate ?? '—' }}</span>
        </div>
      </div>

    </template>

    <!-- 하단 버튼 -->
    <div class="form-footer">
      <template v-if="isEditing">
        <span class="form-footer__desc">V1+V2+V3+V4 합계가 1.0이어야 저장됩니다.</span>
        <div class="form-footer__actions">
          <BaseButton variant="secondary" size="sm" @click="cancelEdit">취소</BaseButton>
          <BaseButton variant="primary" size="sm" :disabled="!isEditFormValid" @click="handleUpdate">수정완료</BaseButton>
        </div>
      </template>
      <template v-else>
        <span class="form-footer__desc"></span>
        <div class="form-footer__actions">
          <BaseButton variant="danger" size="sm" @click="handleDelete">삭제하기</BaseButton>
          <BaseButton variant="primary" size="sm" @click="startEdit">수정하기</BaseButton>
        </div>
      </template>
    </div>

  </div>
</template>

<style scoped>
.detail-panel {
  flex: 1;
  min-width: 0;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 패널 타이틀 */
.panel-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.panel-title {
  font-size: 12px;
  font-weight: 900;
  color: var(--color-text-secondary);
  flex: 1;
}

.badge-editing {
  padding: 4px 10px;
  background: var(--color-warning-soft);
  border: 1.5px solid var(--tier-b);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-warning);
}

/* 공통 블록 */
.block {
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  padding: 17px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.block-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.block-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.block-title-row .block-title { margin-bottom: 0; }

/* 가중치 바 */
.weight-row {
  display: flex;
  align-items: center;
  height: 32px;
  border-bottom: 1.5px solid var(--color-border-row);
  gap: 8px;
}

.weight-label {
  width: 110px;
  flex-shrink: 0;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.weight-bar-wrap {
  flex: 1;
  height: 4px;
  background: var(--color-border-default);
  border-radius: 2px;
}

.weight-bar-fill {
  height: 100%;
  background: var(--color-primary-600);
  border-radius: 2px;
}

.weight-value {
  width: 36px;
  text-align: right;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.weight-sum {
  font-size: 12px;
  font-weight: 700;
  color: var(--tier-s);
  text-align: right;
  margin-top: 8px;
}

/* 합계 뱃지 */
.sum-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}

.sum-badge--ok   { background: var(--color-equip-active-bg);  color: var(--color-equip-active); }
.sum-badge--warn { background: var(--color-warning-soft);      color: var(--color-warning); }

/* 정보 행 */
.info-row {
  display: flex;
  align-items: center;
  height: 32px;
  border-bottom: 1.5px solid var(--color-border-row);
  gap: 8px;
}

.info-label {
  width: 110px;
  flex-shrink: 0;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.info-value {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
  font-family: var(--font-family-mono);
}

.info-value--accent {
  color: var(--color-primary-600);
}

/* ── 폼 ── */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
  margin-top: 4px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field--full { grid-column: 1 / -1; }

.form-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.form-calc {
  font-family: var(--font-family-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-600);
  padding-top: 6px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 4px;
}

.form-footer__desc {
  font-size: 11px;
  color: var(--color-text-placeholder);
  flex: 1;
}

.form-footer__actions {
  display: flex;
  gap: 8px;
}
</style>
