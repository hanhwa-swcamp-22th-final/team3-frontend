<script setup>
import { ref, computed } from 'vue'
import KeywordToolbar from '@/components/admin/scm/KeywordToolbar.vue'
import KeywordTable   from '@/components/admin/scm/KeywordTable.vue'
import KeywordModal   from '@/components/admin/scm/KeywordModalWrapper.vue'
import { BaseButton } from '@/components/common/base'
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
const totalCount    = computed(() => filteredKeywords.value.length)
const totalPages    = computed(() => Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)))
const pagedKeywords = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredKeywords.value.slice(start, start + PAGE_SIZE)
})
const pageStart = computed(() => totalCount.value === 0 ? 0 : (currentPage.value - 1) * PAGE_SIZE + 1)
const pageEnd   = computed(() => Math.min(currentPage.value * PAGE_SIZE, totalCount.value))

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
      <BaseButton variant="primary" size="sm" @click="openAddModal">+ 키워드 등록</BaseButton>
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
      :currentPage="currentPage"
      :totalPages="totalPages"
      :totalCount="totalCount"
      :pageStart="pageStart"
      :pageEnd="pageEnd"
      @editClick="onEditClick"
      @deleteClick="onDeleteClick"
      @pageChange="currentPage = $event"
    />

    <!-- 모달 -->
    <KeywordModal
      :isOpen="isModalOpen"
      :keyword="editingKeyword"
      @close="closeModal"
      @save="onSave"
    />


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


</style>
