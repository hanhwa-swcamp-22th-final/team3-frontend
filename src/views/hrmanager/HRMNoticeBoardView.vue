<script setup>
import { ref, computed } from 'vue'
import {
  mockNotices, nextId,
  STATUS_STYLE, FILTER_TABS,
} from '@/mocks/hrmanager/noticeboard.js'
import HRMNoticeTeamFilter  from '@/components/hr/common/notices/HRMNoticeTeamFilter.vue'
import HRMNoticeFormModal   from '@/components/hr/common/notices/HRMNoticeFormModal.vue'

const notices    = ref([...mockNotices])
const activeTab  = ref('')          // '' = 전체
const orgFilter  = ref([])          // 선택된 조직 목록
const showOrgFilter = ref(false)

const showFormModal = ref(false)
const editTarget    = ref(null)     // null = 새 등록, object = 수정

// ── 필터링 ────────────────────────────────────────────────────────
const filtered = computed(() => {
  return notices.value.filter(n => {
    if (activeTab.value && n.status !== activeTab.value) return false
    if (orgFilter.value.length && !n.targets.some(t => orgFilter.value.includes(t))) return false
    return true
  })
})

const orgLabel = computed(() =>
  orgFilter.value.length ? orgFilter.value.join(' / ') : '전체'
)

// ── 탭 클릭 (토글) ────────────────────────────────────────────────
function setTab(tab) {
  activeTab.value = activeTab.value === tab ? '' : tab
}

// ── 새 공지 등록 ──────────────────────────────────────────────────
function openCreate() {
  editTarget.value  = null
  showFormModal.value = true
}

// ── 수정 ──────────────────────────────────────────────────────────
function openEdit(notice) {
  editTarget.value  = notice
  showFormModal.value = true
}

// ── 저장 (등록 / 수정) ────────────────────────────────────────────
function handleSave(data) {
  if (editTarget.value) {
    Object.assign(editTarget.value, data)
  } else {
    notices.value.unshift({ id: nextId(), ...data })
  }
  showFormModal.value = false
}

// ── 임시 저장 ─────────────────────────────────────────────────────
function handleDraft(data) {
  if (editTarget.value) {
    Object.assign(editTarget.value, data)
  } else {
    notices.value.unshift({ id: nextId(), ...data })
  }
  showFormModal.value = false
}

// ── 삭제 ──────────────────────────────────────────────────────────
function deleteNotice(id) {
  notices.value = notices.value.filter(n => n.id !== id)
}
</script>

<template>
  <div class="notice-view">
    <div class="notice-card">

      <!-- 헤더 -->
      <div class="notice-header">
        <h2 class="notice-header__title">공지 리스트</h2>
        <span class="notice-header__count">총 {{ notices.length }}건</span>
      </div>

      <!-- 필터 바 -->
      <div class="notice-toolbar">
        <div class="notice-tabs">
          <button
            v-for="tab in FILTER_TABS"
            :key="tab"
            class="notice-tab"
            :class="{ 'notice-tab--active': activeTab === tab }"
            @click="setTab(tab)"
          >{{ tab }}</button>

          <!-- 조직 필터 -->
          <div class="notice-org-wrap">
            <button
              class="notice-tab notice-tab--org"
              :class="{ 'notice-tab--active': orgFilter.length > 0 }"
              @click="showOrgFilter = !showOrgFilter"
            >대상 조직: {{ orgLabel }}</button>
            <div v-if="showOrgFilter" class="notice-org-popup">
              <HRMNoticeTeamFilter
                v-model="orgFilter"
                @close="showOrgFilter = false"
              />
            </div>
          </div>
        </div>

        <button class="notice-create-btn" @click="openCreate">+ 새 공지 등록</button>
      </div>

      <!-- 테이블 헤더 -->
      <div class="notice-table-head">
        <span class="col-title">제목</span>
        <span class="col-status">상태</span>
        <span class="col-target">대상</span>
        <span class="col-date">게시일</span>
        <span class="col-action">액션</span>
      </div>

      <!-- 목록 -->
      <div class="notice-list">
        <div v-if="filtered.length === 0" class="notice-list__empty">
          해당 조건의 공지사항이 없습니다.
        </div>
        <div v-for="n in filtered" :key="n.id" class="notice-row">
          <span class="col-title notice-row__title">{{ n.title }}</span>
          <span class="col-status">
            <span
              class="notice-badge"
              :style="{ background: STATUS_STYLE[n.status]?.bg, color: STATUS_STYLE[n.status]?.color }"
            >{{ n.status }}</span>
          </span>
          <span class="col-target notice-row__target">{{ n.targets.join(' / ') }}</span>
          <span class="col-date notice-row__date">{{ n.date ?? '미게시' }}</span>
          <span class="col-action">
            <div class="notice-row__actions">
              <button class="notice-row__edit-btn"   @click="openEdit(n)">수정</button>
              <button class="notice-row__delete-btn" @click="deleteNotice(n.id)">삭제</button>
            </div>
          </span>
        </div>
      </div>

    </div>

    <!-- 모달 -->
    <HRMNoticeFormModal
      v-if="showFormModal"
      :edit-mode="!!editTarget"
      :initial-data="editTarget ?? {}"
      @close="showFormModal = false"
      @save="handleSave"
      @draft="handleDraft"
    />
  </div>
