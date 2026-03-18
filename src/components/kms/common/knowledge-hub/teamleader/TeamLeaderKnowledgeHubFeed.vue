<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  articles: { type: Array, default: () => [] },
})

const emit = defineEmits(['open-write', 'open-detail'])

const activeCategory = ref('all')
const searchQuery = ref('')
const showAllCategories = ref(false)
const currentPage = ref(1)
const defaultVisibleCategoryCount = 4
const pageSize = 4

const primaryCategories = computed(() => props.categories.slice(0, defaultVisibleCategoryCount))
const hiddenCategories = computed(() => props.categories.slice(defaultVisibleCategoryCount))
const hasHiddenCategories = computed(() => hiddenCategories.value.length > 0)

const filteredArticles = computed(() => {
  let result = props.articles

  if (activeCategory.value === 'popular') {
    result = result.filter((item) => item.isPopular)
  } else if (activeCategory.value === 'latest') {
    result = [...result].sort((a, b) => b.id - a.id)
  } else if (activeCategory.value === 'subscribed') {
    result = result.filter((item) => item.isSubscribed)
  } else if (activeCategory.value !== 'all') {
    result = result.filter((item) => item.category === activeCategory.value)
  }

  const keyword = searchQuery.value.trim().toLowerCase()
  if (!keyword) {
    return result
  }

  return result.filter((item) => [item.title, item.preview, item.code, item.equipment].join(' ').toLowerCase().includes(keyword))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredArticles.value.length / pageSize)))

const pagedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredArticles.value.slice(start, start + pageSize)
})

const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

watch([activeCategory, searchQuery], () => {
  currentPage.value = 1
})

watch(filteredArticles, (articles) => {
  const nextTotal = Math.max(1, Math.ceil(articles.length / pageSize))
  if (currentPage.value > nextTotal) {
    currentPage.value = nextTotal
  }
})

function setCategory(categoryKey) {
  activeCategory.value = categoryKey
}

function setPage(page) {
  currentPage.value = page
}

function tierClass(tier) {
  if (tier === 'S') return 'feed__tier--s'
  if (tier === 'A') return 'feed__tier--a'
  if (tier === 'B') return 'feed__tier--b'
  return 'feed__tier--c'
}

function categoryClass(category) {
  const map = {
    정밀가공: 'feed__badge--precision',
    설비점검: 'feed__badge--inspection',
    품질관리: 'feed__badge--quality',
    안전관리: 'feed__badge--safety',
  }
  return map[category] || 'feed__badge--default'
}
</script>

