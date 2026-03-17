<template>
  <div class="kms-view">
    <!-- 상단 통계 카드 -->
    <KmsStatCards />

    <!-- 메인 2열 레이아웃 -->
    <div class="kms-layout">
      <!-- 좌: 피드 -->
      <div class="kms-feed-col">
        <KmsFeed
          :selectedFilter="selectedFilter"
          :selectedTagFilter="selectedTagFilter"
          @filterChange="selectedFilter = $event"
          @tagFilterChange="selectedTagFilter = $event"
        />
      </div>

      <!-- 우: 사이드 패널 -->
      <div class="kms-side-col">
        <div class="side-placeholder">[KmsSidePanel]</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import KmsStatCards from '@/components/admin/kms/KmsStatCards.vue'
import KmsFeed      from '@/components/admin/kms/KmsFeed.vue'

const selectedFilter = ref('전체')
const selectedTagFilter = ref(null)
</script>

<style scoped>
.kms-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: var(--color-bg-app, #fafbff);
  min-height: 100%;
  font-family: var(--font-family-base);
}

.kms-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.kms-feed-col {
  flex: 1;
  min-width: 0;
}

.kms-side-col {
  width: 280px;
  flex-shrink: 0;
}

.side-placeholder {
  background: var(--color-bg-surface, #ffffff);
  border: 1px solid var(--color-border-default, #e0dcff);
  border-radius: 12px;
  padding: 20px;
  color: var(--color-text-muted, #a89ed8);
  font-size: 13px;
}
</style>
