import { kmsApi } from '@/services/apiClient'

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
    return kmsApi.get('/api/kms/stats', { params: { status: 'hub' } })
  },

  // limit: 노출할 기여자 수 (기본 5)
  getContributors(limit = 5) {
    return kmsApi.get('/api/kms/articles/contributors', { params: { limit } })
  },

  getRecommendations() {
    return kmsApi.get('/api/kms/articles/recommendations')
  },

  getWorkerSkillGap() {
    return kmsApi.get('/api/kms/workers/me/skill-gap')
  },

  getTags() {
    return kmsApi.get('/api/kms/tags')
  },

  getEquipments() {
    return kmsApi.get('/api/kms/equipments')
  },

  // ── 내 지식 관리 ────────────────────────────────────────────────
  getMyArticleStats() {
    return kmsApi.get('/api/kms/my/articles/stats')
  },

  // params: { status, page, size }
  getMyArticles(params = {}) {
    return kmsApi.get('/api/kms/my/articles', { params })
  },

  getMyArticleHistory() {
    return kmsApi.get('/api/kms/my/articles/history')
  },

  getMyBookmarks() {
    return kmsApi.get('/api/kms/my/bookmarks')
  },

  // ── 승인 조회 ───────────────────────────────────────────────────
  getPendingStats() {
    return kmsApi.get('/api/kms/stats', { params: { status: 'pending' } })
  },

  // params: { page, size }
  getPendingList(params = {}) {
    return kmsApi.get('/api/kms/articles', {
      params: { ...params, status: 'pending' },
    })
  },

  getPendingDetail(articleId) {
    return kmsApi.get(`/api/kms/articles/${articleId}`, {
      params: { status: 'pending' },
    })
  },

  // ── Worker Command ────────────────────────────────────────────
  // data: { title, category, equipmentId, content }
  createArticle(data) {
    return kmsApi.post('/api/kms/articles', data)
  },

  saveDraft(data) {
    return kmsApi.post('/api/kms/articles/drafts', data)
  },

  // data: { title, category, equipmentId, content }
  // DRAFT / PENDING / REJECTED 상태 문서만 허용 (임시저장용)
  updateArticle(articleId, data) {
    return kmsApi.put(`/api/kms/articles/${articleId}`, data)
  },

  // DRAFT / PENDING / REJECTED -> DRAFT
  saveArticleAsDraft(articleId, data) {
    return kmsApi.put(`/api/kms/articles/${articleId}/draft`, data)
  },

  // APPROVED 문서 수정 시작: 복사본(DRAFT) 생성 또는 기존 복사본 반환
  startRevision(articleId) {
    return kmsApi.put(`/api/kms/articles/${articleId}/revision`, {})
  },

  // DRAFT / REJECTED → PENDING 제출
  // data: { title, category, equipmentId, content }
  submitDraft(articleId, data) {
    return kmsApi.put(`/api/kms/articles/${articleId}/submit`, data)
  },

  deleteArticle(articleId) {
    return kmsApi.delete(`/api/kms/articles/${articleId}`)
  },

  restoreArticle(articleId) {
    return kmsApi.put(`/api/kms/articles/${articleId}/restore`, {})
  },

  // tagIds: Long[]
  updateTags(articleId, tagIds) {
    return kmsApi.put(`/api/kms/articles/${articleId}/tags`, { tagIds })
  },

  addBookmark(articleId) {
    return kmsApi.post('/api/kms/bookmarks', { articleId })
  },

  removeBookmark(articleId) {
    return kmsApi.delete('/api/kms/bookmarks', { params: { articleId } })
  },

  // ── 승인 처리 (TL / DL) ─────────────────────────────────────────
  // role   : 'TL' | 'DL'
  // data   : { status: 'APPROVE'|'REJECT'|'PENDING', reviewComment }
  processApproval(role, articleId, data) {
    const prefix = role === 'TL' ? 'tl' : 'dl'
    return kmsApi.post(`/api/kms/${prefix}/articles/${articleId}/approval`, data)
  },

  // ── Admin Command ─────────────────────────────────────────────
  deleteArticleByAdmin(articleId, data) {
    return kmsApi.delete(`/api/kms/admin/articles/${articleId}`, { data })
  },

  restoreArticleByAdmin(articleId) {
    return kmsApi.put(`/api/kms/admin/articles/${articleId}/restore`)
  },
}

export default knowledgeArticleApi
