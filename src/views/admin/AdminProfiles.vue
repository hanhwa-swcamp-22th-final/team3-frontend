<script setup>
import { ref, computed, onMounted } from 'vue'
import employeeApi from '@/services/employeeApi.js'
import ProfileCreateUpdate from '@/components/admin/hr/ProfileCreateUpdate.vue'

// ── State ──────────────────────────────────────────
const employees      = ref([])
const isLoading      = ref(false)
const searchQuery    = ref('')
const selectedTier   = ref('전체')
const currentPage    = ref(1)
const pageSize       = 6

// 모달 상태 (STEP 4에서 ProfileCreateUpdate 연결)
const isModalOpen       = ref(false)
const editingEmployee   = ref(null)  // null=등록, object=수정

const tiers = ['전체', 'S', 'A', 'B', 'C']
const selectedLine = ref('전체')

// 라인 목록: db에 있는 고유 라인 값 추출
const lines = computed(() => {
  const unique = [...new Set(employees.value.map(e => e.employee_line).filter(Boolean))]
  return ['전체', ...unique.sort()]
})

// ── API 호출 (수업 패턴: try-catch-finally) ─────────
const fetchEmployees = async () => {
  isLoading.value = true
  try {
    const res = await employeeApi.getAll()
    employees.value = res.data
  } catch (e) {
    console.error('직원 목록 조회 실패:', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => { fetchEmployees() })

// ── 통계 카드 ───────────────────────────────────────
const totalCount = computed(() => employees.value.length)

const topTierCount = computed(() =>
  employees.value.filter(e =>
    e.employee_current_tier === 'S' || e.employee_current_tier === 'A'
  ).length
)

const topTierPercent = computed(() =>
  totalCount.value
    ? ((topTierCount.value / totalCount.value) * 100).toFixed(1)
    : 0
)

const avgScore = computed(() => {
  if (!employees.value.length) return 0
  const sum = employees.value.reduce((acc, e) => acc + (e.employee_capability_index || 0), 0)
  return (sum / employees.value.length).toFixed(1)
})

// ── 필터링 ──────────────────────────────────────────
const filteredEmployees = computed(() =>
  employees.value.filter(e => {
    const matchTier   = selectedTier.value === '전체' || e.employee_current_tier === selectedTier.value
    const matchLine   = selectedLine.value === '전체' || e.employee_line === selectedLine.value
    const matchSearch = e.employee_name.includes(searchQuery.value) ||
                        e.employee_code.includes(searchQuery.value)
    return matchTier && matchLine && matchSearch
  })
)

// ── 페이지네이션 ────────────────────────────────────
const totalPages = computed(() => Math.ceil(filteredEmployees.value.length / pageSize))

const pagedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredEmployees.value.slice(start, start + pageSize)
})

const pageStart = computed(() => (currentPage.value - 1) * pageSize + 1)
const pageEnd   = computed(() => Math.min(currentPage.value * pageSize, filteredEmployees.value.length))

const goPage = (p) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

const pageButtons = computed(() => {
  const total = totalPages.value
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  const cur = currentPage.value
  const pages = new Set([1, total, cur, cur - 1, cur + 1].filter(p => p >= 1 && p <= total))
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
})

// ── 모달 핸들러 (Kiosk AdminMenuManagement 패턴) ────
const openAddModal  = () => {
  editingEmployee.value = null
  isModalOpen.value = true
}
const openEditModal = (emp) => {
  editingEmployee.value = { ...emp }  // spread: 원본 배열 보호
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
  editingEmployee.value = null
}
const onSaved = () => { fetchEmployees() }

// ── 삭제 ────────────────────────────────────────────
const removeEmployee = async (id) => {
  if (!confirm('삭제하시겠습니까?')) return
  try {
    await employeeApi.delete(id)
    await fetchEmployees()
  } catch (e) {
    console.error('삭제 실패:', e)
  }
}

// ── 유틸 ────────────────────────────────────────────
const selectTier    = (tier) => { selectedTier.value = tier; currentPage.value = 1 }
const selectLine    = (line) => { selectedLine.value = line; currentPage.value = 1 }
const tierCount     = (tier) => employees.value.filter(e => e.employee_current_tier === tier).length
const tierBgColor   = (tier) => ({ S: '#00BF95', A: '#5B4FCF', B: '#FFD166', C: '#EF476F' }[tier] || '#9AAAC0')
const tierTextColor = (tier) => tier === 'B' ? '#1A1000' : '#FFFFFF'
const AVATAR_COLORS = ['#5B4FCF', '#3D35A0', '#1A8060', '#A07000', '#C0103E', '#7A6FA8', '#00BF95', '#EF476F']
const avatarBgColor = (emp) => AVATAR_COLORS[(emp.id - 1) % AVATAR_COLORS.length]
const formatDate    = (d) => d ? d.substring(0, 7).replace('-', '.') : '-'
</script>

