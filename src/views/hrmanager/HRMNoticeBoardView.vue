<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import hrApi from '@/services/hrApi'
import HRMNoticeListPanel  from '@/components/hr/common/notices/HRMNoticeListPanel.vue'
import HRMNoticeDetailPanel from '@/components/hr/common/notices/HRMNoticeDetailPanel.vue'
import HRMNoticeFormModal   from '@/components/hr/common/notices/HRMNoticeFormModal.vue'
import { BaseConfirmModal, BaseToast } from '@/components/common/base/overlay'

// ── 상태 ──────────────────────────────────────────
const notices        = ref([])
const selectedId     = ref(null)
const selectedNotice = ref(null)
const showFormModal  = ref(false)
const editTarget     = ref(null)
const route = useRoute()

// ── 필드 변환 헬퍼 ────────────────────────────────
const STATUS_MAP = { POSTING: '게시중', RESERVATION: '예약', TEMPORARY: '임시' }
const STATUS_TO_ENUM = { '게시중': 'POSTING', '예약': 'RESERVATION', '임시': 'TEMPORARY' }

function formatDate(isoStr) {
  if (!isoStr) return null
  const d = new Date(isoStr)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

function parseDateTime(value) {
  if (!value) return null
  // Date 객체 (VueDatePicker에서 직접 넘어오는 경우) — 로컬 시간 기준으로 포맷
  if (value instanceof Date) {
    const pad = n => String(n).padStart(2, '0')
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` +
           `T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`
  }
  // '2026.03.25 14:00' 형식 문자열
  return value.replace(/\./g, '-').replace(' ', 'T') + ':00'
}

function normalizeList(n) {
  return {
    id:          n.noticeId,
    title:       n.noticeTitle,
    author:      String(n.authorId ?? '-'),
    status:      STATUS_MAP[n.noticeStatus] ?? n.noticeStatus,
    isImportant: n.isImportant === 1,
    views:       n.noticeViews ?? 0,
    date:        formatDate(n.publishStartAt ?? n.createdAt),
  }
}

function normalizeDetail(n) {
  return {
    ...normalizeList(n),
    content:    n.noticeContent ?? '',
    attachment: n.attachments?.[0]?.fileName ?? '',
  }
}

// ── API 호출 ──────────────────────────────────────
async function fetchNotices() {
  try {
    const res = await hrApi.get('/api/v1/hr/notices')
    const list = res.data?.success ? res.data.data : res.data
    notices.value = (Array.isArray(list) ? list : []).map(normalizeList)
    const queryNoticeId = route.query.noticeId ? Number(route.query.noticeId) : null
    if (queryNoticeId && notices.value.some(notice => notice.id === queryNoticeId)) {
      selectedId.value = queryNoticeId
      return
    }
    if (!selectedId.value && notices.value.length) {
      selectedId.value = notices.value[0].id
    }
  } catch (err) {
    console.error('공지 목록 조회 실패:', err)
  }
}

async function fetchDetail(id) {
  if (!id) { selectedNotice.value = null; return }
  try {
    const res = await hrApi.get(`/api/v1/hr/notices/${id}`)
    const data = res.data?.success ? res.data.data : res.data
    selectedNotice.value = normalizeDetail(data)
  } catch (err) {
    console.error('공지 상세 조회 실패:', err)
  }
}

watch(selectedId, (id) => fetchDetail(id))
onMounted(fetchNotices)

// ── 확인 모달 ─────────────────────────────────────
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

// ── 토스트 ────────────────────────────────────────
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer = null
function showToast(message, type = 'success') {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { show: true, message, type }
  toastTimer = setTimeout(() => { toast.value.show = false }, 2500)
}

// ── CRUD ──────────────────────────────────────────
function openCreate() {
  editTarget.value = null
  showFormModal.value = true
}

function openEdit(notice) {
  editTarget.value = notice
  showFormModal.value = true
}

async function handleSave(data) {
  try {
    const importantEndAt = data.importantEndAt ? parseDateTime(data.importantEndAt) : null
    if (editTarget.value) {
      await hrApi.put(`/api/v1/hr/notices/${editTarget.value.id}`, {
        noticeStatus:   STATUS_TO_ENUM[data.status] ?? 'POSTING',
        important:      data.isImportant,
        noticeTitle:    data.title,
        noticeContent:  data.content,
        publishStartAt: data.status === '예약' ? parseDateTime(data.date) : null,
        importantEndAt,
      })
      showToast('공지가 수정되었습니다.')
    } else if (data.status === '예약') {
      await hrApi.post('/api/v1/hr/notices/schedule', {
        noticeTitle:    data.title,
        noticeContent:  data.content,
        isImportant:    data.isImportant,
        importantEndAt,
        publishStartAt: parseDateTime(data.date),
      })
      showToast('공지가 예약 등록되었습니다.')
    } else {
      await hrApi.post('/api/v1/hr/notices', {
        noticeTitle:    data.title,
        noticeContent:  data.content,
        isImportant:    data.isImportant,
        importantEndAt,
      })
      showToast('공지가 등록되었습니다.')
    }
    showFormModal.value = false
    await fetchNotices()
    await fetchDetail(selectedId.value)
  } catch (err) {
    console.error(err)
    showToast('처리 중 오류가 발생했습니다.', 'error')
  }
}

async function handleDraft(data) {
  try {
    const res = await hrApi.post('/api/v1/hr/notices/draft', {
      noticeId:       editTarget.value?.id ?? null,
      noticeTitle:    data.title,
      noticeContent:  data.content,
      isImportant:    data.isImportant,
      importantEndAt: null,
    })
    const savedId = res.data?.data ?? null
    showFormModal.value = false
    await fetchNotices()
    if (savedId) selectedId.value = savedId
    showToast('임시저장되었습니다.')
  } catch (err) {
    console.error(err)
    showToast('처리 중 오류가 발생했습니다.', 'error')
  }
}

function deleteNotice(id) {
  const notice = notices.value.find(n => n.id === id)
  openConfirm(
    '공지 삭제',
    `'${notice?.title ?? '해당 공지'}'를 삭제하시겠습니까?`,
    async () => {
      try {
        await hrApi.delete(`/api/v1/hr/notices/${id}`)
        await fetchNotices()
        if (selectedId.value === id) selectedId.value = notices.value[0]?.id ?? null
        showToast('공지가 삭제되었습니다.')
      } catch (err) {
        console.error(err)
        showToast('삭제 중 오류가 발생했습니다.', 'error')
      }
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
        :show-create-button="true"
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

    <BaseToast :show="toast.show" :message="toast.message" :type="toast.type" />
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

</style>
