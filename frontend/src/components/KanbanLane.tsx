import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { Task, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';

interface KanbanLaneProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
}

const getHeaderColor = (status: TaskStatus) => {
  switch (status) {
    case 'TODO':
      return '#e0e0e0';
    case 'IN_PROGRESS':
      return '#bbdefb';
    case 'DONE':
      return '#c8e6c9';
    default:
      return '#f5f5f5';
  }
};

export const KanbanLane: React.FC<KanbanLaneProps> = ({ status, title, tasks, onAddTask }) => {
  return (
    <Paper
      sx={{
        flex: 1,
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fafafa',
      }}
    >
      <Box
        sx={{
          backgroundColor: getHeaderColor(status),
          padding: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label={tasks.length} size="small" variant="outlined" />
            <IconButton size="small" onClick={onAddTask} title="タスクを追加">
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 2, overflow: 'auto', flex: 1 }}>
        {tasks.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
            タスクなし
          </Typography>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </Box>
    </Paper>
  );
};
