import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
// WICHTIG: Den Store hier importieren
import { usePerformanceStore } from '@/stores/performanceStore'

// --- DEIN BISHERIGER CODE ---
const app = createApp(App)
const pinia = createPinia() // Wir brauchen die Instanz in einer Variable

app.use(pinia) // Wichtig: Pinia MUSS vor dem Observer-Setup verwendet werden
app.use(router)

const performanceStore = usePerformanceStore()

// Startet den zentralen Beobachter für die gesamte App
performanceStore.setupPerformanceObserver()

app.mount('#app')


