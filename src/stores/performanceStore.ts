import { defineStore } from 'pinia';
import { poiService } from '@/services/pointOfInterestService';
import type { Place } from '@/types/pointOfInterest';

interface PerformanceState {
  durations: number[];
  lastResultCount: number;
  networkDurations: number[];
  singlePlaceDurations: number[];
  singlePlaceNetworkDurations: number[];
  singlePlaceResult: Place | null;
  isSinglePlaceLoading: boolean;
  singlePlaceError: string | null;
}

export const usePerformanceStore = defineStore('performance', {
  state: (): PerformanceState => ({
    durations: [],
    lastResultCount: 0,
    networkDurations: [],
    singlePlaceDurations: [],
    singlePlaceNetworkDurations: [],
    singlePlaceResult: null,
    isSinglePlaceLoading: false,
    singlePlaceError: null,
  }),

  getters: {
    averageDuration(state): number {
      if (state.durations.length === 0) return 0;
      return state.durations.reduce((a, b) => a + b, 0) / state.durations.length;
    },
    lastDuration(state): number | null {
      return state.durations.length > 0 ? state.durations[state.durations.length - 1] : null;
    },
    averageNetworkDuration(state): number {
      if (state.networkDurations.length === 0) return 0;
      return state.networkDurations.reduce((a, b) => a + b, 0) / state.networkDurations.length;
    },
    lastNetworkDuration(state): number | null {
      return state.networkDurations.length > 0
        ? state.networkDurations[state.networkDurations.length - 1]
        : null;
    },
    requestCount(state): number {
      return state.durations.length;
    },
    singlePlaceAverageDuration(state): number {
      if (state.singlePlaceDurations.length === 0) return 0;
      return (
        state.singlePlaceDurations.reduce((a, b) => a + b, 0) / state.singlePlaceDurations.length
      );
    },
    singlePlaceLastDuration(state): number | null {
      return state.singlePlaceDurations.length > 0
        ? state.singlePlaceDurations[state.singlePlaceDurations.length - 1]
        : null;
    },
    singlePlaceRequestCount(state): number {
      return state.singlePlaceDurations.length;
    },
    averageSinglePlaceNetworkDuration(state): number {
      if (state.singlePlaceNetworkDurations.length === 0) return 0;
      return (
        state.singlePlaceNetworkDurations.reduce((a, b) => a + b, 0) /
        state.singlePlaceNetworkDurations.length
      );
    },
    lastSinglePlaceNetworkDuration(state): number | null {
      return state.singlePlaceNetworkDurations.length > 0
        ? state.singlePlaceNetworkDurations[state.singlePlaceNetworkDurations.length - 1]
        : null;
    },
  },

  actions: {
    addDuration(duration: number) {
      this.durations.push(duration);
    },
    addNetworkDuration(duration: number) {
      this.networkDurations.push(duration);
    },
    setLastResultCount(count: number) {
      this.lastResultCount = count;
    },
    clearDurations() {
      this.durations = [];
      this.networkDurations = [];
      this.lastResultCount = 0;
      console.log('🧹 [Pinia Store] Messungen zurückgesetzt.');
    },
    addSinglePlaceDuration(duration: number) {
      this.singlePlaceDurations.push(duration);
    },
    addSinglePlaceNetworkDuration(duration: number) {
      this.singlePlaceNetworkDurations.push(duration);
    },
    resetSinglePlaceSearch() {
      this.singlePlaceDurations = [];
      this.singlePlaceNetworkDurations = [];
      this.singlePlaceResult = null;
      this.singlePlaceError = null;
    },

    async fetchPlaceById(placeId: string, expands: string[]) {
      this.isSinglePlaceLoading = true;
      this.singlePlaceError = null;
      this.singlePlaceResult = null;

      try {
        const result = await poiService.fetchPlaceById(placeId, {
          start: '2025-09-18T09:30:00.000Z',
          end: '2025-09-18T11:30:00.000Z',
          expands,
        });
        this.singlePlaceResult = result.data;
        return result.duration || 0;
      } catch (e) {
        this.singlePlaceError = `Ort mit ID "${placeId}" konnte nicht gefunden werden.`;
        console.error(e);
        return 0;
      } finally {
        this.isSinglePlaceLoading = false;
      }
    },

    setupPerformanceObserver() {
      if (typeof window.PerformanceObserver === 'undefined') return;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'fetch-pois-duration') {
            this.addDuration(entry.duration);
          } else if (entry.name === 'fetch-place-by-id-duration') {
            this.addSinglePlaceDuration(entry.duration);
          }
        }
      });
      observer.observe({ entryTypes: ['measure'] });
      console.log('🚀 [Pinia Store] PerformanceObserver ist aktiv.');
    },
  },
});
