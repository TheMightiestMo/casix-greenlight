<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { poiService } from '@/services/pointOfInterestService.ts'
import type { Bookee, PoiRequestParams, Remark } from '@/types/pointOfInterest.ts'
import LoadingOverlay from './LoadingOverlay.vue'
import { usePerformanceStore } from '@/stores/performanceStore'

const performanceStore = usePerformanceStore()
const {
  averageDuration,
  lastDuration,
  requestCount,
  lastResultCount,
  singlePlaceRequestCount,
  singlePlaceAverageDuration,
  singlePlaceLastDuration,
  singlePlaceResult,
  isSinglePlaceLoading,
  singlePlaceError,
} = storeToRefs(performanceStore)

const DEFAULT_REQUEST_PARAMS: PoiRequestParams = {
  lat: 52.3966,
  lng: 9.6858,
  range: 30000,
  start: '2025-09-15T15:30:00.000Z',
  end: '2025-09-15T17:30:00.000Z'
}

const isLoading = ref(false)
const error = ref<string | null>(null)
const requestParams = ref<PoiRequestParams>({ ...DEFAULT_REQUEST_PARAMS })

const availableExpands = [
  { label: 'Show City', key: 'place.cityId' },
  { label: 'Show Neighborhood', key: 'place.neighborhoodArea.placeId' },
  { label: 'Bookable Types', key: 'place.bookee.bookeeType' },
  { label: 'Vehicles', key: 'place.bookee.placeId' },
  { label: 'Vehicle Geo-Position', key: 'place.bookee.geoPosition' },
  { label: 'Pool Element', key: 'place.bookee.poolElementId' },
  { label: 'Product Info', key: 'place.bookee.bookeeProduct' },
  { label: 'Attributes', key: 'place.bookee.attribute' }
]
const selectedExpands = ref<string[]>([])

const placeIdInput = ref('')

const availableSinglePlaceExpands = [
  { label: 'Bookee', key: 'bookee.bookee' },
  { label: 'Place', key: 'bookee.place' },
  { label: 'Remarks', key: 'bookee.remark' },
  { label: 'BookeeRemarks', key: 'bookee.bookeeProduct.remark' },
  { label: 'BookeeProduct', key: 'bookee.bookeeProduct' },
  { label: 'BookeeType', key: 'bookee.bookeeType' },
  { label: 'City', key: 'cityId' },
  { label: 'BookingModel', key: 'bookee.bookingModel' }
]
const selectedSinglePlaceExpands = ref<string[]>([])

function selectAll(target: Ref<string[]>, source: { key: string }[]) {
  target.value = source.map(e => e.key)
}

function clearAll(target: Ref<string[]>) {
  target.value = []
}

const selectAllExpands = () => selectAll(selectedExpands, availableExpands)
const clearAllExpands = () => clearAll(selectedExpands)
const selectAllSinglePlaceExpands = () => selectAll(selectedSinglePlaceExpands, availableSinglePlaceExpands)
const clearAllSinglePlaceExpands = () => clearAll(selectedSinglePlaceExpands)

const runTest = async () => {
  isLoading.value = true
  error.value = null
  try {
    performance.mark('fetch-pois-start')
    const { data } = await poiService.fetchPois({
      ...requestParams.value,
      expands: selectedExpands.value
    })
    performance.mark('fetch-pois-end')
    performance.measure('fetch-pois-duration', 'fetch-pois-start', 'fetch-pois-end')
    performanceStore.setLastResultCount(data.length)
  } catch (e) {
    error.value = 'An unexpected error occurred.'
    console.error(e)
  } finally {
    isLoading.value = false
    performance.clearMarks('fetch-pois-start')
    performance.clearMarks('fetch-pois-end')
  }
}

const resetTest = () => {
  performanceStore.clearDurations()
}

