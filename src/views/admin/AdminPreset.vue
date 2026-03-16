<script setup>
import { ref } from 'vue'
import PresetList        from '@/components/admin/scm/PresetList.vue'
import PresetDetailPanel from '@/components/admin/scm/PresetDetailPanel.vue'

// ── 더미 데이터 ──────────────────────────────────────
const DUMMY_PRESETS = [
  {
    id: 1,
    icon: '⚙️',
    name: '정밀 기계',
    desc: '항공·자동차·반도체 부품 정밀 가공',
    complexity: [
      { stage: 'D1', label: '1단계(D1)', processes: '5단계 이하',  tolerance: '±0.5mm',       weight: 1.0 },
      { stage: 'D2', label: '2단계(D2)', processes: '6~10단계',    tolerance: '±0.1mm',       weight: 1.3 },
      { stage: 'D3', label: '3단계(D3)', processes: '11~15단계',   tolerance: '±0.05mm',      weight: 1.7 },
      { stage: 'D4', label: '4단계(D4)', processes: '16~20단계',   tolerance: '±0.02mm',      weight: 2.2 },
      { stage: 'D5', label: '5단계(D5)', processes: '20단계 초과', tolerance: '±0.01mm 이하', weight: 3.0 },
    ],
    weights: [
      { name: '생산량 달성률', value: 0.40 },
      { name: '품질 합격률',  value: 0.25 },
      { name: '설비 가동률',  value: 0.20 },
      { name: '납기 준수율',  value: 0.10 },
      { name: '안전 준수',    value: 0.05 },
    ],
    tierThresholds: [
      { tier: 'S', score: 95, desc: '최상위 전문가 · 멘토 자격' },
      { tier: 'A', score: 85, desc: '숙련 엔지니어' },
      { tier: 'B', score: 70, desc: '일반 작업자' },
      { tier: 'C', score: 0,  desc: '기초 역량 개발 단계' },
    ],
  },
  {
    id: 2,
    icon: '🔌',
    name: '전자 제품 조립',
    desc: 'SMT·PCB 조립·검사',
    complexity: [
      { stage: 'D1', label: '1단계(D1)', processes: '3단계 이하',  tolerance: '±1.0mm',       weight: 1.0 },
      { stage: 'D2', label: '2단계(D2)', processes: '4~8단계',     tolerance: '±0.5mm',       weight: 1.2 },
      { stage: 'D3', label: '3단계(D3)', processes: '9~12단계',    tolerance: '±0.2mm',       weight: 1.5 },
      { stage: 'D4', label: '4단계(D4)', processes: '13~18단계',   tolerance: '±0.1mm',       weight: 2.0 },
      { stage: 'D5', label: '5단계(D5)', processes: '18단계 초과', tolerance: '±0.05mm 이하', weight: 2.8 },
    ],
    weights: [
      { name: '생산량 달성률', value: 0.35 },
      { name: '품질 합격률',  value: 0.30 },
      { name: '설비 가동률',  value: 0.20 },
      { name: '납기 준수율',  value: 0.10 },
      { name: '안전 준수',    value: 0.05 },
    ],
    tierThresholds: [
      { tier: 'S', score: 95, desc: '최상위 전문가 · 멘토 자격' },
      { tier: 'A', score: 85, desc: '숙련 엔지니어' },
      { tier: 'B', score: 70, desc: '일반 작업자' },
      { tier: 'C', score: 0,  desc: '기초 역량 개발 단계' },
    ],
  },
  {
    id: 3,
    icon: '🏗',
    name: '장치 산업/화학',
    desc: '화학·정유·제약 공정',
    complexity: [
      { stage: 'D1', label: '1단계(D1)', processes: '3단계 이하',  tolerance: '±2.0mm',      weight: 1.0 },
      { stage: 'D2', label: '2단계(D2)', processes: '4~7단계',     tolerance: '±1.0mm',      weight: 1.2 },
      { stage: 'D3', label: '3단계(D3)', processes: '8~12단계',    tolerance: '±0.5mm',      weight: 1.5 },
      { stage: 'D4', label: '4단계(D4)', processes: '13~17단계',   tolerance: '±0.2mm',      weight: 1.9 },
      { stage: 'D5', label: '5단계(D5)', processes: '17단계 초과', tolerance: '±0.1mm 이하', weight: 2.5 },
    ],
    weights: [
      { name: '생산량 달성률', value: 0.30 },
      { name: '품질 합격률',  value: 0.25 },
      { name: '설비 가동률',  value: 0.25 },
      { name: '납기 준수율',  value: 0.10 },
      { name: '안전 준수',    value: 0.10 },
    ],
    tierThresholds: [
      { tier: 'S', score: 95, desc: '최상위 전문가 · 멘토 자격' },
      { tier: 'A', score: 85, desc: '숙련 엔지니어' },
      { tier: 'B', score: 70, desc: '일반 작업자' },
      { tier: 'C', score: 0,  desc: '기초 역량 개발 단계' },
    ],
  },
  {
    id: 4,
    icon: '🔧',
    name: '일반 기계 제조',
    desc: '범용 부품·설비 제작',
    complexity: [
      { stage: 'D1', label: '1단계(D1)', processes: '4단계 이하',  tolerance: '±1.5mm',       weight: 1.0 },
      { stage: 'D2', label: '2단계(D2)', processes: '5~9단계',     tolerance: '±0.8mm',       weight: 1.2 },
      { stage: 'D3', label: '3단계(D3)', processes: '10~14단계',   tolerance: '±0.3mm',       weight: 1.6 },
      { stage: 'D4', label: '4단계(D4)', processes: '15~19단계',   tolerance: '±0.1mm',       weight: 2.0 },
      { stage: 'D5', label: '5단계(D5)', processes: '19단계 초과', tolerance: '±0.05mm 이하', weight: 2.7 },
    ],
    weights: [
      { name: '생산량 달성률', value: 0.40 },
      { name: '품질 합격률',  value: 0.20 },
      { name: '설비 가동률',  value: 0.25 },
      { name: '납기 준수율',  value: 0.10 },
      { name: '안전 준수',    value: 0.05 },
    ],
    tierThresholds: [
      { tier: 'S', score: 95, desc: '최상위 전문가 · 멘토 자격' },
      { tier: 'A', score: 85, desc: '숙련 엔지니어' },
      { tier: 'B', score: 70, desc: '일반 작업자' },
      { tier: 'C', score: 0,  desc: '기초 역량 개발 단계' },
    ],
  },
  {
    id: 5,
    icon: '➕',
    name: '커스텀 프리셋 생성',
    desc: '직접 파라미터 입력',
    complexity: [
      { stage: 'D1', label: '1단계(D1)', processes: '-', tolerance: '-', weight: 1.0 },
      { stage: 'D2', label: '2단계(D2)', processes: '-', tolerance: '-', weight: 1.0 },
      { stage: 'D3', label: '3단계(D3)', processes: '-', tolerance: '-', weight: 1.0 },
      { stage: 'D4', label: '4단계(D4)', processes: '-', tolerance: '-', weight: 1.0 },
      { stage: 'D5', label: '5단계(D5)', processes: '-', tolerance: '-', weight: 1.0 },
    ],
    weights: [
      { name: '생산량 달성률', value: 0.20 },
      { name: '품질 합격률',  value: 0.20 },
      { name: '설비 가동률',  value: 0.20 },
      { name: '납기 준수율',  value: 0.20 },
      { name: '안전 준수',    value: 0.20 },
    ],
    tierThresholds: [
      { tier: 'S', score: 95, desc: '최상위 전문가 · 멘토 자격' },
      { tier: 'A', score: 85, desc: '숙련 엔지니어' },
      { tier: 'B', score: 70, desc: '일반 작업자' },
      { tier: 'C', score: 0,  desc: '기초 역량 개발 단계' },
    ],
  },
]

// ── State ──────────────────────────────────────────
const presets        = ref(DUMMY_PRESETS)
const selectedPreset = ref({ ...DUMMY_PRESETS[0] })
const activePresetId = ref(1)

// ── 핸들러 ───────────────────────────────────────────
const onSelectPreset = (preset) => { selectedPreset.value = { ...preset } }
const onSave         = (id)     => { activePresetId.value = id }
</script>

<template>
  <div class="admin-preset">
    <PresetList
      :presets="presets"
      :selectedId="selectedPreset?.id"
      :activeId="activePresetId"
      @select="onSelectPreset"
    />
    <PresetDetailPanel
      :preset="selectedPreset"
      :activeId="activePresetId"
      @save="onSave"
    />
  </div>
</template>

<style scoped>
.admin-preset {
  display: flex;
  gap: 16px;
  padding: 24px;
  flex: 1;
  min-width: 0;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  overflow: hidden;
}
</style>
