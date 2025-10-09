<template>
  <div class="loading-container" :class="{ fullscreen }">
    <div class="loading-spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps<{
  message?: string
  fullscreen?: boolean
}>()
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.loading-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loading-spinner {
  position: relative;
  width: 40px;
  height: 40px;
}

.spinner-ring {
  position: absolute;
  width: 32px;
  height: 32px;
  margin: 4px;
  border: 3px solid transparent;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.15s;
}

.loading-message {
  margin-top: 16px;
  color: #6b778c;
  font-size: 14px;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .loading-spinner {
    width: 48px;
    height: 48px;
  }
  
  .spinner-ring {
    width: 40px;
    height: 40px;
    margin: 4px;
    border-width: 4px;
  }
  
  .loading-message {
    font-size: 16px;
    margin-top: 20px;
  }
}
</style>
