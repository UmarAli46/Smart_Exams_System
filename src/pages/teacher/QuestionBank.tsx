import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Tooltip,
  Grid,
  MenuItem,
  TextField,
  Paper,
} from '@mui/material';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../component/shared/DataTable';
import SearchBar from '../../component/shared/SearchBar';
import ConfirmDialog from '../../component/shared/ConfirmDialog';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchQuestionsStart, deleteQuestionStart } from '../../slice/slice-questions';
import type { RootState } from '../../store/store';
import type { Question } from '../../types/question';
import type { GridColDef } from '@mui/x-data-grid';

export default function QuestionBank() {
  const dispatch = useDispatch();
  const { data: questions, loading } = useSelector((s: RootState) => s.questions);

  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchQuestionsStart());
  }, [dispatch]);

  const handleDelete = () => {
    if (deleteId) {
      dispatch(deleteQuestionStart(deleteId));
      setDeleteId(null);
    }
  };

  const filtered = (questions || []).filter((q) => {
    const matchesSearch = q.text?.toLowerCase().includes(search.toLowerCase()) || q.topic?.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = selectedDifficulty === 'ALL' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  const columns: GridColDef[] = [
    { field: 'text', headerName: 'Question Text', flex: 2 },
    { field: 'subject', headerName: 'Subject', flex: 1 },
    { field: 'topic', headerName: 'Topic', flex: 1 },
    {
      field: 'difficulty',
      headerName: 'Difficulty',
      width: 120,
      renderCell: (params) => {
        const val = params.value as string;
        const color = val === 'EASY' ? 'success' : val === 'MEDIUM' ? 'warning' : 'error';
        return <Chip label={val} color={color as any} size="small" sx={{ fontWeight: 700 }} />;
      },
    },
    { field: 'marks', headerName: 'Marks', width: 90 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const q = params.row as Question;
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Details">
              <IconButton size="small" color="primary" onClick={() => setSelectedQuestion(q)}>
                <Eye size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Question">
              <IconButton size="small" color="primary" onClick={() => navigate(`/teacher/questions/create?edit=${q.id}`)}>
                <Edit size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => setDeleteId(q.id)}>
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
            Faculty Question Bank
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage your repository of manual exam questions and multiple-choice options
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => navigate('/teacher/questions/create')}>
          Create Question
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search question text or topic..." />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            select
            fullWidth
            size="small"
            label="Filter Difficulty"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <MenuItem value="ALL">All Difficulties</MenuItem>
            <MenuItem value="EASY">Easy</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HARD">Hard</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {loading ? (
        <LoadingSpinner message="Fetching questions from faculty question bank..." />
      ) : (
        <DataTable rows={filtered} columns={columns} height={460} emptyMessage="No questions found in Question Bank. Click 'Create Question' to add manual questions." />
      )}

      {/* View Question Dialog */}
      <Dialog open={Boolean(selectedQuestion)} onClose={() => setSelectedQuestion(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          Question Inspection
        </DialogTitle>
        <DialogContent dividers>
          {selectedQuestion && (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={selectedQuestion.subject} color="primary" size="small" />
                <Chip label={selectedQuestion.topic} variant="outlined" size="small" />
                <Chip label={`${selectedQuestion.marks} Marks`} color="secondary" size="small" />
              </Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedQuestion.text}
              </Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const optText = selectedQuestion[`option${optKey}` as keyof Question];
                  const isCorrect = selectedQuestion.correctAnswer === optKey;
                  return (
                    <Paper
                      key={optKey}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderColor: isCorrect ? 'success.main' : 'divider',
                        bgcolor: isCorrect ? 'success.light' : 'transparent',
                        color: isCorrect ? 'success.contrastText' : 'text.primary',
                        fontWeight: isCorrect ? 600 : 400,
                      }}
                    >
                      Option {optKey}: {optText as string} {isCorrect && '✓ (Correct Answer)'}
                    </Paper>
                  );
                })}
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setSelectedQuestion(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Question?"
        message="Are you sure you want to remove this question from your Question Bank?"
        confirmText="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
