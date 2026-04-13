<script setup>
import { ref, computed, onMounted } from 'vue'
import WorkerTodayJobCount from '@/components/scm/worker/today-task/WorkerTodayJobCount.vue'
import WorkerTodayJobCard from '@/components/scm/worker/today-task/WorkerTodayJobCard.vue'
import WorkerJobStartModal from '@/components/scm/worker/today-task/WorkerJobStartModal.vue'
import WorkerJobFinishModal from '@/components/scm/worker/today-task/WorkerJobFinishModal.vue'
import { useAuthStore } from '@/stores/auth'
import {
  getTasks,
  getTaskSummary,
  startTask,
  saveFinishDraft,
  finishTask,
} from '@/services/workerScmApi'

const loading = ref(true)
const jobs = ref([])
const summaryState = ref({
  assignedCount: 0,
  inProgressCount: 0,
  completedCount: 0,
})
const showStartModal = ref(false)
const showFinishModal = ref(false)
const selectedJob = ref(null)
const authStore = useAuthStore()

onMounted(async () => {
  await loadTasks()
})

const totalCount = computed(
  () =>
    summaryState.value.assignedCount +
    summaryState.value.inProgressCount +
    summaryState.value.completedCount
)
const inProgressCount = computed(() => summaryState.value.inProgressCount)
const doneCount = computed(() => summaryState.value.completedCount)

function mapStatus(status) {
  switch (status) {
    case 'INPROGRESS':
      return { status: 'in_progress', statusLabel: '진행중' }
    case 'COMPLETE':
      return { status: 'done', statusLabel: '완료' }
    case 'CONFIRM':
    default:
      return { status: 'waiting', statusLabel: '대기' }
  }
}

function mapDifficulty(grade) {
  const score = Number(String(grade ?? '').replace(/\D/g, ''))
  return Number.isFinite(score) && score > 0 ? score : 1
}

function formatDifficultyLabel(score) {
  if (score >= 5) return '최상'
  if (score >= 4) return '상'
  if (score >= 3) return '중'
  if (score >= 2) return '하'
  return '최하'
}

function formatElapsedTime(startAt, endAt) {
  if (!startAt) return null

  const start = new Date(startAt)
  const end = endAt ? new Date(endAt) : new Date()
  const diffMinutes = Math.max(0, Math.floor((end - start) / 60000))
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`
  }
  return `${minutes}분`
}

function calcDeadlineDays(dueDate) {
  if (!dueDate) return null

  const target = new Date(`${dueDate}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((target - today) / 86400000))
}

function mapTaskToJob(task) {
  const difficulty = mapDifficulty(task.difficultyGrade)
  const mappedStatus = mapStatus(task.matchingStatus)

  return {
    id: task.taskId,
    orderCode: task.orderNo,
    title: task.productName,
    equipment: task.matchingMode ?? '배정 정보 없음',
    estimatedTime: task.dueDate ?? '-',
    elapsedTime: formatElapsedTime(task.workStartAt, task.workEndAt),
    deadlineDays: calcDeadlineDays(task.dueDate),
    difficulty,
    difficultyLabel: formatDifficultyLabel(difficulty),
    status: mappedStatus.status,
    statusLabel: mappedStatus.statusLabel,
    target: 100,
    current: mappedStatus.status === 'done' ? 100 : mappedStatus.status === 'in_progress' ? 50 : 0,
    memo: task.comment ?? '',
  }
}

async function loadTasks() {
  const employeeId = authStore.userInfo?.employeeId
  if (!employeeId) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    const [taskList, summary] = await Promise.all([getTasks(employeeId), getTaskSummary(employeeId)])
    jobs.value = Array.isArray(taskList) ? taskList.map(mapTaskToJob) : []
    summaryState.value = {
      assignedCount: summary?.assignedCount ?? 0,
      inProgressCount: summary?.inProgressCount ?? 0,
      completedCount: summary?.completedCount ?? 0,
    }
  } finally {
    loading.value = false
  }
}

function handleStart(job) {
  selectedJob.value = job
  showStartModal.value = true
}

function handleFinish(job) {
  selectedJob.value = job
  showFinishModal.value = true
}

async function confirmStart(job) {
  await startTask(job.id)
  showStartModal.value = false
  selectedJob.value = null
  await loadTasks()
}

async function submitFinish(payload) {
  await finishTask(payload.jobId, payload.memo)
  showFinishModal.value = false
  selectedJob.value = null
  await loadTasks()
}

async function saveDraft(payload) {
  await saveFinishDraft(payload.jobId, payload.memo)
  showFinishModal.value = false
  selectedJob.value = null
  await loadTasks()
}

function closeModal() {
  showStartModal.value = false
  showFinishModal.value = false
  selectedJob.value = null
}
</script>

<template>
  <div class="tt-content">
    <div v-if="loading" class="tt-loading">데이터를 불러오는 중...</div>

    <template v-else>
      <WorkerTodayJobCount
        :total="totalCount"
        :in-progress="inProgressCount"
        :done="doneCount"
      />

      <div class="tt-list">
        <WorkerTodayJobCard
          v-for="job in jobs"
          :key="job.id"
          :job="job"
          @start="handleStart"
          @finish="handleFinish"
        />
      </div>
    </template>

    <!-- Modals -->
    <WorkerJobStartModal
      v-if="showStartModal && selectedJob"
      :job="selectedJob"
      @close="closeModal"
      @confirm="confirmStart"
    />
    <WorkerJobFinishModal
      v-if="showFinishModal && selectedJob"
      :job="selectedJob"
      @close="closeModal"
      @save-draft="saveDraft"
      @submit="submitFinish"
    />
  </div>
</template>

<style scoped>
.tt-content {
  flex: 1;
  padding: 20px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  background: var(--color-bg-app);
}

.tt-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tt-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  font-size: 15px;
  color: var(--color-text-muted);
}
</style>
