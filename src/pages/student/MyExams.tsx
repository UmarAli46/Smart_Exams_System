import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, IconButton, Tooltip, Paper } from '@mui/material';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../component/shared/DataTable';
import SearchBar from '../../component/shared/SearchBar';
import StatusChip from '../../component/shared/StatusChip';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchMyExamsStart } from '../../slice/slice-exams';
import type { RootState } from '../../store/store';
import type { ExamResult } from '../../types/result';
import type { GridColDef } from '@mui/x-data-grid';

export default function MyExams() {
  const dispatch = useDispatch();
  const { myExams: history, loading } = useSelector((s: RootState) => s.exams);

  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMyExamsStart());
  }, [dispatch]);

  const filtered = (history || []).filter((h) => h.name?.toLowerCase().includes(search.toLowerCase()));

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Exam Title', flex: 1.5 },
    { field: 'subject', headerName: 'Subject', flex: 1 },
    { field: 'duration', headerName: 'Duration', width: 110, valueFormatter: (v) => `${v} mins` },
    {
      field: 'status',
      headerName: 'Result',
      width: 110,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    { field: 'startDate', headerName: 'Attempt Date', width: 160 },
    {
      field: 'actions',
      headerName: 'Analysis',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Result Details">
          <IconButton size="small" color="primary" onClick={() => navigate(`/student/results?resultId=${params.row.id}`)}>
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
          My Examination History
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Past examination submissions, scores, and pass/fail evaluations
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Filter history by exam title..." />
      </Box>

      {loading ? (
        <LoadingSpinner message="Fetching examination history..." />
      ) : (
        <DataTable rows={filtered} columns={columns} height={420} emptyMessage="No past examination attempts found." />
      )}
    </Box>
  );
}
