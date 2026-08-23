import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Tooltip,
} from '@mui/material';
import { Eye, FileSpreadsheet } from 'lucide-react';
import DataTable from '../../component/shared/DataTable';
import SearchBar from '../../component/shared/SearchBar';
import StatusChip from '../../component/shared/StatusChip';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchExamsStart } from '../../slice/slice-exams';
import type { RootState } from '../../store/store';
import type { Exam } from '../../types/exam';
import type { GridColDef } from '@mui/x-data-grid';

export default function ExamOverview() {
  const dispatch = useDispatch();
  const { data: exams, loading } = useSelector((s: RootState) => s.exams);

  const [search, setSearch] = useState('');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  useEffect(() => {
    dispatch(fetchExamsStart());
  }, [dispatch]);

  const filtered = (exams || []).filter(
    (e) =>
      e.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.subject?.toLowerCase().includes(search.toLowerCase()) ||
      e.teacherName?.toLowerCase().includes(search.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Exam Title', flex: 1.5 },
    { field: 'subject', headerName: 'Subject', flex: 1 },
    { field: 'teacherName', headerName: 'Faculty Creator', flex: 1 },
    { field: 'questionsCount', headerName: 'Questions', width: 100 },
    { field: 'duration', headerName: 'Duration', width: 100, valueFormatter: (value) => `${value} mins` },
    { field: 'startDate', headerName: 'Start Date & Time', width: 160 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'attemptsCount',
      headerName: 'Submissions',
      width: 120,
    },
    {
      field: 'actions',
      headerName: 'Inspect',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Exam Details">
          <IconButton size="small" color="primary" onClick={() => setSelectedExam(params.row as Exam)}>
            <Eye size={18} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          Exam Oversight & Monitoring
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Read-only audit view of all faculty-created examinations across departments
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Filter by exam title, subject, or faculty name..." />
      </Box>

      {loading ? (
        <LoadingSpinner message="Fetching examinations oversight data..." />
      ) : (
        <DataTable rows={filtered} columns={columns} height={460} emptyMessage="No examinations found in backend database." />
      )}

      {/* Details Dialog */}
      <Dialog open={Boolean(selectedExam)} onClose={() => setSelectedExam(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
          <FileSpreadsheet color="#1976d2" size={24} /> {selectedExam?.name}
        </DialogTitle>
        <DialogContent dividers>
          {selectedExam && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Subject</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedExam.subject}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Faculty Creator</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedExam.teacherName}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Questions Count</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedExam.questionsCount} questions</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Duration</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedExam.duration} minutes</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Start Window</Typography>
                <Typography variant="body2">{selectedExam.startDate}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">End Window</Typography>
                <Typography variant="body2">{selectedExam.endDate}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Passing Score</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedExam.passingMarks}%</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Total Submissions</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedExam.attemptsCount} attempts</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Negative Marking</Typography>
                <Typography variant="body2">{selectedExam.negativeMarking ? 'Enabled (-0.25)' : 'Disabled'}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Randomize Order</Typography>
                <Typography variant="body2">{selectedExam.randomize ? 'Enabled' : 'Disabled'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setSelectedExam(null)}>
            Close Audit View
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
