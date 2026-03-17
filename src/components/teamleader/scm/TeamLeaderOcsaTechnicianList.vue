<script setup>
import { computed, ref, watch } from 'vue'
import { getTierColors } from '@/utils/tierColors'

const tierColors = getTierColors()

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  pageSize: {
    type: Number,
    default: 3,
  },
})

const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(props.items.length / props.pageSize)))
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return props.items.slice(start, start + props.pageSize)
})

watch(
  () => [props.items.length, props.pageSize],
  () => {
    currentPage.value = 1
  }
)

function tierBadgeStyle(tier) {
  const background = tierColors[tier] || '#6b5de0'
  return {
    backgroundColor: background,
    color: tier === 'B' ? '#3f2f00' : '#ffffff',
  }
}
</script>

<template>
  <section class="ocsa-tech-list">
    <header class="ocsa-tech-list__header">
      <p class="ocsa-tech-list__eyebrow">OCSA 기반 추천 테크니션</p>
    </header>

    <div class="ocsa-tech-list__body">
      <article
        v-for="(item, index) in paginatedItems"
        :key="item.id"
        class="ocsa-tech-list__item"
      >
        <div class="ocsa-tech-list__left">
          <span class="ocsa-tech-list__rank">{{ (currentPage - 1) * pageSize + index + 1 }}</span>
          <span class="ocsa-tech-list__avatar" :class="`ocsa-tech-list__avatar--${item.avatarTone}`">{{ item.avatar }}</span>
          <strong>{{ item.name }}</strong>
          <span class="ocsa-tech-list__tier" :style="tierBadgeStyle(item.tier)">{{ item.tier }}</span>
        </div>
        <strong class="ocsa-tech-list__score">{{ item.score }}</strong>
      </article>

      <div v-if="!paginatedItems.length" class="ocsa-tech-list__empty">
        추천 가능한 테크니션이 없습니다.
      </div>
    </div>

    <footer class="ocsa-tech-list__pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="ocsa-tech-list__page"
        :class="{ 'ocsa-tech-list__page--active': page === currentPage }"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
    </footer>
  </section>
</template>

<style scoped>
.ocsa-tech-list {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 14px;
  min-height: 100%;
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 22px;
  background: var(--color-bg-surface);
}

.ocsa-tech-list__eyebrow {
  font-size: 13px;
  font-weight: 800;
  color: var(--color-primary-600);
}

.ocsa-tech-list__body {
  display: grid;
  align-content: start;
  gap: 10px;
  min-height: 0;
}

.ocsa-tech-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 72px;
  padding: 14px 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 14px;
}

.ocsa-tech-list__left {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-primary-800);
}

.ocsa-tech-list__rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-primary-500);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.ocsa-tech-list__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
}

.ocsa-tech-list__avatar--purple { background: #5f50d6; }
.ocsa-tech-list__avatar--green { background: #269063; }
.ocsa-tech-list__avatar--gold { background: #c08b00; }
.ocsa-tech-list__avatar--slate { background: #6f659f; }

.ocsa-tech-list__tier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
}

.ocsa-tech-list__score {
  font-size: 28px;
  color: var(--color-primary-700);
}

.ocsa-tech-list__empty {
  display: grid;
  place-items: center;
  min-height: 160px;
  border: 1px dashed var(--color-border-default);
  border-radius: 14px;
  color: var(--color-text-muted);
}

.ocsa-tech-list__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
}

.ocsa-tech-list__page {
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-border-default);
  border-radius: 10px;
  background: #fff;
  color: var(--color-primary-500);
  font-weight: 700;
  cursor: pointer;
}

.ocsa-tech-list__page--active {
  background: var(--color-primary-600);
  border-color: var(--color-primary-600);
  color: #fff;
}
</style>
