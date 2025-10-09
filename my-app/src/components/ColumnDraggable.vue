<template>
  <div class="column" :class="{ 'drag-over': isDragOver }">
    <!-- Cabeçalho da coluna -->
    <div class="column-header">
      <div class="column-title-container">
        <h3 class="column-title" @click="editTitle" v-if="!editingTitle">
          {{ columnTitle }}
        </h3>
        <input 
          v-else
          v-model="tempTitle"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
          @keyup.escape="cancelEdit"
          class="column-title-input"
          ref="titleInput"
        >
        <span class="task-count">{{ tasks.length }}</span>
      </div>
      
      <div class="column-actions">
        <button class="column-action-btn" @click="$emit('add-task')" title="Add a card">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <div class="column-menu" ref="menuContainer">
          <button class="column-action-btn" @click="toggleMenu" title="Column actions">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="2" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          
          <div v-if="showMenu" class="menu-dropdown">
            <button class="menu-item" @click="$emit('add-task')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Add a card
            </button>
            <button class="menu-item" @click="$emit('copy-list')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="4" y="4" width="8" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 2H12C12.5523 2 13 2.44772 13 3V11" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              Copy list
            </button>
            <hr class="menu-divider">
            <button class="menu-item" @click="$emit('sort-by', 'date')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6L8 11L13 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Sort by date
            </button>
            <button class="menu-item" @click="$emit('sort-by', 'name')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6L8 11L13 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Sort by name
            </button>
            <hr class="menu-divider">
            <button class="menu-item danger" @click="$emit('archive-list')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6V13C3 13.5523 3.44772 14 4 14H12C12.5523 14 13 13.5523 13 13V6" stroke="currentColor" stroke-width="1.5"/>
                <path d="M1 4H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Archive this list
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de tarefas com drag-and-drop -->
    <draggable
      v-model="localTasks"
      group="tasks"
      item-key="id"
      class="tasks-container"
      :class="{ 'drag-over': isDragOver }"
      @start="onDragStart"
      @end="onDragEnd"
      @change="onTaskChange"
      :animation="200"
      ghost-class="ghost-card"
      chosen-class="chosen-card"
      drag-class="drag-card"
    >
      <template #item="{ element: task, index }">
        <TaskCardDraggable
          :task="task"
          :index="index"
          @edit-task="$emit('edit-task', $event)"
          @delete-task="$emit('delete-task', $event)"
        />
      </template>
    </draggable>
    
    <!-- Botão para adicionar nova tarefa -->
    <div v-if="showAddCard" class="add-card-form">
      <textarea
        v-model="newTaskTitle"
        placeholder="Enter a title for this card..."
        class="add-card-input"
        ref="addCardInput"
        @keyup.enter="addTask"
        @keyup.escape="cancelAddCard"
      ></textarea>
      <div class="add-card-actions">
        <button class="btn btn-primary" @click="addTask">Add card</button>
        <button class="btn-cancel" @click="cancelAddCard">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
    
    <button 
      v-else 
      class="add-card-btn" 
      @click="startAddCard"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Add a card
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue'
import draggable from 'vuedraggable'
import TaskCardDraggable from './TaskCardDraggable.vue'

// Interfaces
interface Task {
  id: string
  title: string
  description?: string
  labels?: string[]
  assignees?: string[]
  dueDate?: string
  attachments?: number
  comments?: number
  checklist?: { completed: number; total: number }
}

// Props
const props = defineProps<{
  title: string
  tasks: Task[]
  columnId: string
}>()

// Emits
const emit = defineEmits([
  'add-task', 
  'edit-task', 
  'delete-task', 
  'copy-list', 
  'sort-by', 
  'archive-list',
  'task-moved',
  'title-changed',
  'tasks-updated'
])

// Estado reativo
const columnTitle = ref(props.title)
const editingTitle = ref(false)
const tempTitle = ref('')
const showMenu = ref(false)
const showAddCard = ref(false)
const newTaskTitle = ref('')
const isDragOver = ref(false)
const titleInput = ref<HTMLInputElement>()
const addCardInput = ref<HTMLTextAreaElement>()
const menuContainer = ref<HTMLElement>()

// Computed para tarefas locais (necessário para vuedraggable)
const localTasks = computed({
  get: () => props.tasks,
  set: (value) => {
    emit('tasks-updated', props.columnId, value)
  }
})

// Métodos para edição do título
const editTitle = async () => {
  editingTitle.value = true
  tempTitle.value = columnTitle.value
  await nextTick()
  titleInput.value?.focus()
  titleInput.value?.select()
}

const saveTitle = () => {
  if (tempTitle.value.trim()) {
    columnTitle.value = tempTitle.value.trim()
    emit('title-changed', props.columnId, columnTitle.value)
  }
  editingTitle.value = false
}

