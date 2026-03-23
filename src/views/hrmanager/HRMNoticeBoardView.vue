<script setup>
import { ref, computed } from 'vue'
import { mockNotices, nextId } from '@/mocks/hrmanager/noticeboard.js'
import HRMNoticeListPanel  from '@/components/hr/common/notices/HRMNoticeListPanel.vue'
import HRMNoticeDetailPanel from '@/components/hr/common/notices/HRMNoticeDetailPanel.vue'
import HRMNoticeFormModal   from '@/components/hr/common/notices/HRMNoticeFormModal.vue'
import BaseConfirmModal     from '@/components/common/base/overlay/BaseConfirmModal.vue'

const notices    = ref([...mockNotices])
const selectedId = ref(mockNotices[0]?.id ?? null)

const showFormModal = ref(false)
const editTarget    = ref(null)

const confirmModal = ref({ show: false, title: '', message: '', onConfirm: null })
function openConfirm(title, message, onConfirm) {
  confirmModal.value = { show: true, title, message, onConfirm }
}
function closeConfirm() {
  confirmModal.value = { show: false, title: '', message: '', onConfirm: null }
}
function handleConfirmOk() {
  confirmModal.value.onConfirm?.()
  closeConfirm()
}

const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null
function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

const selectedNotice = computed(() =>
  notices.value.find(n => n.id === selectedId.value) ?? null
)

function openCreate() {
  editTarget.value = null
  showFormModal.value = true
}

function openEdit(notice) {
  editTarget.value = notice
  showFormModal.value = true
}

function handleSave(data) {
  if (editTarget.value) {
    Object.assign(editTarget.value, data)
    showToast('공지가 수정되었습니다.')
  } else {
    const n = { id: nextId(), ...data }
    notices.value.unshift(n)
    selectedId.value = n.id
    showToast('공지가 등록되었습니다.')
  }
  showFormModal.value = false
}

function handleDraft(data) {
  if (editTarget.value) {
    Object.assign(editTarget.value, data)
  } else {
    const n = { id: nextId(), ...data }
    notices.value.unshift(n)
    selectedId.value = n.id
  }
  showFormModal.value = false
  showToast('임시저장되었습니다.')
}

function deleteNotice(id) {
  const notice = notices.value.find(n => n.id === id)
  openConfirm(
    '공지 삭제',
    `'${notice?.title ?? '해당 공지'}'를 삭제하시겠습니까?`,
    () => {
      notices.value = notices.value.filter(n => n.id !== id)
      if (selectedId.value === id) selectedId.value = notices.value[0]?.id ?? null
      showToast('공지가 삭제되었습니다.')
    }
  )
}
</script>

<template>
  <div class="notice-view">
    <div class="notice-grid">

      <!-- 좌측: 리스트 패널 -->
      <HRMNoticeListPanel
        :notices="notices"
        :selected-id="selectedId"
        @select="selectedId = $event"
        @create="openCreate"
      />

      <!-- 우측: 상세 패널 -->
      <HRMNoticeDetailPanel
        :notice="selectedNotice"
        @edit="openEdit"
        @delete="deleteNotice"
      />
    </div>

    <HRMNoticeFormModal
      v-if="showFormModal"
      :edit-mode="!!editTarget"
      :initial-data="editTarget ?? {}"
      @close="showFormModal = false"
      @save="handleSave"
      @draft="handleDraft"
    />

    <BaseConfirmModal
      v-if="confirmModal.show"
      :title="confirmModal.title"
      :confirm-text="'삭제'"
      :cancel-text="'취소'"
      :width="'400px'"
      @close="closeConfirm"
      @cancel="closeConfirm"
      @confirm="handleConfirmOk"
    >
      <p class="notice-confirm__message">{{ confirmModal.message }}</p>
    </BaseConfirmModal>

    <Transition name="notice-toast">
      <div v-if="toast.show" class="notice-toast" :class="`notice-toast--${toast.type}`">
        <span class="notice-toast__icon">{{ toast.type === 'error' ? '!' : '✓' }}</span>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.notice-view {
  flex: 1;
  min-width: 0;
  height: calc(100vh - 80px);
  padding: 24px 28px;
  background: var(--color-bg-app);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.notice-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  align-items: stretch;
  flex: 1;
  min-height: 0;
}

@media (max-width: 1100px) {
  .notice-grid { grid-template-columns: 1fr; }
}

/* 삭제 확인 모달 */
.notice-confirm__message { font-size: var(--font-size-sm); color: var(--color-text-default); padding: 8px 0; }
:deep(.base-confirm-modal__primary) { background: var(--color-danger); }

/* 토스트 */
.notice-toast {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 8px;
  padding: 12px 20px; border-radius: 10px;
  font-size: var(--font-size-sm); font-weight: var(--font-weight-bold);
  color: var(--color-white); z-index: 9999;
  box-shadow: 0 4px 16px rgba(0,0,0,.15);
}
.notice-toast--success { background: var(--color-primary-700); }
.notice-toast--error   { background: var(--color-danger); }
.notice-toast__icon {
  width: 18px; height: 18px; border-radius: 50%;
  background: rgba(255,255,255,.25);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--font-size-xs); font-weight: var(--font-weight-extrabold); flex-shrink: 0;
}
.notice-toast-enter-active,
.notice-toast-leave-active { transition: all 0.25s ease; }
.notice-toast-enter-from   { opacity: 0; transform: translateX(-50%) translateY(12px); }
.notice-toast-leave-to     { opacity: 0; transform: translateX(-50%) translateY(12px); }
</style>
