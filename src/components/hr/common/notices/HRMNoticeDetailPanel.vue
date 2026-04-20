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
  <aside v-if="notice" class="hrm-detail hrm-detail--filled">
    <div class="hrm-detail__hero">
      <div class="hrm-detail__hero-copy">
        <div class="hrm-detail__hero-topline">
          <div class="hrm-detail__badges">
            <span v-if="notice.isImportant" class="hrm-detail__badge hrm-detail__badge--pin">중요</span>
            <span
              class="hrm-detail__badge"
              :class="statusClass(notice.status)"
            >{{ notice.status }}</span>
          </div>
          <div class="hrm-detail__hero-meta">
            <strong class="hrm-detail__hero-value">{{ notice.date ?? '미게시' }}</strong>
          </div>
        </div>
        <h2 class="hrm-detail__title">{{ notice.title }}</h2>
      </div>
    </div>

    <section class="hrm-detail__section hrm-detail__section--body">
      <p class="hrm-detail__body">{{ notice.content }}</p>
    </section>

    <section v-if="notice.attachment" class="hrm-detail__section hrm-detail__attachment">
      <div class="hrm-detail__attachment-row">
        <span class="hrm-detail__attachment-file">{{ notice.attachment }}</span>
        <button type="button" class="hrm-detail__attachment-download">다운로드</button>
      </div>
    </section>

    <div v-if="!readonly" class="hrm-detail__actions">
      <button class="hrm-detail__edit-btn" @click="emit('edit', notice)">수정</button>
      <button class="hrm-detail__delete-btn" @click="emit('delete', notice.id)">삭제</button>
    </div>
  </aside>
  <aside v-else class="hrm-detail hrm-detail--empty">
    <p class="hrm-detail--empty__eyebrow">공지 상세</p>
    <strong class="hrm-detail--empty__title">선택된 공지사항이 없습니다</strong>
    <p class="hrm-detail--empty__body">왼쪽 목록에서 공지사항을 선택하면 상세 내용을 확인할 수 있습니다.</p>
  </aside>
</template>

<style scoped>
.hrm-detail {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  min-height: 0;
}

.hrm-detail--filled {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto auto;
  gap: 16px;
}

.hrm-detail__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 12px 14px 16px;
  border: 1px solid #ece8ff;
  border-radius: 18px;
  background: #fff;
  flex-shrink: 0;
}

.hrm-detail__hero-copy {
  display: grid;
  gap: 6px;
  min-width: 0;
  width: 100%;
  overflow: hidden;
}

.hrm-detail__hero-topline {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
  width: 100%;
}

.hrm-detail__hero-meta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 108px;
  padding: 8px 12px;
  border-radius: 12px;
  background: #f5f2ff;
  text-align: center;
  margin-left: auto;
}

.hrm-detail__hero-value {
  color: var(--color-primary-800);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.hrm-detail__badges { display: flex; gap: 6px; }

.hrm-detail__badge {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  padding: 4px 12px;
  border-radius: 20px;
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
  min-width: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-800);
  line-height: 1.3;
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.hrm-detail__section {
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid #f0ebff;
  border-radius: 18px;
  background: #fff;
  min-width: 0;
  overflow: hidden;
  flex-shrink: 0;
}

.hrm-detail__section--body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.hrm-detail__body {
  display: block;
  flex: 1;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  font-size: var(--font-size-base-plus);
  color: var(--color-text-default);
  line-height: 1.9;
  white-space: pre-wrap;
  margin: 0;
  overflow-y: auto;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.hrm-detail__attachment {
  background: #fcfbff;
}

.hrm-detail__attachment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.hrm-detail__attachment-file {
  min-width: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-default);
  overflow-wrap: anywhere;
  word-break: break-word;
}

.hrm-detail__attachment-download {
  padding: 9px 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
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

.hrm-detail__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.hrm-detail__edit-btn {
  height: 38px; padding: 0 18px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
  font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);
  color: var(--color-primary-600); cursor: pointer;
}
.hrm-detail__edit-btn:hover { border-color: var(--color-primary-300); }

.hrm-detail__delete-btn {
  height: 38px; padding: 0 18px;
  background: var(--color-danger-soft);
  border: 1px solid var(--color-danger);
  border-radius: 10px;
  font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);
  color: var(--color-danger); cursor: pointer;
}

.hrm-detail--empty {
  align-items: flex-start;
  justify-content: center;
}

.hrm-detail--empty__eyebrow {
  margin: 0;
  color: var(--color-primary-500);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
}

.hrm-detail--empty__title {
  color: var(--color-primary-800);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

.hrm-detail--empty__body {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  line-height: 1.7;
}

@media (max-width: 820px) {
  .hrm-detail {
    padding: 16px;
  }

  .hrm-detail__hero {
    flex-direction: column;
  }

  .hrm-detail__hero-meta {
    margin-left: 0;
  }

  .hrm-detail__attachment-row,
  .hrm-detail__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
