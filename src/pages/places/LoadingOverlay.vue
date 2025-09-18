<template>
  <div v-if="show" class="overlay">
    <div class="overlay-content">
      <div class="spinner"></div>
      <p>Loading data...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.overlay-content {
  text-align: center;
  color: white;
}

p {
  margin-top: 20px;
  font-size: 1.2rem;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid black;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1.5s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
