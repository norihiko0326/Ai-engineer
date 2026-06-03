import { Container, Typography, Box } from '@mui/material';
import { SearchBar } from './components/SearchBar';
import { KanbanBoard } from './components/KanbanBoard';

function App() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          Kanban Task Board
        </Typography>
        <SearchBar />
        <KanbanBoard />
      </Box>
    </Container>
  );
}

export default App;
