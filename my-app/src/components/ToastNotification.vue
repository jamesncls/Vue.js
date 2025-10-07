<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div 
        v-if="visible"
        class="toast-notification"
        :class="[type, position]"
        @click="close"
      >
        <div class="toast-icon">
          <svg v-if="type === 'success'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <svg v-else-if="type === 'error'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8L8 12M8 8L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          
          <svg v-else-if="type === 'warning'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2"/>
            <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          
          <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" stroke-width="2"/>
            <path d="M10 6V10M10 14H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        
        <div class="toast-content">
          <div class="toast-title" v-if="title">{{ title }}</div>
          <div class="toast-message">{{ message }}</div>
        </div>
        
        <button v-if="closable" class="toast-close" @click.stop="close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props
const props = withDefaults(defineProps<{
  message: string
  title?: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top' | 'bottom' | 'center'
  closable?: boolean
}>(), {
  type: 'info',
  duration: 3000,
  position: 'top',
  closable: true
})

// Emits
const emit = defineEmits(['close'])

// Estado
const visible = ref(true)

// Métodos
const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300) // Aguarda a animação de saída
}

// Auto close
onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-notification {
  position: fixed;
  z-index: 10000;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 400px;
  min-width: 300px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid currentColor;
}

.toast-notification:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

/* Posicionamento */
.toast-notification.top {
  top: 20px;
  right: 20px;
}

.toast-notification.bottom {
  bottom: 20px;
  right: 20px;
}

.toast-notification.center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Tipos */
.toast-notification.success {
  color: #27ae60;
  border-left-color: #27ae60;
}

.toast-notification.error {
  color: #e74c3c;
  border-left-color: #e74c3c;
}

.toast-notification.warning {
  color: #f39c12;
  border-left-color: #f39c12;
}

.toast-notification.info {
  color: #3498db;
  border-left-color: #3498db;
}

.toast-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 14px;
  color: #172b4d;
  margin-bottom: 4px;
}

.toast-message {
  font-size: 14px;
  color: #5e6c84;
  line-height: 1.4;
  word-wrap: break-word;
}

.toast-close {
  background: none;
  border: none;
  color: #6b778c;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: -2px;
}

.toast-close:hover {
  background: rgba(107, 119, 140, 0.1);
  color: #172b4d;
}

/* Animações */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Mobile */
@media (max-width: 768px) {
  .toast-notification {
    left: 10px;
    right: 10px;
    max-width: none;
    min-width: auto;
    margin: 0;
  }
  
  .toast-notification.top {
    top: 10px;
  }
  
  .toast-notification.bottom {
    bottom: 90px; /* Acima da navegação inferior */
  }
  
  .toast-notification.center {
    top: 50%;
    left: 10px;
    right: 10px;
    transform: translateY(-50%);
  }
  
  .toast-notification {
    padding: 20px;
  }
  
  .toast-title {
    font-size: 16px;
  }
  
  .toast-message {
    font-size: 15px;
  }
  
  .toast-close {
    padding: 8px;
    margin-top: -4px;
  }
  
  /* Animações mobile */
  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(-100%);
  }
  
  .toast-notification.bottom.toast-enter-from,
  .toast-notification.bottom.toast-leave-to {
    transform: translateY(100%);
  }
}

/* Reduzir movimento para usuários com preferência */
@media (prefers-reduced-motion: reduce) {
  .toast-notification,
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .toast-notification:hover {
    transform: none;
  }
  
  .toast-enter-from,
  .toast-leave-to {
    transform: none;
    opacity: 0;
  }
}

/* Alto contraste */
@media (prefers-contrast: high) {
  .toast-notification {
    border: 2px solid currentColor;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
}

/* Modo escuro */
@media (prefers-color-scheme: dark) {
  .toast-notification {
    background: #2c3e50;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }
  
  .toast-title {
    color: #ecf0f1;
  }
  
  .toast-message {
    color: #bdc3c7;
  }
  
  .toast-close {
    color: #95a5a6;
  }
  
  .toast-close:hover {
    background: rgba(149, 165, 166, 0.1);
    color: #ecf0f1;
  }
}
</style>
