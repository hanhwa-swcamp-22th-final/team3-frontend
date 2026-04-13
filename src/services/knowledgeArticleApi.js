import axios from 'axios'
import { ADMIN_API_BASE } from '@/constants'
import { useAuthStore } from '@/stores/auth'

const KMS_API_BASE = import.meta.env.VITE_KMS_API_BASE ?? 'http://localhost:8083'

const kmsApi = axios.create({
  baseURL: KMS_API_BASE,
  timeout: 5000,
  withCredentials: true,
})

// ── request interceptor: Bearer 토큰 자동 첨부 ─────────────────
kmsApi.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

// ── response interceptor: 401 시 토큰 갱신 후 재시도 (authApi.js와 동일 패턴) ─
let isRefreshing = false
let failedQueue = []

function processQueue(error, token) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

kmsApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return kmsApi(originalRequest)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const res = await axios.post(
        `${ADMIN_API_BASE}/api/v1/auth/refresh`,
        null,
        { withCredentials: true }
      )

      if (res.data?.success && res.data.data?.accessToken) {
        const newToken = res.data.data.accessToken
        const authStore = useAuthStore()
        authStore.setToken(newToken)
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return kmsApi(originalRequest)
      }
    } catch (refreshError) {
      processQueue(refreshError, null)
      const authStore = useAuthStore()
      authStore.clearAuth()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }

    return Promise.reject(error)
  }
)

// ── API 메서드 ──────────────────────────────────────────────────

const knowledgeArticleApi = {

  // ── 조회 ──────────────────────────────────────────────────────
  // params: { page, size, category, status, sort, searchType, keyword }
  getArticles(params = {}) {
    return kmsApi.get('/api/kms/articles', { params })
  },

  getArticleDetail(articleId) {
    return kmsApi.get(`/api/kms/articles/${articleId}`)
  },

  getHubStats() {
    return kmsApi.get('/api/kms/stats', { params: { stat: 'hub' } })
  },

  // limit: 노출할 기여자 수 (기본 5)
  getContributors(limit = 5) {
    return kmsApi.get('/api/kms/articles/contributors', { params: { limit } })
  },

  getRecommendations() {
    return kmsApi.get('/api/kms/articles/recommendations')
  },

  getTags() {
    return kmsApi.get('/api/kms/tags')
  },

  getEquipments() {
    return kmsApi.get('/api/kms/equipments')
  },

  // ── 내 지식 관리 ────────────────────────────────────────────────
  getMyArticleStats(authorId) {
    return kmsApi.get('/api/kms/my/articles/stats', { params: { authorId } })
  },

  // params: { authorId, status, page, size }
  getMyArticles(params = {}) {
    return kmsApi.get('/api/kms/my/articles', { params })
  },

  getMyArticleHistory(authorId) {
    return kmsApi.get('/api/kms/my/articles/history', { params: { authorId } })
  },

  // ── 승인 조회 ───────────────────────────────────────────────────
  getApprovalStats() {
    return kmsApi.get('/api/kms/approval/stats')
  },

  // params: { page, size }
  getApprovalList(params = {}) {
    return kmsApi.get('/api/kms/approval', { params })
  },

  getApprovalDetail(articleId) {
    return kmsApi.get(`/api/kms/approval/${articleId}`)
  },

  // ── Worker Command ────────────────────────────────────────────
  // data: { authorId, title, category, equipmentId, content }
  createArticle(data) {
    return kmsApi.post('/api/kms/articles', data)
  },

  saveDraft(data) {
    return kmsApi.post('/api/kms/articles/drafts', data)
  },

  // data: { authorId, title, category, equipmentId, content }
  // DRAFT / PENDING / REJECTED 상태 문서만 허용 (임시저장용)
  updateArticle(articleId, data) {
    return kmsApi.put(`/api/kms/articles/${articleId}`, data)
  },

  // APPROVED 문서 수정 시작: 복사본(DRAFT) 생성 또는 기존 복사본 반환
  // requesterId: Long
  startRevision(articleId, requesterId) {
    return kmsApi.put(`/api/kms/articles/${articleId}/revision`, { requesterId })
  },

  // DRAFT / REJECTED → PENDING 제출
  // data: { authorId, title, category, equipmentId, content }
  submitDraft(articleId, data) {
    return kmsApi.put(`/api/kms/articles/${articleId}/submit`, data)
  },

  // data: { requesterId }
  deleteArticle(articleId, data) {
    return kmsApi.delete(`/api/kms/articles/${articleId}`, { data })
  },

  // tagIds: Long[]
  updateTags(articleId, tagIds) {
    return kmsApi.put(`/api/kms/articles/${articleId}/tags`, { tagIds })
  },

  // ── 승인 처리 (TL / DL) ─────────────────────────────────────────
  // role   : 'TL' | 'DL'
  // data   : { status: 'APPROVE'|'REJECT'|'PENDING', reviewComment }
  processApproval(role, articleId, data) {
    const authStore = useAuthStore()
    const prefix = role === 'TL' ? 'tl' : 'dl'
    return kmsApi.post(`/api/kms/${prefix}/articles/${articleId}/approval`, data, {
      headers: { 'X-Employee-Id': authStore.userInfo?.employeeId },
    })
  },

  // ── Admin Command ─────────────────────────────────────────────
  deleteArticleByAdmin(articleId) {
    return kmsApi.delete(`/api/kms/admin/articles/${articleId}`)
  },
}

export default knowledgeArticleApi
