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
  MenuItem,
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
import { fetchTeachersStart, upsertTeacherStart } from '../../slice/slice-admin';
import type { RootState } from '../../store/store';
import type { Teacher } from '../../types/user';
import type { GridColDef } from '@mui/x-data-grid';

const teacherSchema = z.object({
  teacherId: z.string().min(1, 'Teacher ID required'),
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  department: z.string().min(1, 'Department required'),
});

export default function Teachers() {
  const dispatch = useDispatch();
  const { teachers, loading } = useSelector((s: RootState) => s.admin);

  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchTeachersStart());
  }, [dispatch]);

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: { teacherId: '', name: '', email: '', department: 'Computer Science' },
  });

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    reset({ teacherId: `TCH-${Math.floor(2000 + Math.random() * 8000)}`, name: '', email: '', department: 'Computer Science' });
    setOpenModal(true);
  };

  const handleOpenEdit = (tch: Teacher) => {
    setEditingTeacher(tch);
    setValue('teacherId', tch.teacherId);
    setValue('name', tch.name);
    setValue('email', tch.email);
    setValue('department', tch.department);
    setOpenModal(true);
  };

  const onSubmit = (data: any) => {
    dispatch(upsertTeacherStart({ id: editingTeacher?.id, ...data }));
    setOpenModal(false);
  };

  const filtered = (teachers || []).filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.teacherId?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: 'teacherId', headerName: 'Teacher ID', width: 130 },
    { field: 'name', headerName: 'Faculty Name', flex: 1 },
    { field: 'email', headerName: 'Email Address', flex: 1.2 },
    { field: 'department', headerName: 'Department', flex: 1 },
    { field: 'subjectsCount', headerName: 'Subjects', width: 100 },
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
        const row = params.row as Teacher;
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Edit Teacher">
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
            Faculty Management
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage teacher profiles, department assignments, and system status
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenAdd}>
          Add Teacher
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search teacher by name or ID..." />
      </Box>

      {loading ? (
        <LoadingSpinner message="Loading faculty accounts from backend..." />
      ) : (
        <DataTable rows={filtered} columns={columns} height={460} emptyMessage="No faculty accounts found. Click 'Add Teacher' to register new faculty members." />
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={2}>
              <Controller
                name="teacherId"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Teacher ID" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                )}
              />
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Faculty Name" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Email Address" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                )}
              />
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Department" fullWidth>
                    {['Computer Science', 'Software Engineering', 'Information Tech', 'Artificial Intelligence'].map((d) => (
                      <MenuItem key={d} value={d}>
                        {d}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save Teacher
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Teacher Account?"
        message="Are you sure you want to delete this teacher account?"
        confirmText="Delete"
        confirmColor="error"
        onConfirm={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
