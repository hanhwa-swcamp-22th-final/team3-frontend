<script setup>
import { ref, watch } from 'vue'
import { MOCK_TEAMS } from '@/mocks/hrmanager/noticeboard.js'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'close'])

const local = ref([...props.modelValue])

watch(() => props.modelValue, v => { local.value = [...v] })

function toggle(team) {
  if (team === '전체') {
    local.value = local.value.length === MOCK_TEAMS.length - 1
      ? []
      : MOCK_TEAMS.slice(1)
    return
  }
  const idx = local.value.indexOf(team)
  if (idx === -1) local.value.push(team)
  else            local.value.splice(idx, 1)
}

function isChecked(team) {
  if (team === '전체') return local.value.length === MOCK_TEAMS.length - 1
  return local.value.includes(team)
}

function removeTag(team) {
  local.value = local.value.filter(t => t !== team)
}

function reset() { local.value = [] }

function apply() {
  emit('update:modelValue', [...local.value])
  emit('close')
}
</script>

<template>
  <div class="team-filter">
    <ul class="team-filter__list">
      <li
        v-for="team in MOCK_TEAMS"
        :key="team"
        class="team-filter__item"
        @click="toggle(team)"
      >
        <span class="team-filter__check" :class="{ 'team-filter__check--on': isChecked(team) }">✓</span>
        <span class="team-filter__name">{{ team }}</span>
      </li>
    </ul>

    <div v-if="local.length" class="team-filter__tags">
      <span
        v-for="t in local"
        :key="t"
        class="team-filter__tag"
      >
        {{ t }}
        <button class="team-filter__tag-x" @click.stop="removeTag(t)">×</button>
      </span>
    </div>

    <div class="team-filter__actions">
      <button class="team-filter__btn team-filter__btn--reset" @click="reset">
        <span>↺</span> 초기화
      </button>
      <button class="team-filter__btn team-filter__btn--apply" @click="apply">적용하기</button>
    </div>
  </div>
</template>

<style scoped>
.team-filter {
  background: var(--color-bg-surface);
  border: 1.5px solid var(--color-border-default);
  border-radius: 12px;
  padding: 12px 16px;
  width: 200px;
  box-shadow: 0 4px 20px rgba(0,0,0,.12);
  display: flex; flex-direction: column; gap: 10px;
}

.team-filter__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.team-filter__item {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 4px; cursor: pointer; border-radius: 6px;
}
.team-filter__item:hover { background: var(--color-primary-100); }
.team-filter__check { font-size: 12px; color: transparent; width: 16px; flex-shrink: 0; }
.team-filter__check--on { color: var(--color-primary-600); }
.team-filter__name { font-size: 13px; color: var(--color-primary-800); }

.team-filter__tags {
  display: flex; flex-wrap: wrap; gap: 4px;
  padding-top: 4px; border-top: 1px solid var(--color-border-default);
}
.team-filter__tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 8px;
  background: var(--color-primary-100); color: var(--color-primary-700);
  border-radius: 20px; font-size: 11px; font-weight: 600;
}
.team-filter__tag-x {
  background: none; border: none; cursor: pointer;
  color: #a89ed8; font-size: 12px; padding: 0; line-height: 1;
}

.team-filter__actions { display: flex; justify-content: space-between; align-items: center; }
.team-filter__btn {
  height: 30px; padding: 0 12px;
  border-radius: 8px; font-size: 12px; font-weight: 700;
  cursor: pointer; border: none;
  display: flex; align-items: center; gap: 4px;
}
.team-filter__btn--reset {
  background: none; color: #a89ed8;
  border: 1px solid var(--color-border-default);
}
.team-filter__btn--apply {
  background: var(--color-primary-600); color: var(--color-white);
}
</style>
