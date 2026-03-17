import axios from 'axios'
import { API_BASE } from '@/constants'

const api = axios.create({
    baseURL: API_BASE,
    timeout: 5000,
})

export default api
