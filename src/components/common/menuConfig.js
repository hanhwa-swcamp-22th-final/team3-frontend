export const roleLabels = {
  admin: 'Admin',
  HRM: 'HR Manager',
  TL: 'Team Leader',
  GL: 'Group Leader',
  worker: 'Worker',
}

export const defaultRouteByRole = {
  admin: { name: 'AdminDashboard' },
  HRM: { name: 'HRDashboard' },
  TL: { name: 'TeamLeaderDashboard' },
  GL: { name: 'GroupLeaderDashboard' },
  worker: { name: 'WorkerDashboard' },
}

export const adminSidebarSections = [
  {
    key: 'admin',
    label: 'ADMIN',
    items: [
      { label: '설비 관리', icon: '⚙', to: { name: 'AdminFacility' } },
      { label: '시스템 로그', icon: '🖥', to: { name: 'AdminLogs' } },
      { label: '권한 관리', icon: '🔐', to: { name: 'AdminPermissions' } },
      { label: '알고리즘 설정', icon: '🔢', to: { name: 'AdminAlgorithm' } },
      { label: '산업군 프리셋', icon: '🏭', to: { name: 'AdminPreset' } },
      { label: '도메인 키워드 관리', icon: '🪪', to: { name: 'AdminDomainKeywords' } },
      { label: '프로필 조회/등록/수정', icon: '✏', to: { name: 'AdminProfiles' } },
      { label: 'KMS 지식허브', icon: '📚', to: { name: 'AdminKnowledgeHub' } },
    ],
  },
]

export const roleSidebarSections = {
  HRM: [
    {
      key: 'hr',
      label: 'HR',
      items: [
        { label: '대시보드', icon: '👥', to: { name: 'HRDashboard' } },
        { label: '평가 승인', icon: '✅', to: { name: 'ApprovalReview' } },
        { label: 'KPI 리포트', icon: '📊', to: { name: 'HRMKpiReport' } },
        { label: '평가 기준 설정', icon: '🎯', to: { name: 'EvaluationCriteria' } },
        { label: '승급 심사', icon: '🏆', to: { name: 'PromotionReview' } },
        { label: '조직도 관리', icon: '📘', to: { name: 'OrganizationManagement' } },
        { label: '공지사항', icon: '🪪', to: { name: 'HRMNoticeBoard' } },
      ],
    },
  ],
  TL: [
    {
      key: 'hr',
      label: 'HR',
      items: [
        { label: '대시보드', icon: '👥', to: { name: 'TeamLeaderDashboard' } },
        { label: 'KPI 리포트', icon: '📊', to: { name: 'TLKpiReport' } },
        { label: '1차 평가 작성', icon: '📝', to: { name: 'TeamEvaluation' } },
        { label: '알림', icon: '🔔', to: { name: 'TLNotifications' } },
        { label: '공지사항', icon: '🪪', to: { name: 'TLNoticeBoard' } },
      ],
    },
    {
      key: 'scm',
      label: 'SCM',
      items: [
        { label: 'SCM 주문현황', icon: '📋', to: { name: 'TLScmOrders' } },
        { label: '작업 매칭', icon: '📊', to: { name: 'TaskMatching' } },
        { label: 'OCSA 난이도 산출', icon: '🔢', to: { name: 'OcsaScore' } },
        { label: '설비 현황', icon: '🏭', to: { name: 'FacilityStatus' } },
      ],
    },
    {
      key: 'kms',
      label: 'KMS',
      items: [
        { label: 'KMS 지식허브', icon: '📚', to: { name: 'TLKnowledgeHub' } },
        { label: 'KMS 승인', icon: '✅', to: { name: 'TLKnowledgeApproval' } },
      ],
    },
  ],
  DL: [
    {
      key: 'hr',
      label: 'HR',
      items: [
        { label: '대시보드', icon: '👥', to: { name: 'DepartmentLeaderDashboard' } },
        { label: '그룹 성과 현황', icon: '📊', to: { name: 'DepartmentLeaderDashboardPerformance' } },
        { label: '팀원 역량 조회', icon: '🔍', to: { name: 'TeamCapability' } },
        { label: '2차 평가 작성', icon: '📝', to: { name: 'DepartmentLeaderDashboardEvaluation' } },
        { label: '알림', icon: '🔔', to: { name: 'DLNotifications' } },
        { label: '공지사항', icon: '🪪', to: { name: 'DLNoticeBoard' } },
      ],
    },
    {
      key: 'scm',
      label: 'SCM',
      items: [
        { label: 'SCM 주문현황', icon: '📋', to: { name: 'DLScmOrders' } },
      ],
    },
    {
      key: 'kms',
      label: 'KMS',
      items: [
        { label: 'KMS 지식허브', icon: '📚', to: { name: 'DLKnowledgeHub' } },
        { label: 'KMS 승인', icon: '✅', to: { name: 'DLKnowledgeApproval' } },
      ],
    },
  ],
  worker: [
    {
      key: 'hr',
      label: 'HR',
      items: [
        { label: '내 능력치 카드', icon: '👤', to: { name: 'WorkerDashboard' } },
        { label: '포인트 / 미션', icon: '🎯', to: { name: 'PointMission' } },
        { label: '내 평가 결과', icon: '📊', to: { name: 'WorkerEvaluationResult' } },
        { label: '평가 이의 신청', icon: '✋', to: { name: 'AppealRequest' } },
        { label: '공지사항', icon: '🪪', to: { name: 'WorkerNoticeBoard' } },
      ],
    },
    {
      key: 'scm',
      label: 'SCM',
      items: [
        { label: '오늘 내 작업', icon: '📋', to: { name: 'TodayTask' } },
      ],
    },
    {
      key: 'kms',
      label: 'KMS',
      items: [
        { label: 'KMS 지식허브', icon: '📚', to: { name: 'WorkerKnowledgeHub' } },
        { label: 'KMS 내 지식 관리', icon: '📚', to: { name: 'MyKnowledgeManagement' } },
        { label: 'Skill Gap 분석', icon: '🔍', to: { name: 'SkillGapAnalysis' } },
      ],
    },
  ],
}

export function getSidebarSectionsByRole(role) {
  if (role === 'admin') {
    return adminSidebarSections
  }

  return roleSidebarSections[role] ?? []
}
