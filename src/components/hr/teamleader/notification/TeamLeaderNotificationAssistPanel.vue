<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  panels: {
    type: Array,
    default: () => [],
  },
  activePanelId: {
    type: Number,
    default: null,
  },
  pageSize: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['quick-assign'])

const currentPage = ref(1)
const selectedCandidateId = ref(null)

const totalPages = computed(() => Math.max(1, Math.ceil(props.panels.length / props.pageSize)))
const currentPanel = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return props.panels[start]
})

watch(
  () => [props.panels.length, props.pageSize],
  () => {
    currentPage.value = 1
  }
)

watch(
  () => props.activePanelId,
  (panelId) => {
    if (!panelId) {
      return
    }

    const panelIndex = props.panels.findIndex((panel) => panel.id === panelId)

    if (panelIndex === -1) {
      return
    }

    currentPage.value = Math.floor(panelIndex / props.pageSize) + 1
  },
)

watch(
  currentPanel,
  (panel) => {
    selectedCandidateId.value = panel?.candidates?.[0]?.id ?? null
  },
  { immediate: true }
)

function goToPage(page) {
  currentPage.value = page
}

function selectCandidate(candidateId) {
  selectedCandidateId.value = candidateId
}

function handleQuickAssign() {
  if (!currentPanel.value || !currentPanel.value.candidates?.length) {
    return
  }

  const selectedCandidate =
    currentPanel.value.candidates.find((candidate) => candidate.id === selectedCandidateId.value) ??
    currentPanel.value.candidates[0]

  emit('quick-assign', {
    panel: currentPanel.value,
    candidate: selectedCandidate,
  })
}
</script>

<template>
  <aside class="assist-panel" v-if="currentPanel">
    <header class="assist-panel__header">
      <div>
        <p class="assist-panel__eyebrow">{{ currentPanel.title }}</p>
        <h2 class="assist-panel__title">{{ currentPanel.subtitle }}</h2>
      </div>
      <span v-if="panels.length > 0" class="assist-panel__page-indicator">{{ currentPage }} / {{ totalPages }}</span>
    </header>

    <section class="assist-panel__equipment">
      <div class="assist-panel__equipment-row">
        <strong>{{ currentPanel.equipment.code }}</strong>
        <span>{{ currentPanel.equipment.status }}</span>
      </div>
      <p>{{ currentPanel.equipment.line }}</p>
      <p>{{ currentPanel.equipment.assignee }}</p>
    </section>

    <section class="assist-panel__candidate-section">
      <h3>가용 테크니션</h3>
      <article
        v-for="candidate in currentPanel.candidates"
        :key="candidate.id"
        class="assist-panel__candidate"
        :class="{ 'assist-panel__candidate--selected': candidate.id === selectedCandidateId }"
        @click="selectCandidate(candidate.id)"
      >
        <div class="assist-panel__candidate-copy">
          <div class="assist-panel__avatar" :class="`assist-panel__avatar--${candidate.avatarTone}`">
            {{ candidate.avatar }}
          </div>
          <strong>{{ candidate.name }}</strong>
          <span class="assist-panel__tier">{{ candidate.tier }}</span>
        </div>
        <span class="assist-panel__score">{{ candidate.scoreLabel }}</span>
      </article>
    </section>

    <footer v-if="panels.length > 0" class="assist-panel__pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        class="assist-panel__page"
        :class="{ 'assist-panel__page--active': page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </footer>

    <button type="button" class="assist-panel__action" @click="handleQuickAssign">
      {{ currentPanel.actionLabel }}
    </button>
  </aside>
</template>

<style scoped>
.assist-panel {
  display: grid;
  gap: 18px;
  padding: 18px;
  border: 1px solid var(--color-border-default);
  border-radius: 18px;
  background: var(--color-bg-surface);
}

.assist-panel__header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.assist-panel__eyebrow {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-300);
}

.assist-panel__title {
  margin-top: 6px;
  font-size: 18px;
  color: var(--color-primary-800);
}

.assist-panel__page-indicator {
  color: var(--color-primary-300);
  font-size: 12px;
  font-weight: 700;
}

.assist-panel__equipment {
  padding: 16px;
  border: 2px solid #ff5072;
  border-radius: 12px;
  background: #fff3f6;
}

.assist-panel__equipment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.assist-panel__equipment-row strong,
.assist-panel__equipment-row span {
  color: #db294d;
  font-weight: 800;
}

.assist-panel__equipment p {
  margin-top: 6px;
  color: var(--color-primary-300);
}

.assist-panel__candidate-section h3 {
  font-size: 14px;
  color: var(--color-primary-300);
}

.assist-panel__candidate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  padding: 12px 14px;
  border: 1px solid #e7e1ff;
  border-radius: 12px;
  cursor: pointer;
}

.assist-panel__candidate--selected {
  border-color: #6557dd;
  background: #f7f5ff;
  box-shadow: 0 0 0 2px rgba(101, 87, 221, 0.1);
}

.assist-panel__candidate-copy {
  display: flex;
  align-items: center;
  gap: 10px;
}

.assist-panel__avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
}

.assist-panel__avatar--purple {
  background: #5f50d6;
}

.assist-panel__avatar--green {
  background: #269063;
}

.assist-panel__tier {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 8px;
  background: #6557dd;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.assist-panel__score {
  color: #19b897;
  font-size: 13px;
  font-weight: 800;
}

.assist-panel__pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.assist-panel__page {
  width: 34px;
  height: 34px;
  border: 1px solid #e2dbff;
  border-radius: 10px;
  background: #fff;
  color: var(--color-primary-500);
  font-weight: 700;
  cursor: pointer;
}

.assist-panel__page--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: #fff;
}

.assist-panel__action {
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 10px;
  background: #f3294f;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}
</style>
