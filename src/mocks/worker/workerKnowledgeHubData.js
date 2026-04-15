export const ongoingMentoring = [
  {
    id: 1,
    mentorInitial: '손',
    mentorColor: '#00BF95',
    menteeInitial: '임',
    menteeColor: '#8B5E3C',
    field: '정밀가공',
    status: '진행중',
  },
  {
    id: 2,
    mentorInitial: '김',
    mentorColor: '#5B4FCF',
    menteeInitial: '박',
    menteeColor: '#C62828',
    field: 'CNC가공',
    status: '진행중',
  },
]

export const mentoringRequests = [
  {
    id: 1,
    name: '이수연',
    initial: '이',
    avatarColor: '#5B4FCF',
    message: '용접 기술 멘토 구합니다',
    field: '정밀가공',
    period: '2주',
    priority: '높음',
    reason:
      '최근 항공 부품 용접 공정 전환 배치가 예정되어 있어, 사전 숙련도 보완을 위해 멘토링이 필요합니다. 특히 용접 조건 보정과 불량 판정 기준을 우선 학습하고 싶습니다.',
    managementMemo:
      '현재 동일 분야 진행중 멘토링 1건 보유. 주 2회, 회당 1시간 운영 시 병행 가능. 수락 시 TL과 GL에게도 매칭 진행 상태 공유.',
  },
]

export const mentoringRequestFormDefaults = {
  myName: '손창우',
  myInitial: '손',
  myAvatarColor: '#00BF95',
  myTitle: '정밀가공 Specialist / 항공 부품 정밀 가공',
  field: '정밀가공',
  period: '2주',
  frequency: '주 2회',
  purpose:
    'Ti-6Al-4V 소재 가공 시 공구 마모 보정과 셋업 기준을 빠르게 익히고 싶습니다. 다음 달 항공 부품 공정 전환 예정이라 사전 준비가 필요합니다.',
  requestDetails:
    '1. 정밀가공 셋업 체크리스트 공유\n2. 채터링 방지 조건 설명\n3. 실습 기준 피드백 2회 진행',
  operatingMemo:
    '주간조 기준 화 / 목 15:00 이후 참여 가능합니다. 수락 시 TL과 GL에게 동시에 일일 전송됩니다.',
}
