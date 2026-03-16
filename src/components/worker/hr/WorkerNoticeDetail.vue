<script setup>
const props = defineProps({
  notice: { type: Object, required: true },
})
</script>

<template>
  <div class="nd">
    <!-- Badges -->
    <div class="nd__badges">
      <span v-if="notice.category === '긴급'" class="nd__badge nd__badge--urgent">중요</span>
      <span class="nd__badge" :class="'nd__badge--' + notice.status">
        {{ notice.statusLabel }}
      </span>
    </div>

    <!-- Title -->
    <h2 class="nd__title">{{ notice.title }}</h2>

    <!-- Content -->
    <div class="nd__content">
      <p>{{ notice.content }}</p>
    </div>

    <!-- Attachments -->
    <div v-if="notice.attachments && notice.attachments.length" class="nd__attach">
      <h4 class="nd__attach-title">첨부파일</h4>
      <div class="nd__attach-list">
        <div class="nd__attach-files">
          <span v-for="(file, i) in notice.attachments" :key="i" class="nd__attach-file">
            {{ file }}
          </span>
        </div>
        <button class="nd__attach-download">다운로드</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nd {
  background: #ffffff;
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nd__badges {
  display: flex;
  gap: 6px;
}

.nd__badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
}

.nd__badge--urgent {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.nd__badge--active {
  background: #dcfce7;
  color: #166534;
}

.nd__badge--scheduled {
  background: #fef3c7;
  color: #92400e;
}

.nd__title {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text-strong);
  line-height: 1.5;
  margin: 0;
}

.nd__content {
  font-size: 14px;
  color: var(--color-text-default);
  line-height: 1.8;
}

.nd__content p {
  margin: 0;
}

/* ── Attachments ────────────────────────────────────────── */
.nd__attach {
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 16px 20px;
  margin-top: 8px;
}

.nd__attach-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0 0 10px;
}

.nd__attach-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.nd__attach-files {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nd__attach-file {
  font-size: 13px;
  color: var(--color-text-default);
}

.nd__attach-download {
  padding: 8px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-default);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.nd__attach-download:hover {
  border-color: var(--color-primary-300);
  color: var(--color-primary-700);
}
</style>
