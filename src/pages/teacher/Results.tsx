import React, { useEffect, useState } from 'react';
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
import { Eye, Award } from 'lucide-react';
import DataTable from '../../component/shared/DataTable';
import SearchBar from '../../component/shared/SearchBar';
import StatusChip from '../../component/shared/StatusChip';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { apiGetResults } from '../../api/api-results';
import type { ExamResult } from '../../types/result';
import type { GridColDef } from '@mui/x-data-grid';

export default function Results() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    let mounted = true;
    apiGetResults()
      .then((res: any) => {
        if (mounted) {
          const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
          setResults(list);
        }
      })
      .catch(() => {
        if (mounted) setResults([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = (results || []).filter(
    (r) =>
      (r.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.studentId || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.examName || '').toLowerCase().includes(search.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: 'studentId', headerName: 'Student ID', width: 120 },
    { field: 'studentName', headerName: 'Student Name', flex: 1, valueGetter: (p, row) => row.studentName || 'Student' },
    { field: 'examName', headerName: 'Exam Title', flex: 1.5 },
    {
      field: 'score',
      headerName: 'Score',
      width: 110,
      valueGetter: (p, row) => `${row.score}/${row.totalMarks}`,
    },
    {
      field: 'percentage',
      headerName: 'Percentage',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 700, color: params.value >= 50 ? 'success.main' : 'error.main' }}>
          {params.value}%
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Evaluation',
      width: 110,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    { field: 'attemptDate', headerName: 'Submitted At', width: 160 },
    {
      field: 'actions',
      headerName: 'Inspect',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Detailed Answers">
          <IconButton size="small" color="primary" onClick={() => setSelectedResult(params.row as ExamResult)}>
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
          Student Exam Evaluations
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Inspect submission scores, percentage metrics, and itemized performance
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search student name, ID, or exam title..." />
      </Box>

      {loading ? (
        <LoadingSpinner message="Fetching exam results from Spring Boot database..." />
      ) : (
        <DataTable rows={filtered} columns={columns} height={460} emptyMessage="No student examination evaluations recorded yet." />
      )}

      {/* Result Details Dialog */}
      <Dialog open={Boolean(selectedResult)} onClose={() => setSelectedResult(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Award color="#1976d2" size={24} /> Evaluation Details — {selectedResult?.studentName}
        </DialogTitle>
        <DialogContent dividers>
          {selectedResult && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Exam Title</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedResult.examName}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Final Score</Typography>
                <Typography variant="h6" fontWeight={700} color={selectedResult.status === 'PASS' ? 'success.main' : 'error.main'}>
                  {selectedResult.score} / {selectedResult.totalMarks} ({selectedResult.percentage}%)
                </Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">Correct Choice</Typography>
                <Typography variant="body1" fontWeight={600} color="success.main">{selectedResult.correctAnswers}</Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">Wrong Choice</Typography>
                <Typography variant="body1" fontWeight={600} color="error.main">{selectedResult.wrongAnswers}</Typography>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Typography variant="caption" color="text.secondary">Skipped</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedResult.skippedAnswers}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Time Taken</Typography>
                <Typography variant="body2">{selectedResult.duration} minutes</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="text.secondary">Submitted At</Typography>
                <Typography variant="body2">{selectedResult.attemptDate}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" onClick={() => setSelectedResult(null)}>
            Close Evaluation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
