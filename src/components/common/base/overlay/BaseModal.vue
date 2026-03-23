<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  eyebrow: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '680px',
  },
  maxHeight: {
    type: String,
    default: 'calc(100vh - 40px)',
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

function handleBackdropClick() {
  if (!props.closeOnBackdrop) {
    return
  }
  emit('close')
}
</script>

<template>
  <div class="base-modal">
    <div class="base-modal__backdrop" @click="handleBackdropClick"></div>

    <section
      class="base-modal__dialog"
      :style="{ width: `min(${width}, calc(100vw - 32px))`, maxHeight }"
    >
      <header v-if="eyebrow || title || showCloseButton || $slots.header" class="base-modal__head">
        <slot name="header">
          <div>
            <p v-if="eyebrow" class="base-modal__eyebrow">{{ eyebrow }}</p>
            <h2 v-if="title" class="base-modal__title">{{ title }}</h2>
          </div>
        </slot>

        <button
          v-if="showCloseButton"
          type="button"
          class="base-modal__close"
          @click="emit('close')"
        >
          ×
        </button>
      </header>

      <div class="base-modal__content">
        <slot />
      </div>

      <footer v-if="$slots.footer" class="base-modal__footer">
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>

<style scoped>
.base-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
}

.base-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(14, 12, 31, 0.48);
}

.base-modal__dialog {
  position: relative;
  overflow-y: auto;
  border-radius: 22px;
  background: #fff;
  padding: 24px;
  display: grid;
  gap: 18px;
  box-shadow: 0 30px 80px rgba(20, 15, 60, 0.24);
}

.base-modal__head,
.base-modal__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.base-modal__eyebrow {
  font-size: var(--font-size-xs-plus);
  font-weight: 700;
  color: var(--color-primary-300);
}

.base-modal__title {
  margin-top: 6px;
  font-size: var(--font-size-2xl-plus);
  color: var(--color-primary-800);
}

.base-modal__content {
  display: grid;
  gap: 18px;
}

.base-modal__close {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #f4f2ff;
  color: var(--color-primary-700);
  font-size: var(--font-size-xl);
  cursor: pointer;
  flex-shrink: 0;
}
</style>
