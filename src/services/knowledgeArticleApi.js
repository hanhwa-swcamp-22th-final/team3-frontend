import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
    baseURL: import.meta.env.VITE_KMS_API_BASE ?? 'http://localhost:8083',
    timeout: 5000,
})

api.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }
    return config
})

const knowledgeArticleApi = {
    getArticles(page, size) {
        return api.get(`/api/kms/articles?page=${page}&size=${size}`)
    }
}

export default knowledgeArticleApi