const searchPlaceById = async () => {
  if (!placeIdInput.value) {
    performanceStore.singlePlaceError = 'Please enter an ID.';
    return;
  }

  performance.mark('fetch-place-by-id-start');

  await performanceStore.fetchPlaceById(placeIdInput.value, selectedSinglePlaceExpands.value);

  performance.mark('fetch-place-by-id-end');
  performance.measure(
    'fetch-place-by-id-duration',
    'fetch-place-by-id-start',
    'fetch-place-by-id-end'
  );
  performance.clearMarks();
};

const resetSinglePlaceTest = () => {
  performanceStore.resetSinglePlaceSearch();
  placeIdInput.value = '';
};

const getCarImageUrl = (bookee: Bookee): string | null => {
  const specificImage = bookee.remarks?.find(
    (r: Remark) => r.name === 'Bild vom Fahrzeug' && r.contentType?.startsWith('image/')
  )
  if (specificImage?.reference) {
    return specificImage.reference
  }

  const marketingImage = bookee.bookeeProduct?.remarks?.find(
    (r: Remark) => r.name === 'Homepage Bild' && r.contentType?.startsWith('image/')
  )
  if (marketingImage?.reference) {
    return marketingImage.reference
  }

  return null
}
</script>

<template>
  <LoadingOverlay :show="isLoading || isSinglePlaceLoading" />
  <div class="performance-tester">
    <div class="container flex">
      <div class="formDiv flex">
        <div class="headerDiv with-back-button">
          <router-link to="/" class="btn back-button"> ← Back </router-link>
          <h3>POI Performance</h3>
        </div>

        <h2>Load All POIs</h2>
        <div class="expand-options">
          <h4>Which additional data should be loaded?</h4>
          <div class="checkbox-list">
            <div v-for="expand in availableExpands" :key="expand.key" class="checkbox-item">
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  :id="expand.key"
                  :value="expand.key"
                  v-model="selectedExpands"
                />
                <span class="slider"></span>
              </label>
              <span>{{ expand.label }}</span>
            </div>
          </div>
          <div class="expand-buttons">
            <button class="btn" @click="selectAllExpands">Select All</button>
            <button class="btn" @click="clearAllExpands">Deselect All</button>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn" @click="runTest" :disabled="isLoading">
            {{ isLoading ? 'Loading...' : 'Start Request' }}
          </button>
        </div>

        <div v-if="requestCount > 0" class="results">
          <h3>Results</h3>
          <p>Number of requests: <strong>{{ requestCount }}</strong></p>
          <p>Average duration: <strong>{{ averageDuration.toFixed(2) }} ms</strong></p>
          <p v-if="lastDuration">Last duration: <strong>{{ lastDuration.toFixed(2) }} ms</strong></p>
          <p>Number of POIs received: <strong>{{ lastResultCount }}</strong></p>
        </div>
        <button v-if="requestCount > 0" class="btn" @click="resetTest" :disabled="isLoading">
          Reset
        </button>
        <div v-if="error" class="error">
          <p>{{ error }}</p>
        </div>
      </div>

      <div class="formDiv flex">
        <h2>Search Single Place by ID</h2>
        <div class="expand-options">
          <h4>Which detail data should be loaded?</h4>
          <div class="checkbox-list">
            <div
              v-for="expand in availableSinglePlaceExpands"
              :key="expand.key"
              class="checkbox-item"
            >
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  :id="`single-${expand.key}`"
                  :value="expand.key"
                  v-model="selectedSinglePlaceExpands"
                />
                <span class="slider"></span>
              </label>
              <span>{{ expand.label }}</span>
            </div>
          </div>
          <div class="expand-buttons">
            <button class="btn" @click="selectAllSinglePlaceExpands">Select All</button>
            <button class="btn" @click="clearAllSinglePlaceExpands">Deselect All</button>
          </div>
        </div>

        <div class="inputDiv">
          <div class="input flex">
            <input
              type="text"
              v-model="placeIdInput"
              :placeholder="`Enter Place ID (e.g. 4190)`"
            />
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn" @click="searchPlaceById" :disabled="isSinglePlaceLoading">
            {{ isSinglePlaceLoading ? 'Searching...' : 'Search' }}
          </button>
        </div>

        <div v-if="singlePlaceRequestCount > 0" class="results">
          <h3>Single Search Results</h3>
          <p>Number of requests: <strong>{{ singlePlaceRequestCount }}</strong></p>
          <p>Average duration: <strong>{{ singlePlaceAverageDuration.toFixed(2) }} ms</strong></p>
          <p v-if="singlePlaceLastDuration">Last duration: <strong>{{ singlePlaceLastDuration.toFixed(2) }} ms</strong></p>
        </div>

        <button v-if="singlePlaceRequestCount > 0" @click="resetSinglePlaceTest" :disabled="isSinglePlaceLoading" class="btn">
          Reset
        </button>

        <div v-if="singlePlaceResult" class="results-detailed">
          <h3>{{ singlePlaceResult.name }}</h3>
          <p class="station-address">
            {{ singlePlaceResult.address.street }} {{ singlePlaceResult.address.streetNr }},
            {{ singlePlaceResult.address.postalCode }} {{ singlePlaceResult.address.city }}
          </p>

          <h4>Available Vehicles ({{ singlePlaceResult?.bookees?.length || 0 }})</h4>
          <div class="car-list">
            <div v-for="car in singlePlaceResult.bookees" :key="car.id" class="car-card">
              <img
                :src="getCarImageUrl(car) || 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg'"
                alt="Vehicle image"
                class="car-image"
              />
              <div class="car-details">
                <div class="car-name">{{ car.displayName }}</div>
                <div class="car-license">License Plate: <strong>{{ car.licenseNumber }}</strong></div>
                <div class="car-fuel">Fuel: {{ car.fuelTypeName }} ({{ car.fuelLevel }}%)</div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="singlePlaceError" class="error">
          <p>{{ singlePlaceError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:root {
  --whiteColor: hsl(0, 0%, 100%);
  --blackColor: hsl(0, 0%, 18%);
  --inputColor: hsl(330, 12%, 97%);
}

.flex {
  display: flex;
  align-items: center;
}

.btn {
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 8px;
  padding: .8rem 1.5rem;
  color: white;
  background: black;
  white-space: nowrap;
}

.performance-tester {
  width: 100%;
  padding: 2rem 0;
  background-color: #f8f8f8;
}

.container {
  width: 90%;
  max-width: 800px;
  margin: auto;
  gap: 2rem;
  flex-direction: column;
  background: hsl(0, 0%, 91%);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 7px 50px rgb(214, 223, 213);
}

.formDiv {
  width: 100%;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
}

.headerDiv {
  text-align: center;
  width: 100%;
  margin-bottom: 1rem;

  &.with-back-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn.back-button {
    position: absolute;
    left: 0;
  }
  h3 {
    font-size: 2rem;
    color: var(--blackColor);
  }
}

.formDiv > h2 {
  text-align: center;
}

.expand-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;

  h4 {
    text-align: center;
  }
}

.inputDiv {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 300px;

  .input {
    gap: .5rem;
    padding: 1rem;
    background: var(--inputColor);
    border-radius: 10px;
    width: 100%;
    border: 2px solid grey;
    transition: border-color 0.3s ease;
    input {
      background: none;
      outline: none;
      border: none;
      width: 100%;
      text-align: center;
    }
  }
}

.inputDiv .input:focus-within {
  border-color: black;
}
.expand-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.results, .results-detailed {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
}

.error {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #ffdddd;
  border: 1px solid #ff8888;
  color: #d8000c;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.car-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
}
.car-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  text-align: left;
}
.car-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  background-color: #f0f0f0;
}
.car-details {
  padding: 1rem;
  .car-name { font-weight: bold; }
  .car-license, .car-fuel { font-size: 0.9em; color: #555; }
}

.checkbox-list {
  display: inline-flex;
  flex-direction: column;
  gap: 15px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 26px;
  flex-shrink: 0;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #34c759;
}

input:checked + .slider:before {
  transform: translateX(18px);
}
</style>
