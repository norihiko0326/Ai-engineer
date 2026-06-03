import React, { useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useTasks } from '../hooks/useTasks';
import { KanbanLane } from './KanbanLane';
import { CreateTaskDialog } from './CreateTaskDialog';
import type { TaskStatus } from '../types/task';

export const KanbanBoard: React.FC = () => {
  const { filteredTasks, loading, error, createTask } = useTasks();
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

  const todoTasks = filteredTasks.filter(t => t.status === 'TODO');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'IN_PROGRESS');
  const completedTasks = filteredTasks.filter(t => t.status === 'DONE');

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
        />
        <KanbanLane
          status="IN_PROGRESS"
          title="進行中"
          tasks={inProgressTasks}
          onAddTask={() => handleAddTask('IN_PROGRESS')}
        />
        <KanbanLane
          status="DONE"
          title="完了"
          tasks={completedTasks}
          onAddTask={() => handleAddTask('DONE')}
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
