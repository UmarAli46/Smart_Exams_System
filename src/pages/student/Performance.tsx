import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Typography, Paper, LinearProgress, Stack, Chip, Button } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../../component/shared/DashboardCard';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import EmptyState from '../../component/shared/EmptyState';
import { Award, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { apiGetStudentAnalytics } from '../../api/api-results';
import type { RootState } from '../../store/store';
import type { StudentAnalytics } from '../../types/result';

export default function Performance() {
  const navigate = useNavigate();
  const { data: reduxResults } = useSelector((s: RootState) => s.results);

  const [data, setData] = useState<StudentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiGetStudentAnalytics()
      .then((res: any) => {
        if (mounted) {
          setData(res.data || res);
        }
      })
      .catch(() => {
        if (mounted) {
          if (reduxResults && reduxResults.length > 0) {
            const percentages = reduxResults.map((r) => r.percentage || 0);
            const totalPct = percentages.reduce((a, b) => a + b, 0);
            const avgPct = Math.round(totalPct / percentages.length);
            const highest = Math.max(...percentages);
            const lowest = Math.min(...percentages);
            const passCount = reduxResults.filter((r) => r.status === 'PASS').length;

            setData({
              overallPercentage: avgPct,
              averageScore: Math.round(avgPct * 0.5 * 10) / 10,
              examsAttempted: reduxResults.length,
              highestScore: highest,
              lowestScore: lowest,
              passCount,
              failCount: reduxResults.length - passCount,
              topicPerformance: [
                { topic: 'Object-Oriented Programming (OOP)', percentage: avgPct, level: avgPct >= 75 ? 'STRONG' : avgPct >= 50 ? 'AVERAGE' : 'WEAK' },
              ],
              recentResults: reduxResults,
            });
          } else {
            setData(null);
          }
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [reduxResults]);

  if (loading) {
    return <LoadingSpinner message="Calculating dynamic performance metrics..." />;
  }

  if (!data || data.examsAttempted === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <EmptyState
            title="No Performance Metrics Recorded"
            subtitle="You have not completed any examinations yet. Complete an exam to generate your score trajectory and topic performance breakdown."
            action={
              <Button variant="contained" onClick={() => navigate('/student/exams/available')} sx={{ mt: 2 }}>
                Browse Available Exams
              </Button>
            }
          />
        </Paper>
      </Box>
    );
  }

  const topicList = data.topicPerformance || [];
  const historyData = (data.recentResults || []).map((r) => ({
    exam: r.examName,
    score: r.percentage,
  }));

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          My Academic Performance Dashboard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Itemized tracking of score progression, topic mastery, and weak areas
        </Typography>
      </Box>

      {/* Dynamic Top Stats */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <DashboardCard title="Overall %" value={`${data.overallPercentage}%`} icon={<TrendingUp size={20} />} color="#1976d2" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <DashboardCard title="Average Score" value={`${data.averageScore}`} icon={<Award size={20} />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <DashboardCard title="Exams Attempted" value={data.examsAttempted} icon={<CheckCircle size={20} />} color="#9c27b0" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <DashboardCard title="Highest Score" value={`${data.highestScore}%`} icon={<Award size={20} />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 2.4 }}>
          <DashboardCard title="Lowest Score" value={`${data.lowestScore}%`} icon={<XCircle size={20} />} color="#ed6c02" />
        </Grid>
      </Grid>

      {/* Dynamic Line Chart & Topic Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
              Score Progress Trajectory Over Time
            </Typography>
            {historyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="exam" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#1976d2" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <Typography color="text.secondary">No historical evaluation trajectory data recorded yet.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Dynamic Topic Breakdown */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: 380 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
              Topic Mastery Level Breakdown
            </Typography>
            <Stack spacing={2.5}>
              {topicList.map((t) => {
                const color = t.level === 'STRONG' ? 'success' : t.level === 'AVERAGE' ? 'warning' : 'error';
                return (
                  <Box key={t.topic}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>{t.topic}</Typography>
                      <Chip label={`${t.percentage}% • ${t.level}`} color={color as any} size="small" sx={{ fontWeight: 700 }} />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={t.percentage}
                      color={color as any}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
