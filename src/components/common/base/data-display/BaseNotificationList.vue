<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  selectedItemId: {
    type: Number,
    default: null,
  },
  pageSize: {
    type: Number,
    default: 4,
  },
  emptyMessage: {
    type: String,
    default: '표시할 알림이 없습니다.',
  },
})

const emit = defineEmits(['click-item', 'click-action', 'change-page'])

const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.items.length / props.pageSize)))
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return props.items.slice(start, start + props.pageSize)
})

watch(
  () => [props.items.length, props.pageSize],
  () => {
    currentPage.value = 1
  }
)

function goToPage(page) {
  currentPage.value = page
  emit('change-page', page)
}

function handleClickItem(item) {
  emit('click-item', item)
}

function handleClickAction(item) {
  emit('click-action', item)
}
</script>

<template>
  <section class="base-notification-list">
    <article
      v-for="item in paginatedItems"
      :key="item.id"
      class="base-notification-list__item"
      :class="[
        `base-notification-list__item--${item.tone}`,
        { 'base-notification-list__item--selected': item.id === selectedItemId },
      ]"
      @click="handleClickItem(item)"
    >
      <div class="base-notification-list__body">
        <div class="base-notification-list__top">
          <span class="base-notification-list__type">{{ item.type }}</span>
          <span v-if="item.unread" class="base-notification-list__unread">미확인</span>
        </div>
        <strong class="base-notification-list__title">{{ item.title }}</strong>
        <p class="base-notification-list__description">{{ item.description }}</p>
      </div>

      <div class="base-notification-list__side">
        <span class="base-notification-list__time">{{ item.time }}</span>
        <button
          type="button"
          class="base-notification-list__action"
          @click.stop="handleClickAction(item)"
        >
          {{ item.actionLabel }}
        </button>
      </div>
    </article>

    <div v-if="!items.length" class="base-notification-list__empty">
      {{ emptyMessage }}
    </div>

    <footer v-if="totalPages > 1" class="base-notification-list__pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="base-notification-list__page"
        :class="{ 'base-notification-list__page--active': page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </footer>
  </section>
</template>

<style scoped>
.base-notification-list {
  display: grid;
  gap: 14px;
  padding: 14px 20px 20px;
  border: 1px solid var(--color-border-default);
  border-top: none;
  border-radius: 0 0 18px 18px;
  background: var(--color-bg-surface);
}

.base-notification-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 18px 18px 20px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
}

.base-notification-list__item--selected {
  box-shadow: 0 0 0 3px rgba(101, 87, 221, 0.12);
  transform: translateY(-1px);
}

.base-notification-list__item--fault {
  border-color: #ff5072;
}

.base-notification-list__item--warn {
  border-color: #f4c54b;
}

.base-notification-list__item--info {
  border-color: #6557dd;
}

.base-notification-list__item--success {
  border-color: #20c9a7;
}

.base-notification-list__item--neutral {
  border-color: var(--color-border-default);
}

.base-notification-list__body {
  min-width: 0;
}

.base-notification-list__top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.base-notification-list__type,
.base-notification-list__unread {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.base-notification-list__item--fault .base-notification-list__type,
.base-notification-list__item--fault .base-notification-list__unread {
  background: #fff0f4;
  color: #db294d;
}

.base-notification-list__item--warn .base-notification-list__type,
.base-notification-list__item--warn .base-notification-list__unread {
  background: #fff7dd;
  color: #c28b00;
}

.base-notification-list__item--info .base-notification-list__type,
.base-notification-list__item--info .base-notification-list__unread {
  background: #f1efff;
  color: #6557dd;
}

.base-notification-list__item--success .base-notification-list__type,
.base-notification-list__item--success .base-notification-list__unread {
  background: #e9fbf6;
  color: #15967d;
}

.base-notification-list__title {
  display: block;
  margin-top: 10px;
  font-size: 23px;
  color: var(--color-primary-800);
}

.base-notification-list__description {
  margin-top: 4px;
  color: var(--color-primary-300);
}

.base-notification-list__side {
  display: grid;
  justify-items: end;
  gap: 10px;
  flex-shrink: 0;
}

.base-notification-list__time {
  font-size: 13px;
  color: #b1abd9;
}

.base-notification-list__action {
  min-width: 74px;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #e2dbff;
  border-radius: 8px;
  background: #fff;
  color: var(--color-primary-600);
  font-weight: 700;
  cursor: pointer;
}

.base-notification-list__item--fault .base-notification-list__action {
  border: none;
  background: #f3294f;
  color: #fff;
}

.base-notification-list__empty {
  padding: 24px 12px 8px;
  text-align: center;
  color: var(--color-text-muted);
}

.base-notification-list__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}

.base-notification-list__page {
  width: 34px;
  height: 34px;
  border: 1px solid #e2dbff;
  border-radius: 10px;
  background: #fff;
  color: var(--color-primary-500);
  font-weight: 700;
  cursor: pointer;
}

.base-notification-list__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: #fff;
}

@media (max-width: 860px) {
  .base-notification-list__item {
    align-items: stretch;
    flex-direction: column;
  }

  .base-notification-list__side {
    justify-items: stretch;
    width: 100%;
  }
}
</style>
