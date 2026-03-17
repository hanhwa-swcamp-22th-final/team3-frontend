export const performanceSummary = {
  totalMembers: 14,
  totalTeams: 4,
  evalCompleted: 12,
  evalTotal: 14,
  deptAvg: 80.4,
  deptAvgDelta: +3.2,
  period: '2026 1분기',
}

export const gradeDistribution = [
  { grade: 'S', count: 1, recommended: 10 },
  { grade: 'A', count: 5, recommended: 25 },
  { grade: 'B', count: 6, recommended: 40 },
  { grade: 'C', count: 2, recommended: 20 },
  { grade: 'D', count: 0, recommended: 5 },
]

// radar: 정량, 정성, 완료율, 고등급비율, 역량지수 (0~100)
export const teamComparison = {
  labels: ['정량 평균', '정성 평균', '완료율', '고등급(S/A)', '역량지수'],
  teams: [
    { name: '정밀가공 1팀', color: '#5b4fcf', values: [88, 84, 100, 80, 87] },
    { name: '정밀가공 2팀', color: '#269063', values: [76, 74, 80,  20, 76] },
    { name: '프레스라인팀', color: '#f4c54b', values: [79, 77, 100, 50, 80] },
    { name: '용접팀',       color: '#ef476f', values: [69, 70, 75,  0,  70] },
  ],
}

export const performanceMembers = [
  { empId: 'MCH-01', name: '손창우', position: '수석',   team: '정밀가공 1팀', quantitative: 94.2, qualitative: 89.4, total: 91.8, grade: 'S', status: '완료' },
  { empId: 'MCH-02', name: '김신우', position: '선임',   team: '정밀가공 1팀', quantitative: 86.1, qualitative: 82.7, total: 84.0, grade: 'A', status: '완료' },
  { empId: 'MCH-03', name: '이재훈', position: '선임',   team: '정밀가공 1팀', quantitative: 83.5, qualitative: 81.2, total: 82.4, grade: 'A', status: '완료' },
  { empId: 'MCH-04', name: '박준호', position: '일반',   team: '정밀가공 1팀', quantitative: 75.3, qualitative: 72.8, total: 74.2, grade: 'B', status: '완료' },
  { empId: 'MCH-05', name: '최민정', position: '선임',   team: '정밀가공 1팀', quantitative: 85.0, qualitative: 82.3, total: 83.8, grade: 'A', status: '완료' },
  { empId: 'PRS-01', name: '황자현', position: '선임',   team: '정밀가공 2팀', quantitative: 83.4, qualitative: 79.1, total: 81.2, grade: 'A', status: '진행중' },
  { empId: 'WLD-01', name: '임원석', position: '일반',   team: '정밀가공 2팀', quantitative: 72.8, qualitative: 75.3, total: 74.0, grade: 'B', status: '미완료' },
  { empId: 'PRS-02', name: '이지훈', position: '일반',   team: '정밀가공 2팀', quantitative: 71.5, qualitative: 73.2, total: 72.3, grade: 'B', status: '완료' },
  { empId: 'PRS-03', name: '박지훈', position: '일반',   team: '정밀가공 2팀', quantitative: 74.2, qualitative: 71.8, total: 73.2, grade: 'B', status: '완료' },
  { empId: 'PRS-04', name: '오성민', position: '일반',   team: '정밀가공 2팀', quantitative: 62.1, qualitative: 65.4, total: 63.5, grade: 'C', status: '완료' },
  { empId: 'PRS-05', name: '정현우', position: '선임',   team: '프레스라인팀',  quantitative: 80.5, qualitative: 78.9, total: 79.8, grade: 'A', status: '완료' },
  { empId: 'PRS-06', name: '한수진', position: '일반',   team: '프레스라인팀',  quantitative: 76.3, qualitative: 74.1, total: 75.4, grade: 'B', status: '완료' },
  { empId: 'WLD-02', name: '김지수', position: '일반',   team: '용접팀',       quantitative: 73.5, qualitative: 71.2, total: 72.5, grade: 'B', status: '완료' },
  { empId: 'WLD-03', name: '이수연', position: '일반',   team: '용접팀',       quantitative: 64.2, qualitative: 67.8, total: 65.6, grade: 'C', status: '진행중' },
]

export const teamOptions = ['전체', '정밀가공 1팀', '정밀가공 2팀', '프레스라인팀', '용접팀']
export const gradeOptions = ['전체', 'S', 'A', 'B', 'C', 'D']
export const periodOptions = ['2026 1분기', '2025 4분기', '2025 3분기', '2025 2분기']
