<script setup>
import BaseModal from './BaseModal.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  eyebrow: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '620px',
  },
  maxHeight: {
    type: String,
    default: 'calc(100vh - 40px)',
  },
  cancelText: {
    type: String,
    default: '닫기',
  },
  confirmText: {
    type: String,
    default: '확인',
  },
  confirmDisabled: {
    type: Boolean,
    default: false,
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

const emit = defineEmits(['close', 'cancel', 'confirm'])

function handleClose() {
  emit('close')
}

function handleCancel() {
  emit('cancel')
}

function handleConfirm() {
  if (props.confirmDisabled) {
    return
  }
  emit('confirm')
}
</script>

<template>
  <BaseModal
    :title="title"
    :eyebrow="eyebrow"
    :width="width"
    :max-height="maxHeight"
    :close-on-backdrop="closeOnBackdrop"
    :show-close-button="showCloseButton"
    @close="handleClose"
  >
    <slot />

    <template #footer>
      <slot name="footer">
        <div class="base-confirm-modal__actions">
          <button type="button" class="base-confirm-modal__ghost" @click="handleCancel">
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="base-confirm-modal__primary"
            :disabled="confirmDisabled"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </slot>
    </template>
  </BaseModal>
</template>

<style scoped>
.base-confirm-modal__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}

.base-confirm-modal__ghost,
.base-confirm-modal__primary {
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.base-confirm-modal__ghost {
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
}

.base-confirm-modal__primary {
  border: none;
  background: var(--color-primary-700);
  color: #fff;
}

.base-confirm-modal__primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
