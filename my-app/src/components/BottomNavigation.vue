<template>
  <nav class="bottom-navigation">
    <button 
      class="nav-item" 
      :class="{ active: activeTab === 'inbox' }"
      @click="setActiveTab('inbox')"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M22 12H16L14 15H10L8 12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Inbox</span>
    </button>

    <button 
      class="nav-item" 
      :class="{ active: activeTab === 'planner' }"
      @click="setActiveTab('planner')"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Planner</span>
    </button>

    <button 
      class="nav-item" 
      :class="{ active: activeTab === 'board' }"
      @click="setActiveTab('board')"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="18" rx="1" stroke="currentColor" stroke-width="2"/>
        <rect x="14" y="3" width="7" height="18" rx="1" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Board</span>
    </button>

    <button 
      class="nav-item" 
      :class="{ active: activeTab === 'switch' }"
      @click="setActiveTab('switch')"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
        <circle cx="9" cy="9" r="2" stroke="currentColor" stroke-width="2"/>
        <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>Switch Boards</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Emits
defineEmits(['tab-changed'])

// Estado reativo
const activeTab = ref('board')

// Métodos
const setActiveTab = (tab: string) => {
  activeTab.value = tab
  // Emit evento para o componente pai
  console.log('Tab changed to:', tab)
}
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #dfe1e6;
  display: flex;
  justify-content: space-around;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.nav-item {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b778c;
  font-size: 12px;
  font-weight: 500;
  min-width: 60px;
}

.nav-item:hover {
  background: #f4f5f7;
  color: #172b4d;
}

.nav-item.active {
  color: #0079bf;
  background: #e4f0f6;
}

.nav-item svg {
  transition: all 0.2s ease;
}

.nav-item.active svg {
  transform: scale(1.1);
}

.nav-item span {
  font-size: 10px;
  text-align: center;
  line-height: 1.2;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Ocultar em desktop */
@media (min-width: 769px) {
  .bottom-navigation {
    display: none;
  }
}

/* Ajustes para diferentes tamanhos de tela mobile */
@media (max-width: 480px) {
  .nav-item {
    padding: 6px 8px;
    min-width: 50px;
  }
  
  .nav-item span {
    font-size: 9px;
    max-width: 50px;
  }
}
</style>
