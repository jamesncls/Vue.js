<template>
  <div 
    class="task-card"
    :class="{ 'dragging': isDragging }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @click="$emit('edit-task', task)"
  >
    <!-- Labels -->
    <div v-if="task.labels && task.labels.length > 0" class="task-labels">
      <span 
        v-for="label in task.labels" 
        :key="label"
        class="task-label"
        :class="`label-${label}`"
      ></span>
    </div>

    <!-- Título da tarefa -->
    <h4 class="task-title">{{ task.title }}</h4>

    <!-- Descrição (se houver) -->
    <p v-if="task.description" class="task-description">
      {{ task.description }}
    </p>

    <!-- Badges e informações -->
    <div v-if="hasBadges" class="task-badges">
      <!-- Data de vencimento -->
      <div v-if="task.dueDate" class="task-badge due-date" :class="dueDateClass">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1"/>
          <path d="M6 3V6L8 8" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
        </svg>
        {{ formatDueDate(task.dueDate) }}
      </div>

      <!-- Descrição -->
      <div v-if="task.description" class="task-badge">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 3H10M2 6H10M2 9H7" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- Anexos -->
      <div v-if="task.attachments && task.attachments > 0" class="task-badge">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6.5 1.5L3 5L6.5 8.5C7.32843 8.5 8 7.82843 8 7V3C8 2.17157 7.32843 1.5 6.5 1.5Z" stroke="currentColor" stroke-width="1"/>
          <path d="M3 5L6.5 8.5L10 5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ task.attachments }}
      </div>

      <!-- Comentários -->
      <div v-if="task.comments && task.comments > 0" class="task-badge">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10 3C10 2.44772 9.55228 2 9 2H3C2.44772 2 2 2.44772 2 3V7C2 7.55228 2.44772 8 3 8H4L6 10L8 8H9C9.55228 8 10 7.55228 10 7V3Z" stroke="currentColor" stroke-width="1"/>
        </svg>
        {{ task.comments }}
      </div>

      <!-- Checklist -->
      <div v-if="task.checklist" class="task-badge checklist" :class="checklistClass">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="1" width="10" height="10" rx="1" stroke="currentColor" stroke-width="1"/>
          <path v-if="task.checklist.completed === task.checklist.total" d="M3 6L5 8L9 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ task.checklist.completed }}/{{ task.checklist.total }}
      </div>

      <!-- Assignees -->
      <div v-if="task.assignees && task.assignees.length > 0" class="task-assignees">
        <div 
          v-for="(assignee, index) in task.assignees.slice(0, 3)" 
          :key="assignee"
          class="assignee-avatar"
          :style="{ 
            backgroundColor: getAssigneeColor(assignee),
            zIndex: task.assignees.length - index
          }"
          :title="assignee"
        >
          {{ getAssigneeInitials(assignee) }}
        </div>
        <div v-if="task.assignees.length > 3" class="assignee-more">
          +{{ task.assignees.length - 3 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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
  task: Task
}>()

// Emits
defineEmits(['edit-task', 'delete-task', 'drag-start', 'drag-end'])

// Estado reativo
const isDragging = ref(false)

// Computed properties
const hasBadges = computed(() => {
  return props.task.dueDate || 
         props.task.description || 
         (props.task.attachments && props.task.attachments > 0) ||
         (props.task.comments && props.task.comments > 0) ||
         props.task.checklist ||
         (props.task.assignees && props.task.assignees.length > 0)
})

const dueDateClass = computed(() => {
  if (!props.task.dueDate) return ''
  
  const dueDate = new Date(props.task.dueDate)
  const now = new Date()
  const diffTime = dueDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'due-today'
  if (diffDays <= 1) return 'due-soon'
  return ''
})

const checklistClass = computed(() => {
  if (!props.task.checklist) return ''
  
  const { completed, total } = props.task.checklist
  if (completed === total) return 'completed'
  if (completed > 0) return 'in-progress'
  return ''
})

// Métodos
const handleDragStart = (event: DragEvent) => {
  isDragging.value = true
  
  // Dados para transferir durante o drag
  const dragData = {
    task: props.task,
    sourceColumnId: 'current-column' // Isso seria passado como prop
  }
  
  event.dataTransfer?.setData('application/json', JSON.stringify(dragData))
  event.dataTransfer!.effectAllowed = 'move'
}

const handleDragEnd = () => {
  isDragging.value = false
}

const formatDueDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`
  } else if (diffDays === 0) {
    return 'Due today'
  } else if (diffDays === 1) {
    return 'Due tomorrow'
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

const getAssigneeInitials = (name: string): string => {
  return name.split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getAssigneeColor = (name: string): string => {
  const colors = [
    '#3498db', '#e74c3c', '#f39c12', '#9b59b6', 
    '#27ae60', '#e67e22', '#1abc9c', '#34495e'
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.task-card:hover {
  box-shadow: 0 2px 8px rgba(9, 30, 66, 0.15);
  transform: translateY(-1px);
}

.task-card.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.task-labels {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.task-label {
  height: 8px;
  border-radius: 4px;
  min-width: 40px;
  display: block;
}

/* Cores das labels */
.label-red { background-color: #eb5a46; }
.label-orange { background-color: #ff9f1a; }
.label-yellow { background-color: #f2d600; }
.label-green { background-color: #61bd4f; }
.label-blue { background-color: #0079bf; }
.label-purple { background-color: #c377e0; }
.label-pink { background-color: #ff78cb; }
.label-sky { background-color: #00c2e0; }
.label-lime { background-color: #51e898; }
.label-black { background-color: #344563; }

.task-title {
  font-size: 14px;
  font-weight: 400;
  color: #172b4d;
  margin: 0 0 8px 0;
  line-height: 1.3;
  word-wrap: break-word;
}

.task-description {
  font-size: 12px;
  color: #5e6c84;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-badges {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.task-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #5e6c84;
  background: #f4f5f7;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 400;
}

.task-badge.due-date {
  background: #dfe1e6;
}

.task-badge.due-date.due-today {
  background: #fff2cc;
  color: #b7950b;
}

.task-badge.due-date.due-soon {
  background: #fff2cc;
  color: #b7950b;
}

.task-badge.due-date.overdue {
  background: #ffebee;
  color: #c62828;
}

.task-badge.checklist.completed {
  background: #e3fcef;
  color: #006644;
}

.task-badge.checklist.in-progress {
  background: #fff2cc;
  color: #b7950b;
}

.task-assignees {
  display: flex;
  align-items: center;
  gap: -4px;
  margin-left: auto;
}

.assignee-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: white;
  border: 2px solid white;
  margin-left: -4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.assignee-avatar:hover {
  transform: translateY(-2px);
  z-index: 10 !important;
}

.assignee-more {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #dfe1e6;
  color: #5e6c84;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  border: 2px solid white;
  margin-left: -4px;
}

/* Responsividade */
@media (max-width: 768px) {
  .task-card {
    padding: 16px;
  }
  
  .task-title {
    font-size: 16px;
  }
  
  .task-description {
    font-size: 14px;
  }
  
  .task-badge {
    font-size: 13px;
    padding: 4px 8px;
  }
  
  .assignee-avatar {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
  
  .assignee-more {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
}
</style>
