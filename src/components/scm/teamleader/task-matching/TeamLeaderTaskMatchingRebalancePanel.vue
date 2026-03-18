<script setup>
const props = defineProps({
  summaryCards: { type: Array, default: () => [] },
  lines: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  matrixRows: { type: Array, default: () => [] },
  technicians: { type: Array, default: () => [] },
  suggestions: { type: Array, default: () => [] },
})

function toneClass(tone) {
  return `rebalance__segment--${tone}`
}

function badgeToneClass(tone) {
  return `rebalance__tech--${tone}`
}
</script>

<template>
  <section class="rebalance">
    <section class="rebalance__summary">
      <article v-for="card in summaryCards" :key="card.label" class="rebalance-stat">
        <p>{{ card.label }}</p>
        <strong :class="`rebalance-stat__value rebalance-stat__value--${card.tone}`">{{ card.value }}</strong>
        <span v-if="card.helper">{{ card.helper }}</span>
      </article>
    </section>

    <section class="rebalance__grid">
      <article class="rebalance-card">
        <p class="rebalance-card__eyebrow">라인별 인원 배치 현황</p>
        <div class="rebalance-card__lines">
          <article v-for="line in lines" :key="line.id" class="rebalance-line">
            <div class="rebalance-line__head">
              <strong>{{ line.title }}</strong>
              <span>{{ line.count }}</span>
            </div>
            <div class="rebalance-line__bar">
              <span v-for="segment in line.segments" :key="`${line.id}-${segment.label}`" class="rebalance-line__segment" :class="toneClass(segment.tone)" :style="{ width: `${segment.value}%` }"></span>
            </div>
            <p class="rebalance-line__helper" :class="{ 'rebalance-line__helper--warning': line.warning }">{{ line.helper }}</p>
          </article>
        </div>
        <div class="rebalance-card__suggestions">
          <p class="rebalance-card__eyebrow">AI 배치 최적화 제안</p>
          <ul>
            <li v-for="item in suggestions" :key="item">{{ item }}</li>
          </ul>
        </div>
      </article>

      <article class="rebalance-card">
        <p class="rebalance-card__eyebrow">Tier × 설비숙련도 배치 매트릭스</p>
        <div class="rebalance-table-simplified">
          <div class="rebalance-table-simplified__row rebalance-table-simplified__row--header">
            <span></span>
            <span v-for="column in columns" :key="column">{{ column }}</span>
          </div>
          <div v-for="row in matrixRows" :key="row.tier" class="rebalance-table-simplified__row">
            <strong>{{ row.tier }}</strong>
            <div v-for="(cell, index) in row.cells" :key="`${row.tier}-${index}`" class="rebalance-table-simplified__cell">
              <span v-for="person in cell" :key="`${row.tier}-${index}-${person.initial}`" class="rebalance__tech" :class="badgeToneClass(person.tone)">{{ person.initial }}</span>
            </div>
          </div>
        </div>

        <div class="rebalance-card__people">
          <p class="rebalance-card__eyebrow">전체 인원 현황 ({{ technicians.length }}명)</p>
          <div class="rebalance-card__people-list">
            <article v-for="person in technicians" :key="person.id" class="rebalance-card__person">
              <span class="rebalance__tech" :class="badgeToneClass(person.tone)">{{ person.initial }}</span>
              <strong>{{ person.name }}</strong>
              <span>{{ person.tier }}</span>
            </article>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.rebalance { display: grid; gap: 16px; }
.rebalance__summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.rebalance-stat, .rebalance-card { border: 1px solid var(--color-border-default); border-radius: 20px; background: var(--color-bg-surface); }
.rebalance-stat { padding: 18px; display: grid; gap: 8px; }
.rebalance-stat p, .rebalance-card__eyebrow, .rebalance-line__helper, .rebalance-card li, .rebalance-card__person span, .rebalance-table-simplified__row span { font-size: 12px; color: var(--color-text-muted); }
.rebalance-stat__value { font-size: 52px; line-height: 1; font-weight: 800; }
.rebalance-stat__value--primary { color: var(--color-primary-700); } .rebalance-stat__value--success { color: #18b9a7; } .rebalance-stat__value--warning { color: #f0b539; } .rebalance-stat__value--danger { color: #ef4f74; }
.rebalance__grid { display: grid; grid-template-columns: minmax(320px, 0.95fr) minmax(0, 1.4fr); gap: 16px; }
.rebalance-card { padding: 18px; display: grid; gap: 16px; }
.rebalance-card__lines { display: grid; gap: 12px; }
.rebalance-line { border: 1px solid var(--color-border-default); border-radius: 16px; padding: 14px; display: grid; gap: 10px; }
.rebalance-line__head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.rebalance-line__head strong, .rebalance-card__person strong { color: var(--color-primary-800); }
.rebalance-line__bar { display: flex; height: 10px; border-radius: 999px; overflow: hidden; background: #efeaff; }
.rebalance__segment--mint { background: #18b9a7; } .rebalance__segment--primary { background: var(--color-primary-600); } .rebalance__segment--warning { background: #f0b539; } .rebalance__segment--danger { background: #ef4f74; }
.rebalance-line__helper--warning { color: #ef4f74; }
.rebalance-card__suggestions ul { padding-left: 16px; display: grid; gap: 8px; }
.rebalance-table-simplified { border: 1px solid var(--color-border-default); border-radius: 16px; overflow: hidden; }
.rebalance-table-simplified__row { display: grid; grid-template-columns: 110px repeat(4, minmax(0, 1fr)); }
.rebalance-table-simplified__row > * { min-height: 64px; padding: 10px; border-right: 1px solid #ece7ff; border-bottom: 1px solid #ece7ff; display: flex; align-items: center; justify-content: center; gap: 8px; }
.rebalance-table-simplified__row > *:last-child { border-right: none; }
.rebalance-table-simplified__row:last-child > * { border-bottom: none; }
.rebalance-table-simplified__row--header { background: #f6f3ff; }
.rebalance-table-simplified__cell { flex-wrap: wrap; }
.rebalance__tech { min-width: 28px; height: 28px; padding: 0 8px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; background: #f4f4fb; }
.rebalance__tech--primary { background: #efeaff; color: var(--color-primary-700); } .rebalance__tech--green { background: #e8fbf7; color: #10937f; } .rebalance__tech--gold { background: #fff1cc; color: #d98c00; } .rebalance__tech--danger { background: #ffe8ef; color: #db2952; } .rebalance__tech--soft { background: #f1eefc; color: #8479b7; }
.rebalance-card__people-list { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; }
.rebalance-card__person { border: 1px solid var(--color-border-default); border-radius: 14px; padding: 10px; display: grid; justify-items: center; gap: 6px; }
@media (max-width: 1240px) { .rebalance__summary, .rebalance__grid, .rebalance-card__people-list { grid-template-columns: 1fr; } .rebalance-table-simplified__row { grid-template-columns: 90px repeat(4, minmax(0, 1fr)); } }
</style>