<template>
  <section class="feed">
    <div class="feed__top">
      <div>
        <p class="feed__eyebrow">지식 허브</p>
        <h2 class="feed__title">지식 피드</h2>
      </div>
      <button type="button" class="feed__write-button" @click="emit('open-write')">지식 작성</button>
    </div>

    <div class="feed__controls">
      <div class="feed__tabs-wrap">
        <div class="feed__tabs-main">
          <div class="feed__tabs">
            <button
              v-for="category in primaryCategories"
              :key="category.key"
              type="button"
              class="feed__tab"
              :class="{ 'feed__tab--active': activeCategory === category.key }"
              @click="setCategory(category.key)"
            >
              {{ category.label }}
            </button>
          </div>

          <Transition name="feed-expand">
            <div v-if="showAllCategories" class="feed__tabs feed__tabs--expanded">
              <button
                v-for="category in hiddenCategories"
                :key="category.key"
                type="button"
                class="feed__tab"
                :class="{ 'feed__tab--active': activeCategory === category.key }"
                @click="setCategory(category.key)"
              >
                {{ category.label }}
              </button>
            </div>
          </Transition>
        </div>

        <button
          v-if="hasHiddenCategories"
          type="button"
          class="feed__more"
          @click="showAllCategories = !showAllCategories"
        >
          {{ showAllCategories ? '접기' : '+ 더보기' }}
        </button>
      </div>

      <input v-model="searchQuery" class="feed__search" type="text" placeholder="지식 검색" />
    </div>

    <div class="feed__list">
      <article
        v-for="article in pagedArticles"
        :key="article.id"
        class="feed__card"
        tabindex="0"
        @click="emit('open-detail', article)"
        @keydown.enter="emit('open-detail', article)"
        @keydown.space.prevent="emit('open-detail', article)"
      >
        <div class="feed__card-top">
          <div class="feed__badges">
            <span v-if="article.status === 'draft'" class="feed__badge feed__badge--draft">임시 저장</span>
            <span v-if="article.isPopular" class="feed__badge feed__badge--popular">인기</span>
            <span class="feed__badge" :class="categoryClass(article.category)">{{ article.category }}</span>
            <span class="feed__badge feed__badge--equip">{{ article.equipment }}</span>
          </div>
          <span class="feed__date">{{ article.date }}</span>
        </div>

        <div class="feed__code">{{ article.code }}</div>
        <h3 class="feed__card-title">{{ article.title }}</h3>
        <p class="feed__preview">{{ article.preview }}</p>

        <div class="feed__card-bottom">
          <div class="feed__author">
            <span class="feed__avatar">{{ article.authorInitial }}</span>
            <span class="feed__author-name">{{ article.author }}</span>
            <span class="feed__tier" :class="tierClass(article.authorTier)">{{ article.authorTier }}</span>
          </div>
          <div class="feed__meta"><span>댓글 {{ article.comments }}</span></div>
        </div>
      </article>

      <div v-if="filteredArticles.length === 0" class="feed__empty">조건에 맞는 문서가 없습니다.</div>
    </div>

    <div v-if="filteredArticles.length > 0" class="feed__pagination">
      <button
        v-for="page in pageNumbers"
        :key="page"
        type="button"
        class="feed__page"
        :class="{ 'feed__page--active': currentPage === page }"
        @click="setPage(page)"
      >
        {{ page }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.feed {
  border: 1px solid var(--color-border-default);
  border-radius: 20px;
  background: var(--color-bg-surface);
  padding: 22px;
  display: grid;
  gap: 16px;
}

.feed__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.feed__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.feed__title {
  margin-top: 6px;
  font-size: 26px;
  color: var(--color-primary-800);
}

.feed__write-button {
  height: 42px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: var(--color-primary-700);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.feed__controls {
  display: grid;
  gap: 12px;
}

.feed__tabs-wrap {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.feed__tabs-main {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.feed__tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feed__tabs--expanded {
  min-width: 0;
  overflow: hidden;
  flex-wrap: nowrap;
  flex: 1;
}

.feed__tab,
.feed__more {
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.feed__tab--active {
  border-color: var(--color-primary-700);
  background: var(--color-primary-700);
  color: #fff;
}

.feed__badge--draft {
  background: #fff4d8;
  color: #9a6a00;
}

.feed__more {
  color: var(--color-text-muted);
  margin-left: auto;
  flex-shrink: 0;
}

.feed__search {
  height: 42px;
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
}

.feed__list {
  display: grid;
  gap: 12px;
}

.feed__card {
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 18px 20px;
  display: grid;
  gap: 10px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.feed__card:hover,
.feed__card:focus-visible {
  border-color: var(--color-primary-300);
  box-shadow: 0 12px 24px rgba(62, 42, 156, 0.08);
  transform: translateY(-1px);
  outline: none;
}

.feed__card-top,
.feed__card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.feed__badges,
.feed__author,
.feed__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.feed__badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.feed__badge--popular { background: #fff1cc; color: #d98c00; }
.feed__badge--precision { background: #efeaff; color: var(--color-primary-700); }
.feed__badge--inspection { background: #e8fbf7; color: #10937f; }
.feed__badge--quality { background: #ffe8ef; color: #db2952; }
.feed__badge--safety { background: #edf4ff; color: #3662c7; }
.feed__badge--default,
.feed__badge--equip { background: #f4f4fb; color: var(--color-text-muted); }

.feed__date,
.feed__code,
.feed__preview,
.feed__meta {
  font-size: 13px;
  color: var(--color-text-muted);
}

.feed__card-title {
  font-size: 18px;
  color: var(--color-primary-800);
}

.feed__avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-700);
  color: #fff;
  font-weight: 700;
}

.feed__author-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-default);
}

.feed__tier {
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.feed__tier--s { background: #00bf95; color: #fff; }
.feed__tier--a { background: var(--color-primary-600); color: #fff; }
.feed__tier--b { background: #ffd166; color: #2d237c; }
.feed__tier--c { background: #ef476f; color: #fff; }

.feed__empty {
  min-height: 180px;
  display: grid;
  place-items: center;
  border: 1px dashed var(--color-border-default);
  border-radius: 16px;
  color: var(--color-text-muted);
}

.feed__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 4px;
}

.feed__page {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--color-border-default);
  background: #fff;
  color: var(--color-text-default);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.feed__page--active {
  border-color: var(--color-primary-700);
  background: var(--color-primary-700);
  color: #fff;
}

.feed-expand-enter-active,
.feed-expand-leave-active {
  transition: max-width 0.28s ease, opacity 0.22s ease, transform 0.22s ease;
}

.feed-expand-enter-from,
.feed-expand-leave-to {
  max-width: 0;
  opacity: 0;
  transform: translateX(-8px);
}

.feed-expand-enter-to,
.feed-expand-leave-from {
  max-width: 480px;
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 860px) {
  .feed__tabs-wrap,
  .feed__tabs-main {
    flex-wrap: wrap;
  }

  .feed__tabs--expanded {
    flex: 0 0 100%;
    flex-wrap: wrap;
  }

  .feed__more {
    margin-left: 0;
  }

  .feed-expand-enter-to,
  .feed-expand-leave-from {
    max-width: 100%;
  }
}

@media (max-width: 720px) {
  .feed__top,
  .feed__card-top,
  .feed__card-bottom {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
