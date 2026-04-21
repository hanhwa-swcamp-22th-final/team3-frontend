<script setup>
import { ref, computed } from 'vue'
import { NOTICE_FILTER_TABS } from '@/constants'

const props = defineProps({
  notices:          { type: Array, required: true },
  selectedId:       { type: [Number, null], default: null },
  showCreateButton: { type: Boolean, default: false },
  filterTabs:       { type: Array, default: () => NOTICE_FILTER_TABS },
  allowHideImportant: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'create'])

const activeTab        = ref('')
const searchQuery      = ref('')
const hideImportant    = ref(false)
const PAGE_SIZE        = 5
const currentPage      = ref(1)

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return props.notices
    .filter(n => {
      if (activeTab.value === '중요' && !n.isImportant) return false
      if (activeTab.value && activeTab.value !== '중요' && n.status !== activeTab.value) return false
      if (hideImportant.value && activeTab.value !== '중요' && n.isImportant) return false
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

function setTab(tab) {
  activeTab.value = tab === '전체' ? '' : (activeTab.value === tab ? '' : tab)
  currentPage.value = 1
}

function statusClass(status) {
  return {
    게시중: 'notice-badge--published',
    중요: 'notice-badge--important',
    예약: 'notice-badge--scheduled',
    임시: 'notice-badge--draft',
  }[status] ?? ''
}
</script>

<template>
  <div class="notice-card">
    <div class="notice-header">
      <div>
        <p class="notice-header__eyebrow">공지 대상 목록</p>
        <h2 class="notice-header__title">공지 목록</h2>
      </div>
      <span class="notice-header__count">총 {{ notices.length }}건</span>
    </div>

    <div class="notice-toolbar">
      <div class="notice-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab"
          class="notice-tab"
          :class="{ 'notice-tab--active': tab === '전체' ? activeTab === '' : activeTab === tab }"
          @click="setTab(tab)"
        >{{ tab }}</button>
      </div>

      <div class="notice-toolbar__actions">
        <button
          v-if="allowHideImportant && activeTab !== '중요'"
          class="notice-tab"
          :class="{ 'notice-tab--active': hideImportant }"
          @click="hideImportant = !hideImportant; currentPage = 1"
        >중요 숨기기</button>
        <div class="notice-search">
          <input
            v-model="searchQuery"
            class="notice-search__input"
            placeholder="제목 검색"
            @input="currentPage = 1"
          />
        </div>
        <button v-if="showCreateButton" class="notice-create-btn" @click="emit('create')">+공지등록</button>
      </div>
    </div>

    <div class="notice-board">
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
        <div class="notice-row__main">
          <div class="notice-row__topline">
            <span
              class="notice-row__number"
              :class="{ 'notice-row__number--important': n.isImportant }"
            >{{ n.isImportant ? '중요 공지' : `공지 #${n.id}` }}</span>
            <span
              class="notice-badge"
              :class="statusClass(n.status)"
            >{{ n.status }}</span>
          </div>
          <p class="notice-row__title">{{ n.title }}</p>
          <div class="notice-row__meta">
            <span class="notice-row__meta-item">작성자 {{ n.author ?? '-' }}</span>
            <span class="notice-row__meta-dot" />
            <span class="notice-row__meta-item">{{ n.date ?? '미게시' }}</span>
            <span class="notice-row__meta-dot" />
            <span class="notice-row__meta-item">조회 {{ n.views ?? 0 }}</span>
          </div>
        </div>
      </div>
    </div>

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
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  padding: 20px;
  display: flex; flex-direction: column; gap: 16px;
  overflow: hidden;
  min-height: 0;
  box-sizing: border-box;
}

.notice-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; }
.notice-header__eyebrow {
  margin: 0 0 4px;
  color: var(--color-primary-500);
  font-size: var(--font-size-xs-plus);
  font-weight: var(--font-weight-semibold);
}
.notice-header__title {
  font-size: var(--font-size-xl); font-weight: var(--font-weight-extrabold);
  color: var(--color-primary-800); white-space: nowrap;
  margin: 0;
}
.notice-header__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f5f2ff;
  color: #8a7bd1;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}

