<script setup>
import { ref, computed } from 'vue'
import KeywordToolbar from '@/components/admin/scm/KeywordToolbar.vue'
import KeywordTable   from '@/components/admin/scm/KeywordTable.vue'
import KeywordModal   from '@/components/admin/scm/KeywordModalWrapper.vue'
import { DUMMY_KEYWORDS, PAGE_SIZE } from '@/mocks/admin/keyword/keywordData.js'

const keywords         = ref(DUMMY_KEYWORDS.map(k => ({ ...k })))
const searchQuery      = ref('')
const selectedCategory = ref('전체 카테고리')
const currentPage      = ref(1)

// ── 필터링 ──────────────────────────────────────────
const filteredKeywords = computed(() =>
  keywords.value.filter(k => {
    const matchCat    = selectedCategory.value === '전체 카테고리' || k.category === selectedCategory.value
    const matchSearch = k.keyword.includes(searchQuery.value) || k.description.includes(searchQuery.value)
    return matchCat && matchSearch
  })
)

// ── 페이지네이션 ────────────────────────────────────
const totalPages   = computed(() => Math.max(1, Math.ceil(filteredKeywords.value.length / PAGE_SIZE)))
const pagedKeywords = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredKeywords.value.slice(start, start + PAGE_SIZE)
})

// ── 핸들러 ───────────────────────────────────────────
const onSearch         = (v) => { searchQuery.value      = v; currentPage.value = 1 }
const onCategoryChange = (v) => { selectedCategory.value = v; currentPage.value = 1 }

// ── 모달 핸들러 ─────────────────────────────────────
const isModalOpen    = ref(false)
const editingKeyword = ref(null)

const openAddModal  = ()   => { editingKeyword.value = null;      isModalOpen.value = true }
const openEditModal = (kw) => { editingKeyword.value = { ...kw }; isModalOpen.value = true }
const closeModal    = ()   => { isModalOpen.value = false; editingKeyword.value = null }

const onSave = (kw) => {
  if (kw.id) {
    const idx = keywords.value.findIndex(k => k.id === kw.id)
    if (idx !== -1) keywords.value[idx] = { ...kw }
  } else {
    const newId = Math.max(...keywords.value.map(k => k.id)) + 1
    keywords.value.push({ ...kw, id: newId })
  }
  closeModal()
}

const onEditClick   = (kw) => { openEditModal(kw) }
const onDeleteClick = (id) => {
  if (!confirm('삭제하시겠습니까?')) return
  const idx = keywords.value.findIndex(k => k.id === id)
  if (idx !== -1) keywords.value.splice(idx, 1)
}
</script>

<template>
  <div class="admin-domain-keywords">

    <!-- 헤더 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">도메인 키워드 관리</h1>
        <p class="page-desc">NLP 정성평가에 사용되는 제조 도메인 키워드 사전</p>
      </div>
      <button class="btn-add" @click="openAddModal">+ 키워드 등록</button>
    </div>

    <!-- 툴바 -->
    <KeywordToolbar
      :searchQuery="searchQuery"
      :selectedCategory="selectedCategory"
      @search="onSearch"
      @categoryChange="onCategoryChange"
    />

    <!-- 테이블 -->
    <KeywordTable
      :keywords="pagedKeywords"
      @editClick="onEditClick"
      @deleteClick="onDeleteClick"
    />

    <!-- 모달 -->
    <KeywordModal
      :isOpen="isModalOpen"
      :keyword="editingKeyword"
      @close="closeModal"
      @save="onSave"
    />

    <!-- 페이지네이션 -->
    <div class="pagination">
      <span class="pagination-info">총 {{ filteredKeywords.length }}개 키워드 등록됨</span>
      <div class="pagination-btns">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">＜</button>
        <button
          v-for="p in totalPages"
          :key="p"
          class="page-btn"
          :class="{ 'page-btn--active': currentPage === p }"
          @click="currentPage = p"
        >{{ p }}</button>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">＞</button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.admin-domain-keywords {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  flex: 1;
  min-width: 0;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  overflow: hidden;

}

/* 헤더 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary-800);
  margin: 0;
}

.page-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
}

.btn-add {
  height: 36px;
  padding: 0 20px;
  background: var(--color-primary-600);
  border: 1px solid var(--color-primary-500);
  border-radius: var(--radius-2xs);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-bg-surface);

  cursor: pointer;
  flex-shrink: 0;
}

.btn-add:hover { background: var(--color-primary-700); }

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.pagination-info {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.pagination-btns {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn {
  width: 28px;
  height: 28px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);

  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:disabled { opacity: 0.4; cursor: default; }
.page-btn--active  { background: var(--color-primary-600); color: var(--color-bg-surface); border-color: var(--color-primary-600); }
.page-btn:not(:disabled):not(.page-btn--active):hover { background: var(--color-primary-100); }
</style>
