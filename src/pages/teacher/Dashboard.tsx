import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Paper, Button } from '@mui/material';
import { HelpCircle, FileSpreadsheet, PlayCircle, CheckCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../../component/shared/DashboardCard';
import DataTable from '../../component/shared/DataTable';
import StatusChip from '../../component/shared/StatusChip';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchQuestionsStart } from '../../slice/slice-questions';
import { fetchExamsStart } from '../../slice/slice-exams';
import type { RootState } from '../../store/store';
import type { GridColDef } from '@mui/x-data-grid';

const recentExamsCols: GridColDef[] = [
  { field: 'name', headerName: 'Exam Title', flex: 1.5 },
  { field: 'subject', headerName: 'Subject', flex: 1 },
  { field: 'questionsCount', headerName: 'Questions', width: 100 },
  { field: 'duration', headerName: 'Duration', width: 100, valueFormatter: (v) => `${v} mins` },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => <StatusChip status={params.value} />,
  },
  { field: 'attemptsCount', headerName: 'Submissions', width: 120 },
];

export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: questions, loading: questionsLoading } = useSelector((s: RootState) => s.questions);
  const { data: exams, loading: examsLoading } = useSelector((s: RootState) => s.exams);

  useEffect(() => {
    dispatch(fetchQuestionsStart());
    dispatch(fetchExamsStart());
  }, [dispatch]);

  const totalQuestions = questions?.length || 0;
  const totalExams = exams?.length || 0;
  const activeExams = exams?.filter((e) => e.status === 'ACTIVE').length || 0;
  const completedExams = exams?.filter((e) => e.status === 'COMPLETED').length || 0;

  const loading = questionsLoading || examsLoading;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
            Faculty Workspace
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Overview of your question bank, exams, and student evaluations
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Plus size={18} />} onClick={() => navigate('/teacher/questions/create')}>
            Add Question
          </Button>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => navigate('/teacher/exams/create')}>
            Create Exam
          </Button>
        </Box>
      </Box>

      {/* Dynamic Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard title="Question Bank" value={totalQuestions} icon={<HelpCircle size={22} />} color="#1976d2" subtitle="Questions created by you" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard title="Total Exams" value={totalExams} icon={<FileSpreadsheet size={22} />} color="#9c27b0" subtitle="Created this semester" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard title="Active Exams" value={activeExams} icon={<PlayCircle size={22} />} color="#ed6c02" subtitle="Currently in progress" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard title="Completed Exams" value={completedExams} icon={<CheckCircle size={22} />} color="#2e7d32" subtitle="Evaluated & graded" />
        </Grid>
      </Grid>

      {/* Dynamic Recent Exams Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
          Your Recent Examinations
        </Typography>
        {loading ? (
          <LoadingSpinner message="Loading workspace overview..." />
        ) : (
          <DataTable rows={exams || []} columns={recentExamsCols} height={320} emptyMessage="No examinations found in database. Click 'Create Exam' to launch an examination." />
        )}
      </Paper>
    </Box>
  );
}
