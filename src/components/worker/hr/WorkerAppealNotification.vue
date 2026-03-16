<template>
  <div class="an">
    <span class="an__icon">📋</span>
    <span class="an__text">평가 결과에 이의가 있으신가요? 근거 자료와 함께 이의 신청을 제출하면 HR 담당자가 검토합니다.</span>
  </div>
</template>

<style scoped>
.an {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-left: 4px solid var(--color-primary-700);
  border-radius: 12px;
  padding: 18px 24px;
}

.an__icon {
  font-size: 16px;
  flex-shrink: 0;
}

.an__text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-default);
  line-height: 1.6;
}
</style>