.notice-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #ece8ff;
  border-radius: 16px;
  background: linear-gradient(180deg, #fff 0%, #fcfbff 100%);
}
.notice-toolbar__actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.notice-tabs { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; flex-shrink: 1; min-width: 0; }
.notice-tab {
  height: 32px; padding: 0 12px;
  border-radius: 20px; font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  cursor: pointer;
  border: 1px solid var(--color-border-default);
  background: var(--color-bg-surface);
  color: var(--color-primary-400);
  transition: all .15s;
  white-space: nowrap;
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
  height: auto; min-height: 29px; max-width: 110px; text-wrap: wrap;
}
.notice-tab--org.notice-tab--active {
  background: var(--color-primary-100); color: var(--color-primary-700);
  border-color: var(--color-primary-300);
}

.notice-org-wrap { position: relative; }
.notice-org-popup { position: absolute; top: calc(100% + 6px); left: 0; z-index: 20; }

.notice-search {
  display: flex; align-items: center;
  height: 36px; padding: 0 12px;
  border: 1px solid var(--color-border-default);
  border-radius: 10px; background: var(--color-bg-surface);
}
.notice-search:focus-within { border-color: var(--color-primary-300); }
.notice-search__input {
  border: none; outline: none; background: transparent;
  font-size: var(--font-size-sm); color: var(--color-text-default);
  width: 130px;
}
.notice-search__input::placeholder { color: var(--color-text-muted); }

.notice-create-btn {
  height: 36px; padding: 0 14px; flex-shrink: 0;
  background: var(--color-primary-700); color: var(--color-white);
  border: none; border-radius: 10px; font-size: var(--font-size-sm); font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: background-color .15s, color .15s, border-color .15s;
}

.notice-create-btn:hover {
  background: var(--color-primary-800);
}

.notice-board {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 6px;
  background: transparent;
}
.notice-row {
  display: block;
  padding: 12px 16px;
  border: 1px solid #ece6ff;
  border-radius: 16px;
  cursor: pointer;
  transition: background .12s, border-color .12s;
  background: #fff;
}
.notice-row:hover {
  background: #fbf9ff;
  border-color: #daccff;
}
.notice-row--selected {
  background: #f7f3ff;
  border-color: #cfc0ff;
}
.notice-list__empty {
  padding: 32px 0; text-align: center;
  font-size: var(--font-size-sm); color: #a89ed8;
}

.notice-row__main {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.notice-row__topline {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.notice-row__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: #f5f2ff;
  color: #8d82d8;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.notice-row__number--important {
  background: #fff1f3;
  color: #c24157;
}

.notice-badge {
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 20px;
  font-size: var(--font-size-xs-plus); font-weight: var(--font-weight-bold);
  white-space: nowrap;
  flex-shrink: 0;
}
.notice-badge--published {
  background: #e3fbef;
  color: #007a60;
}
.notice-badge--important {
  background: var(--color-primary-100);
  color: var(--color-primary-600);
}
.notice-badge--scheduled {
  background: #fff8e1;
  color: #b45309;
}
.notice-badge--draft {
  background: #ffecf1;
  color: #c0103e;
}
.notice-row__title {
  min-width: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
  margin: 0;
  overflow: hidden;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: normal;
  text-overflow: ellipsis;
}

.notice-row__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex-wrap: wrap;
}

.notice-row__meta-item {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-sm);
  line-height: 1.3;
  color: var(--color-text-muted);
}

.notice-row__meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #c7bdf5;
  flex-shrink: 0;
}

/* 페이지네이션 */
.notice-pagination { display: flex; align-items: center; justify-content: center; gap: 4px; padding-top: 4px; flex-shrink: 0; }
.notice-page-btn {
  min-width: 28px; height: 28px; padding: 0 6px;
  border: 1px solid var(--color-border-default); border-radius: 8px;
  background: var(--color-bg-surface); color: var(--color-text-secondary);
  font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);
  cursor: pointer; transition: all .15s;
}
.notice-page-btn:hover:not(:disabled) { border-color: var(--color-primary-300); color: var(--color-primary-600); }
.notice-page-btn--active { background: var(--color-primary-700); color: var(--color-white); border-color: var(--color-primary-700); }
.notice-page-btn:disabled { opacity: 0.35; cursor: default; }

@media (max-width: 1320px) {
  .notice-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .notice-toolbar__actions {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
}

@media (max-width: 820px) {
  .notice-card {
    padding: 16px;
  }

  .notice-row {
    padding: 12px 14px;
  }
}
</style>
