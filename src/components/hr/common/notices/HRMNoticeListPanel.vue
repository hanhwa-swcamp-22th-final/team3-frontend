<script setup>
import { ref, computed } from 'vue'
import { STATUS_STYLE, FILTER_TABS } from '@/mocks/hrmanager/noticeboard.js'
import HRMNoticeTeamFilter from '@/components/hr/common/notices/HRMNoticeTeamFilter.vue'

const props = defineProps({
  notices:    { type: Array, required: true },
  selectedId: { type: [Number, null], default: null },
})

const emit = defineEmits(['select', 'create'])

const activeTab     = ref('')
const orgFilter     = ref([])
const showOrgFilter = ref(false)
const searchQuery   = ref('')
const PAGE_SIZE     = 8
const currentPage   = ref(1)

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return props.notices
    .filter(n => {
      if (activeTab.value === '중요' && !n.isImportant) return false
      if (activeTab.value && activeTab.value !== '중요' && n.status !== activeTab.value) return false
      if (orgFilter.value.length && !n.targets.some(t => orgFilter.value.includes(t))) return false
      if (q && !n.title.toLowerCase().includes(q)) return false
      return true
    })
    .sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const paginated  = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filtered.value.slice(start, start + PAGE_SIZE)
})
const orgLabel = computed(() =>
  orgFilter.value.length ? orgFilter.value.join(' / ') : '전체'
)

function setTab(tab) {
  activeTab.value = tab === '전체' ? '' : (activeTab.value === tab ? '' : tab)
  currentPage.value = 1
}
</script>

<template>
  <div class="notice-card">
    <!-- 헤더 -->
    <div class="notice-header">
      <h2 class="notice-header__title">공지 목록</h2>
      <span class="notice-header__count">총 {{ notices.length }}건</span>
    </div>

    <!-- 툴바 -->
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
          >대상: {{ orgLabel }}</button>
          <div v-if="showOrgFilter" class="notice-org-popup">
            <HRMNoticeTeamFilter
              v-model="orgFilter"
              @close="showOrgFilter = false"
            />
          </div>
        </div>
      </div>

      <div class="notice-toolbar__actions">
        <div class="notice-search">
          <input
            v-model="searchQuery"
            class="notice-search__input"
            placeholder="제목 검색"
            @input="currentPage = 1"
          />
        </div>
        <button class="notice-create-btn" @click="emit('create')">+ 공지 등록</button>
      </div>
    </div>

    <!-- 게시판 -->
    <div class="notice-board">
      <div class="notice-board__head">
        <span class="notice-col--num">번호</span>
        <span class="notice-col--title">제목</span>
        <span class="notice-col--author">작성자</span>
        <span class="notice-col--date">날짜</span>
        <span class="notice-col--views">조회</span>
      </div>
      <div v-if="filtered.length === 0" class="notice-list__empty">
        해당 조건의 공지사항이 없습니다.
      </div>
      <div
        v-for="n in paginated"
        :key="n.id"
        class="notice-row"
        :class="{ 'notice-row--selected': n.id === selectedId }"
        @click="emit('select', n.id)"
      >
        <span class="notice-col--num notice-row__cell">
          {{ n.isImportant ? '📌' : n.id }}
        </span>
        <div class="notice-col--title notice-row__title-wrap">
          <span
            class="notice-badge"
            :style="{ background: STATUS_STYLE[n.status]?.bg, color: STATUS_STYLE[n.status]?.color }"
          >{{ n.status }}</span>
          <p class="notice-row__title">{{ n.title }}</p>
        </div>
        <span class="notice-col--author notice-row__cell">{{ n.author ?? '-' }}</span>
        <span class="notice-col--date notice-row__cell">{{ n.date ?? '미게시' }}</span>
        <span class="notice-col--views notice-row__cell">{{ n.views ?? 0 }}</span>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="notice-pagination">
      <button class="notice-page-btn" :disabled="currentPage === 1" @click="currentPage--">&#8249;</button>
      <button
        v-for="p in totalPages"
        :key="p"
        class="notice-page-btn"
        :class="{ 'notice-page-btn--active': p === currentPage }"
        @click="currentPage = p"
      >{{ p }}</button>
      <button class="notice-page-btn" :disabled="currentPage === totalPages" @click="currentPage++">&#8250;</button>
    </div>
  </div>
</template>

<style scoped>
.notice-card {
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 14px;
  padding: 28px 32px;
  display: flex; flex-direction: column; gap: 16px;
  overflow: hidden;
}

