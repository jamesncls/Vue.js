import { ref, Ref } from 'vue'

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

interface DragData {
  task: Task
  sourceColumnId: string
  sourceIndex: number
}

export function useDragAndDrop(columns: Ref<Column[]>) {
  const draggedTask = ref<DragData | null>(null)
  const isDragging = ref(false)

  // Iniciar drag
  const startDrag = (task: Task, sourceColumnId: string, sourceIndex: number) => {
    draggedTask.value = {
      task,
      sourceColumnId,
      sourceIndex
    }
    isDragging.value = true
  }

  // Finalizar drag
  const endDrag = () => {
    draggedTask.value = null
    isDragging.value = false
  }

  // Mover tarefa entre colunas
  const moveTask = (targetColumnId: string, targetIndex: number) => {
    if (!draggedTask.value) return

    const { task, sourceColumnId, sourceIndex } = draggedTask.value

    // Se for a mesma coluna e mesma posição, não fazer nada
    if (sourceColumnId === targetColumnId && sourceIndex === targetIndex) {
      return
    }

    // Encontrar colunas de origem e destino
    const sourceColumn = columns.value.find(col => col.id === sourceColumnId)
    const targetColumn = columns.value.find(col => col.id === targetColumnId)

    if (!sourceColumn || !targetColumn) return

    // Remover tarefa da coluna de origem
    sourceColumn.tasks.splice(sourceIndex, 1)

    // Adicionar tarefa na coluna de destino
    targetColumn.tasks.splice(targetIndex, 0, task)

    console.log(`Moved task "${task.title}" from ${sourceColumnId} to ${targetColumnId}`)
  }

  // Reordenar tarefas dentro da mesma coluna
  const reorderTasks = (columnId: string, oldIndex: number, newIndex: number) => {
    const column = columns.value.find(col => col.id === columnId)
    if (!column) return

    const task = column.tasks.splice(oldIndex, 1)[0]
    column.tasks.splice(newIndex, 0, task)

    console.log(`Reordered task "${task.title}" in column ${columnId}`)
  }

  // Mover coluna
  const moveColumn = (oldIndex: number, newIndex: number) => {
    const column = columns.value.splice(oldIndex, 1)[0]
    columns.value.splice(newIndex, 0, column)

    console.log(`Moved column "${column.title}" from position ${oldIndex} to ${newIndex}`)
  }

  // Verificar se pode fazer drop
  const canDrop = (targetColumnId: string): boolean => {
    return draggedTask.value !== null && draggedTask.value.sourceColumnId !== targetColumnId
  }

  // Obter dados do drag atual
  const getDragData = (): DragData | null => {
    return draggedTask.value
  }

  return {
    isDragging,
    startDrag,
    endDrag,
    moveTask,
    reorderTasks,
    moveColumn,
    canDrop,
    getDragData
  }
}
