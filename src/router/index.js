import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROLE_ROUTE_MAP } from '@/constants'
import LoginView from '@/views/common/LoginView.vue'
import DashboardView from '@/views/common/DashboardView.vue'
const Placeholder = () => import('@/views/common/PlaceholderView.vue')

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
        component: DashboardView,
        meta: { requiresAuth: true },
        children: [
            { path: '', name: 'Dashboard', component: Placeholder },
        ],
    },

    // Admin Routes
    {
        path: '/admin',
        component: DashboardView,
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
        children: [
            {
                path: 'facility',
                name: 'AdminFacility',
                component: () => import('@/views/admin/AdminEquipmentManage.vue'),
            },
            {
                path: 'logs',
                name: 'AdminLogs',
                component: () => import('@/views/admin/AdminLogs.vue'),
            },
            {
                path: 'permissions',
                name: 'AdminPermissions',
                component: () => import('@/views/admin/AdminSystemAccessManage.vue'),
            },
            {
                path: 'algorithm',
                name: 'AdminAlgorithm',
                component: () => import('@/views/admin/AdminAlgorithmConfig.vue'),
            },
            {
                path: 'preset',
                name: 'AdminPreset',
                component: () => import('@/views/admin/AdminIndustryPreset.vue'),
            },
            {
                path: 'domain-keywords',
                name: 'AdminDomainKeywords',
                component: () => import('@/views/admin/AdminDomainKeywordManage.vue'),
            },
            {
                path: 'org-management',
                name: 'AdminOrgManagement',
                component: () => import('@/views/admin/AdminOrganizationManage.vue'),
            },
            {
                path: 'knowledge-hub',
                name: 'AdminKnowledgeHub',
                component: () => import('@/views/admin/AdminKnowledgeHub.vue'),
            },
        ],
    },

  // HRM Routes
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
        component: () => import('@/views/hrmanager/HRMApprovalView.vue'),
      },
      {
        path: 'kpireport',
        name: 'HRMKpiReport',
        component: () => import('@/views/hrmanager/HRMKpiReportView.vue'),
      },
      {
        path: 'evaluation-criteria',
        name: 'EvaluationCriteria',
        component: () => import('@/views/hrmanager/HRMEvaluationCriteriaView.vue'),
      },
      {
        path: 'promotion-review',
        name: 'PromotionReview',
        component: () => import('@/views/hrmanager/HRMPromotionReviewView.vue'),
      },
      {
        path: 'organization',
        name: 'OrganizationManagement',
        component: () => import('@/views/hrmanager/HRMOrganizationView.vue'),
      },
      {
        path: 'noticeboard',
        name: 'HRMNoticeBoard',
        component: () => import('@/views/hrmanager/HRMNoticeBoardView.vue'),
      },
    ],
  },

  // Team Leader Routes
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
        component: () => import('@/views/teamleader/TeamLeaderKpiReportView.vue'),
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
        component: () => import('@/views/teamleader/TeamLeaderNoticeBoardView.vue'),
      },
      {
        path: 'scmorders',
        name: 'TLScmOrders',
        component: () => import('@/views/teamleader/TeamLeaderScmOrdersView.vue'),
      },
      {
        path: 'taskmatching',
        name: 'TaskMatching',
        component: () => import('@/views/teamleader/TeamLeaderTaskMatchingView.vue'),
      },
      {
        path: 'ocsascore',
        name: 'OcsaScore',
        component: () => import('@/views/teamleader/TeamLeaderOcsaScoreView.vue'),
      },
      {
        path: 'facilitystatus',
        name: 'FacilityStatus',
        component: () => import('@/views/teamleader/TeamLeaderFacilityStatusView.vue'),
      },
      {
        path: 'knowledgehub',
          name: 'TLKnowledgeHub',
          component: () => import('@/views/teamleader/TeamLeaderKnowledgeHubView.vue'),
      },
      {
        path: 'knowledgeapproval',
        name: 'TLKnowledgeApproval',
        component: () => import('@/views/teamleader/TeamLeaderKnowledgeApprovalView.vue'),
      },
    ],
  },

  // Department Leader Routes
  {
    path: '/departmentleader',
    component: DashboardView,
    meta: { requiresAuth: true, allowedRoles: ['DL'] },
    children: [
      {
        path: 'dashboard',
        name: 'DepartmentLeaderDashboard',
        component: () => import('@/views/departmentleader/DepartmentLeaderDashboardView.vue'),
      },
      {
        path: 'performance',
        name: 'DepartmentLeaderDashboardPerformance',
        component: () => import('@/views/departmentleader/DepartmentLeaderPerformanceView.vue'),
      },
      {
        path: 'team-capability',
        name: 'TeamCapability',
        component: () => import('@/views/departmentleader/DepartmentLeaderTeamCapabilityView.vue'),
      },
      {
        path: 'evaluation',
        name: 'DepartmentLeaderDashboardEvaluation',
        component: () => import('@/views/departmentleader/DepartmentLeaderSecondEvaluationView.vue'),
      },
      {
        path: 'notification',
        name: 'DLNotifications',
        component: () => import('@/views/departmentleader/DepartmentLeaderNotificationView.vue'),
      },
      {
        path: 'noticeboard',
        name: 'DLNoticeBoard',
        component: () => import('@/views/departmentleader/DepartmentLeaderNoticeBoardView.vue'),
      },
      {
        path: 'scmorders',
        name: 'DLScmOrders',
        component: () => import('@/views/departmentleader/DepartmentLeaderScmOrdersView.vue'),
      },
      {
        path: 'knowledgehub',
        name: 'DLKnowledgeHub',
        component: () => import('@/views/departmentleader/DepartmentLeaderKnowledgeHubView.vue'),
      },
      {
        path: 'knowledgeapproval',
        name: 'DLKnowledgeApproval',
        component: () => import('@/views/departmentleader/DepartmentLeaderKnowledgeApprovalView.vue'),
      },
    ],
  },

    // Worker Routes
    {
        path: '/worker',
        component: DashboardView,
        meta: { requiresAuth: true, allowedRoles: ['worker'] },
        children: [
            {
                path: 'dashboard',
                name: 'WorkerDashboard',
                component: () => import('@/views/worker/WorkerMyProfileView.vue'),
            },
            {
                path: 'point-mission',
                name: 'PointMission',
                component: () => import('@/views/worker/WorkerPointMissionView.vue'),
            },
            {
                path: 'evaluation-result',
                name: 'WorkerEvaluationResult',
                component: () => import('@/views/worker/WorkerEvaluationResultView.vue'),
            },
            {
                path: 'appeal',
                name: 'AppealRequest',
                component: () => import('@/views/worker/WorkerAppealRequestView.vue'),
            },
            {
                path: 'noticeboard',
                name: 'WorkerNoticeBoard',
                component: () => import('@/views/worker/WorkerNoticeBoardView.vue'),
            },
            {
                path: 'today-task',
                name: 'TodayTask',
                component: () => import('@/views/worker/WorkerTodayTaskView.vue'),
            },
            {
                path: 'knowledgehub',
                name: 'WorkerKnowledgeHub',
                component: () => import('@/views/worker/WorkerKnowledgeHubView.vue'),
            },
            {
                path: 'my-knowledge',
                name: 'MyKnowledgeManagement',
                component: () => import('@/views/worker/WorkerMyKnowledgeManagementView.vue'),
            },
            {
                path: 'skill-gap',
                name: 'SkillGapAnalysis',
                component: () => import('@/views/worker/WorkerSkillGapView.vue'),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

let authInitialized = false

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    // Try to restore session from refresh token on first navigation
    if (!authInitialized) {
        authInitialized = true
        if (!auth.isAuthenticated) {
            await auth.initAuth()
        }
    }

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return { name: 'Login' }
    }

    // Role enforcement
    if (to.meta.allowedRoles && auth.isAuthenticated) {
        const userRole = auth.role()
        if (!to.meta.allowedRoles.includes(userRole)) {
            const dest = ROLE_ROUTE_MAP[userRole] ?? 'Login'
            return { name: dest }
        }
    }

    if (to.name === 'Login' && auth.isAuthenticated) {
        const dest = ROLE_ROUTE_MAP[auth.role()] ?? 'Login'
        return { name: dest }
    }
})

export default router