const cancelEdit = () => {
  editingTitle.value = false
  tempTitle.value = ''
}

// Métodos para o menu
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// Métodos para adicionar tarefa
const startAddCard = async () => {
  showAddCard.value = true
  await nextTick()
  addCardInput.value?.focus()
}

const addTask = () => {
  if (newTaskTitle.value.trim()) {
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.value.trim()
    }
    emit('add-task', props.columnId, newTask)
    newTaskTitle.value = ''
    showAddCard.value = false
  }
}

const cancelAddCard = () => {
  newTaskTitle.value = ''
  showAddCard.value = false
}

// Métodos para drag and drop
const onDragStart = (event: any) => {
  isDragOver.value = true
  console.log('Drag started in column:', props.columnId)
}

const onDragEnd = (event: any) => {
  isDragOver.value = false
  console.log('Drag ended in column:', props.columnId)
}

const onTaskChange = (event: any) => {
  console.log('Task change event:', event)
  
  if (event.added) {
    // Tarefa foi adicionada a esta coluna
    const { element: task, newIndex } = event.added
    emit('task-moved', {
      task,
      targetColumnId: props.columnId,
      targetIndex: newIndex,
      action: 'added'
    })
  }
  
  if (event.removed) {
    // Tarefa foi removida desta coluna
    const { element: task, oldIndex } = event.removed
    emit('task-moved', {
      task,
      sourceColumnId: props.columnId,
      sourceIndex: oldIndex,
      action: 'removed'
    })
  }
  
  if (event.moved) {
    // Tarefa foi movida dentro da mesma coluna
    const { element: task, oldIndex, newIndex } = event.moved
    emit('task-moved', {
      task,
      columnId: props.columnId,
      oldIndex,
      newIndex,
      action: 'moved'
    })
  }
}

// Fechar menu ao clicar fora
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
.column {
  background: #f1f2f4;
  border-radius: 12px;
  padding: 12px;
  width: 272px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.column.drag-over {
  background: #e3f2fd;
  transform: scale(1.02);
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.column-title-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.column-title {
  font-size: 14px;
  font-weight: 600;
  color: #172b4d;
  margin: 0;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  flex: 1;
}

.column-title:hover {
  background: rgba(9, 30, 66, 0.08);
}

.column-title-input {
  font-size: 14px;
  font-weight: 600;
  background: white;
  border: 2px solid #0079bf;
  color: #172b4d;
  padding: 8px 12px;
  border-radius: 6px;
  outline: none;
  flex: 1;
}

.task-count {
  background: rgba(9, 30, 66, 0.13);
  color: #5e6c84;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.column-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.column-action-btn {
  background: none;
  border: none;
  color: #6b778c;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.column-action-btn:hover {
  background: rgba(9, 30, 66, 0.08);
  color: #172b4d;
}

.column-menu {
  position: relative;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 180px;
  z-index: 1000;
  margin-top: 4px;
}

.menu-item {
  width: 100%;
  background: none;
  border: none;
  padding: 10px 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #172b4d;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background: #f4f5f7;
}

.menu-item.danger {
  color: #b04632;
}

.menu-item.danger:hover {
  background: #ffebe6;
}

.menu-divider {
  border: none;
  border-top: 1px solid #dfe1e6;
  margin: 8px 0;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 50px;
  transition: all 0.2s ease;
}

.tasks-container.drag-over {
  background: rgba(0, 121, 191, 0.1);
  border-radius: 8px;
  padding: 4px;
}

.add-card-btn {
  background: none;
  border: none;
  color: #6b778c;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  text-align: left;
}

.add-card-btn:hover {
  background: rgba(9, 30, 66, 0.08);
  color: #172b4d;
}

.add-card-form {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
}

.add-card-input {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  font-size: 14px;
  line-height: 1.4;
  color: #172b4d;
  min-height: 60px;
  font-family: inherit;
}

.add-card-input::placeholder {
  color: #a5adba;
}

.add-card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.btn-cancel {
  background: none;
  border: none;
  color: #6b778c;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: rgba(9, 30, 66, 0.08);
  color: #172b4d;
}

/* Estilos para drag and drop */
:deep(.ghost-card) {
  opacity: 0.5;
  background: #c8e6c9;
  transform: rotate(2deg);
}

:deep(.chosen-card) {
  cursor: grabbing;
}

:deep(.drag-card) {
  transform: rotate(5deg);
  opacity: 0.8;
}

/* Responsividade */
@media (max-width: 768px) {
  .column {
    width: 100%;
    min-width: 280px;
  }
  
  .column-title {
    font-size: 16px;
  }
  
  .column-title-input {
    font-size: 16px;
  }
}
</style>
