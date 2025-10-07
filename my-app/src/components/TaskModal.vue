<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isNewTask ? 'Create Card' : 'Edit Card' }}</h3>
        <button class="modal-close" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="handleSave">
          <!-- Título da tarefa -->
          <div class="form-group">
            <label for="task-title">Title *</label>
            <input
              id="task-title"
              v-model="localTask.title"
              type="text"
              placeholder="Enter a title for this card..."
              class="form-input"
              required
              ref="titleInput"
            >
          </div>

          <!-- Descrição -->
          <div class="form-group">
            <label for="task-description">Description</label>
            <textarea
              id="task-description"
              v-model="localTask.description"
              placeholder="Add a more detailed description..."
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <!-- Labels -->
          <div class="form-group">
            <label>Labels</label>
            <div class="labels-container">
              <button
                v-for="color in availableLabels"
                :key="color"
                type="button"
                class="label-option"
                :class="[`label-${color}`, { active: isLabelSelected(color) }]"
                @click="toggleLabel(color)"
              >
                <span class="label-name">{{ color }}</span>
                <svg v-if="isLabelSelected(color)" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L4.5 8.5L10 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Data de vencimento -->
          <div class="form-group">
            <label for="task-due-date">Due Date</label>
            <input
              id="task-due-date"
              v-model="localTask.dueDate"
              type="date"
              class="form-input"
            >
          </div>

          <!-- Assignees -->
          <div class="form-group">
            <label>Assignees</label>
            <div class="assignees-container">
              <button
                v-for="member in availableMembers"
                :key="member.id"
                type="button"
                class="assignee-option"
                :class="{ active: isAssigneeSelected(member.name) }"
                @click="toggleAssignee(member.name)"
              >
                <div 
                  class="assignee-avatar"
                  :style="{ backgroundColor: member.color }"
                >
                  {{ member.initials }}
                </div>
                <span class="assignee-name">{{ member.name }}</span>
                <svg v-if="isAssigneeSelected(member.name)" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Ações -->
          <div class="modal-actions">
            <button type="submit" class="btn btn-primary">
              {{ isNewTask ? 'Create Card' : 'Save Changes' }}
            </button>
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancel
            </button>
            <button 
              v-if="!isNewTask" 
              type="button" 
              class="btn btn-danger" 
              @click="handleDelete"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

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

interface Member {
  id: string
  name: string
  initials: string
  color: string
}

// Props
const props = defineProps<{
  task: Task | null
}>()

// Emits
const emit = defineEmits(['close', 'save', 'delete'])

// Estado reativo
const titleInput = ref<HTMLInputElement>()
const localTask = ref<Task>({
  id: '',
  title: '',
  description: '',
  labels: [],
  assignees: [],
  dueDate: ''
})

// Dados disponíveis
const availableLabels = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'sky', 'lime', 'black']

const availableMembers: Member[] = [
  { id: '1', name: 'John Doe', initials: 'JD', color: '#3498db' },
  { id: '2', name: 'Jane Smith', initials: 'JS', color: '#e74c3c' },
  { id: '3', name: 'Mike Johnson', initials: 'MJ', color: '#f39c12' },
  { id: '4', name: 'Sarah Wilson', initials: 'SW', color: '#9b59b6' }
]

// Computed
const isNewTask = computed(() => !props.task?.id || props.task.id === '')

// Métodos
const isLabelSelected = (color: string): boolean => {
  return localTask.value.labels?.includes(color) || false
}

const toggleLabel = (color: string) => {
  if (!localTask.value.labels) {
    localTask.value.labels = []
  }
  
  const index = localTask.value.labels.indexOf(color)
  if (index > -1) {
    localTask.value.labels.splice(index, 1)
  } else {
    localTask.value.labels.push(color)
  }
}

const isAssigneeSelected = (name: string): boolean => {
  return localTask.value.assignees?.includes(name) || false
}

const toggleAssignee = (name: string) => {
  if (!localTask.value.assignees) {
    localTask.value.assignees = []
  }
  
  const index = localTask.value.assignees.indexOf(name)
  if (index > -1) {
    localTask.value.assignees.splice(index, 1)
  } else {
    localTask.value.assignees.push(name)
  }
}

const handleSave = () => {
  if (localTask.value.title.trim()) {
    emit('save', { ...localTask.value })
  }
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this card?')) {
    emit('delete', localTask.value.id)
  }
}

// Lifecycle
onMounted(async () => {
  if (props.task) {
    localTask.value = { ...props.task }
  }
  
  await nextTick()
  titleInput.value?.focus()
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #dfe1e6;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #172b4d;
}

.modal-close {
  background: none;
  border: none;
  color: #6b778c;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f4f5f7;
  color: #172b4d;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #172b4d;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #dfe1e6;
  border-radius: 8px;
  font-size: 14px;
  color: #172b4d;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0079bf;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.labels-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.label-option {
  background: none;
  border: 2px solid transparent;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  transition: all 0.2s ease;
  text-transform: capitalize;
}

.label-option.active {
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

/* Cores das labels */
.label-red { background-color: #eb5a46; }
.label-orange { background-color: #ff9f1a; }
.label-yellow { background-color: #f2d600; color: #172b4d; }
.label-green { background-color: #61bd4f; }
.label-blue { background-color: #0079bf; }
.label-purple { background-color: #c377e0; }
.label-pink { background-color: #ff78cb; }
.label-sky { background-color: #00c2e0; }
.label-lime { background-color: #51e898; color: #172b4d; }
.label-black { background-color: #344563; }

.assignees-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.assignee-option {
  background: none;
  border: 2px solid #dfe1e6;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  text-align: left;
}

.assignee-option:hover {
  border-color: #0079bf;
  background: #f4f5f7;
}

.assignee-option.active {
  border-color: #0079bf;
  background: #e4f0f6;
}

.assignee-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.assignee-name {
  flex: 1;
  font-size: 14px;
  color: #172b4d;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #dfe1e6;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
  margin-left: auto;
}

.btn-danger:hover {
  background-color: #c0392b;
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body {
    padding: 16px;
  }
  
  .labels-container {
    gap: 6px;
  }
  
  .label-option {
    padding: 6px 10px;
    font-size: 11px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-danger {
    margin-left: 0;
    order: -1;
  }
}
</style>
