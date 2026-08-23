import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import { Plus, Award, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../component/shared/DataTable';
import SearchBar from '../../component/shared/SearchBar';
import StatusChip from '../../component/shared/StatusChip';
import ConfirmDialog from '../../component/shared/ConfirmDialog';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchExamsStart } from '../../slice/slice-exams';
import type { RootState } from '../../store/store';
import type { Exam, ExamStatus } from '../../types/exam';
import type { GridColDef } from '@mui/x-data-grid';

export default function MyExams() {
  const dispatch = useDispatch();
  const { data: exams, loading } = useSelector((s: RootState) => s.exams);

  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchExamsStart());
  }, [dispatch]);

  const statuses: (ExamStatus | 'ALL')[] = ['ALL', 'ACTIVE', 'UPCOMING', 'COMPLETED', 'DRAFT'];
  const currentStatusFilter = statuses[tabIndex];

  const filtered = (exams || []).filter((e) => {
    const matchesStatus = currentStatusFilter === 'ALL' || e.status === currentStatusFilter;
    const matchesSearch = e.name?.toLowerCase().includes(search.toLowerCase()) || e.subject?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Exam Title', flex: 1.5 },
    { field: 'subject', headerName: 'Subject', flex: 1 },
    { field: 'questionsCount', headerName: 'Questions', width: 100 },
    { field: 'duration', headerName: 'Duration', width: 100, valueFormatter: (v) => `${v} mins` },
    { field: 'startDate', headerName: 'Start Date & Time', width: 160 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    { field: 'attemptsCount', headerName: 'Submissions', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const row = params.row as Exam;
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View Results">
              <IconButton size="small" color="primary" onClick={() => navigate(`/teacher/results?examId=${row.id}`)}>
                <Award size={16} />
              </IconButton>
            </Tooltip>
            {row.status !== 'COMPLETED' && (
              <Tooltip title="Cancel / Delete Exam">
                <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}>
                  <Trash2 size={16} />
                </IconButton>
              </Tooltip>
            )}
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
            My Created Examinations
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Filter by status, inspect submissions, and manage upcoming schedules
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => navigate('/teacher/exams/create')}>
          Create New Exam
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(_, val) => setTabIndex(val)}>
          <Tab label="All Exams" />
          <Tab label="Active Now" />
          <Tab label="Upcoming" />
          <Tab label="Completed" />
          <Tab label="Drafts" />
        </Tabs>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search exam by title or subject..." />
      </Box>

      {loading ? (
        <LoadingSpinner message="Loading examinations..." />
      ) : (
        <DataTable rows={filtered} columns={columns} height={420} emptyMessage="No examinations found. Click 'Create New Exam' to launch an examination." />
      )}

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Cancel / Delete Exam?"
        message="Are you sure you want to cancel this exam schedule?"
        confirmText="Delete"
        confirmColor="error"
        onConfirm={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
