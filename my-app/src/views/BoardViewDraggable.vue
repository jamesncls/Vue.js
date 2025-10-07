<template>
  <div class="board-view">
    <!-- Header principal -->
    <Header @create-board="handleCreateBoard" />
    
    <!-- Header do board -->
    <BoardHeader 
      :title="boardData.title"
      :members="boardData.members"
      @add-member="handleAddMember"
      @share-board="handleShareBoard"
      @board-settings="handleBoardSettings"
      @change-background="handleChangeBackground"
      @archive-board="handleArchiveBoard"
    />

    <!-- Container principal do board -->
    <div class="board-container">
      <div class="board-content">
        <!-- Colunas do board com drag-and-drop -->
        <draggable
          v-model="boardData.columns"
          group="columns"
          item-key="id"
          class="columns-container"
          @start="onColumnDragStart"
          @end="onColumnDragEnd"
          @change="onColumnChange"
          :animation="200"
          ghost-class="ghost-column"
          chosen-class="chosen-column"
          drag-class="drag-column"
          handle=".column-drag-handle"
        >
          <template #item="{ element: column, index }">
            <div class="column-wrapper">
              <!-- Handle para arrastar coluna -->
              <div class="column-drag-handle">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="3" cy="3" r="1" fill="currentColor"/>
                  <circle cx="9" cy="3" r="1" fill="currentColor"/>
                  <circle cx="3" cy="6" r="1" fill="currentColor"/>
                  <circle cx="9" cy="6" r="1" fill="currentColor"/>
                  <circle cx="3" cy="9" r="1" fill="currentColor"/>
                  <circle cx="9" cy="9" r="1" fill="currentColor"/>
                </svg>
              </div>
              
              <ColumnDraggable
                :title="column.title"
                :tasks="column.tasks"
                :column-id="column.id"
                @add-task="handleAddTask"
                @edit-task="handleEditTask"
                @delete-task="handleDeleteTask"
                @copy-list="handleCopyList"
                @sort-by="handleSortBy"
                @archive-list="handleArchiveList"
                @task-moved="handleTaskMoved"
                @title-changed="handleColumnTitleChanged"
                @tasks-updated="handleTasksUpdated"
              />
            </div>
          </template>
        </draggable>
        
        <!-- Botão para adicionar nova coluna -->
        <div class="add-column-container">
          <div v-if="showAddColumn" class="add-column-form">
            <input
              v-model="newColumnTitle"
              placeholder="Enter list title..."
              class="add-column-input"
              ref="addColumnInput"
              @keyup.enter="addColumn"
              @keyup.escape="cancelAddColumn"
            >
            <div class="add-column-actions">
              <button class="btn btn-primary" @click="addColumn">Add list</button>
              <button class="btn-cancel" @click="cancelAddColumn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <button 
            v-else 
            class="add-column-btn" 
            @click="startAddColumn"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V15M1 8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Add another list
          </button>
        </div>
      </div>
    </div>

    <!-- Navegação inferior (mobile) -->
    <BottomNavigation @tab-changed="handleTabChanged" />

    <!-- Modal para edição de tarefa -->
    <TaskModal
      v-if="showTaskModal"
      :task="selectedTask"
      @close="closeTaskModal"
      @save="handleSaveTask"
      @delete="handleDeleteTaskFromModal"
    />

    <!-- Notificação de sucesso -->
    <div v-if="showNotification" class="notification" :class="notificationType">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import draggable from 'vuedraggable'
import Header from '../components/Header.vue'
import BoardHeader from '../components/BoardHeader.vue'
import ColumnDraggable from '../components/ColumnDraggable.vue'
import BottomNavigation from '../components/BottomNavigation.vue'
import TaskModal from '../components/TaskModal.vue'

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

interface Column {
  id: string
  title: string
  tasks: Task[]
}

interface Member {
  id: string
  name: string
  initials: string
  color: string
}

interface BoardData {
  title: string
  members: Member[]
  columns: Column[]
}

// Estado reativo
const showAddColumn = ref(false)
const newColumnTitle = ref('')
const showTaskModal = ref(false)
const selectedTask = ref<Task | null>(null)
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref<'success' | 'error' | 'info'>('success')
const addColumnInput = ref<HTMLInputElement>()

