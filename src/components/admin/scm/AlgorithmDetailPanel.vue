<script setup>
import { computed } from 'vue'
import { BaseButton } from '@/components/common/base'

const model = defineModel({
  type: Object,
  required: true,
})

defineProps({
  isNew: { type: Boolean, default: false },
  isSaving: { type: Boolean, default: false },
  isReviewing: { type: Boolean, default: false },
  policyReview: { type: Object, default: null },
})

const emit = defineEmits(['save', 'delete', 'resetPolicy', 'review'])

const policyPreview = computed(() => JSON.stringify(model.value.policyConfig ?? {}, null, 2))
</script>

<template>
  <section class="section">
    <div class="section-head">
      <div>
        <p class="eyebrow">ALGORITHM POLICY</p>
        <h2 class="section-title">{{ isNew ? '새 알고리즘 버전' : `${model.versionNo} 정책` }}</h2>
      </div>
      <span class="status-pill" :class="{ 'status-pill--active': model.isActive }">
        {{ model.isActive ? '활성' : '비활성' }}
      </span>
    </div>

    <div class="form-grid form-grid--meta">
      <label>
        <span>버전 번호</span>
        <input v-model="model.versionNo" placeholder="v1.0" />
      </label>
      <label>
        <span>구현 정책 키</span>
        <input v-model="model.implementationKey" placeholder="POLICY_V1" />
      </label>
      <label class="form-grid__full">
        <span>설명</span>
        <input v-model="model.description" placeholder="정책 버전에 대한 설명을 입력하세요" />
      </label>
      <label class="toggle-row form-grid__full">
        <input v-model="model.isActive" type="checkbox" />
        <span>활성 알고리즘 버전으로 지정</span>
      </label>
    </div>

    <div class="policy-head">
      <div>
        <h3>정량 평가 정책</h3>
        <p>설비 노후화, E_idx, 생산 점수 가중치, 환경/자재 영향, 챌린지 보너스 계산 기준을 설정합니다.</p>
      </div>
      <BaseButton variant="secondary" size="sm" @click="emit('resetPolicy')">기본값 복원</BaseButton>
    </div>

    <div class="policy-block">
      <h4>설비 노후화 / E_idx 계산 정책</h4>
      <p class="policy-note">
        보증 기간, 설계 수명, 마모 계수, 기준 성능률, 기준 오차율 같은 설비별 등록값은 설비 관리에서 입력합니다.
        이 영역은 해당 설비 값을 배치 계산에 반영할 때 사용할 공통 보정 상수만 관리합니다.
      </p>
      <div class="form-grid form-grid--policy">
        <label><span>노후화 감쇠 민감도</span><input v-model.number="model.policyConfig.equipment.ageDecayLambda" type="number" step="0.01" /></label>
        <label><span>최소 노후화 보정값</span><input v-model.number="model.policyConfig.equipment.minEtaAge" type="number" step="0.01" /></label>
        <label><span>정비 감쇠 민감도</span><input v-model.number="model.policyConfig.equipment.maintDecayLambda" type="number" step="0.01" /></label>
        <label><span>노후화 반영 가중치</span><input v-model.number="model.policyConfig.equipment.ageFactor" type="number" step="0.01" /></label>
        <label><span>정비 반영 가중치</span><input v-model.number="model.policyConfig.equipment.maintFactor" type="number" step="0.01" /></label>
        <label><span>환경 편차 반영 가중치</span><input v-model.number="model.policyConfig.equipment.envFactor" type="number" step="0.01" /></label>
        <label><span>자재 품질 반영 가중치</span><input v-model.number="model.policyConfig.equipment.materialFactor" type="number" step="0.01" /></label>
        <label><span>E_idx 상한값</span><input v-model.number="model.policyConfig.equipment.eIdxMax" type="number" step="0.01" /></label>
        <label><span>기준 성능 노후 보정 계수</span><input v-model.number="model.policyConfig.equipment.baselineAgeFactor" type="number" step="0.01" /></label>
        <label><span>A등급 경계값</span><input v-model.number="model.policyConfig.equipment.gradeBoundaryA" type="number" step="0.01" /></label>
        <label><span>B등급 경계값</span><input v-model.number="model.policyConfig.equipment.gradeBoundaryB" type="number" step="0.01" /></label>
      </div>
    </div>

    <div class="policy-block">
      <h4>생산 점수 / 환경 / 자재 / 챌린지 정책</h4>
      <div class="form-grid form-grid--policy">
        <label><span>UPH 가중치</span><input v-model.number="model.policyConfig.score.uphWeight" type="number" step="0.01" /></label>
        <label><span>수율 가중치</span><input v-model.number="model.policyConfig.score.yieldWeight" type="number" step="0.01" /></label>
        <label><span>리드타임 가중치</span><input v-model.number="model.policyConfig.score.leadTimeWeight" type="number" step="0.01" /></label>
        <label><span>온도 편차 가중치</span><input v-model.number="model.policyConfig.environment.tempWeight" type="number" step="0.01" /></label>
        <label><span>습도 편차 가중치</span><input v-model.number="model.policyConfig.environment.humidityWeight" type="number" step="0.01" /></label>
        <label><span>입자 편차 가중치</span><input v-model.number="model.policyConfig.environment.particleWeight" type="number" step="0.01" /></label>
        <label><span>LOT 불량률 기준값</span><input v-model.number="model.policyConfig.material.lotDefectThreshold" type="number" step="0.01" /></label>
        <label><span>자재 영향 완화 계수</span><input v-model.number="model.policyConfig.material.shieldingRelief" type="number" step="0.01" /></label>
        <label><span>챌린지 보너스 배율</span><input v-model.number="model.policyConfig.challenge.bonusScale" type="number" step="1" /></label>
        <label><span>챌린지 보너스 상한</span><input v-model.number="model.policyConfig.challenge.bonusCap" type="number" step="1" /></label>
      </div>
    </div>

    <div class="policy-head policy-head--sub">
      <div>
        <h3>정성 평가 정책</h3>
        <p>코멘트 청크, 키워드 점수 상한, 문맥 가중치, 정규화 범위, 등급 기준을 설정합니다.</p>
      </div>
    </div>

    <div class="policy-block">
      <h4>키워드 / 문맥 / 정규화 정책</h4>
      <div class="form-grid form-grid--policy">
        <label><span>대조 청크 가중치</span><input v-model.number="model.policyConfig.qualitative.contrastiveChunkWeight" type="number" step="0.01" /></label>
        <label><span>키워드 합산 상한</span><input v-model.number="model.policyConfig.qualitative.keywordSumCap" type="number" step="0.01" /></label>
        <label><span>상세 문맥 가중치</span><input v-model.number="model.policyConfig.qualitative.contextDetailWeight" type="number" step="0.01" /></label>
        <label><span>수치 포함 문맥 가중치</span><input v-model.number="model.policyConfig.qualitative.contextDetailWithNumberWeight" type="number" step="0.01" /></label>
        <label><span>기본 그룹 평균</span><input v-model.number="model.policyConfig.qualitative.defaultGroupMean" type="number" step="0.01" /></label>
        <label><span>기본 그룹 표준편차</span><input v-model.number="model.policyConfig.qualitative.defaultGroupStd" type="number" step="0.01" /></label>
        <label><span>분모 보정값</span><input v-model.number="model.policyConfig.qualitative.epsilon" type="number" step="0.01" /></label>
        <label><span>보조 역량 반영 계수</span><input v-model.number="model.policyConfig.qualitative.secondaryAdjustmentFactor" type="number" step="0.01" /></label>
        <label><span>보조 역량 반영 상한</span><input v-model.number="model.policyConfig.qualitative.secondaryAdjustmentCap" type="number" step="0.01" /></label>
        <label><span>내부 원점수 최소값</span><input v-model.number="model.policyConfig.qualitative.internalRawMin" type="number" step="0.01" /></label>
        <label><span>내부 원점수 최대값</span><input v-model.number="model.policyConfig.qualitative.internalRawMax" type="number" step="0.01" /></label>
      </div>
    </div>

    <div class="policy-block">
      <h4>정성 평가 등급 기준</h4>
      <div class="form-grid form-grid--policy">
        <label><span>S등급 기준 점수</span><input v-model.number="model.policyConfig.qualitative.tierS" type="number" step="1" /></label>
        <label><span>A등급 기준 점수</span><input v-model.number="model.policyConfig.qualitative.tierA" type="number" step="1" /></label>
        <label><span>B등급 기준 점수</span><input v-model.number="model.policyConfig.qualitative.tierB" type="number" step="1" /></label>
      </div>
    </div>


    <div class="policy-head policy-head--sub">
      <div>
        <h3>AI 정책 검토</h3>
        <p>현재 정량/정성 정책값을 관리자 백엔드로 보내 Google AI가 한글로 위험 요소와 보완점을 검토합니다.</p>
      </div>
      <BaseButton variant="secondary" size="sm" :disabled="isReviewing" @click="emit('review')">
        {{ isReviewing ? '검토 중...' : 'AI 검토 요청' }}
      </BaseButton>
    </div>

    <div v-if="policyReview" class="review-box" :class="{ 'review-box--fallback': !policyReview.aiEnabled }">
      <div class="review-box__meta">
        <span>{{ policyReview.provider }}</span>
        <span>{{ policyReview.model }}</span>
      </div>
      <pre>{{ policyReview.review }}</pre>
    </div>
    <details class="preview-box">
      <summary>policy_config JSON 미리보기</summary>
      <pre>{{ policyPreview }}</pre>
    </details>

    <div class="actions">
      <BaseButton v-if="!isNew" variant="secondary" size="sm" @click="emit('delete')">삭제</BaseButton>
      <BaseButton
        variant="primary"
        size="sm"
        :disabled="isSaving || !model.versionNo?.trim() || !model.implementationKey?.trim()"
        @click="emit('save')"
      >
        {{ isSaving ? '저장 중...' : '정책 저장' }}
      </BaseButton>
    </div>
  </section>
