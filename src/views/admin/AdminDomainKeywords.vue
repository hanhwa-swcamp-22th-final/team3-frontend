<script setup>
import { ref } from 'vue'
import KeywordToolbar from '@/components/admin/scm/KeywordToolbar.vue'

const searchQuery      = ref('')
const selectedCategory = ref('전체 카테고리')

const onSearch         = (v) => { searchQuery.value      = v }
const onCategoryChange = (v) => { selectedCategory.value = v }
</script>

<template>
  <div class="admin-domain-keywords">

    <!-- 헤더 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">도메인 키워드 관리</h1>
        <p class="page-desc">NLP 정성평가에 사용되는 제조 도메인 키워드 사전</p>
      </div>
      <button class="btn-add">+ 키워드 등록</button>
    </div>

    <!-- 툴바 -->
    <KeywordToolbar
      :searchQuery="searchQuery"
      :selectedCategory="selectedCategory"
      @search="onSearch"
      @categoryChange="onCategoryChange"
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
  font-family: 'Pretendard', sans-serif;
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
  color: #2d1f6e;
  margin: 0;
}

.page-desc {
  font-size: 13px;
  color: #7a6fa8;
  margin: 0;
}

.btn-add {
  height: 36px;
  padding: 0 20px;
  background: #5b4fcf;
  border: 1px solid #7f75db;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
  flex-shrink: 0;
}

.btn-add:hover { background: #4a3fb0; }
</style>