<template>
  <div class="admin-profiles">

    <!-- 통계 카드 -->
    <div class="stat-cards">
      <div class="stat-card">
        <span class="stat-card__label">전체 인원</span>
        <span class="stat-card__value">{{ totalCount }}명</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">S+A Tier</span>
        <span class="stat-card__value">{{ topTierCount }}명</span>
        <span class="stat-card__sub">({{ topTierPercent }}%)</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">평균 종합점수</span>
        <span class="stat-card__value">{{ avgScore }}</span>
      </div>
    </div>

    <!-- 툴바 -->
    <div class="toolbar">
      <input
        v-model="searchQuery"
        class="toolbar__search"
        type="text"
        placeholder="🔍 이름 또는 사번 검색..."
        @input="currentPage = 1"
      />
      <select class="toolbar__select" v-model="selectedTier" @change="currentPage = 1">
        <option value="전체">Tier 전체</option>
        <option v-for="t in ['S','A','B','C']" :key="t" :value="t">{{ t }} 티어</option>
      </select>
      <select class="toolbar__select" v-model="selectedLine" @change="currentPage = 1">
        <option value="전체">라인 전체</option>
        <option v-for="l in lines.slice(1)" :key="l" :value="l">{{ l }}</option>
      </select>
      <button class="toolbar__btn" @click="openAddModal">+ 테크니션 등록</button>
    </div>

    <!-- 섹션 -->
    <div class="section">

      <div class="section-title">👥 전체 테크니션 목록</div>

      <!-- 필터 탭 -->
      <div class="filter-tabs">
        <button
          v-for="tier in tiers"
          :key="tier"
          class="filter-tab"
          :class="{ 'filter-tab--active': selectedTier === tier }"
          @click="selectTier(tier)"
        >
          {{ tier === '전체' ? `전체(${totalCount})` : `${tier}티어(${tierCount(tier)})` }}
        </button>
      </div>

      <!-- 테이블 헤더 -->
      <div class="table-header">
        <span class="col col--name">이름</span>
        <span class="col col--code">사번</span>
        <span class="col col--tier">Tier</span>
        <span class="col col--line">소속라인</span>
        <span class="col col--equip">배정설비</span>
        <span class="col col--date">입사일</span>
        <span class="col col--action">관리</span>
      </div>

      <!-- 로딩 -->
      <div v-if="isLoading" class="table-empty">불러오는 중...</div>

      <!-- 데이터 없음 -->
      <div v-else-if="filteredEmployees.length === 0" class="table-empty">
        검색 결과가 없습니다.
      </div>

      <!-- 테이블 행 -->
      <template v-else>
        <div
          v-for="emp in pagedEmployees"
          :key="emp.id"
          class="table-row"
        >
          <div class="col col--name">
            <div
              class="avatar"
              :style="{ backgroundColor: avatarBgColor(emp) }"
            >{{ emp.employee_name.charAt(0) }}</div>
            <span>{{ emp.employee_name }}</span>
          </div>
          <span class="col col--code">{{ emp.employee_code }}</span>
          <span class="col col--tier">
            <span
              class="tier-badge"
              :style="{ backgroundColor: tierBgColor(emp.employee_current_tier), color: tierTextColor(emp.employee_current_tier) }"
            >{{ emp.employee_current_tier }}</span>
          </span>
          <span class="col col--line">{{ emp.employee_line || '—' }}</span>
          <span class="col col--equip">{{ emp.employee_equipment || '—' }}</span>
          <span class="col col--date">{{ formatDate(emp.created_at) }}</span>
          <div class="col col--action">
            <button class="btn-edit" @click="openEditModal(emp)">수정</button>
            <button class="btn-delete" @click="removeEmployee(emp.id)">삭제</button>
          </div>
        </div>
      </template>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <div class="pagination__spacer"></div>
        <div class="pagination__pages">
          <button class="page-btn" @click="goPage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
          <template v-for="p in pageButtons" :key="p">
            <span v-if="p === '...'" class="page-ellipsis">...</span>
            <button
              v-else
              class="page-btn"
              :class="{ 'page-btn--active': p === currentPage }"
              @click="goPage(p)"
            >{{ p }}</button>
          </template>
          <button class="page-btn" @click="goPage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
        </div>
        <div class="pagination__spacer">
          <span class="pagination__info">
            {{ filteredEmployees.length > 0 ? `${pageStart}-${pageEnd} / ${filteredEmployees.length}명` : '0명' }}
          </span>
        </div>
      </div>

    </div>

    <!-- ProfileCreateUpdate 모달 -->
    <ProfileCreateUpdate
      :isOpen="isModalOpen"
      :employee="editingEmployee"
      @close="closeModal"
      @save="onSaved"
    />

  </div>
