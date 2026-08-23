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
  TextField,
  Stack,
  Tooltip,
} from '@mui/material';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '../../component/shared/DataTable';
import SearchBar from '../../component/shared/SearchBar';
import StatusChip from '../../component/shared/StatusChip';
import ConfirmDialog from '../../component/shared/ConfirmDialog';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchSubjectsStart, upsertSubjectStart } from '../../slice/slice-admin';
import type { RootState } from '../../store/store';
import type { Subject } from '../../types/user';
import type { GridColDef } from '@mui/x-data-grid';

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name required'),
  description: z.string().optional(),
});

export default function Subjects() {
  const dispatch = useDispatch();
  const { subjects, loading } = useSelector((s: RootState) => s.admin);

  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchSubjectsStart());
  }, [dispatch]);

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: '', description: '' },
  });

  const handleOpenAdd = () => {
    setEditingSubject(null);
    reset({ name: '', description: '' });
    setOpenModal(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setValue('name', sub.name);
    setValue('description', sub.description || '');
    setOpenModal(true);
  };

  const onSubmit = (data: any) => {
    dispatch(upsertSubjectStart({ id: editingSubject?.id, ...data }));
    setOpenModal(false);
  };

  const filtered = (subjects || []).filter((s) => s.name?.toLowerCase().includes(search.toLowerCase()));

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Subject Course Name', flex: 1.2 },
    { field: 'description', headerName: 'Description & Topics', flex: 2 },
    { field: 'teachersCount', headerName: 'Assigned Faculty', width: 140 },
    { field: 'examsCount', headerName: 'Total Exams', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const row = params.row as Subject;
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit Subject">
              <IconButton size="small" color="primary" onClick={() => handleOpenEdit(row)}>
                <Edit size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}>
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
            Subject Catalog
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage academic course offerings and examination subjects
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenAdd}>
          Add Subject
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search subject by course name..." />
      </Box>

      {loading ? (
        <LoadingSpinner message="Fetching subjects from backend catalog..." />
      ) : (
        <DataTable rows={filtered} columns={columns} height={460} emptyMessage="No subjects found in catalog. Click 'Add Subject' to add course offerings." />
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={2}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Subject Name" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Description & Key Topics" multiline rows={3} fullWidth />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save Subject
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Subject?"
        message="Are you sure you want to delete this subject?"
        confirmText="Delete"
        confirmColor="error"
        onConfirm={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