/* 헤더 */
.notice-header { display: flex; align-items: center; gap: 10px; }
.notice-header__title {
  font-size: var(--font-size-lg); font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-800); white-space: nowrap;
}
.notice-header__count { font-size: var(--font-size-sm); color: #a89ed8; white-space: nowrap; }

/* 툴바 */
.notice-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.notice-toolbar__actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.notice-tabs { display: flex; align-items: center; gap: 5px; flex-wrap: nowrap; }
.notice-tab {
  height: 28px; padding: 0 10px;
  border-radius: 20px; font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  cursor: pointer;
  border: 1.5px solid var(--color-border-default);
  background: var(--color-bg-surface);
  color: var(--color-primary-400);
  transition: all .15s;
}
.notice-tab:hover { border-color: var(--color-primary-300); color: var(--color-primary-600); }
.notice-tab--active {
  background: var(--color-primary-800); color: var(--color-white);
  border-color: var(--color-primary-800);
}
.notice-tab--org {
  background: var(--color-bg-surface-muted);
  border-color: var(--color-border-strong);
  color: var(--color-text-secondary);
  height: auto; min-height: 30px; max-width: 110px;
}
.notice-tab--org.notice-tab--active {
  background: var(--color-primary-100); color: var(--color-primary-700);
  border-color: var(--color-primary-300);
}

.notice-org-wrap { position: relative; }
.notice-org-popup { position: absolute; top: calc(100% + 6px); left: 0; z-index: 20; }

.notice-search {
  display: flex; align-items: center;
  height: 30px; padding: 0 10px;
  border: 1.5px solid var(--color-border-default);
  border-radius: 8px; background: var(--color-bg-surface);
}
.notice-search:focus-within { border-color: var(--color-primary-300); }
.notice-search__input {
  border: none; outline: none; background: transparent;
  font-size: var(--font-size-xs); color: var(--color-text-default);
  width: 130px;
}
.notice-search__input::placeholder { color: var(--color-text-muted); }

.notice-create-btn {
  height: 30px; padding: 0 12px; flex-shrink: 0;
  background: var(--color-primary-600); color: var(--color-white);
  border: none; border-radius: 8px; font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  cursor: pointer;
}

/* 게시판 */
.notice-board { flex: 1; overflow-y: auto; min-height: 0; display: flex; flex-direction: column; }

.notice-board__head,
.notice-row {
  display: grid;
  grid-template-columns: 48px 1fr 90px 80px 48px;
  align-items: center;
  gap: 8px; padding: 0 12px;
}
.notice-board__head {
  height: 36px;
  background: var(--color-bg-app); border-radius: 8px;
  font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  color: var(--color-text-muted); flex-shrink: 0;
}
.notice-row {
  height: 48px;
  border-bottom: 1px solid var(--color-border-default);
  cursor: pointer; transition: background .12s;
}
.notice-row:hover { background: var(--color-bg-app); }
.notice-row--selected {
  background: var(--color-primary-50, #f3f0ff);
  border-left: 3px solid var(--color-primary-600);
  padding-left: 10px;
}
.notice-list__empty {
  padding: 32px 0; text-align: center;
  font-size: var(--font-size-sm); color: #a89ed8;
}

/* 컬럼 */
.notice-col--num    { font-size: var(--font-size-xs); color: var(--color-text-muted); text-align: center; }
.notice-col--title  { overflow: hidden; text-align: center; }
.notice-col--author { font-size: var(--font-size-xs); color: var(--color-text-muted); text-align: center; }
.notice-col--date   { font-size: var(--font-size-xs); color: var(--color-text-muted); text-align: center; }
.notice-col--views  { font-size: var(--font-size-xs); color: var(--color-text-muted); text-align: center; }

.notice-row__title-wrap { display: flex; align-items: center; gap: 6px; overflow: hidden; min-width: 0; }
.notice-badge {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 20px;
  font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);
  white-space: nowrap;
}
.notice-row__title {
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  color: var(--color-primary-800); margin: 0;
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis; min-width: 0;
}
.notice-row__cell { font-size: var(--font-size-xs); color: var(--color-text-muted); text-align: center; }

/* 페이지네이션 */
.notice-pagination { display: flex; align-items: center; justify-content: center; gap: 4px; padding-top: 4px; flex-shrink: 0; }
.notice-page-btn {
  min-width: 28px; height: 28px; padding: 0 6px;
  border: 1.5px solid var(--color-border-default); border-radius: 6px;
  background: var(--color-bg-surface); color: var(--color-text-secondary);
  font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold);
  cursor: pointer; transition: all .15s;
}
.notice-page-btn:hover:not(:disabled) { border-color: var(--color-primary-300); color: var(--color-primary-600); }
.notice-page-btn--active { background: var(--color-primary-700); color: var(--color-white); border-color: var(--color-primary-700); }
.notice-page-btn:disabled { opacity: 0.35; cursor: default; }
</style>
