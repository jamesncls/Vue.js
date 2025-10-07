<template>
  <header class="header">
    <div class="header-content">
      <!-- Logo -->
      <div class="logo">
        <div class="logo-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="24" height="24" rx="4" fill="#e74c3c"/>
            <rect x="8" y="8" width="16" height="16" rx="2" fill="white"/>
            <rect x="10" y="10" width="12" height="2" rx="1" fill="#e74c3c"/>
            <rect x="10" y="14" width="8" height="2" rx="1" fill="#e74c3c"/>
            <rect x="10" y="18" width="10" height="2" rx="1" fill="#e74c3c"/>
          </svg>
        </div>
        <span class="logo-text">Trello Clone</span>
      </div>

      <!-- Navegação -->
      <nav class="nav">
        <a href="#" class="nav-link" :class="{ active: activeTab === 'workspaces' }" @click="setActiveTab('workspaces')">
          Workspaces
        </a>
        <a href="#" class="nav-link" :class="{ active: activeTab === 'recent' }" @click="setActiveTab('recent')">
          Recent
        </a>
        <a href="#" class="nav-link" :class="{ active: activeTab === 'starred' }" @click="setActiveTab('starred')">
          Starred
        </a>
        <a href="#" class="nav-link" :class="{ active: activeTab === 'templates' }" @click="setActiveTab('templates')">
          Templates
        </a>
      </nav>

      <!-- Ações do usuário -->
      <div class="user-actions">
        <button class="btn btn-primary create-btn" @click="$emit('create-board')">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Create
        </button>

        <button class="search-btn" @click="toggleSearch">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="m19 19-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <button class="notifications-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 6.5C15 5.11929 14.4732 3.79532 13.5355 2.85786C12.5979 1.92039 11.2739 1.39355 9.89286 1.39355C8.51181 1.39355 7.18784 1.92039 6.25038 2.85786C5.31291 3.79532 4.78607 5.11929 4.78607 6.5C4.78607 12.5 2.5 14 2.5 14H17.5C17.5 14 15 12.5 15 6.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.4404 17.5C11.2484 17.8031 10.9849 18.0547 10.6728 18.2295C10.3607 18.4044 10.0092 18.4967 9.65179 18.4967C9.29439 18.4967 8.94285 18.4044 8.63078 18.2295C8.31871 18.0547 8.05524 17.8031 7.86328 17.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <div class="user-avatar" @click="toggleUserMenu">
          <span>{{ userInitials }}</span>
        </div>
      </div>
    </div>

    <!-- Search overlay -->
    <div v-if="showSearch" class="search-overlay" @click="toggleSearch">
      <div class="search-container" @click.stop>
        <input
          type="text"
          placeholder="Search boards, cards, and more..."
          class="search-input"
          v-model="searchQuery"
          @keyup.enter="performSearch"
          ref="searchInput"
        >
        <button class="search-close" @click="toggleSearch">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

// Props e emits
defineEmits(['create-board'])

// Estado reativo
const activeTab = ref('workspaces')
const showSearch = ref(false)
const searchQuery = ref('')
const userInitials = ref('JD')
const searchInput = ref<HTMLInputElement>()

// Métodos
const setActiveTab = (tab: string) => {
  activeTab.value = tab
}

const toggleSearch = async () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    // Implementar lógica de busca
  }
}

const toggleUserMenu = () => {
  console.log('Toggle user menu')
  // Implementar menu do usuário
}
</script>

<style scoped>
.header {
  background: #ffffff;
  color: rgb(92, 92, 92);
  padding: 12px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: rgba(0, 0, 0, 0.8);
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link:hover,
.nav-link.active {
  color: rgb(37, 36, 36);
  background: rgba(255, 255, 255, 0.1);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.create-btn {
  background: rgba(255, 255, 255, 0.2);
  color: rgb(15, 14, 14);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.create-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.search-btn,
.notifications-btn {
  background: none;
  border: none;
  color: rgba(15, 14, 14, 0.8);
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-btn:hover,
.notifications-btn:hover {
  color: rgb(41, 38, 38);
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e74c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
  z-index: 1001;
}

.search-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  margin: 0 20px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #3498db;
}

.search-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 4px;
}

.search-close:hover {
  color: #2c3e50;
}

/* Responsividade */
@media (max-width: 768px) {
  .header-content {
    padding: 0 15px;
  }

  .nav {
    display: none;
  }

  .logo-text {
    display: none;
  }

  .user-actions {
    gap: 8px;
  }

  .create-btn span {
    display: none;
  }
}
</style>
