<script setup>
import { ref, computed } from 'vue'
import { TIER_BADGE_STYLES as tierColors } from '@/constants'

const props = defineProps({
  members: { type: Array, default: () => [] },
  selectedId: { type: Number, default: null },
})

const emit = defineEmits(['select'])

const search = ref('')
const teamFilter = ref('전체')
const dropdownOpen = ref(false)

const teams = computed(() => {
  const names = [...new Set(props.members.map((m) => m.team).filter(Boolean))]
  return ['전체', ...names]
})

const filtered = computed(() => {
  return props.members.filter((m) => {
    const matchTeam = teamFilter.value === '전체' || m.team === teamFilter.value
    const matchSearch = m.name.includes(search.value.trim())
    return matchTeam && matchSearch
  })
})

function selectTeam(t) {
  teamFilter.value = t
  dropdownOpen.value = false
}


</script>

<template>
  <section class="member-list-panel">
    <!-- Header -->
    <div class="member-list-panel__header">
      <span class="member-list-panel__title">👥 팀원 목록</span>
      <div class="member-list-panel__dropdown-wrap">
        <button
          class="member-list-panel__team-btn"
          @click="dropdownOpen = !dropdownOpen"
        >
          {{ teamFilter }} ▾
        </button>
        <ul v-if="dropdownOpen" class="member-list-panel__dropdown">
          <li
            v-for="t in teams"
            :key="t"
            class="member-list-panel__dropdown-item"
            :class="{ 'member-list-panel__dropdown-item--active': teamFilter === t }"
            @click="selectTeam(t)"
          >
            {{ t }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Search -->
    <div class="member-list-panel__search">
      <span class="member-list-panel__search-icon">🔍</span>
      <input
        v-model="search"
        class="member-list-panel__search-input"
        placeholder="팀원 검색..."
      />
    </div>

    <!-- List -->
    <ul class="member-list-panel__list">
      <li
        v-for="m in filtered"
        :key="m.id"
        class="member-list-panel__item"
        :class="{ 'member-list-panel__item--active': m.id === selectedId }"
        @click="emit('select', m)"
      >
        <div
          class="member-list-panel__avatar"
          :style="{ background: m.avatarColor }"
        >
          {{ m.avatar }}
        </div>
        <div class="member-list-panel__info">
          <div class="member-list-panel__name-row">
            <span class="member-list-panel__name">{{ m.name }}</span>
            <span
              class="member-list-panel__tier"
              :style="{ background: tierColors[m.tier]?.bg, color: tierColors[m.tier]?.text }"
            >
              {{ m.tier }}
            </span>
          </div>
          <span class="member-list-panel__sub">{{ [m.code, `Overall ${m.score}`].filter(Boolean).join(' · ') }}</span>
        </div>
      </li>
    </ul>

  </section>
</template>

<style scoped>
.member-list-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--color-border-default);
  border-radius: 24px;
  background: var(--color-bg-surface);
  height: 100%;
}

.member-list-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.member-list-panel__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.member-list-panel__dropdown-wrap {
  position: relative;
}

.member-list-panel__team-btn {
  background: var(--color-primary-100);
  border: none;
  border-radius: var(--radius-sm);
  padding: 6px 12px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary-700);
  cursor: pointer;
}

.member-list-panel__dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 10;
  list-style: none;
  min-width: 140px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.member-list-panel__dropdown-item {
  padding: 10px 16px;
  font-size: var(--font-size-sm);
  cursor: pointer;
  color: var(--color-text-default);
}
.member-list-panel__dropdown-item:hover {
  background: var(--color-primary-100);
}
.member-list-panel__dropdown-item--active {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-700);
}

.member-list-panel__search {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  background: var(--color-bg-surface-muted);
}

.member-list-panel__search-icon {
  font-size: var(--font-size-base);
  flex-shrink: 0;
}

.member-list-panel__search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--font-size-sm);
  color: var(--color-text-default);
  width: 100%;
}
.member-list-panel__search-input::placeholder {
  color: var(--color-text-muted);
}

.member-list-panel__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  overflow-y: auto;
}

.member-list-panel__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.15s;
}
.member-list-panel__item:hover {
  background: var(--color-bg-surface-muted);
}
.member-list-panel__item--active {
  background: var(--color-primary-100);
}

.member-list-panel__avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
}

.member-list-panel__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.member-list-panel__name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.member-list-panel__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-800);
}

.member-list-panel__tier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-extrabold);
}

.member-list-panel__sub {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
