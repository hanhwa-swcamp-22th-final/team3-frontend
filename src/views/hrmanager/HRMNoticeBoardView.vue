<script setup>
import { ref, computed } from 'vue'
import {
  mockNotices, nextId,
  STATUS_STYLE, FILTER_TABS,
} from '@/mocks/hrmanager/noticeboard.js'
import HRMNoticeTeamFilter  from '@/components/hr/common/notices/HRMNoticeTeamFilter.vue'
import HRMNoticeDetailPanel from '@/components/hr/common/notices/HRMNoticeDetailPanel.vue'
import HRMNoticeFormModal   from '@/components/hr/common/notices/HRMNoticeFormModal.vue'

const notices    = ref([...mockNotices])
const activeTab  = ref('')
const orgFilter  = ref([])
const showOrgFilter = ref(false)

const showFormModal = ref(false)
const editTarget    = ref(null)

const selectedId = ref(mockNotices[0]?.id ?? null)

// ── 필터링 ────────────────────────────────────────────────────────
const filtered = computed(() => {
  return notices.value.filter(n => {
    if (activeTab.value && n.status !== activeTab.value) return false
    if (orgFilter.value.length && !n.targets.some(t => orgFilter.value.includes(t))) return false
    return true
  })
})

const selectedNotice = computed(() =>
  filtered.value.find(n => n.id === selectedId.value) ?? filtered.value[0] ?? null
)

const orgLabel = computed(() =>
  orgFilter.value.length ? orgFilter.value.join(' / ') : '전체'
)

// ── 탭 클릭 ───────────────────────────────────────────────────────
function setTab(tab) {
  activeTab.value = tab === '전체' ? '' : (activeTab.value === tab ? '' : tab)
}

// ── 새 공지 등록 ──────────────────────────────────────────────────
function openCreate() {
  editTarget.value = null
  showFormModal.value = true
}

// ── 수정 ──────────────────────────────────────────────────────────
function openEdit(notice) {
  editTarget.value = notice
  showFormModal.value = true
}

// ── 저장 ──────────────────────────────────────────────────────────
function handleSave(data) {
  if (editTarget.value) {
    Object.assign(editTarget.value, data)
  } else {
    const n = { id: nextId(), ...data }
    notices.value.unshift(n)
    selectedId.value = n.id
  }
  showFormModal.value = false
}

// ── 임시 저장 ─────────────────────────────────────────────────────
function handleDraft(data) {
  if (editTarget.value) {
    Object.assign(editTarget.value, data)
  } else {
    const n = { id: nextId(), ...data }
    notices.value.unshift(n)
    selectedId.value = n.id
  }
  showFormModal.value = false
}

// ── 삭제 ──────────────────────────────────────────────────────────
function deleteNotice(id) {
  notices.value = notices.value.filter(n => n.id !== id)
  selectedId.value = filtered.value[0]?.id ?? null
}
</script>

<template>
  <div class="notice-view">
    <div class="notice-grid">

      <!-- 좌측: 리스트 -->
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
              :class="{ 'notice-tab--active': tab === '전체' ? activeTab === '' : activeTab === tab }"
              @click="setTab(tab)"
            >{{ tab }}</button>

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

        <!-- 목록 -->
        <div class="notice-list">
          <div v-if="filtered.length === 0" class="notice-list__empty">
            해당 조건의 공지사항이 없습니다.
          </div>
          <div
            v-for="n in filtered"
            :key="n.id"
            class="notice-row"
            :class="{ 'notice-row--selected': n.id === selectedNotice?.id }"
            @click="selectedId = n.id"
          >
            <div class="notice-row__top">
              <div class="notice-row__badges">
                <span v-if="n.isImportant" class="notice-badge notice-badge--pin">PIN</span>
                <span
                  class="notice-badge"
                  :style="{ background: STATUS_STYLE[n.status]?.bg, color: STATUS_STYLE[n.status]?.color }"
                >{{ n.status }}</span>
              </div>
              <span class="notice-row__views">조회 {{ n.views ?? 0 }}</span>
            </div>
            <p class="notice-row__title">{{ n.title }}</p>
            <p class="notice-row__preview">{{ n.content }}</p>
            <div class="notice-row__meta">
              <span>작성자 {{ n.author ?? '-' }}</span>
              <span>{{ n.date ?? '미게시' }}</span>
              <span>대상: {{ n.targets.join(' / ') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 우측: 상세 패널 -->
      <HRMNoticeDetailPanel
        :notice="selectedNotice"
        @edit="openEdit"
        @delete="deleteNotice"
      />
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
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.notice-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
  align-items: stretch;
  flex: 1;
  min-height: 0;
}

.notice-card {
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 14px;
  padding: 28px 32px;
  display: flex; flex-direction: column; gap: 16px;
  overflow: hidden;
}

/* 헤더 */
.notice-header { display: flex; align-items: baseline; gap: 12px; }
.notice-header__title {
  font-size: var(--font-size-lg); font-weight: var(--font-weight-extrabold); color: var(--color-primary-800);
}
.notice-header__count {
  margin-left: auto;
  font-size: var(--font-size-sm); color: #a89ed8;
}

/* 툴바 */
.notice-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.notice-tabs { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.notice-tab {
  height: 34px; padding: 0 16px;
  border-radius: 20px; font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
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
  border: none; border-radius: 10px; font-size: var(--font-size-base); font-weight: var(--font-weight-bold);
  cursor: pointer;
}

/* 목록 */
.notice-list { display: flex; flex-direction: column; gap: 6px; flex: 1; overflow-y: auto; min-height: 0; }
.notice-list__empty {
  padding: 32px 0; text-align: center;
  font-size: var(--font-size-sm); color: #a89ed8;
}

.notice-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  background: var(--color-bg-app);
  border: 1.5px solid var(--color-border-default);
  border-radius: 10px;
  cursor: pointer;
  transition: all .15s;
}
.notice-row:hover { border-color: var(--color-primary-300); }
.notice-row--selected {
  background: var(--color-primary-100);
  border-left: 3px solid var(--color-primary-600);
  padding-left: 14px;
}

.notice-row__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.notice-row__badges { display: flex; gap: 6px; }

.notice-badge {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 20px;
  font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
}
.notice-badge--pin {
  background: var(--color-primary-100);
  color: var(--color-primary-600);
}

.notice-row__views {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.notice-row__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
  margin: 0;
}

.notice-row__preview {
  font-size: var(--font-size-sm);
  color: var(--color-text-default);
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notice-row__meta {
  display: flex;
  gap: 10px;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 2px;
}

@media (max-width: 1100px) {
  .notice-grid { grid-template-columns: 1fr; }
}
</style>
