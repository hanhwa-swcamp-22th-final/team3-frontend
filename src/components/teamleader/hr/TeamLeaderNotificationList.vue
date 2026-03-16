<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="notification-list">
    <article
      v-for="item in items"
      :key="item.id"
      class="notification-item"
      :class="`notification-item--${item.tone}`"
    >
      <div class="notification-item__body">
        <div class="notification-item__top">
          <span class="notification-item__type">{{ item.type }}</span>
          <span v-if="item.unread" class="notification-item__unread">미확인</span>
        </div>
        <strong class="notification-item__title">{{ item.title }}</strong>
        <p class="notification-item__description">{{ item.description }}</p>
      </div>

      <div class="notification-item__side">
        <span class="notification-item__time">{{ item.time }}</span>
        <button type="button" class="notification-item__action">{{ item.actionLabel }}</button>
      </div>
    </article>
  </section>
</template>

<style scoped>
.notification-list {
  display: grid;
  gap: 14px;
  padding: 14px 20px 20px;
  border: 1px solid var(--color-border-default);
  border-top: none;
  border-radius: 0 0 18px 18px;
  background: var(--color-bg-surface);
}

.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 18px 18px 20px;
  border: 2px solid transparent;
  border-radius: 12px;
  background: #fff;
}

.notification-item--fault {
  border-color: #ff5072;
}

.notification-item--warn {
  border-color: #f4c54b;
}

.notification-item--info {
  border-color: #6557dd;
}

.notification-item--success {
  border-color: #20c9a7;
}

.notification-item__body {
  min-width: 0;
}

.notification-item__top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-item__type,
.notification-item__unread {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.notification-item--fault .notification-item__type,
.notification-item--fault .notification-item__unread {
  background: #fff0f4;
  color: #db294d;
}

.notification-item--warn .notification-item__type,
.notification-item--warn .notification-item__unread {
  background: #fff7dd;
  color: #c28b00;
}

.notification-item--info .notification-item__type,
.notification-item--info .notification-item__unread {
  background: #f1efff;
  color: #6557dd;
}

.notification-item--success .notification-item__type,
.notification-item--success .notification-item__unread {
  background: #e9fbf6;
  color: #15967d;
}

.notification-item__title {
  display: block;
  margin-top: 10px;
  font-size: 23px;
  color: var(--color-primary-800);
}

.notification-item__description {
  margin-top: 4px;
  color: var(--color-primary-300);
}

.notification-item__side {
  display: grid;
  justify-items: end;
  gap: 10px;
  flex-shrink: 0;
}

.notification-item__time {
  font-size: 13px;
  color: #b1abd9;
}

.notification-item__action {
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

.notification-item--fault .notification-item__action {
  border: none;
  background: #f3294f;
  color: #fff;
}

@media (max-width: 860px) {
  .notification-item {
    align-items: stretch;
    flex-direction: column;
  }

  .notification-item__side {
    justify-items: stretch;
    width: 100%;
  }
}
</style>