</template>

<style scoped>
.section {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 20px;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.section-head,
.policy-head,
.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.policy-head {
  align-items: flex-end;
  border-top: 1px solid var(--color-border-default);
  padding-top: 16px;
}

.policy-head--sub {
  margin-top: 4px;
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-primary-300);
}

.section-title,
.policy-head h3,
.policy-block h4 {
  margin: 0;
  color: var(--color-primary-800);
  font-weight: 900;
}

.section-title {
  font-size: 18px;
}

.policy-head h3 {
  font-size: 14px;
}

.policy-head p,
.policy-note {
  margin: 4px 0 0;
  font-size: 11px;
  color: var(--color-primary-300);
}

.policy-note {
  margin: 0;
  line-height: 1.7;
}

.status-pill {
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--color-border-muted);
  color: var(--color-primary-300);
  font-size: 11px;
  font-weight: 900;
}

.status-pill--active {
  background: rgba(0, 191, 149, 0.12);
  color: var(--tier-s, #00bf95);
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid--meta {
  grid-template-columns: 1fr 1fr;
}

.form-grid--policy {
  grid-template-columns: repeat(3, minmax(160px, 1fr));
}

.form-grid__full {
  grid-column: 1 / -1;
}

.policy-block {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  background: var(--color-bg-app);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.policy-block h4 {
  font-size: 12px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  color: var(--color-primary-300);
}

input {
  height: 38px;
  padding: 0 12px;
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  background: var(--color-bg-surface);
  color: var(--color-primary-800);
  outline: none;
  font-size: 13px;
}

input:focus {
  border-color: var(--color-primary-600);
}

.toggle-row {
  flex-direction: row;
  align-items: center;
}

.toggle-row input {
  width: 16px;
  height: 16px;
}

.review-box,
.preview-box {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-2xs);
  background: var(--color-bg-app);
  padding: 12px;
}

.review-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.review-box--fallback {
  border-color: rgba(255, 176, 0, 0.45);
}

.review-box__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 900;
  color: var(--color-primary-300);
}

.review-box pre {
  white-space: pre-wrap;
  overflow-x: auto;
  margin: 0;
  font-family: var(--font-family-mono);
  font-size: 11px;
  line-height: 1.7;
  color: var(--color-primary-800);
}

.preview-box summary {
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  color: var(--color-primary-700);
}

.preview-box pre {
  overflow-x: auto;
  margin: 12px 0 0;
  font-family: var(--font-family-mono);
  font-size: 11px;
  color: var(--color-primary-800);
}

.actions {
  justify-content: flex-end;
}

@media (max-width: 1180px) {
  .form-grid--policy {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }
}
</style>