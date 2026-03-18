<script setup>
import BaseFilterTabs from '@/components/common/base/navigation/BaseFilterTabs.vue'

defineProps({
  list:       { type: Array,  required: true },
  tabs:       { type: Array,  required: true },
  activeTab:  { type: String, required: true },
  selectedId: { default: null },
})
defineEmits(['tab-change', 'select', 'confirm'])

const RESULT_STYLE = {
  '보류':     { bg: '#f0eeff', color: '#7468e2' },
  '승급 권장': { bg: '#fff3cd', color: '#b07800' },
  '승급 가능': { bg: '#e3fbef', color: '#007a60' },
  '승급 확정': { bg: '#00bf95', color: '#fff' },
}

function resultStyle(result) {
  return RESULT_STYLE[result] ?? RESULT_STYLE['보류']
}
</script>

<template>
  <article class="promo-list">
    <p class="promo-list__title">🏆 승급 심사 대상자 ({{ list.length }}명)</p>

    <BaseFilterTabs
      :items="tabs"
      :modelValue="activeTab"
      variant="chip"
      @change="$emit('tab-change', $event)"
    />

    <table class="promo-table">
      <thead>
        <tr>
          <th>이름</th>
          <th>현재Tier</th>
          <th>종합점수</th>
          <th>요건충족</th>
          <th>미달항목</th>
          <th>성장추이</th>
          <th>예상결과</th>
          <th>액션</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in list"
          :key="item.id"
          :class="{ 'promo-table__row--selected': selectedId === item.id }"
          @click="$emit('select', item.id)"
        >
          <td>
            <div class="promo-table__name">
              <span class="promo-table__avatar" :style="{ background: item.avatarColor }">
                {{ item.name[0] }}
              </span>
              {{ item.name }}
            </div>
          </td>
          <td>
            <span class="promo-table__tier">{{ item.currentTier }}→{{ item.targetTier }}</span>
          </td>
          <td class="promo-table__score">{{ item.totalScore }}</td>
          <td>
            <div class="promo-table__bar-wrap">
              <div
                class="promo-table__bar"
                :class="item.fulfillRate === 100 ? 'promo-table__bar--full' : item.fulfillRate >= 70 ? 'promo-table__bar--high' : 'promo-table__bar--low'"
                :style="{ width: item.fulfillRate + '%' }"
              />
            </div>
          </td>
          <td :class="{ 'promo-table__missing--red': item.missingCount > 0 }">
            {{ item.missingCount }}개
          </td>
          <td class="promo-table__trend">
            ▲{{ item.growthTrend }} {{ item.growthArrows }}
          </td>
          <td>
            <span class="promo-table__result" :style="{ background: resultStyle(item.result).bg, color: resultStyle(item.result).color }">
              {{ item.result }}
            </span>
          </td>
          <td>
            <button
              v-if="item.result === '승급 확정'"
              class="promo-table__btn promo-table__btn--confirm"
              @click.stop="$emit('confirm', item.id)"
            >확정처리</button>
            <button
              v-else
              class="promo-table__btn promo-table__btn--detail"
              @click.stop="$emit('select', item.id)"
            >상세보기</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="promo-list__actions">
      <button class="promo-list__btn promo-list__btn--confirm">
        승급 확정 ({{ list.filter(i => i.result === '승급 확정').length }}명)
      </button>
      <button class="promo-list__btn promo-list__btn--hold">일괄 보류</button>
      <button class="promo-list__btn promo-list__btn--excel">Excel 내보내기</button>
    </div>
  </article>
</template>

<style scoped>
.promo-list {
  flex: 1;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}
.promo-list__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-500);
}

/* 테이블 */
.promo-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}
.promo-table th {
  text-align: left;
  padding: 8px 10px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
  border-bottom: 1.5px solid var(--color-border-default);
}
.promo-table td {
  padding: 10px 10px;
  border-bottom: 1px solid var(--color-border-default);
  vertical-align: middle;
}
.promo-table tbody tr {
  cursor: pointer;
}
.promo-table tbody tr:hover { background: var(--color-primary-100); }
.promo-table__row--selected { background: var(--color-primary-100); }

.promo-table__name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}
.promo-table__avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 900;
  color: #fff;
  flex-shrink: 0;
}
.promo-table__tier {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-600);
}
.promo-table__score {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}
.promo-table__bar-wrap {
  width: 80px;
  height: 6px;
  background: var(--color-border-default);
  border-radius: 3px;
  overflow: hidden;
}
.promo-table__bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}
.promo-table__bar--full  { background: var(--color-mint-500); }
.promo-table__bar--high  { background: var(--color-mint-500); }
.promo-table__bar--low   { background: #ffd166; }

.promo-table__missing--red { color: var(--color-danger); font-weight: var(--font-weight-bold); }
.promo-table__trend { color: var(--color-mint-500); font-weight: var(--font-weight-bold); }

.promo-table__result {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border-radius: 10px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
}
.promo-table__btn {
  height: 24px;
  padding: 0 10px;
  border-radius: 6px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: none;
  white-space: nowrap;
}
.promo-table__btn--confirm {
  background: var(--color-mint-500);
  color: #fff;
}
.promo-table__btn--detail {
  background: var(--color-bg-app);
  color: var(--color-primary-600);
  border: 1px solid var(--color-border-default);
}

/* 하단 액션 */
.promo-list__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}
.promo-list__btn {
  height: 38px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  border: none;
}
.promo-list__btn--confirm {
  background: var(--color-mint-500);
  color: #fff;
}
.promo-list__btn--hold {
  background: var(--color-bg-app);
  color: var(--color-primary-600);
  border: 1.5px solid var(--color-border-default);
}
.promo-list__btn--excel {
  background: var(--color-bg-app);
  color: var(--color-primary-600);
  border: 1.5px solid var(--color-border-default);
}
</style>
