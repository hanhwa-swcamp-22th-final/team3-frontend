<script setup>
defineProps({
  show:    { type: Boolean, required: true },
  message: { type: String,  required: true },
  type:    { type: String,  default: 'success' }, // 'success' | 'error'
})
</script>

<template>
  <Transition name="base-toast">
    <div v-if="show" class="base-toast" :class="`base-toast--${type}`">
      <span class="base-toast__icon">{{ type === 'error' ? '!' : '✓' }}</span>
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.base-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  color: #fff;
  border-radius: 10px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  box-shadow: 0 8px 24px rgba(20, 15, 60, 0.2);
  pointer-events: none;
}
.base-toast--success { background: var(--color-primary-700); }
.base-toast--error   { background: var(--color-danger); }

.base-toast__icon {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.base-toast-enter-active,
.base-toast-leave-active { transition: all 0.25s ease; }
.base-toast-enter-from,
.base-toast-leave-to     { opacity: 0; transform: translateX(-50%) translateY(12px); }
</style>
