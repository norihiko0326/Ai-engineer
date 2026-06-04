import React, { useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useTasks } from '../hooks/useTasks';
import { KanbanLane } from './KanbanLane';
import { CreateTaskDialog } from './CreateTaskDialog';
import { updateTaskStatusAndOrder } from '../api/taskApi';
import type { TaskStatus } from '../types/task';

export const KanbanBoard: React.FC = () => {
  const { filteredTasks, loading, error, createTask, refreshTasks } = useTasks();
  const [openDialog, setOpenDialog] = useState(false);
  const [targetStatus, setTargetStatus] = useState<TaskStatus>('TODO');

  const handleAddTask = (status: TaskStatus) => {
    setTargetStatus(status);
    setOpenDialog(true);
  };

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    status: string;
    priority: number;
    dueDate?: string | null;
    createdBy?: string;
  }) => {
    await createTask(data);
  };

  const handleDrop = (e: React.DragEvent, destStatus: TaskStatus): void => {
    const taskId = e.dataTransfer.getData('taskId');

    if (!taskId) return;

    const draggedTaskId = parseInt(taskId);

    const destTasks = filteredTasks
      .filter(t => t.status === destStatus)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const tasksToUpdate: Array<{ id: number; status: string; order: number }> = [];

    tasksToUpdate.push({
      id: draggedTaskId,
      status: destStatus,
      order: destTasks.length,
    });

    updateTaskStatusAndOrder(tasksToUpdate)
      .then(() => refreshTasks())
      .catch(err => console.error('Failed to update task:', err));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        エラーが発生しました: {error}
      </Alert>
    );
  }

  const todoTasks = filteredTasks.filter(t => t.status === 'TODO').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const inProgressTasks = filteredTasks.filter(t => t.status === 'IN_PROGRESS').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const completedTasks = filteredTasks.filter(t => t.status === 'DONE').sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
          mt: 3,
        }}
      >
        <KanbanLane
          status="TODO"
          title="TODO"
          tasks={todoTasks}
          onAddTask={() => handleAddTask('TODO')}
          onDrop={(e) => handleDrop(e, 'TODO')}
        />
        <KanbanLane
          status="IN_PROGRESS"
          title="進行中"
          tasks={inProgressTasks}
          onAddTask={() => handleAddTask('IN_PROGRESS')}
          onDrop={(e) => handleDrop(e, 'IN_PROGRESS')}
        />
        <KanbanLane
          status="DONE"
          title="完了"
          tasks={completedTasks}
          onAddTask={() => handleAddTask('DONE')}
          onDrop={(e) => handleDrop(e, 'DONE')}
        />
      </Box>
      <CreateTaskDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleCreateTask}
        status={targetStatus}
      />
    </>
  );
};
