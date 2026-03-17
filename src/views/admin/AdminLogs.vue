<script setup>
import { ref, computed } from 'vue'
import LogServiceCards from '@/components/admin/scm/LogServiceCards.vue'
import LogToolbar      from '@/components/admin/scm/LogToolbar.vue'
import LogViewer       from '@/components/admin/scm/LogViewer.vue'
import LogMonitorPanel from '@/components/admin/scm/LogMonitorPanel.vue'
import { DUMMY_LOGS }  from '@/mocks/admin/logs/logData.js'

// ── State ──────────────────────────────────────────
const selectedFilter = ref('전체')
const searchQuery    = ref('')

// ── 필터링 ──────────────────────────────────────────
const filteredLogs = computed(() =>
  DUMMY_LOGS.filter(log => {
    const matchFilter = selectedFilter.value === '전체' || log.level === selectedFilter.value
    const matchSearch = log.message.includes(searchQuery.value) ||
                        log.time.includes(searchQuery.value)
    return matchFilter && matchSearch
  })
)

// ── 핸들러 ───────────────────────────────────────────
const onFilterChange = (f) => { selectedFilter.value = f }
const onSearch       = (v) => { searchQuery.value    = v }
</script>

<template>
  <div class="admin-logs">

    <!-- 상단 상태바 -->
    <div class="status-bar">
      <div class="status-normal">
        <span class="status-dot" />
        <span class="status-text">시스템 정상</span>
      </div>
      <span class="status-batch">마지막 배치: 03.09 02:00</span>
      <button class="btn-refresh">새로고침</button>
    </div>

    <!-- 서비스 상태 카드 -->
    <LogServiceCards />

    <!-- 메인 컨텐츠 -->
    <div class="content">

      <!-- 좌측: 로그 섹션 -->
      <div class="log-section">
        <span class="section-title">📋 실시간 시스템 로그</span>
        <LogToolbar
          :selectedFilter="selectedFilter"
          :searchQuery="searchQuery"
          @filterChange="onFilterChange"
          @search="onSearch"
        />
        <LogViewer :logs="filteredLogs" />
      </div>

      <!-- 우측: 모니터링 패널 -->
      <LogMonitorPanel />

    </div>

  </div>
</template>

<style scoped>
.admin-logs {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  flex: 1;
  min-width: 0;
  height: calc(100vh - 80px);
  box-sizing: border-box;
  overflow: hidden;
  font-family: 'Pretendard', sans-serif;
}

/* 상태바 */
.status-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.status-normal {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  height: 30px;
  border-radius: 4px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00bf95;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(0, 191, 149, 0.15);
  flex-shrink: 0;
}

.status-text {
  font-size: 11px;
  font-weight: 700;
  color: #7a6fa8;
}

.status-batch {
  font-size: 10px;
  color: #a89ed8;
}

.btn-refresh {
  height: 35px;
  padding: 0 14px;
  background: #ffffff;
  border: 1.5px solid #e0dcff;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #7a6fa8;
  font-family: 'Pretendard', sans-serif;
  cursor: pointer;
}

.btn-refresh:hover { background: #f0eeff; color: #5b4fcf; }

/* 메인 컨텐츠 */
.content {
  display: flex;
  gap: 14px;
  flex: 1;
  min-height: 0;
}

/* 로그 섹션 */
.log-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
  padding: 21.5px;
  background: #ffffff;
  border: 1.5px solid #e0dcff;
  border-radius: 12px;
  overflow: hidden;
}

.section-title {
  font-size: 12px;
  font-weight: 900;
  color: #7a6fa8;
  flex-shrink: 0;
}
</style>
