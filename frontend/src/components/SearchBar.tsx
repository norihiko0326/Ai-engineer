import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTasks } from '../hooks/useTasks';
import type { TaskStatus } from '../types/task';

export const SearchBar: React.FC = () => {
  const { searchQuery, statusFilter, dispatch } = useTasks();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const handleStatusChange = (e: any) => {
    dispatch({ type: 'SET_STATUS_FILTER', payload: e.target.value as TaskStatus | 'all' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        mt: 2,
      }}
    >
      <TextField
        label="タスク検索"
        placeholder="タイトルまたは説明で検索..."
        value={searchQuery}
        onChange={handleSearchChange}
        variant="outlined"
        size="small"
        sx={{ flex: 1, minWidth: '200px' }}
      />
      <FormControl sx={{ minWidth: '200px' }}>
        <InputLabel>ステータス</InputLabel>
        <Select
          value={statusFilter}
          onChange={handleStatusChange}
          label="ステータス"
          size="small"
        >
          <MenuItem value="all">すべて</MenuItem>
          <MenuItem value="TODO">TODO</MenuItem>
          <MenuItem value="IN_PROGRESS">進行中</MenuItem>
          <MenuItem value="DONE">完了</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
