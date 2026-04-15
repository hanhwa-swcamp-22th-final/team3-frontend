<script setup>
import { computed, ref, watch } from 'vue'
import EvaluationMemberCard from '@/components/hr/common/evaluation/EvaluationMemberCard.vue'
import EvalListLayout from '@/components/hr/common/evaluation/EvalListLayout.vue'
import { formatMemberMeta } from '@/utils/hrListFormat'

const props = defineProps({
  appeals: {
    type: Array,
    default: () => [],
  },
  selectedId: {
    type: [Number, String],
    default: null,
  },
})

const emit = defineEmits(['select'])

const search = ref('')
const AVATAR_TONES = ['purple', 'green', 'gold']
const filteredAppeals = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return props.appeals.filter((appeal) => {
    const matchesKeyword =
      !keyword
      || appeal.employeeName?.toLowerCase().includes(keyword)
      || appeal.title?.toLowerCase().includes(keyword)
      || appeal.periodLabel?.toLowerCase().includes(keyword)

    return matchesKeyword
  })
})

const cardAppeals = computed(() =>
  filteredAppeals.value.map((appeal, index) => ({
    ...appeal,
    avatar: appeal.employeeName?.[0] ?? '?',
    avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
    tier: appeal.employeeTier ?? '',
    meta: formatMemberMeta(appeal.employeeCode, appeal.departmentName, appeal.teamName),
    cardStatus: appeal.status === 'COMPLETED' ? 'submitted' : 'in_progress',
    cardDate: appeal.status === 'SUBMITTED'
      ? '검토 대기'
      : appeal.status === 'RECEIVING'
        ? '접수 완료'
        : appeal.status === 'REVIEWING'
          ? '검토중'
          : '처리 완료',
  })),
)

watch(filteredAppeals, (appeals) => {
  if (!appeals.length) return
  const hasSelected = appeals.some((appeal) => String(appeal.appealId) === String(props.selectedId))
  if (!hasSelected) {
    emit('select', appeals[0].appealId)
  }
}, { immediate: true })
</script>

<template>
  <EvalListLayout
    eyebrow="이의신청 현황"
    title="신청 내역"
    :total-label="`총 ${appeals.length}건`"
    search-aria-label="이의신청 검색"
    search-placeholder="이름으로 검색"
    :search-value="search"
    :has-items="cardAppeals.length > 0"
    empty-title="확인할 이의신청이 없습니다."
    empty-description="현재 차수에서 검토할 대상이 생기면 이곳에 표시됩니다."
    @update:search-value="search = $event"
  >
    <template #default>
      <EvaluationMemberCard
        v-for="appeal in cardAppeals"
        :key="appeal.appealId"
        :member-id="appeal.appealId"
        :name="appeal.employeeName"
        :avatar="appeal.avatar"
        :avatar-tone="appeal.avatarTone"
        :tier="appeal.tier"
        :meta="appeal.meta"
        :status="appeal.cardStatus"
        :status-date="appeal.cardDate"
        :selected="String(appeal.appealId) === String(selectedId)"
        @select="emit('select', appeal.appealId)"
      />
    </template>
  </EvalListLayout>
</template>

<style scoped></style>
