import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },

  // ── Admin ──────────────────────────────────────────────────────────
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/admin/facility',
    name: 'AdminFacility',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/admin/logs',
    name: 'AdminLogs',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/admin/permissions',
    name: 'AdminPermissions',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/admin/algorithm',
    name: 'AdminAlgorithm',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/admin/preset',
    name: 'AdminPreset',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/admin/domain-keywords',
    name: 'AdminDomainKeywords',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/admin/profiles',
    name: 'AdminProfiles',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },
  {
    path: '/admin/knowledge-hub',
    name: 'AdminKnowledgeHub',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
  },

  // ── HRM (HR Manager) ───────────────────────────────────────────────
  {
    path: '/hr/dashboard',
    name: 'HRDashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['HRM'] },
  },
  {
    path: '/hr/approval-review',
    name: 'ApprovalReview',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['HRM'] },
  },
  {
    path: '/hr/kpireport',
    name: 'HRMKpiReport',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['HRM'] },
  },
  {
    path: '/hr/evaluation-criteria',
    name: 'EvaluationCriteria',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['HRM'] },
  },
  {
    path: '/hr/promotion-review',
    name: 'PromotionReview',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['HRM'] },
  },
  {
    path: '/hr/organization',
    name: 'OrganizationManagement',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['HRM'] },
  },
  {
    path: '/hr/noticeboard',
    name: 'HRMNoticeBoard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['HRM'] },
  },

  // ── TL (Team Leader) ───────────────────────────────────────────────
  {
    path: '/teamleader/dashboard',
    name: 'TeamLeaderDashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },
  {
    path: '/teamleader/kpireport',
    name: 'TLKpiReport',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },
  {
    path: '/teamleader/teamevaluation',
    name: 'TeamEvaluation',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },
  {
    path: '/teamleader/notification',
    name: 'TLNotifications',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },
  {
    path: '/teamleader/noticeboard',
    name: 'TLNoticeBoard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },
  {
    path: '/teamleader/scmorders',
    name: 'TLScmOrders',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },
  {
    path: '/teamleader/taskmatching',
    name: 'TaskMatching',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },
  {
    path: '/teamleader/ocsascore',
    name: 'OcsaScore',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },
  {
    path: '/teamleader/facilitystatus',
    name: 'FacilityStatus',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },
  {
    path: '/teamleader/knowledgehub',
    name: 'TLKnowledgeHub',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },
  {
    path: '/teamleader/knowledgeapproval',
    name: 'TLKnowledgeApproval',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
  },

  // ── DL (Department Leader) ─────────────────────────────────────────
  {
    path: '/departmentleader/dashboard',
    name: 'DepartmentLeaderDashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
  },
  {
    path: '/departmentleader/performance',
    name: 'DepartmentLeaderDashboardPerformance',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
  },
  {
    path: '/departmentleader/team-capability',
    name: 'TeamCapability',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
  },
  {
    path: '/departmentleader/evaluation',
    name: 'DepartmentLeaderDashboardEvaluation',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
  },
  {
    path: '/departmentleader/notification',
    name: 'DLNotifications',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
  },
  {
    path: '/departmentleader/noticeboard',
    name: 'DLNoticeBoard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
  },
  {
    path: '/departmentleader/scmorders',
    name: 'DLScmOrders',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
  },
  {
    path: '/departmentleader/knowledgehub',
    name: 'DLKnowledgeHub',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
  },
  {
    path: '/departmentleader/knowledgeapproval',
    name: 'DLKnowledgeApproval',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
  },

  // ── Worker ─────────────────────────────────────────────────────────
  {
    path: '/worker/dashboard',
    name: 'WorkerDashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['worker'] },
  },
  {
    path: '/worker/point-mission',
    name: 'PointMission',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['worker'] },
  },
  {
    path: '/worker/evaluation-result',
    name: 'WorkerEvaluationResult',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['worker'] },
  },
  {
    path: '/worker/appeal',
    name: 'AppealRequest',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['worker'] },
  },
  {
    path: '/worker/noticeboard',
    name: 'WorkerNoticeBoard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['worker'] },
  },
  {
    path: '/worker/today-task',
    name: 'TodayTask',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['worker'] },
  },
  {
    path: '/worker/knowledgehub',
    name: 'WorkerKnowledgeHub',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['worker'] },
  },
  {
    path: '/worker/my-knowledge',
    name: 'MyKnowledgeManagement',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['worker'] },
  },
  {
    path: '/worker/skill-gap',
    name: 'SkillGapAnalysis',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, allowedRoles: ['worker'] },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Login' }
  }

  if (to.name === 'Login' && auth.isAuthenticated) {
    return { name: 'Dashboard' }
  }
})

export default router
