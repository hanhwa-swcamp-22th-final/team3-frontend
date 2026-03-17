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

    // Admin Routes
    {
        path: '/admin',
        component: DashboardView,
        meta: { requiresAuth: true, allowedRoles: ['admin'] },
        children: [
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
                component: () => import('@/views/admin/AdminPermissions.vue'),
            },
            {
                path: 'algorithm',
                name: 'AdminAlgorithm',
                component: () => import('@/views/admin/AdminAlgorithm.vue'),
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
                component: () => import('@/views/admin/AdminProfiles.vue'),
            },
            {
                path: 'knowledge-hub',
                name: 'AdminKnowledgeHub',
                component: Placeholder,
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
        component: Placeholder,
      },
      {
        path: 'ocsascore',
        name: 'OcsaScore',
        component: () => import('@/views/teamleader/TeamLeaderOcsaScoreView.vue'),
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
        component: Placeholder,
      },
      {
        path: 'team-capability',
        name: 'TeamCapability',
        component: () => import('@/views/departmentleader/DepartmentLeaderTeamCapabilityView.vue'),
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

    // Worker Routes
    {
        path: '/worker',
        component: DashboardView,
        meta: { requiresAuth: true, allowedRoles: ['worker'] },
        children: [
            {
                path: 'dashboard',
                name: 'WorkerDashboard',
                component: () => import('@/views/worker/WorkerMyProfileContent.vue'),
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
                component: () => import('@/views/worker/AppealRequestContent.vue'),
            },
            {
                path: 'noticeboard',
                name: 'WorkerNoticeBoard',
                component: () => import('@/views/worker/NoticeBoardContent.vue'),
            },
            {
                path: 'today-task',
                name: 'TodayTask',
                component: () => import('@/views/worker/TodayTaskContent.vue'),
            },
            {
                path: 'knowledgehub',
                name: 'WorkerKnowledgeHub',
                component: () => import('@/views/worker/KnowledgeHubContent.vue'),
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
        const roleRouteMap = {
            admin: 'AdminFacility',
            HRM: 'HRDashboard',
            TL: 'TeamLeaderDashboard',
            DL: 'DepartmentLeaderDashboard',
            worker: 'WorkerDashboard',
        }
        const dest = roleRouteMap[auth.role()] ?? 'Login'
        return { name: dest }
    }
})

export default router
