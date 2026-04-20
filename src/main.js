import { createApp } from 'vue'
import './assets/font/pretendard.css'
import './assets/font/inter.css'
import './assets/styles/variables.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setupSessionExpirationInterceptors } from '@/services/sessionExpirationHandler'

const app = createApp(App)
app.use(createPinia())
app.use(router)
setupSessionExpirationInterceptors()
app.mount('#app')
