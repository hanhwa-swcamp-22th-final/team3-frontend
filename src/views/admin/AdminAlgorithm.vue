<script setup>
import { ref } from 'vue'
import AlgorithmEquipmentList from '@/components/admin/scm/AlgorithmEquipmentList.vue'
import AlgorithmDetailPanel   from '@/components/admin/scm/AlgorithmDetailPanel.vue'

// ── 더미 데이터 ──────────────────────────────────────
const DUMMY_EQUIPMENTS = [
  { id: 1, code: 'MCH-01', name: '5축 머시닝센터',  availability: 97.2, quality_rate: 98.1, performance_rate: 96.4, e_idx_threshold: 0.80, params: { base_production: 120, base_speed_factor: 1.00, min_correction: 0.70, max_correction: 1.20, update_cycle: '실시간', anomaly_threshold: 15 } },
  { id: 2, code: 'MCH-02', name: '3축 머시닝센터',  availability: 99.0, quality_rate: 97.5, performance_rate: 99.5, e_idx_threshold: 0.80, params: { base_production: 100, base_speed_factor: 1.00, min_correction: 0.70, max_correction: 1.20, update_cycle: '실시간', anomaly_threshold: 15 } },
  { id: 3, code: 'WLD-01', name: '자동용접기',       availability: 85.0, quality_rate: 82.0, performance_rate: 99.0, e_idx_threshold: 0.80, params: { base_production:  80, base_speed_factor: 0.95, min_correction: 0.60, max_correction: 1.10, update_cycle: '1시간',  anomaly_threshold: 20 } },
  { id: 4, code: 'PRS-01', name: '유압프레스',       availability: 94.0, quality_rate: 93.0, performance_rate: 99.5, e_idx_threshold: 0.80, params: { base_production: 150, base_speed_factor: 1.00, min_correction: 0.70, max_correction: 1.20, update_cycle: '실시간', anomaly_threshold: 15 } },
  { id: 5, code: 'INS-01', name: '3D 검사기',        availability: 99.5, quality_rate: 99.8, performance_rate: 99.7, e_idx_threshold: 0.80, params: { base_production: 200, base_speed_factor: 1.00, min_correction: 0.80, max_correction: 1.20, update_cycle: '실시간', anomaly_threshold: 10 } },
  { id: 6, code: 'CNV-01', name: '컨베이어',         availability: 97.0, quality_rate: 96.0, performance_rate: 99.0, e_idx_threshold: 0.80, params: { base_production: 500, base_speed_factor: 1.00, min_correction: 0.70, max_correction: 1.20, update_cycle: '실시간', anomaly_threshold: 15 } },
]

// ── State ──────────────────────────────────────────
const equipments        = ref(DUMMY_EQUIPMENTS)
const selectedEquipment = ref({ ...DUMMY_EQUIPMENTS[0] })
const isDirty           = ref(false)
const globalThreshold   = ref(0.80)

// ── 핸들러 ───────────────────────────────────────────
const onSelectEquipment = (eq)  => { selectedEquipment.value = { ...eq }; isDirty.value = false }
const onThresholdChange = (val) => { globalThreshold.value = val; isDirty.value = true }
const onSave            = ()    => {
  const idx = equipments.value.findIndex(e => e.id === selectedEquipment.value.id)
  if (idx !== -1) equipments.value[idx] = { ...selectedEquipment.value }
  isDirty.value = false
}
</script>

<template>
  <div class="admin-algorithm">

    <!-- 탭바 + 액션 버튼 -->
    <div class="tab-bar">
      <div class="tab-bar__tabs">
        <div class="tab-bar__tab tab-bar__tab--active">설비 보정(E_idx)</div>
      </div>
      <div class="tab-bar__actions">
        <span v-if="isDirty" class="badge-editing">수정 중</span>
        <button class="btn-outline">시뮬레이션</button>
        <button class="btn-primary" @click="onSave">저장 적용</button>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="content">
      <AlgorithmEquipmentList
        :equipments="equipments"
        :selectedId="selectedEquipment?.id"
        :globalThreshold="globalThreshold"
        :isLoading="isLoading"
        @select="onSelectEquipment"
        @thresholdChange="onThresholdChange"
      />

      <AlgorithmDetailPanel
        :equipment="selectedEquipment"
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

/* 탭바 */
.tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1.5px solid var(--color-border-default);
  flex-shrink: 0;
}

.tab-bar__tabs {
  display: flex;
}

.tab-bar__tab {
  padding: 8px 20px 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-primary-300);
  border-bottom: 2px solid transparent;
  margin-bottom: -1.5px;
  cursor: pointer;
}

.tab-bar__tab--active {
  color: var(--color-primary-600);
  border-bottom-color: var(--color-primary-600);
}

.tab-bar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
}

.badge-editing {
  padding: 6px 12px;
  background: var(--color-warning-soft);
  border: 1.5px solid #FFD166;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-warning);
}

.btn-outline {
  height: 34px;
  padding: 0 19px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-primary-600);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-600);
  cursor: pointer;
}

.btn-primary {
  height: 34px;
  padding: 0 19px;
  background: var(--color-primary-600);
  border: 1.5px solid var(--color-primary-500);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #FFFFFF;
  cursor: pointer;
}

/* 메인 컨텐츠 */
.content {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}
</style>
