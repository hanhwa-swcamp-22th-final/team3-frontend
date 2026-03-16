<script setup>
import { computed, ref } from 'vue'
import TeamLeaderNoticeFilterBar from '@/components/teamleader/hr/TeamLeaderNoticeFilterBar.vue'
import TeamLeaderNoticeList from '@/components/teamleader/hr/TeamLeaderNoticeList.vue'
import TeamLeaderNoticeDetailPanel from '@/components/teamleader/hr/TeamLeaderNoticeDetailPanel.vue'

const filters = [
  { key: 'all', label: '전체' },
  { key: 'urgent', label: '긴급' },
  { key: 'education', label: '교육' },
  { key: 'inspection', label: '점검' },
  { key: 'hrm', label: '작성자: HRM 전체' },
]

const activeFilter = ref('all')
const selectedNoticeId = ref(1)

const notices = [
  {
    id: 1,
    category: 'inspection',
    pin: true,
    status: '게시중',
    title: '3월 18일 정기 설비 점검으로 인한 작업 배치 변경 안내',
    summary: '오전 09:00~11:00 동안 2라인 검사설비 정기 점검이 진행됩니다. 해당 시간대 작업자는 대체 공정으로 우선 배치되며, 점검 종료 후 원복 예정입니다.',
    author: '작성자 HRM_운영관리',
    schedule: '2026.03.13 09:20',
    target: '대상: TL / GL / Worker',
    views: '조회 128',
    attachmentLabel: '설비점검_대체배치표.xlsx / 안전체크리스트.pdf',
  },
  {
    id: 2,
    category: 'education',
    pin: false,
    status: '게시중',
    title: 'KPI 리포트 반영 일정 및 평가 결과 공개 기준',
    summary: '이번 달 평가 결과는 3월 21일 18시 이후 확인 가능합니다. 1차 확인 후 이의신청 기간은 3일입니다.',
    author: '작성자 HRM_평가운영',
    schedule: '2026.03.12 14:00',
    target: '대상: TL / GL',
    views: '조회 74',
    attachmentLabel: '평가 결과 공개 기준.pdf',
  },
  {
    id: 3,
    category: 'urgent',
    pin: false,
    status: '예약',
    title: '신규 KMS 등록 가이드 배포',
    summary: '현장 개선 사례 등록 시 필수 입력 항목과 승인 절차가 업데이트됩니다.',
    author: '작성자 KMS_Admin',
    schedule: '2026.03.14 08:00 예약',
    target: '대상: TL / Worker',
    views: '조회 예정',
    attachmentLabel: 'KMS_등록가이드_v2.pdf',
  },
  {
    id: 4,
    category: 'inspection',
    pin: false,
    status: '게시중',
    title: '주간 설비 점검 체크리스트 배포',
    summary: '라인별 점검 체크리스트 항목이 최신 버전으로 갱신되었습니다.',
    author: '작성자 HRM_운영관리',
    schedule: '2026.03.11 11:30',
    target: '대상: TL / Worker',
    views: '조회 51',
    attachmentLabel: '주간_점검체크리스트.pdf',
  },
]

const filteredNotices = computed(() => {
  if (activeFilter.value === 'all') {
    return notices
  }

  if (activeFilter.value === 'hrm') {
    return notices.filter((notice) => notice.author.includes('HRM'))
  }

  return notices.filter((notice) => notice.category === activeFilter.value)
})

const selectedNotice = computed(() => {
  return filteredNotices.value.find((notice) => notice.id === selectedNoticeId.value) ?? filteredNotices.value[0]
})

function handleFilterChange(filterKey) {
  activeFilter.value = filterKey
  selectedNoticeId.value = filteredNotices.value[0]?.id ?? null
}

function handleSelectNotice(noticeId) {
  selectedNoticeId.value = noticeId
}
</script>

<template>
  <section class="teamleader-noticeboard-view">
    <header class="teamleader-noticeboard-view__header">
      <h1>공지 목록</h1>
      <span>총 {{ notices.length }}건</span>
    </header>

    <section class="teamleader-noticeboard-view__content">
      <div class="teamleader-noticeboard-view__main">
        <TeamLeaderNoticeFilterBar
          :filters="filters"
          :active-filter="activeFilter"
          @change-filter="handleFilterChange"
        />
        <TeamLeaderNoticeList
          :items="filteredNotices"
          :selected-id="selectedNotice?.id"
          :page-size="3"
          @select-notice="handleSelectNotice"
        />
      </div>

      <TeamLeaderNoticeDetailPanel :notice="selectedNotice" />
    </section>
  </section>
</template>

<style scoped>
.teamleader-noticeboard-view {
  width: 100%;
  min-width: 0;
  padding: 14px 10px;
  box-sizing: border-box;
  background: var(--color-bg-app);
}

.teamleader-noticeboard-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 8px 4px;
}

.teamleader-noticeboard-view__header h1 {
  font-size: 32px;
  color: var(--color-primary-800);
}

.teamleader-noticeboard-view__header span {
  color: var(--color-primary-300);
  font-size: 15px;
  font-weight: 700;
}

.teamleader-noticeboard-view__content {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(360px, 1fr);
  gap: 16px;
  align-items: start;
}

.teamleader-noticeboard-view__main {
  display: grid;
  gap: 0;
  align-content: start;
}

@media (max-width: 1180px) {
  .teamleader-noticeboard-view__content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .teamleader-noticeboard-view {
    padding: 12px;
  }

  .teamleader-noticeboard-view__header h1 {
    font-size: 24px;
  }
}
</style>
