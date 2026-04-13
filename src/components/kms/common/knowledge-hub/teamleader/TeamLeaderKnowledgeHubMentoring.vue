<script setup>
defineProps({
  mentoring: {
    type: Object,
    default: () => ({ ongoing: [], pending: [] }),
  },
  ongoingCaption: {
    type: String,
    default: '진행 중인 매칭',
  },
  ongoingActionLabel: {
    type: String,
    default: '',
  },
  pendingCaption: {
    type: String,
    default: '검토 요청',
  },
  pendingActionLabel: {
    type: String,
    default: '확인',
  },
  requestButtonVisible: {
    type: Boolean,
    default: true,
  },
  requestButtonLabel: {
    type: String,
    default: '멘토링 요청 등록 +',
  },
})

const emit = defineEmits(['review-request', 'open-request', 'action-ongoing'])
</script>

<template>
  <section class="mentoring">
    <div class="mentoring__head">
      <p class="mentoring__eyebrow">협업 현황</p>
    </div>

    <div class="mentoring__section">
      <span class="mentoring__caption">{{ ongoingCaption }}</span>
      <div class="mentoring__ongoing-list">
        <article v-for="item in mentoring.ongoing" :key="item.id" class="mentoring__ongoing-row">
          <div>
            <strong>{{ item.mentor }}</strong>
            <p>{{ item.mentee }} · {{ item.field }}</p>
          </div>
          <div class="mentoring__ongoing-actions">
            <span class="mentoring__status">{{ item.status }}</span>
            <button
              v-if="item.actionLabel || ongoingActionLabel"
              type="button"
              class="mentoring__action-button mentoring__action-button--secondary"
              @click="emit('action-ongoing', item)"
            >
              {{ item.actionLabel ?? ongoingActionLabel }}
            </button>
          </div>
        </article>
      </div>
    </div>

    <div class="mentoring__section">
      <span class="mentoring__caption">{{ pendingCaption }}</span>
      <div class="mentoring__pending-list">
        <article v-for="item in mentoring.pending" :key="item.id" class="mentoring__pending-row">
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.requester }} · {{ item.summary }}</p>
          </div>
          <button type="button" class="mentoring__action-button" @click="emit('review-request', item)">
            {{ item.actionLabel ?? pendingActionLabel }}
          </button>
        </article>
      </div>
    </div>

    <button v-if="requestButtonVisible" type="button" class="mentoring__request-button" @click="emit('open-request')">
      {{ requestButtonLabel }}
    </button>
  </section>
</template>

<style scoped>
.mentoring {
  height: 100%;
  min-height: 0;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
  padding: 20px;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: 14px;
  overflow: hidden;
  box-sizing: border-box;
}

.mentoring__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.mentoring__head h3 {
  margin-top: 6px;
  font-size: 20px;
  color: var(--color-primary-800);
}

.mentoring__section {
  display: grid;
  gap: 10px;
  min-height: 0;
}

.mentoring__caption {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.mentoring__ongoing-list,
.mentoring__pending-list {
  display: grid;
  gap: 10px;
  align-content: start;
}

.mentoring__pending-list {
  min-height: 0;
  max-height: 78px;
  overflow-y: auto;
  padding-right: 4px;
}

.mentoring__ongoing-list {
  max-height: 78px;
  overflow-y: auto;
  padding-right: 4px;
}

.mentoring__ongoing-row,
.mentoring__pending-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 14px;
  padding: 14px 16px;
}

.mentoring__ongoing-row {
  border: 1px solid var(--color-border-default);
}

.mentoring__pending-row {
  background: #fff8e9;
  border: 1px solid #f4d27f;
}

.mentoring strong {
  color: var(--color-primary-800);
}

.mentoring p {
  margin-top: 3px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.mentoring__status {
  padding: 4px 10px;
  border-radius: 999px;
  background: #e7faf5;
  color: #10937f;
  font-size: 11px;
  font-weight: 800;
}

.mentoring__ongoing-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mentoring__action-button,
.mentoring__request-button {
  border: none;
  background: var(--color-primary-700);
  color: #fff;
  cursor: pointer;
}

.mentoring__action-button {
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}

.mentoring__action-button--secondary {
  background: #ffffff;
  color: var(--color-primary-700);
  border: 1px solid var(--color-primary-200);
}

.mentoring__request-button {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
}
</style>
