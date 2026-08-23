import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper, LinearProgress } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import DashboardCard from '../../component/shared/DashboardCard';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { Users, UserCheck, FileSpreadsheet, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { apiGetAdminAnalytics } from '../../api/api-results';

export interface AdminAnalyticsData {
  totalStudents: number;
  totalTeachers: number;
  totalExams: number;
  totalAttempts: number;
  avgScore: number;
  passRate: number;
  attemptsGrowth: { month: string; attempts: number; passRate: number }[];
  subjectDistribution: { name: string; value: number; color: string }[];
  departmentPassRates: { dept: string; passRate: number }[];
}

export default function Analytics() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiGetAdminAnalytics()
      .then((res: any) => {
        if (mounted) {
          setData(res.data || res);
        }
      })
      .catch(() => {
        if (mounted) {
          setData({
            totalStudents: 0,
            totalTeachers: 0,
            totalExams: 0,
            totalAttempts: 0,
            avgScore: 0,
            passRate: 0,
            attemptsGrowth: [],
            subjectDistribution: [],
            departmentPassRates: [],
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
    return <LoadingSpinner message="Fetching institutional analytics from Spring Boot API..." />;
  }

  const attemptsData = data?.attemptsGrowth || [];
  const subjectDistribution = data?.subjectDistribution || [];
  const departmentPassRates = data?.departmentPassRates || [];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          System Analytics & Insights
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Institution-wide examination performance metrics and statistics
        </Typography>
      </Box>

      {/* Top Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <DashboardCard title="Students" value={data?.totalStudents ?? 0} icon={<Users size={20} />} color="#1976d2" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <DashboardCard title="Teachers" value={data?.totalTeachers ?? 0} icon={<UserCheck size={20} />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <DashboardCard title="Exams" value={data?.totalExams ?? 0} icon={<FileSpreadsheet size={20} />} color="#9c27b0" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <DashboardCard title="Attempts" value={data?.totalAttempts ?? 0} icon={<Award size={20} />} color="#ed6c02" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <DashboardCard title="Avg Score" value={`${data?.avgScore ?? 0}%`} icon={<TrendingUp size={20} />} color="#0288d1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2 }}>
          <DashboardCard title="Pass Rate" value={`${data?.passRate ?? 0}%`} icon={<CheckCircle size={20} />} color="#2e7d32" />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
              Exam Submissions & Growth Trend
            </Typography>
            {attemptsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={attemptsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attempts" fill="#1976d2" radius={[6, 6, 0, 0]} name="Exam Attempts" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">No submissions recorded in database yet.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
              Attempts by Subject
            </Typography>
            {subjectDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie data={subjectDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {subjectDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#1976d2'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">No subject distribution data.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Department Pass Rate Breakdown */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
          Departmental Academic Performance
        </Typography>
        {departmentPassRates.length > 0 ? (
          <Grid container spacing={3}>
            {departmentPassRates.map((d) => (
              <Grid size={{ xs: 12, sm: 6 }} key={d.dept}>
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{d.dept}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{d.passRate}% Pass Rate</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={d.passRate} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">No departmental analytics recorded.</Typography>
        )}
      </Paper>
    </Box>
  );
}
