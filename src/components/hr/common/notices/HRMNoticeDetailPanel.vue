<script setup>
defineProps({
  notice:   { type: Object,  default: null },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits(['edit', 'delete'])

function statusClass(status) {
  return {
    게시중: 'hrm-detail__badge--published',
    중요: 'hrm-detail__badge--important',
    예약: 'hrm-detail__badge--scheduled',
    임시: 'hrm-detail__badge--draft',
  }[status] ?? ''
}
</script>

<template>
  <aside v-if="notice" class="hrm-detail">
    <div class="hrm-detail__badges">
      <span v-if="notice.isImportant" class="hrm-detail__badge hrm-detail__badge--pin">중요</span>
      <span
        class="hrm-detail__badge"
        :class="statusClass(notice.status)"
      >{{ notice.status }}</span>
    </div>

    <h2 class="hrm-detail__title">{{ notice.title }}</h2>
    <p class="hrm-detail__body">{{ notice.content }}</p>

    <div class="hrm-detail__bottom">
      <div class="hrm-detail__meta">
        <span>{{ notice.date ?? '미게시' }}</span>
      </div>

      <div v-if="notice.attachment" class="hrm-detail__attachment">
        <h4 class="hrm-detail__attachment-title">첨부파일</h4>
        <div class="hrm-detail__attachment-row">
          <span class="hrm-detail__attachment-file">{{ notice.attachment }}</span>
          <button type="button" class="hrm-detail__attachment-download">다운로드</button>
        </div>
      </div>

      <div v-if="!readonly" class="hrm-detail__actions">
        <button class="hrm-detail__edit-btn" @click="emit('edit', notice)">수정</button>
        <button class="hrm-detail__delete-btn" @click="emit('delete', notice.id)">삭제</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.hrm-detail {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;
}

.hrm-detail__badges { display: flex; gap: 6px; }

.hrm-detail__badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  padding: 3px 10px;
  border-radius: 4px;
}
.hrm-detail__badge--published {
  background: #e3fbef;
  color: #007a60;
}
.hrm-detail__badge--important {
  background: var(--color-primary-100);
  color: var(--color-primary-600);
}
.hrm-detail__badge--scheduled {
  background: #fff8e1;
  color: #b45309;
}
.hrm-detail__badge--draft {
  background: #ffecf1;
  color: #c0103e;
}

.hrm-detail__badge--pin {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.hrm-detail__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-text-strong);
  line-height: 1.5;
  margin: 0;
}

.hrm-detail__body {
  font-size: var(--font-size-base);
  color: var(--color-text-default);
  line-height: 1.8;
  white-space: pre-wrap;
}

.hrm-detail__body p { margin: 0; }

.hrm-detail__bottom { display: grid; gap: 14px; margin-top: 8px; }

.hrm-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

.hrm-detail__attachment {
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-base);
  padding: 16px 20px;
}

.hrm-detail__attachment-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-strong);
  margin: 0 0 10px;
}

.hrm-detail__attachment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.hrm-detail__attachment-file {
  font-size: var(--font-size-sm);
  color: var(--color-text-default);
}

.hrm-detail__attachment-download {
  padding: 8px 18px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  background: var(--color-bg-surface);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-default);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
}

.hrm-detail__attachment-download:hover {
  border-color: var(--color-primary-300);
  color: var(--color-primary-700);
}

.hrm-detail__actions { display: flex; justify-content: flex-end; gap: 8px; }

.hrm-detail__edit-btn {
  height: 32px; padding: 0 16px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  color: var(--color-primary-600); cursor: pointer;
}
.hrm-detail__edit-btn:hover { border-color: var(--color-primary-300); }

.hrm-detail__delete-btn {
  height: 32px; padding: 0 16px;
  background: var(--color-danger-soft);
  border: 1.5px solid var(--color-danger);
  border-radius: var(--radius-xs);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  color: var(--color-danger); cursor: pointer;
}
</style>
