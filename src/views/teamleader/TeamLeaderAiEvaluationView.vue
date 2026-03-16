<script setup>
import TeamLeaderAiEvaluationTargetList from '@/components/teamleader/hr/TeamLeaderAiEvaluationTargetList.vue'
import TeamLeaderAiEvaluationPanel from '@/components/teamleader/hr/TeamLeaderAiEvaluationPanel.vue'
import TeamLeaderAiEvaluationActionBar from '@/components/teamleader/hr/TeamLeaderAiEvaluationActionBar.vue'

const searchPlaceholder = '팀원 검색...'

const targets = [
  { id: 1, name: '손창우', code: 'MCH-01', tier: 'S', scoreHint: 'Overall 91', avatar: '손', avatarTone: 'purple' },
  { id: 2, name: '김신우', code: 'MCH-02', tier: 'A', scoreHint: '84', avatar: '김', avatarTone: 'purple' },
  { id: 3, name: '황자현', code: 'PRS-01', tier: 'A', scoreHint: '81', avatar: '황', avatarTone: 'green' },
  { id: 4, name: '임원석', code: 'WLD-01', tier: 'B', scoreHint: '74', avatar: '임', avatarTone: 'gold' },
]

const selectedTarget = {
  voiceLabel: '음성 인식 및 텍스트 변환',
  voiceDescription: '면담 음성 또는 메모를 텍스트 초안으로 변환하는 상단 입력 영역',
  convertedText:
    '[음성 인식 텍스트 변환 결과] 김철우 사원은 3월 2주차 설비 이상 상황에서 센서 점검 문제를 먼저 식별했습니다. 이후 장비 담당자와 협업하여 18분 내 재가동을 완료했고, 이후 재발 방지 체크리스트를 정리했습니다. 일부 단어는 음성 품질 저하로 누락되었을 수 있어 아래 수정 패널에서 최종 문장으로 보완이 필요합니다.',
}
</script>

<template>
  <section class="teamleader-ai-evaluation-view">
    <section class="teamleader-ai-evaluation-view__content">
      <TeamLeaderAiEvaluationTargetList
        :targets="targets"
        selected-id="1"
        :search-placeholder="searchPlaceholder"
      />

      <div class="teamleader-ai-evaluation-view__form">
        <TeamLeaderAiEvaluationPanel :selected-target="selectedTarget" />
        <TeamLeaderAiEvaluationActionBar />
      </div>
    </section>
  </section>
</template>

<style scoped>
.teamleader-ai-evaluation-view {
  width: 100%;
  min-width: 0;
  padding: 12px 10px;
  background: var(--color-bg-app);
  box-sizing: border-box;
}

.teamleader-ai-evaluation-view__content {
  display: grid;
  grid-template-columns: minmax(270px, 0.72fr) minmax(0, 1.6fr);
  gap: 18px;
  align-items: start;
}

.teamleader-ai-evaluation-view__form {
  display: grid;
  gap: 14px;
}

@media (max-width: 1120px) {
  .teamleader-ai-evaluation-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-ai-evaluation-view {
    padding: 12px;
  }
}
</style>
