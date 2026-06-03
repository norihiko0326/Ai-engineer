import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Box,
} from '@mui/material';
import type { TaskStatus } from '../types/task';

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    status: string;
    priority: number;
    dueDate?: string | null;
    createdBy?: string;
  }) => Promise<void>;
  status: TaskStatus;
}

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  open,
  onClose,
  onSubmit,
  status,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(3);
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) {
      setError('タイトルは必須です');
      return;
    }

    if (!priority || priority < 1 || priority > 5) {
      setError('優先度は1～5の間で指定してください');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate || null,
        createdBy: undefined,
      });

      setTitle('');
      setDescription('');
      setPriority(3);
      setDueDate('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'タスク作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setDescription('');
      setPriority(3);
      setDueDate('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>新しいタスクを作成</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          placeholder="タスクのタイトルを入力"
          disabled={loading}
          autoFocus
        />

        <TextField
          label="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          placeholder="タスクの説明（オプション）"
          disabled={loading}
        />

        <FormControl fullWidth>
          <InputLabel>優先度</InputLabel>
          <Select
            value={priority}
            label="優先度"
            onChange={(e) => setPriority(Number(e.target.value))}
            disabled={loading}
          >
            <MenuItem value={1}>1 - 最高</MenuItem>
            <MenuItem value={2}>2 - 高</MenuItem>
            <MenuItem value={3}>3 - 中</MenuItem>
            <MenuItem value={4}>4 - 低</MenuItem>
            <MenuItem value={5}>5 - 最低</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="期限日時"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
          disabled={loading}
          variant="outlined"
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        <Box sx={{ mt: 1, p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <small>ステータス: <strong>{status}</strong></small>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          キャンセル
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? '作成中...' : '作成'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
