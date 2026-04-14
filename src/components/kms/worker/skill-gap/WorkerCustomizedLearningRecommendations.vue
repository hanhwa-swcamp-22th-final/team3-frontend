<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  courses: { type: Array, required: true },
  articles: { type: Array, required: true },
})

const emit = defineEmits(['open-article'])

const localCourses = ref([])

// Initialize or update local copy when prop changes
watch(() => props.courses, (newVal) => {
  localCourses.value = newVal.map(c => ({ ...c }))
}, { immediate: true })

const startCourse = (id) => {
  const course = localCourses.value.find(c => c.id === id)
  if (course && course.status === '시작하기') {
    course.status = '진행중'
  }
}

const openArticle = (article) => {
  emit('open-article', article)
}
</script>

<template>
  <div class="lr">
    <span class="lr__label">🎓 맞춤 학습 추천</span>

    <!-- Course Cards -->
    <div class="lr__courses">
      <div v-for="course in localCourses" :key="course.id" class="lr__course">
        <div class="lr__course-top">
          <div class="lr__course-badges">
            <span
              class="lr__priority"
              :style="{ background: course.priorityColor + '18', color: course.priorityColor }"
            >
              {{ course.priority }}
            </span>
            <span class="lr__category">{{ course.category }}</span>
          </div>
          <span class="lr__duration">{{ course.duration }}</span>
        </div>
        <h4 class="lr__course-title">{{ course.title }}</h4>
        <p v-if="course.description" class="lr__course-desc">{{ course.description }}</p>
        <div class="lr__course-bottom">
          <span v-if="course.durationDiff" class="lr__course-diff">{{ course.durationDiff }}</span>
          <button
            class="lr__course-btn"
            :class="{ 'lr__course-btn--active': course.status === '진행중' }"
            @click="startCourse(course.id)"
          >
            {{ course.status }}
          </button>
        </div>
      </div>
    </div>

    <!-- Related KMS Articles -->
    <div class="lr__articles">
      <span class="lr__articles-label">📘 관련 KMS 지식</span>
      <div class="lr__articles-list">
        <button
          v-for="article in articles"
          :key="article.id"
          type="button"
          class="lr__article"
          @click="openArticle(article)"
        >
          <span class="lr__article-title">{{ article.title }}</span>
          <span class="lr__article-likes">👍{{ article.likes }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lr {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-card);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lr__label {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* ── Course Cards ──────────────────────────────────────── */
.lr__courses {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lr__course {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lr__course-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lr__course-badges {
  display: flex;
  gap: 6px;
  align-items: center;
}

.lr__priority {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-2xs);
}

.lr__category {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-2xs);
  background: var(--color-neutral-100);
  color: var(--color-text-default);
}

.lr__duration {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text-strong);
  font-family: var(--font-family-num);
}

.lr__course-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-strong);
  margin: 0;
}

.lr__course-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}

.lr__course-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.lr__course-diff {
  font-size: 13px;
  color: var(--tier-s);
  font-weight: 600;
}

.lr__course-btn {
  padding: 6px 20px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-xs);
  background: var(--color-bg-surface);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-default);
  cursor: pointer;
}

.lr__course-btn:hover {
  border-color: var(--color-primary-300);
  color: var(--color-primary-700);
}

.lr__course-btn--active {
  background: var(--color-primary-600);
  color: var(--color-white);
  border-color: var(--color-primary-600);
}

.lr__course-btn--active:hover {
  background: var(--color-primary-700);
  color: var(--color-white);
  border-color: var(--color-primary-700);
}

/* ── Related Articles ──────────────────────────────────── */
.lr__articles {
  background: var(--color-primary-800);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lr__articles-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-white);
}

.lr__articles-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lr__article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}

.lr__article:hover {
  background: rgba(255, 255, 255, 0.14);
}

.lr__article-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-white);
}

.lr__article-likes {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}
</style>
