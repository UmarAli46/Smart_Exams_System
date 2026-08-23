import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper, LinearProgress, Stack } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DashboardCard from '../../component/shared/DashboardCard';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { Award, TrendingUp, FileSpreadsheet, CheckCircle, XCircle } from 'lucide-react';
import { apiGetTeacherAnalytics } from '../../api/api-results';

export interface TeacherAnalyticsData {
  avgScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  totalSubmissions: number;
  examScores: { exam: string; avgScore: number; passRate: number }[];
  topicAnalytics: { topic: string; score: number; level: string }[];
}

export default function TeacherAnalytics() {
  const [data, setData] = useState<TeacherAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiGetTeacherAnalytics()
      .then((res: any) => {
        if (mounted) {
          setData(res.data || res);
        }
      })
      .catch(() => {
        if (mounted) {
          setData({
            avgScore: 0,
            highestScore: 0,
            lowestScore: 0,
            passRate: 0,
            totalSubmissions: 0,
            examScores: [],
            topicAnalytics: [],
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
    return <LoadingSpinner message="Calculating faculty analytics from Spring Boot API..." />;
  }

  const examScoresData = data?.examScores || [];
  const topicAnalytics = data?.topicAnalytics || [];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          Faculty Performance Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Itemized score analysis, pass percentage trends, and weak topic insights
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <DashboardCard title="Avg Score" value={`${data?.avgScore ?? 0}%`} icon={<TrendingUp size={20} />} color="#1976d2" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <DashboardCard title="Highest Score" value={`${data?.highestScore ?? 0}%`} icon={<Award size={20} />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <DashboardCard title="Lowest Score" value={`${data?.lowestScore ?? 0}%`} icon={<XCircle size={20} />} color="#d32f2f" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <DashboardCard title="Pass Rate" value={`${data?.passRate ?? 0}%`} icon={<CheckCircle size={20} />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <DashboardCard title="Total Submissions" value={data?.totalSubmissions ?? 0} icon={<FileSpreadsheet size={20} />} color="#9c27b0" />
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
              Average Exam Performance Comparison
            </Typography>
            {examScoresData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={examScoresData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="exam" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#1976d2" radius={[6, 6, 0, 0]} name="Average Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">No examination scores in database yet.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
              Topic Mastery Level Analytics
            </Typography>
            {topicAnalytics.length > 0 ? (
              <Stack spacing={2.5}>
                {topicAnalytics.map((t) => (
                  <Box key={t.topic}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>{t.topic}</Typography>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={t.score >= 75 ? 'success.main' : t.score >= 60 ? 'warning.main' : 'error.main'}
                      >
                        {t.score}% ({t.level})
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={t.score}
                      color={t.score >= 75 ? 'success' : t.score >= 60 ? 'warning' : 'error'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">No topic analytics recorded.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
