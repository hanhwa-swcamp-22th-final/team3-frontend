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
    default: '680px',
  },
  maxHeight: {
    type: String,
    default: 'calc(100vh - 40px)',
  },
  cancelText: {
    type: String,
    default: '취소',
  },
  confirmText: {
    type: String,
    default: '저장',
  },
  showDraftButton: {
    type: Boolean,
    default: false,
  },
  draftText: {
    type: String,
    default: '임시 저장',
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

const emit = defineEmits(['close', 'cancel', 'draft', 'confirm'])

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

function handleDraft() {
  emit('draft')
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
        <div class="base-form-modal__actions">
          <button
            v-if="showDraftButton"
            type="button"
            class="base-form-modal__secondary"
            @click="handleDraft"
          >
            {{ draftText }}
          </button>
          <button type="button" class="base-form-modal__ghost" @click="handleCancel">
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="base-form-modal__primary"
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
.base-form-modal__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}

.base-form-modal__ghost,
.base-form-modal__secondary,
.base-form-modal__primary {
  height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.base-form-modal__ghost {
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
}

.base-form-modal__secondary {
  border: 1px solid var(--color-primary-200, #d9d4ff);
  background: #f6f3ff;
  color: var(--color-primary-700);
}

.base-form-modal__primary {
  border: none;
  background: var(--color-primary-700);
  color: #fff;
}

.base-form-modal__primary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
