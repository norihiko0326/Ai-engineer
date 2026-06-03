import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import type { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
}

const getPriorityColor = (priority?: number) => {
  if (!priority) return 'default';
  if (priority === 1) return 'error';
  if (priority === 2) return 'warning';
  if (priority === 3) return 'success';
  return 'default';
};

const getPriorityLabel = (priority?: number) => {
  if (!priority) return '';
  if (priority === 1) return '高';
  if (priority === 2) return '中';
  if (priority === 3) return '低';
  return '';
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const createdDate = new Date(task.createdAt).toLocaleDateString('ja-JP');

  return (
    <Card sx={{ mb: 1, cursor: 'pointer', '&:hover': { boxShadow: 2 } }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
          {task.title}
        </Typography>
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {task.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {task.priority && (
            <Chip label={getPriorityLabel(task.priority)} color={getPriorityColor(task.priority)} size="small" />
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          作成: {createdDate}
        </Typography>
      </CardContent>
    </Card>
  );
};
