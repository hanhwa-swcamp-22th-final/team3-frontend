<script setup>
defineProps({
  selectedTarget: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="evaluation-form-panel">
    <header class="evaluation-form-panel__header">
      <div>
        <h2 class="evaluation-form-panel__title">{{ selectedTarget.voiceLabel }}</h2>
        <p class="evaluation-form-panel__description">
          {{ selectedTarget.voiceDescription }}
        </p>
      </div>
      <button type="button" class="evaluation-form-panel__voice-chip">음성 입력</button>
    </header>

    <div class="evaluation-form-panel__toolbar">
      <div class="evaluation-form-panel__toolbar-left">
        <button type="button" class="evaluation-form-panel__tool-button evaluation-form-panel__tool-button--active">
          음성 인식 시작
        </button>
        <button type="button" class="evaluation-form-panel__tool-button">파일 업로드</button>
        <button type="button" class="evaluation-form-panel__tool-button">텍스트 변환</button>
        <button type="button" class="evaluation-form-panel__tool-button">다시 듣기</button>
      </div>
      <button type="button" class="evaluation-form-panel__guide-button">작성 가이드</button>
    </div>

    <div class="evaluation-form-panel__notice">
      음성 인식 결과가 누락되거나 문장이 비문으로 바뀔 수 있습니다.
      변환 결과는 초안으로만 사용하고 아래 패널에서 최종 평가 문장을 직접 수정하세요.
    </div>

    <textarea class="evaluation-form-panel__editor" :value="selectedTarget.convertedText"></textarea>

    <div class="evaluation-form-panel__recording-zone">
      <div class="evaluation-form-panel__recording-ring">
        <div class="evaluation-form-panel__recording-icon">🎤</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.evaluation-form-panel {
  padding: 22px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
}

.evaluation-form-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
}

.evaluation-form-panel__title {
  font-size: 26px;
  color: var(--color-primary-800);
}

.evaluation-form-panel__description {
  margin-top: 8px;
  font-size: 14px;
  color: var(--color-text-muted);
}

.evaluation-form-panel__voice-chip {
  height: 34px;
  padding: 0 14px;
  border: none;
  border-radius: 999px;
  background: rgba(174, 236, 227, 0.6);
  color: #10937f;
  font-weight: 700;
  cursor: pointer;
}

.evaluation-form-panel__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border-soft);
}

.evaluation-form-panel__toolbar-left {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.evaluation-form-panel__tool-button,
.evaluation-form-panel__guide-button {
  height: 38px;
  padding: 0 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  background: var(--color-bg-surface);
  color: var(--color-primary-600);
  font-weight: 700;
  cursor: pointer;
}

.evaluation-form-panel__tool-button--active {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.evaluation-form-panel__guide-button {
  background: linear-gradient(180deg, #f0edff 0%, #d9d1ff 100%);
}

.evaluation-form-panel__notice {
  margin-top: 14px;
  padding: 14px 16px;
  border: 1px solid #ffdca6;
  border-radius: 14px;
  background: #fff5df;
  font-size: 13px;
  line-height: 1.6;
  color: #946200;
}

.evaluation-form-panel__editor {
  width: 100%;
  min-height: 250px;
  margin-top: 14px;
  padding: 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  resize: vertical;
  font: inherit;
  line-height: 1.8;
  color: var(--color-primary-800);
  box-sizing: border-box;
}

.evaluation-form-panel__recording-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 132px;
  margin-top: 14px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(174, 236, 227, 0.5) 0%, rgba(232, 251, 247, 0.85) 100%);
}

.evaluation-form-panel__recording-ring {
  width: 106px;
  height: 106px;
  border-radius: 50%;
  border: 4px solid rgba(16, 147, 127, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}

.evaluation-form-panel__recording-icon {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #08c8a7;
  font-size: 34px;
}

@media (max-width: 720px) {
  .evaluation-form-panel__header,
  .evaluation-form-panel__toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
