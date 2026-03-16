<script setup>
defineProps({
  notice: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <aside class="notice-detail" v-if="notice">
    <div class="notice-detail__badges">
      <span class="notice-detail__badge notice-detail__badge--pin" v-if="notice.pin">중요</span>
      <span class="notice-detail__badge notice-detail__badge--live">{{ notice.status }}</span>
    </div>

    <h2 class="notice-detail__title">{{ notice.title }}</h2>
    <p class="notice-detail__body">{{ notice.summary }}</p>

    <div class="notice-detail__bottom">
      <div class="notice-detail__meta">
        <span>{{ notice.author }}</span>
        <span>{{ notice.schedule }}</span>
        <span>{{ notice.target }}</span>
      </div>

      <div class="notice-detail__attachment">
        <div>
          <strong>첨부파일</strong>
          <p>{{ notice.attachmentLabel }}</p>
        </div>
        <button type="button">다운로드</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.notice-detail {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 100%;
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
}

.notice-detail__badges {
  display: flex;
  gap: 8px;
}

.notice-detail__badge {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.notice-detail__badge--pin {
  background: #f1efff;
  color: #7569e0;
}

.notice-detail__badge--live {
  background: #e9fbf6;
  color: #18a98e;
}

.notice-detail__title {
  font-size: 28px;
  color: var(--color-primary-800);
  line-height: 1.4;
}

.notice-detail__body {
  color: var(--color-primary-300);
  line-height: 1.8;
  min-height: 240px;
}

.notice-detail__bottom {
  margin-top: auto;
  display: grid;
  gap: 16px;
}

.notice-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #9a93ca;
  font-size: 13px;
  font-weight: 700;
}

.notice-detail__attachment {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid #e6e0ff;
  border-radius: 16px;
  background: #fff;
}

.notice-detail__attachment strong {
  color: var(--color-primary-800);
}

.notice-detail__attachment p {
  margin-top: 4px;
  color: var(--color-primary-300);
}

.notice-detail__attachment button {
  height: 40px;
  padding: 0 16px;
  border: 1px solid #d8d1ff;
  border-radius: 12px;
  background: #fff;
  color: var(--color-primary-600);
  font-weight: 700;
  cursor: pointer;
}
</style>
