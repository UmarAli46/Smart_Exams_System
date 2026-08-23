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
  Chip,
} from '@mui/material';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Camera } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DataTable from '../../component/shared/DataTable';
import SearchBar from '../../component/shared/SearchBar';
import StatusChip from '../../component/shared/StatusChip';
import ConfirmDialog from '../../component/shared/ConfirmDialog';
import FaceVerificationModal from '../../component/exam/FaceVerificationModal';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchStudentsStart, upsertStudentStart } from '../../slice/slice-admin';
import type { RootState } from '../../store/store';
import type { Student } from '../../types/user';
import type { GridColDef } from '@mui/x-data-grid';

const studentSchema = z.object({
  studentId: z.string().min(1, 'Student ID required'),
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  department: z.string().min(1, 'Department required'),
  semester: z.string().min(1, 'Semester required'),
});

export default function Students() {
  const dispatch = useDispatch();
  const { students, loading } = useSelector((s: RootState) => s.admin);

  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [registeringFaceStudent, setRegisteringFaceStudent] = useState<Student | null>(null);

  useEffect(() => {
    dispatch(fetchStudentsStart());
  }, [dispatch]);

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: { studentId: '', name: '', email: '', department: 'Computer Science', semester: 'Semester 1' },
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    reset({ studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`, name: '', email: '', department: 'Computer Science', semester: 'Semester 1' });
    setOpenModal(true);
  };

  const handleOpenEdit = (stu: Student) => {
    setEditingStudent(stu);
    setValue('studentId', stu.studentId);
    setValue('name', stu.name);
    setValue('email', stu.email);
    setValue('department', stu.department);
    setValue('semester', stu.semester);
    setOpenModal(true);
  };

  const onSubmit = (data: any) => {
    dispatch(upsertStudentStart({ id: editingStudent?.id, ...data }));
    setOpenModal(false);
  };

  const filtered = (students || []).filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: 'studentId', headerName: 'Student ID', width: 130 },
    { field: 'name', headerName: 'Full Name', flex: 1 },
    { field: 'email', headerName: 'Email Address', flex: 1.2 },
    { field: 'department', headerName: 'Department', flex: 1 },
    { field: 'semester', headerName: 'Semester', width: 110 },
    {
      field: 'biometrics',
      headerName: 'Biometrics',
      width: 140,
      renderCell: () => <Chip label="ENROLLED ✓" color="success" size="small" sx={{ fontWeight: 700 }} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => {
        const row = params.row as Student;
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="Enroll / Update Face Photo">
              <IconButton size="small" color="secondary" onClick={() => setRegisteringFaceStudent(row)}>
                <Camera size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Student">
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
            Student Management & Biometrics
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage student profiles, accounts, and facial recognition enrollment
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={18} />} onClick={handleOpenAdd}>
          Add Student
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, or email..." />
      </Box>

      {loading ? (
        <LoadingSpinner message="Fetching students data from backend API..." />
      ) : (
        <DataTable rows={filtered} columns={columns} height={460} emptyMessage="No students found. Click 'Add Student' to register new student accounts." />
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={2}>
              <Controller
                name="studentId"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Student ID" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                )}
              />
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField {...field} label="Full Name" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
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
                    {['Computer Science', 'Software Engineering', 'Information Tech', 'Artificial Intelligence', 'Data Science'].map((d) => (
                      <MenuItem key={d} value={d}>
                        {d}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="semester"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Semester" fullWidth>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <MenuItem key={s} value={`Semester ${s}`}>
                        Semester {s}
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
              Save Student
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Admin Biometric Face Registration Modal */}
      <FaceVerificationModal
        open={Boolean(registeringFaceStudent)}
        studentName={registeringFaceStudent?.name || 'Student'}
        onSuccess={() => setRegisteringFaceStudent(null)}
        onCancel={() => setRegisteringFaceStudent(null)}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Student Account?"
        message="Are you sure you want to permanently delete this student account?"
        confirmText="Delete"
        confirmColor="error"
        onConfirm={() => setDeleteId(null)}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
