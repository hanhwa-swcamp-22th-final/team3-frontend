<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  equipment: {
    type: Object,
    required: true,
  },
  candidates: {
    type: Array,
    default: () => [],
  },
  actionLabel: {
    type: String,
    default: '즉시 배정',
  },
})
</script>

<template>
  <aside class="assist-panel">
    <header class="assist-panel__header">
      <p class="assist-panel__eyebrow">{{ title }}</p>
      <h2 class="assist-panel__title">{{ subtitle }}</h2>
    </header>

    <section class="assist-panel__equipment">
      <div class="assist-panel__equipment-row">
        <strong>{{ equipment.code }}</strong>
        <span>{{ equipment.status }}</span>
      </div>
      <p>{{ equipment.line }}</p>
      <p>{{ equipment.assignee }}</p>
    </section>

    <section class="assist-panel__candidate-section">
      <h3>가용 테크니션</h3>
      <article
        v-for="candidate in candidates"
        :key="candidate.id"
        class="assist-panel__candidate"
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

    <button type="button" class="assist-panel__action">{{ actionLabel }}</button>
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
