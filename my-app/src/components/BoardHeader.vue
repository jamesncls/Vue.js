<template>
  <div class="board-header">
    <div class="board-header-content">
      <!-- Título e navegação do board -->
      <div class="board-info">
        <h1 class="board-title" @click="editTitle" v-if="!editingTitle">
          {{ boardTitle }}
        </h1>
        <input 
          v-else
          v-model="tempTitle"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
          @keyup.escape="cancelEdit"
          class="board-title-input"
          ref="titleInput"
        >
        
        <div class="board-nav">
          <button class="board-nav-btn active">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="3" height="10" rx="1" fill="currentColor"/>
              <rect x="6.5" y="3" width="3" height="10" rx="1" fill="currentColor"/>
              <rect x="11" y="3" width="3" height="10" rx="1" fill="currentColor"/>
            </svg>
            Board
          </button>
        </div>
      </div>

      <!-- Ações do board -->
      <div class="board-actions">
        <!-- Avatares dos membros -->
        <div class="board-members">
          <div 
            v-for="member in members" 
            :key="member.id"
            class="member-avatar"
            :style="{ backgroundColor: member.color }"
            :title="member.name"
          >
            {{ member.initials }}
          </div>
          <button class="add-member-btn" @click="$emit('add-member')">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- Botão Share -->
        <button class="btn btn-secondary share-btn" @click="$emit('share-board')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 10.5C13.8284 10.5 14.5 11.1716 14.5 12C14.5 12.8284 13.8284 13.5 13 13.5C12.1716 13.5 11.5 12.8284 11.5 12C11.5 11.1716 12.1716 10.5 13 10.5Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M3 6.5C3.82843 6.5 4.5 7.17157 4.5 8C4.5 8.82843 3.82843 9.5 3 9.5C2.17157 9.5 1.5 8.82843 1.5 8C1.5 7.17157 2.17157 6.5 3 6.5Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M13 2.5C13.8284 2.5 14.5 3.17157 14.5 4C14.5 4.82843 13.8284 5.5 13 5.5C12.1716 5.5 11.5 4.82843 11.5 4C11.5 3.17157 12.1716 2.5 13 2.5Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4.22 7.22L11.78 4.78" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M4.22 8.78L11.78 11.22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Share
        </button>

        <!-- Menu de opções -->
        <div class="board-menu" ref="menuContainer">
          <button class="menu-trigger" @click="toggleMenu">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="2" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          
          <div v-if="showMenu" class="menu-dropdown">
            <button class="menu-item" @click="$emit('board-settings')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M13.45 8.9C13.3537 9.15 13.3537 9.43 13.45 9.68L14.12 11.26C14.18 11.39 14.15 11.54 14.05 11.64L12.64 13.05C12.54 13.15 12.39 13.18 12.26 13.12L10.68 12.45C10.43 12.3537 10.15 12.3537 9.9 12.45L8.32 13.12C8.19 13.18 8.04 13.15 7.94 13.05L6.53 11.64C6.43 11.54 6.4 11.39 6.46 11.26L7.13 9.68C7.2263 9.43 7.2263 9.15 7.13 8.9L6.46 7.32C6.4 7.19 6.43 7.04 6.53 6.94L7.94 5.53C8.04 5.43 8.19 5.4 8.32 5.46L9.9 6.13C10.15 6.2263 10.43 6.2263 10.68 6.13L12.26 5.46C12.39 5.4 12.54 5.43 12.64 5.53L14.05 6.94C14.15 7.04 14.18 7.19 14.12 7.32L13.45 8.9Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Board Settings
            </button>
            <button class="menu-item" @click="$emit('change-background')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="6" cy="7" r="1.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M14 11L11 8L8.5 10.5L6.5 8.5L2 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Change Background
            </button>
            <hr class="menu-divider">
            <button class="menu-item danger" @click="$emit('archive-board')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V6" stroke="currentColor" stroke-width="1.5"/>
                <path d="M1 4H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M5 4V2C5 1.44772 5.44772 1 6 1H10C10.5523 1 11 1.44772 11 2V4" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6.5 7.5V11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M9.5 7.5V11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Archive Board
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'

// Props
interface Member {
  id: string
  name: string
  initials: string
  color: string
}

const props = defineProps<{
  title?: string
  members?: Member[]
}>()

// Emits
defineEmits(['add-member', 'share-board', 'board-settings', 'change-background', 'archive-board', 'title-changed'])

// Estado reativo
const boardTitle = ref(props.title || 'Development Sprint Board')
const editingTitle = ref(false)
const tempTitle = ref('')
const showMenu = ref(false)
const titleInput = ref<HTMLInputElement>()
const menuContainer = ref<HTMLElement>()

const members = ref<Member[]>(props.members || [
  { id: '1', name: 'John Doe', initials: 'JD', color: '#3498db' },
  { id: '2', name: 'Jane Smith', initials: 'JS', color: '#e74c3c' },
  { id: '3', name: 'Mike Johnson', initials: 'MJ', color: '#f39c12' },
  { id: '4', name: 'Sarah Wilson', initials: 'SW', color: '#9b59b6' }
])

// Métodos
const editTitle = async () => {
  editingTitle.value = true
  tempTitle.value = boardTitle.value
  await nextTick()
  titleInput.value?.focus()
  titleInput.value?.select()
}

const saveTitle = () => {
  if (tempTitle.value.trim()) {
    boardTitle.value = tempTitle.value.trim()
  }
  editingTitle.value = false
}

const cancelEdit = () => {
  editingTitle.value = false
  tempTitle.value = ''
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuContainer.value && !menuContainer.value.contains(event.target as Node)) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.board-header {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  padding: 16px 0;
  margin-bottom: 20px;
}

.board-header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.board-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.board-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.board-title:hover {
  background: rgba(255, 255, 255, 0.1);
}

.board-title-input {
  font-size: 24px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  outline: none;
  min-width: 300px;
}

.board-title-input:focus {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.board-nav {
  display: flex;
  gap: 8px;
}

.board-nav-btn {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.board-nav-btn:hover,
.board-nav-btn.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.board-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.board-members {
  display: flex;
  align-items: center;
  gap: -4px;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  margin-left: -4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.member-avatar:hover {
  transform: translateY(-2px);
  z-index: 10;
}

.add-member-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.add-member-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-color: rgba(255, 255, 255, 0.5);
}

.share-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.share-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.board-menu {
  position: relative;
}

.menu-trigger {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-trigger:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 200px;
  z-index: 1000;
  margin-top: 8px;
}

.menu-item {
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #2c3e50;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background: #f8f9fa;
}

.menu-item.danger {
  color: #e74c3c;
}

.menu-item.danger:hover {
  background: #fdf2f2;
}

.menu-divider {
  border: none;
  border-top: 1px solid #e1e8ed;
  margin: 8px 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .board-header-content {
    padding: 0 15px;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .board-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .board-title {
    font-size: 20px;
  }
  
  .board-title-input {
    font-size: 20px;
    min-width: 250px;
  }
  
  .board-actions {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .board-members {
    gap: -2px;
  }
  
  .member-avatar {
    width: 28px;
    height: 28px;
    font-size: 11px;
    margin-left: -2px;
  }
  
  .add-member-btn {
    width: 28px;
    height: 28px;
    margin-left: 6px;
  }
}
</style>