</template>

<style scoped>
.admin-profiles {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 24px 0;
  /* DashboardView header min-height: 80px 제외한 나머지 뷰포트 */
  height: calc(100vh - 80px);
  box-sizing: border-box;
  overflow: hidden;
}

/* 통계 카드 */
.stat-cards {
  display: flex;
  gap: 16px;
}

.stat-card {
  flex: 1;
  padding: 15px 17px;
  background: #FFFFFF;
  border: 1px solid #E0DCFF;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-card__label {
  font-size: 10px;
  color: #A89ED8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card__value {
  font-size: 30px;
  font-weight: 900;
  color: #2D1F6E;
  line-height: 1;
}

.stat-card__sub {
  font-size: 11px;
  color: #7A6FA8;
}

/* 툴바 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar__search {
  flex: 1;
  height: 37px;
  padding: 0 14px;
  border: 1px solid #E0DCFF;
  border-radius: 6px;
  font-size: 12px;
  color: #2D1F6E;
  outline: none;
}

.toolbar__search:focus { border-color: #5B4FCF; }

.toolbar__select {
  height: 37px;
  padding: 0 10px;
  border: 1px solid #E0DCFF;
  border-radius: 6px;
  font-size: 12px;
  color: #2D1F6E;
  background: #FFFFFF;
  cursor: pointer;
  outline: none;
}

.toolbar__select:focus { border-color: #5B4FCF; }

.toolbar__btn {
  height: 37px;
  padding: 0 16px;
  background: #5B4FCF;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

/* 섹션 — Figma: 516px 고정, 내용 넘치면 스크롤 */
.section {
  background: #FFFFFF;
  border: 1px solid #E0DCFF;
  border-radius: 12px;
  padding: 20px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.section-title {
  font-size: 9px;
  font-weight: 700;
  color: #A89ED8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

/* 필터 탭 */
.filter-tabs {
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #EEEBFF;
  margin-bottom: 12px;
}

.filter-tab {
  padding: 8px 0;
  font-size: 11px;
  font-weight: 700;
  color: #A89ED8;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  margin-bottom: -1px;
}

.filter-tab--active {
  color: #5B4FCF;
  border-bottom-color: #5B4FCF;
}

/* 테이블 헤더 */
.table-header {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #E0DCFF;
  font-size: 10px;
  color: #A89ED8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 테이블 행 */
.table-row {
  display: flex;
  align-items: center;
  height: 56px;
  border-bottom: 1px solid #EEEBFF;
  font-size: 12px;
  color: #2D1F6E;
}

.table-empty {
  padding: 40px 0;
  text-align: center;
  font-size: 13px;
  color: #A89ED8;
}

/* 컬럼 — Figma 픽셀 기준: total 1128px
   name:141 / code:128 / tier:90 / line:128 / equip:128 / date:103 / action:103 */
.col { display: flex; align-items: center; }
.col--name   { flex: 1.4; gap: 8px; }
.col--code   { flex: 1.3; }
.col--tier   { flex: 0.9; }
.col--line   { flex: 1.3; }
.col--equip  { flex: 1.3; }
.col--date   { flex: 1.1; }
.col--action { flex: 1.1; gap: 8px; }

/* 아바타 */
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  color: #FFFFFF;
  flex-shrink: 0;
}

/* Tier 뱃지 */
.tier-badge {
  padding: 2px 7px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 900;
}

/* 수정/삭제 버튼 */
.btn-edit {
  width: 52px;
  height: 26px;
  font-size: 12px;
  color: #5B4FCF;
  background: #F0EEFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete {
  width: 52px;
  height: 26px;
  font-size: 12px;
  color: #EF476F;
  background: #FFF0F3;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  align-items: center;
  padding-top: 16px;
}

.pagination__spacer {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.pagination__info {
  font-size: 11px;
  color: #A89ED8;
}

.pagination__pages {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #7A6FA8;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled { opacity: 0.4; cursor: default; }

.page-btn--active {
  background: #5B4FCF;
  color: #FFFFFF;
  border: 1px solid #7F75DB;
}

.page-ellipsis {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #7A6FA8;
}
</style>
