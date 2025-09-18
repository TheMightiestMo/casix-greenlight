import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { usePerformanceStore } from '@/stores/performanceStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const performanceStore = usePerformanceStore()
performanceStore.setupPerformanceObserver()

app.mount('#app')