</template>

<style scoped>
.notice-view {
  flex: 1;
  padding: 24px 28px;
  background: var(--color-bg-app);
  overflow: auto;
  min-height: 0;
}
.notice-card {
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 14px;
  padding: 28px 32px;
  display: flex; flex-direction: column; gap: 16px;
}

/* 헤더 */
.notice-header {
  display: flex; align-items: baseline; gap: 12px;
}
.notice-header__title {
  font-size: 20px; font-weight: 800; color: var(--color-primary-800);
}
.notice-header__count {
  margin-left: auto;
  font-size: 13px; color: #a89ed8;
}

/* 툴바 */
.notice-toolbar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.notice-tabs { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.notice-tab {
  height: 34px; padding: 0 16px;
  border-radius: 20px; font-size: 13px; font-weight: 600;
  cursor: pointer;
  border: 1.5px solid var(--color-border-default);
  background: var(--color-bg-surface);
  color: var(--color-primary-400);
  transition: all .15s;
}
.notice-tab:hover { border-color: var(--color-primary-300); color: var(--color-primary-600); }
.notice-tab--active {
  background: var(--color-primary-600); color: var(--color-white);
  border-color: var(--color-primary-600);
}
.notice-tab--org.notice-tab--active {
  background: var(--color-primary-100); color: var(--color-primary-700);
  border-color: var(--color-primary-300);
}

.notice-org-wrap { position: relative; }
.notice-org-popup { position: absolute; top: calc(100% + 6px); left: 0; z-index: 20; }

.notice-create-btn {
  height: 38px; padding: 0 20px; flex-shrink: 0;
  background: var(--color-primary-600); color: var(--color-white);
  border: none; border-radius: 10px; font-size: 14px; font-weight: 700;
  cursor: pointer;
}

/* 테이블 */
.notice-table-head,
.notice-row {
  display: grid;
  grid-template-columns: 1fr 90px 160px 110px 130px;
  align-items: center;
  gap: 8px;
}
.notice-table-head {
  padding: 0 16px 10px;
  border-bottom: 1.5px solid var(--color-border-default);
  font-size: 12px; font-weight: 700; color: #a89ed8;
  text-align: center;
}
.notice-table-head .col-title { text-align: left; }

.notice-list { display: flex; flex-direction: column; gap: 6px; }
.notice-list__empty {
  padding: 32px 0; text-align: center;
  font-size: 13px; color: #a89ed8;
}

.notice-row {
  padding: 14px 16px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 10px;
}
.notice-row__title {
  font-size: 14px; font-weight: 600; color: var(--color-primary-800);
}
.notice-row__target {
  font-size: 13px; color: var(--color-primary-600);
  text-align: center;
}
.notice-row__date {
  font-size: 13px; color: #7a6fa8;
  text-align: center;
}

.notice-badge {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 3px 10px; border-radius: 20px;
  font-size: 12px; font-weight: 700;
  margin: auto;
}
.col-status { display: flex; justify-content: center; }

.notice-row__actions {
  display: flex; gap: 6px; justify-content: flex-end;
}
.notice-row__edit-btn {
  height: 30px; padding: 0 14px;
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 7px; font-size: 12px; font-weight: 700;
  color: var(--color-primary-600); cursor: pointer;
}
.notice-row__delete-btn {
  height: 30px; padding: 0 14px;
  background: var(--color-danger-soft);
  border: 1.5px solid var(--color-danger);
  border-radius: 7px; font-size: 12px; font-weight: 700;
  color: var(--color-danger); cursor: pointer;
}
</style>
