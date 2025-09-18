import { defineStore } from 'pinia';
import { poiService } from '@/services/pointOfInterestService';
import type { Place } from '@/types/pointOfInterest';

interface PerformanceState {
  durations: number[];
  lastResultCount: number;
  singlePlaceDurations: number[];
  singlePlaceResult: Place | null;      // NEU: Hier speichern wir die Fahrzeug-Daten
  isSinglePlaceLoading: boolean;        // NEU: Ladezustand für die Einzelsuche
  singlePlaceError: string | null;
}

export const usePerformanceStore = defineStore('performance', {
  state: (): PerformanceState => ({
    durations: [] as number[],
    lastResultCount: 0,
    singlePlaceDurations: [] as number[],
    singlePlaceResult: null,            // NEU
    isSinglePlaceLoading: false,        // NEU
    singlePlaceError: null,
  }),

  // Getter sind wie computed() für den Store.
  // Sie berechnen Werte aus dem State.
  getters: {
    averageDuration(state): number {
      if (state.durations.length === 0) return 0;
      return state.durations.reduce((a, b) => a + b, 0) / state.durations.length;
    },
    lastDuration(state): number | null {
      if (state.durations.length === 0) return null;
      return state.durations[state.durations.length - 1];
    },
    requestCount(state): number {
      return state.durations.length;
    },
    singlePlaceAverageDuration(state): number {
      if (state.singlePlaceDurations.length === 0) return 0;
      return state.singlePlaceDurations.reduce((a, b) => a + b, 0) / state.singlePlaceDurations.length;
    },
    singlePlaceLastDuration(state): number | null {
      if (state.singlePlaceDurations.length === 0) return null;
      return state.singlePlaceDurations[state.singlePlaceDurations.length - 1];
    },
    singlePlaceRequestCount(state): number {
      return state.singlePlaceDurations.length;
    },

  },

  // Actions verändern den State.
  actions: {
    addDuration(duration: number) {
      this.durations.push(duration);
    },
    setLastResultCount(count: number) {
      this.lastResultCount = count;
    },
    clearDurations() {
      this.durations = [];
      this.lastResultCount = 0;
      console.log('🧹 [Pinia Store] Messungen zurückgesetzt.');
    },
    addSinglePlaceDuration(duration: number) {
      this.singlePlaceDurations.push(duration);
    },

    // 2. NEUE ACTION ZUM LADEN DER DATEN ERSTELLEN
    async fetchPlaceById(placeId: string, expands: string[]) {
      this.isSinglePlaceLoading = true;
      this.singlePlaceError = null;
      this.singlePlaceResult = null;

      // Die Performance-Messung bleibt in der Komponente, aber die Logik ist hier
      try {
        const result = await poiService.fetchPlaceById(placeId, {
          start: '2025-09-18T09:30:00.000Z', // Heutiges Datum als Beispiel
          end: '2025-09-18T11:30:00.000Z',
          expands: expands,
        });
        this.singlePlaceResult = result.data;
      } catch (e) {
        this.singlePlaceError = `Ort mit ID "${placeId}" konnte nicht gefunden werden.`;
        console.error(e);
      } finally {
        this.isSinglePlaceLoading = false;
      }
    },
    resetSinglePlaceSearch() {
      this.singlePlaceDurations = [];
      this.singlePlaceResult = null;
      this.singlePlaceError = null;
    },
    setupPerformanceObserver() {
      // Sicherstellen, dass der Code nur im Browser läuft
      if (typeof window.PerformanceObserver === 'undefined') return;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Prüfen, welche Messung es war und die richtige Action aufrufen
          if (entry.name === 'fetch-pois-duration') {
            this.addDuration(entry.duration);
          } else if (entry.name === 'fetch-place-by-id-duration') {
            this.addSinglePlaceDuration(entry.duration);
          }
        }
      });
      // Dem Observer sagen, dass er auf unsere "measure"-Einträge hören soll
      observer.observe({ entryTypes: ['measure'] });
      console.log('🚀 [Pinia Store] PerformanceObserver ist aktiv.');
    },
  },
});