// Dados do board (simulando dados reais)
const boardData = ref<BoardData>({
  title: 'Development Sprint Board',
  members: [
    { id: '1', name: 'John Doe', initials: 'JD', color: '#3498db' },
    { id: '2', name: 'Jane Smith', initials: 'JS', color: '#e74c3c' },
    { id: '3', name: 'Mike Johnson', initials: 'MJ', color: '#f39c12' },
    { id: '4', name: 'Sarah Wilson', initials: 'SW', color: '#9b59b6' }
  ],
  columns: [
    {
      id: 'backlog',
      title: 'Backlog',
      tasks: [
        {
          id: '1',
          title: 'Implement user authentication',
          labels: ['red', 'blue'],
          assignees: ['John Doe', 'Sarah Wilson'],
          dueDate: '2024-01-15',
          comments: 3,
          attachments: 2
        },
        {
          id: '2',
          title: 'Design new landing page',
          labels: ['yellow'],
          assignees: ['Mike Johnson'],
          comments: 3
        },
        {
          id: '3',
          title: 'Set up CI/CD pipeline',
          labels: ['blue', 'green'],
          assignees: ['John Doe'],
          checklist: { completed: 2, total: 8 }
        },
        {
          id: '4',
          title: 'Database migration scripts',
          labels: ['green'],
          assignees: ['Jane Smith'],
          attachments: 2
        },
        {
          id: '5',
          title: 'Update API documentation',
          labels: ['yellow'],
          assignees: ['Sarah Wilson', 'Mike Johnson'],
          checklist: { completed: 5, total: 12 },
          comments: 3
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        {
          id: '6',
          title: 'Build search functionality',
          assignees: ['Jane Smith'],
          dueDate: '2024-01-10',
          checklist: { completed: 7, total: 15 },
          comments: 3,
          attachments: 2
        },
        {
          id: '7',
          title: 'Implement payment gateway',
          labels: ['red', 'yellow'],
          assignees: ['Sarah Wilson', 'John Doe'],
          checklist: { completed: 3, total: 10 },
          comments: 3
        },
        {
          id: '8',
          title: 'Create notification system',
          labels: ['green'],
          assignees: ['Mike Johnson'],
          checklist: { completed: 12, total: 20 },
          attachments: 2
        },
        {
          id: '9',
          title: 'Refactor dashboard components',
          labels: ['yellow'],
          assignees: ['Jane Smith', 'Mike Johnson'],
          comments: 3
        }
      ]
    },
    {
      id: 'code-review',
      title: 'Code Review',
      tasks: [
        {
          id: '10',
          title: 'Email template system',
          labels: ['green', 'blue'],
          assignees: ['Sarah Wilson'],
          dueDate: '2024-01-12',
          checklist: { completed: 14, total: 14 },
          comments: 3,
          attachments: 2
        },
        {
          id: '11',
          title: 'User profile settings',
          labels: ['blue'],
          assignees: ['John Doe', 'Jane Smith'],
          checklist: { completed: 8, total: 8 },
          comments: 3
        },
        {
          id: '12',
          title: 'Mobile responsive fixes',
          labels: ['red'],
          assignees: ['Mike Johnson'],
          attachments: 2
        },
        {
          id: '13',
          title: 'API rate limiting',
          assignees: ['Sarah Wilson'],
          checklist: { completed: 5, total: 5 },
          comments: 3
        }
      ]
    },
    {
      id: 'ready-for-testing',
      title: 'Ready for Testing',
      tasks: [
        {
          id: '14',
          title: 'Image upload feature',
          labels: ['green'],
          assignees: ['John Doe', 'Sarah Wilson'],
          dueDate: '2024-01-08',
          checklist: { completed: 32, total: 32 },
          comments: 3,
          attachments: 2
        },
        {
          id: '15',
          title: 'Dark mode implementation',
          labels: ['blue', 'purple'],
          assignees: ['Mike Johnson'],
          checklist: { completed: 18, total: 18 },
          comments: 3
        },
        {
          id: '16',
          title: 'CSV export functionality',
          labels: ['yellow'],
          attachments: 2
        }
      ]
    },
    {
      id: 'awaiting-release',
      title: 'Awaiting Release',
      tasks: [
        {
          id: '17',
          title: 'Social media integration',
          labels: ['blue', 'green'],
          assignees: ['Jane Smith'],
          dueDate: '2024-01-20',
          checklist: { completed: 25, total: 25 },
          comments: 3
        },
        {
          id: '18',
          title: 'Advanced filtering system',
          labels: ['green'],
          assignees: ['Sarah Wilson', 'Mike Johnson'],
          checklist: { completed: 42, total: 42 },
          attachments: 2
        },
        {
          id: '19',
          title: 'Performance optimizations',
          assignees: ['John Doe'],
          comments: 3,
          attachments: 2
        }
      ]
    }
  ]
})

// Métodos para gerenciar colunas
const startAddColumn = async () => {
  showAddColumn.value = true
  await nextTick()
  addColumnInput.value?.focus()
}

const addColumn = () => {
  if (newColumnTitle.value.trim()) {
    const newColumn: Column = {
      id: Date.now().toString(),
      title: newColumnTitle.value.trim(),
      tasks: []
    }
    boardData.value.columns.push(newColumn)
    newColumnTitle.value = ''
    showAddColumn.value = false
    showNotificationMessage('List added successfully!', 'success')
  }
}

const cancelAddColumn = () => {
  newColumnTitle.value = ''
  showAddColumn.value = false
}

// Métodos para drag-and-drop de colunas
const onColumnDragStart = () => {
  console.log('Column drag started')
}

const onColumnDragEnd = () => {
  console.log('Column drag ended')
}

const onColumnChange = (event: any) => {
  console.log('Column change event:', event)
  if (event.moved) {
    const { element, oldIndex, newIndex } = event.moved
    showNotificationMessage(`Moved "${element.title}" column`, 'info')
  }
}

// Métodos para gerenciar tarefas
const handleAddTask = (columnId: string, newTask?: Task) => {
  if (newTask) {
    const column = boardData.value.columns.find(col => col.id === columnId)
    if (column) {
      column.tasks.push(newTask)
      showNotificationMessage('Card added successfully!', 'success')
    }
  } else {
    // Abrir modal para criar nova tarefa
    selectedTask.value = {
      id: Date.now().toString(),
      title: '',
      description: ''
    }
    showTaskModal.value = true
  }
}

const handleEditTask = (task: Task) => {
  selectedTask.value = { ...task }
  showTaskModal.value = true
}

const handleDeleteTask = (taskId: string) => {
  boardData.value.columns.forEach(column => {
    const taskIndex = column.tasks.findIndex(task => task.id === taskId)
    if (taskIndex !== -1) {
      const deletedTask = column.tasks.splice(taskIndex, 1)[0]
      showNotificationMessage(`Deleted "${deletedTask.title}"`, 'info')
    }
  })
}

const handleTaskMoved = (event: any) => {
  console.log('Task moved:', event)
  if (event.action === 'added') {
    showNotificationMessage('Card moved successfully!', 'success')
  }
}

const handleTasksUpdated = (columnId: string, tasks: Task[]) => {
  const column = boardData.value.columns.find(col => col.id === columnId)
  if (column) {
    column.tasks = tasks
  }
}

const handleColumnTitleChanged = (columnId: string, newTitle: string) => {
  const column = boardData.value.columns.find(col => col.id === columnId)
  if (column) {
    column.title = newTitle
    showNotificationMessage('List title updated!', 'success')
  }
}

// Métodos para modal de tarefa
const closeTaskModal = () => {
  showTaskModal.value = false
  selectedTask.value = null
}

const handleSaveTask = (task: Task) => {
  // Implementar lógica para salvar tarefa
  console.log('Save task:', task)
  showNotificationMessage('Card saved successfully!', 'success')
  closeTaskModal()
}

const handleDeleteTaskFromModal = (taskId: string) => {
  handleDeleteTask(taskId)
  closeTaskModal()
}

// Métodos para ações do board
const handleCreateBoard = () => {
  console.log('Create new board')
}

const handleAddMember = () => {
  console.log('Add member to board')
}

const handleShareBoard = () => {
  console.log('Share board')
}

const handleBoardSettings = () => {
  console.log('Open board settings')
}

const handleChangeBackground = () => {
  console.log('Change board background')
}

const handleArchiveBoard = () => {
  console.log('Archive board')
}

// Métodos para ações das colunas
const handleCopyList = (columnId: string) => {
  const column = boardData.value.columns.find(col => col.id === columnId)
  if (column) {
    const copiedColumn: Column = {
      id: Date.now().toString(),
      title: `${column.title} (Copy)`,
      tasks: column.tasks.map(task => ({
        ...task,
        id: `${task.id}-copy-${Date.now()}`
      }))
    }
    boardData.value.columns.push(copiedColumn)
    showNotificationMessage(`Copied "${column.title}" list`, 'success')
  }
}

const handleSortBy = (columnId: string, sortType: string) => {
  const column = boardData.value.columns.find(col => col.id === columnId)
  if (column) {
    if (sortType === 'name') {
      column.tasks.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortType === 'date') {
      column.tasks.sort((a, b) => {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
        return dateA - dateB
      })
    }
    showNotificationMessage(`Sorted by ${sortType}`, 'info')
  }
}

const handleArchiveList = (columnId: string) => {
  const columnIndex = boardData.value.columns.findIndex(col => col.id === columnId)
  if (columnIndex !== -1) {
    const archivedColumn = boardData.value.columns.splice(columnIndex, 1)[0]
    showNotificationMessage(`Archived "${archivedColumn.title}" list`, 'info')
  }
}

// Métodos para navegação mobile
const handleTabChanged = (tab: string) => {
  console.log('Tab changed:', tab)
}

// Método para mostrar notificações
const showNotificationMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

// Lifecycle
onMounted(() => {
  // Configurações iniciais se necessário
})
</script>

<style scoped>
.board-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.board-container {
  flex: 1;
  overflow: hidden;
  padding-bottom: 80px; /* Espaço para navegação mobile */
}

.board-content {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 20px 20px;
}

.columns-container {
  display: flex;
  gap: 16px;
  min-height: calc(100vh - 200px);
  padding-bottom: 20px;
}

.column-wrapper {
  position: relative;
  min-width: 272px;
  flex-shrink: 0;
}

.column-drag-handle {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: grab;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10;
}

.column-wrapper:hover .column-drag-handle {
  opacity: 1;
}

.column-drag-handle:hover {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.column-drag-handle:active {
  cursor: grabbing;
}

.add-column-container {
  min-width: 272px;
  flex-shrink: 0;
}

.add-column-btn {
  background: rgba(255, 255, 255, 0.24);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}

.add-column-btn:hover {
  background: rgba(255, 255, 255, 0.32);
  transform: translateY(-1px);
}

.add-column-form {
  background: #f1f2f4;
  border-radius: 12px;
  padding: 12px;
}

.add-column-input {
  width: 100%;
  border: none;
  outline: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #172b4d;
  background: white;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
}

.add-column-input::placeholder {
  color: #a5adba;
}

.add-column-actions {
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

/* Estilos para drag and drop de colunas */
:deep(.ghost-column) {
  opacity: 0.5;
  background: rgba(255, 255, 255, 0.1);
  transform: rotate(2deg);
}

:deep(.chosen-column) {
  cursor: grabbing;
}

:deep(.drag-column) {
  transform: rotate(5deg);
  opacity: 0.8;
}

/* Notificação */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 2000;
  animation: slideIn 0.3s ease;
}

.notification.success {
  background: #27ae60;
}

.notification.error {
  background: #e74c3c;
}

.notification.info {
  background: #3498db;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .board-content {
    padding: 0 15px 20px;
  }
  
  .columns-container {
    gap: 12px;
    min-height: calc(100vh - 180px);
  }
  
  .column-wrapper {
    min-width: 280px;
  }
  
  .add-column-container {
    min-width: 280px;
  }
  
  .board-container {
    padding-bottom: 100px; /* Mais espaço para navegação mobile */
  }
  
  .column-drag-handle {
    opacity: 1; /* Sempre visível no mobile */
    top: -12px;
  }
  
  .notification {
    top: 10px;
    right: 10px;
    left: 10px;
    text-align: center;
  }
}

/* Scrollbar personalizada para área horizontal */
.board-content::-webkit-scrollbar {
  height: 12px;
}

.board-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.board-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 6px;
}

.board-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
