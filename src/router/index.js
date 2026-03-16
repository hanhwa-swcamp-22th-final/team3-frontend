import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'

const Placeholder = () => import('@/views/PlaceholderView.vue')

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
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: Placeholder },
    ],
  },

  // ── Admin ──────────────────────────────────────────────────────────
  {
    path: '/admin',
    component: DashboardView,
    meta: { requiresAuth: true, allowedRoles: ['admin'] },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: Placeholder,
      },
      {
        path: 'facility',
        name: 'AdminFacility',
        component: Placeholder,
      },
      {
        path: 'logs',
        name: 'AdminLogs',
        component: Placeholder,
      },
      {
        path: 'permissions',
        name: 'AdminPermissions',
        component: Placeholder,
      },
      {
        path: 'algorithm',
        name: 'AdminAlgorithm',
        component: Placeholder,
      },
      {
        path: 'preset',
        name: 'AdminPreset',
        component: Placeholder,
      },
      {
        path: 'domain-keywords',
        name: 'AdminDomainKeywords',
        component: Placeholder,
      },
      {
        path: 'profiles',
        name: 'AdminProfiles',
        component: Placeholder,
      },
      {
        path: 'knowledge-hub',
        name: 'AdminKnowledgeHub',
        component: Placeholder,
      },
    ],
  },

  // ── HRM (HR Manager) ───────────────────────────────────────────────
  {
    path: '/hr',
    component: DashboardView,
    meta: { requiresAuth: true, allowedRoles: ['HRM'] },
    children: [
      {
        path: 'dashboard',
        name: 'HRDashboard',
        component: () => import('@/views/hrmanager/HRMDashboardView.vue'),
      },
      {
        path: 'approval-review',
        name: 'ApprovalReview',
        component: Placeholder,
      },
      {
        path: 'kpireport',
        name: 'HRMKpiReport',
        component: Placeholder,
      },
      {
        path: 'evaluation-criteria',
        name: 'EvaluationCriteria',
        component: Placeholder,
      },
      {
        path: 'promotion-review',
        name: 'PromotionReview',
        component: Placeholder,
      },
      {
        path: 'organization',
        name: 'OrganizationManagement',
        component: Placeholder,
      },
      {
        path: 'noticeboard',
        name: 'HRMNoticeBoard',
        component: Placeholder,
      },
    ],
  },

  // ── TL (Team Leader) ───────────────────────────────────────────────
  {
    path: '/teamleader',
    component: DashboardView,
    meta: { requiresAuth: true, allowedRoles: ['TL'] },
    children: [
      {
        path: 'dashboard',
        name: 'TeamLeaderDashboard',
        component: () => import("@/views/teamleader/TeamLeaderDashboardView.vue"),
      },
      {
        path: 'kpireport',
        name: 'TLKpiReport',
        component: Placeholder,
      },
      {
        path: 'teamevaluation',
        name: 'TeamEvaluation',
        component: () => import('@/views/teamleader/TeamLeaderAiEvaluationView.vue'),
      },
        {
          path: 'notification',
          name: 'TLNotifications',
          component: () => import('@/views/teamleader/TeamLeaderNotificationView.vue'),
        },
      {
        path: 'noticeboard',
        name: 'TLNoticeBoard',
        component: Placeholder,
      },
      {
        path: 'scmorders',
        name: 'TLScmOrders',
        component: Placeholder,
      },
      {
        path: 'taskmatching',
        name: 'TaskMatching',
        component: Placeholder,
      },
      {
        path: 'ocsascore',
        name: 'OcsaScore',
        component: Placeholder,
      },
      {
        path: 'facilitystatus',
        name: 'FacilityStatus',
        component: Placeholder,
      },
      {
        path: 'knowledgehub',
        name: 'TLKnowledgeHub',
        component: Placeholder,
      },
      {
        path: 'knowledgeapproval',
        name: 'TLKnowledgeApproval',
        component: Placeholder,
      },
    ],
  },

  // ── DL (Department Leader) ─────────────────────────────────────────
  {
    path: '/departmentleader',
    component: DashboardView,
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
    children: [
      {
        path: 'dashboard',
        name: 'DepartmentLeaderDashboard',
        component: Placeholder,
      },
      {
        path: 'performance',
        name: 'DepartmentLeaderDashboardPerformance',
        component: Placeholder,
      },
      {
        path: 'team-capability',
        name: 'TeamCapability',
        component: Placeholder,
      },
      {
        path: 'evaluation',
        name: 'DepartmentLeaderDashboardEvaluation',
        component: Placeholder,
      },
      {
        path: 'notification',
        name: 'DLNotifications',
        component: Placeholder,
      },
      {
        path: 'noticeboard',
        name: 'DLNoticeBoard',
        component: Placeholder,
      },
      {
        path: 'scmorders',
        name: 'DLScmOrders',
        component: Placeholder,
      },
      {
        path: 'knowledgehub',
        name: 'DLKnowledgeHub',
        component: Placeholder,
      },
      {
        path: 'knowledgeapproval',
        name: 'DLKnowledgeApproval',
        component: Placeholder,
      },
    ],
  },

  // ── Worker ─────────────────────────────────────────────────────────
  {
    path: '/worker',
    component: DashboardView,
    meta: { requiresAuth: true, allowedRoles: ['worker'] },
    children: [
      {
        path: 'dashboard',
        name: 'WorkerDashboard',
        component: () => import('@/views/worker/WorkerDashboardContent.vue'),
      },
      {
        path: 'point-mission',
        name: 'PointMission',
        component: () => import('@/views/worker/PointMissionContent.vue'),
      },
      {
        path: 'evaluation-result',
        name: 'WorkerEvaluationResult',
        component: () => import('@/views/worker/EvaluationResultContent.vue'),
      },
      {
        path: 'appeal',
        name: 'AppealRequest',
        component: Placeholder,
      },
      {
        path: 'noticeboard',
        name: 'WorkerNoticeBoard',
        component: Placeholder,
      },
      {
        path: 'today-task',
        name: 'TodayTask',
        component: Placeholder,
      },
      {
        path: 'knowledgehub',
        name: 'WorkerKnowledgeHub',
        component: Placeholder,
      },
      {
        path: 'my-knowledge',
        name: 'MyKnowledgeManagement',
        component: Placeholder,
      },
      {
        path: 'skill-gap',
        name: 'SkillGapAnalysis',
        component: Placeholder,
      },
    ],
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
