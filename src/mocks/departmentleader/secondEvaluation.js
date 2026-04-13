export const evalDeadline = '2026.03.10'

export const evalMembers = [
  {
    id: 1,
    name: '손창우',
    avatar: '손',
    avatarColor: '#5f50d6',
    tier: 'S',
    code: 'MCH-01',
    team: '정밀가공 1팀',
    experience: '경력 3년 2월',
    status: 'submitted',
    statusDate: '03.05',
    secondEvaluationDraft:
      '1차 평가에서 확인된 강점을 유지하면서도, 팀 내 표준화 작업과 후배 지원 측면에서 조직 기여를 더 확장할 수 있을 것으로 판단됩니다. 현재 수준의 안정적인 성과를 감안할 때 상위 역할 수행 가능성도 높습니다.',
    firstEvaluationSummary: {
      quantitativeScore: 94.2,
      qualitativeScore: 91.0,
      compositeScore: 92.6,
      qualitativeComment:
        '야간 설비 이상 상황에서도 원인을 빠르게 특정했고, 정비 담당과의 협업을 주도해 재가동 시간을 단축했다. 이후 동일 이슈 재발 방지용 점검 포인트를 팀에 공유했다.',
    },
    aiRecommended: { quantitative: 94.2, qualitative: 89.4, composite: 91.8 },
    evaluations: [
      { category: '직무 태도',    stars: 5, score: 95, comment: '작업 숙련도 매우 높음' },
      { category: '팀 기여도',    stars: 5, score: 93, comment: '팀 전체 생산성 향상 기여' },
      { category: '문제 해결',    stars: 5, score: 92, comment: '설비 이상 신속 대응' },
      { category: '커뮤니케이션', stars: 4, score: 88, comment: '명확한 의사소통' },
      { category: '성장 가능성', stars: 5, score: 96, comment: '꾸준한 자기 개발' },
    ],
  },
  {
    id: 2,
    name: '김신우',
    avatar: '김',
    avatarColor: '#5f50d6',
    tier: 'A',
    code: 'MCH-02',
    team: '정밀가공 1팀',
    experience: '경력 2년 5월',
    status: 'submitted',
    statusDate: '03.06',
    secondEvaluationDraft:
      '업무 수행 안정성과 협업 태도는 전반적으로 우수합니다. 다만 예외 상황 대응 시 판단 근거와 후속 공유를 조금 더 명확히 남기면 팀 차원의 신뢰도와 재현 가능성이 더 높아질 것으로 보입니다.',
    firstEvaluationSummary: {
      quantitativeScore: 86.1,
      qualitativeScore: 84.0,
      compositeScore: 85.0,
      qualitativeComment:
        '업무 수행이 안정적이고 협업 태도도 좋다. 다만 돌발 이슈 대응에서는 보고 속도는 좋지만, 선제적 공유와 후속 정리까지 이어지는 부분은 조금 더 보완이 필요하다.',
    },
    aiRecommended: { quantitative: 86.1, qualitative: 82.7, composite: 84.0 },
    evaluations: [
      { category: '직무 태도',    stars: 4, score: 85, comment: '성실한 업무 태도' },
      { category: '팀 기여도',    stars: 4, score: 82, comment: '팀 작업 적극 참여' },
      { category: '문제 해결',    stars: 4, score: 80, comment: '문제 인식 및 보고 우수' },
      { category: '커뮤니케이션', stars: 4, score: 84, comment: '원활한 소통' },
      { category: '성장 가능성', stars: 4, score: 83, comment: '기술 습득 속도 양호' },
    ],
  },
  {
    id: 3,
    name: '황자현',
    avatar: '황',
    avatarColor: '#269063',
    tier: 'A',
    code: 'PRS-01',
    team: '정밀가공 2팀',
    experience: '경력 2년 8월',
    status: 'in_progress',
    statusDate: '오늘',
    secondEvaluationDraft:
      '1차 평가에서 드러난 설비 최적화 기여는 긍정적입니다. 2차 평가에서는 문제 상황에서의 설명력과 의사결정 근거 공유를 더 보완할 필요가 있다고 판단합니다.',
    firstEvaluationSummary: {
      quantitativeScore: 83.4,
      qualitativeScore: 80.0,
      compositeScore: 81.7,
      qualitativeComment:
        '설비 최적화와 팀 협업 측면에서 기여도가 보였고 학습 속도도 양호했다. 다만 이슈 발생 시 판단 근거를 더 명확히 공유하면 신뢰도가 올라갈 것으로 보인다.',
    },
    aiRecommended: { quantitative: 83.4, qualitative: 79.1, composite: 81.2 },
    evaluations: [
      { category: '직무 태도',    stars: 4, score: 82, comment: '팀 내 협력 우수, 지각 없음' },
      { category: '팀 기여도',    stars: 4, score: 80, comment: 'PRS-01 설비 최적화 기여' },
      { category: '문제 해결',    stars: 4, score: 79, comment: '트러블슈팅 능력 향상 중' },
      { category: '커뮤니케이션', stars: 3, score: 75, comment: '' },
      { category: '성장 가능성', stars: 4, score: 85, comment: '' },
    ],
  },
  {
    id: 4,
    name: '임원석',
    avatar: '임',
    avatarColor: '#c08b00',
    tier: 'B',
    code: 'WLD-01',
    team: '정밀가공 2팀',
    experience: '경력 1년 3월',
    status: 'not_started',
    statusDate: '—',
    secondEvaluationDraft: '',
    firstEvaluationSummary: {
      quantitativeScore: 72.8,
      qualitativeScore: 74.0,
      compositeScore: 73.4,
      qualitativeComment:
        '기초 수행 역량은 확보하고 있으나, 업무 우선순위 판단과 커뮤니케이션 일관성은 추가 관찰이 필요하다. 반복 업무 정확도는 유지하되 상황 대응력 보완이 요구된다.',
    },
    aiRecommended: { quantitative: 72.8, qualitative: 75.3, composite: 74.0 },
    evaluations: [
      { category: '직무 태도',    stars: 3, score: 72, comment: '' },
      { category: '팀 기여도',    stars: 3, score: 70, comment: '' },
      { category: '문제 해결',    stars: 3, score: 68, comment: '' },
      { category: '커뮤니케이션', stars: 3, score: 74, comment: '' },
      { category: '성장 가능성', stars: 4, score: 76, comment: '' },
    ],
  },
]
