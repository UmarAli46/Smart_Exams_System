import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { Users, UserCheck, BookOpen, FileSpreadsheet, PlayCircle, CheckCircle, Award } from 'lucide-react';
import DashboardCard from '../../component/shared/DashboardCard';
import DataTable from '../../component/shared/DataTable';
import StatusChip from '../../component/shared/StatusChip';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { apiGetAdminDashboard } from '../../api/api-admin';
import type { GridColDef } from '@mui/x-data-grid';

const recentActivityCols: GridColDef[] = [
  { field: 'user', headerName: 'User Account', flex: 1 },
  { field: 'role', headerName: 'Role', width: 110 },
  { field: 'action', headerName: 'System Activity Log', flex: 1.5 },
  { field: 'timestamp', headerName: 'Timestamp', width: 160 },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => <StatusChip status={params.value} />,
  },
];

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiGetAdminDashboard()
      .then((res: any) => {
        if (mounted) setDashboardData(res.data || res);
      })
      .catch(() => {
        if (mounted) {
          setDashboardData({
            totalStudents: 0,
            totalTeachers: 0,
            totalSubjects: 0,
            totalExams: 0,
            activeExams: 0,
            completedExams: 0,
            totalAttempts: 0,
            recentActivity: [],
          });
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading system dashboard metrics..." />;
  }

  const d = dashboardData || {};

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          System Oversight Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Real-time system statistics, faculty activity, and active examinations
        </Typography>
      </Box>

      {/* Primary Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard title="Total Students" value={d.totalStudents ?? 0} icon={<Users size={22} />} color="#1976d2" subtitle="Registered accounts" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard title="Total Teachers" value={d.totalTeachers ?? 0} icon={<UserCheck size={22} />} color="#2e7d32" subtitle="Faculty members" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard title="Total Subjects" value={d.totalSubjects ?? 0} icon={<BookOpen size={22} />} color="#9c27b0" subtitle="Academic courses" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard title="Total Exams" value={d.totalExams ?? 0} icon={<FileSpreadsheet size={22} />} color="#ed6c02" subtitle="Created examinations" />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DashboardCard title="Active Exams" value={d.activeExams ?? 0} icon={<PlayCircle size={22} />} color="#ed6c02" subtitle="Running right now" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DashboardCard title="Completed Exams" value={d.completedExams ?? 0} icon={<CheckCircle size={22} />} color="#2e7d32" subtitle="Finished assessments" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DashboardCard title="Total Submissions" value={d.totalAttempts ?? 0} icon={<Award size={22} />} color="#0288d1" subtitle="Student attempts" />
        </Grid>
      </Grid>

      {/* Recent Activity Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
          Recent System Activity Audit
        </Typography>
        <DataTable
          rows={d.recentActivity || []}
          columns={recentActivityCols}
          height={320}
          emptyMessage="No system audit activities recorded in database."
        />
      </Paper>
    </Box>
  );
}
