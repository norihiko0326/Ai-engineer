import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Task } from '../types/task';
import { useTaskContext } from '../context/TaskContext';

interface TaskCardProps {
  task: Task;
  index: number;
}

const getPriorityColor = (priority?: number): 'error' | 'warning' | 'info' | 'success' | 'default' => {
  if (!priority) return 'default';
  if (priority === 1) return 'error';
  if (priority === 2) return 'warning';
  if (priority === 3) return 'info';
  if (priority === 4) return 'success';
  if (priority === 5) return 'default';
  return 'default';
};

const getPriorityLabel = (priority?: number): string => {
  if (!priority) return '';
  if (priority === 1) return '最高';
  if (priority === 2) return '高';
  if (priority === 3) return '中';
  if (priority === 4) return '低';
  if (priority === 5) return '最低';
  return '';
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { deleteTask } = useTaskContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createdDate = new Date(task.createdAt).toLocaleDateString('ja-JP');

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', String(task.id));
    e.dataTransfer.setData('taskStatus', task.status);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card
        draggable
        onDragStart={handleDragStart}
        sx={{
          mb: 1,
          cursor: 'grab',
          '&:hover': { boxShadow: 2 },
          '&:active': { cursor: 'grabbing' },
          userSelect: 'none',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
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
            </Box>
            <IconButton
              size="small"
              color="error"
              onClick={handleDeleteClick}
              sx={{ ml: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>タスク削除の確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            このタスク「{task.title}」を削除します。この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} disabled={isDeleting}>
            キャンセル
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? '削除中...' : '削除'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
