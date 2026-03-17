<script setup>
import { ref, computed, onMounted } from 'vue'
import WorkerTodayJobCount from '@/components/worker/scm/WorkerTodayJobCount.vue'
import WorkerTodayJobCard from '@/components/worker/scm/WorkerTodayJobCard.vue'
import WorkerJobStartModal from '@/components/worker/scm/WorkerJobStartModal.vue'
import WorkerJobFinishModal from '@/components/worker/scm/WorkerJobFinishModal.vue'
import { todayJobs as mockJobs } from '@/mocks/workerTodayJobData'

const loading = ref(true)
const jobs = ref([])
const showStartModal = ref(false)
const showFinishModal = ref(false)
const selectedJob = ref(null)

onMounted(() => {
  jobs.value = mockJobs.map((j) => ({ ...j }))
  loading.value = false
})

const totalCount = computed(() => jobs.value.length)
const inProgressCount = computed(() => jobs.value.filter((j) => j.status === 'in_progress').length)
const doneCount = computed(() => jobs.value.filter((j) => j.status === 'done').length)

function handleStart(job) {
  selectedJob.value = job
  showStartModal.value = true
}

function handleFinish(job) {
  selectedJob.value = job
  showFinishModal.value = true
}

function confirmStart(job) {
  const target = jobs.value.find((j) => j.id === job.id)
  if (target) {
    target.status = 'in_progress'
    target.statusLabel = '진행중'
  }
  showStartModal.value = false
  selectedJob.value = null
}

function submitFinish(payload) {
  const target = jobs.value.find((j) => j.id === payload.jobId)
  if (target) {
    target.status = 'done'
    target.statusLabel = '완료'
    target.current = target.target
  }
  showFinishModal.value = false
  selectedJob.value = null
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
      @save-draft="closeModal"
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
