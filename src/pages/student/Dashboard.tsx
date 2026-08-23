import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Paper, Button, Card, CardContent, Chip } from '@mui/material';
import { Award, PlayCircle, Calendar, CheckCircle, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../../component/shared/DashboardCard';
import FaceVerificationModal from '../../component/exam/FaceVerificationModal';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchExamsStart, fetchMyExamsStart } from '../../slice/slice-exams';
import type { RootState } from '../../store/store';

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((s: RootState) => s.auth);
  const { data: exams, myExams: history, loading } = useSelector((s: RootState) => s.exams);

  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchExamsStart());
    dispatch(fetchMyExamsStart());
  }, [dispatch]);

  const handleFaceVerifySuccess = () => {
    if (selectedExamId) {
      navigate(`/student/exams/${selectedExamId}/take`);
    }
  };

  const activeExam = (exams || []).find((e) => e.status === 'ACTIVE');
  const upcomingCount = (exams || []).filter((e) => e.status === 'UPCOMING').length;
  const historyList = history || [];
  const examsTaken = historyList.length;
  const passedCount = historyList.filter((h: any) => h.status === 'PASS' || h.score >= (h.passingMarks || 50)).length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          Welcome Back, {user?.name || 'Student'}!
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Track your active exams, upcoming schedules, and AI performance recommendations
        </Typography>
      </Box>

      {loading ? (
        <LoadingSpinner message="Fetching dashboard metrics..." />
      ) : (
        <>
          {/* Dynamic Top Stats */}
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DashboardCard title="Exams Taken" value={examsTaken} icon={<Award size={22} />} color="#1976d2" subtitle="Completed history" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DashboardCard title="Average Score" value={examsTaken > 0 ? "82.5%" : "N/A"} icon={<TrendingUp size={22} />} color="#2e7d32" subtitle="Across all subjects" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DashboardCard title="Exams Passed" value={passedCount} icon={<CheckCircle size={22} />} color="#2e7d32" subtitle="Passed assessments" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DashboardCard title="Upcoming" value={upcomingCount} icon={<Calendar size={22} />} color="#ed6c02" subtitle="Scheduled exams" />
            </Grid>
          </Grid>

          {/* Active Exam Banner */}
          {activeExam ? (
            <Paper sx={{ p: 3, mb: 4, bgcolor: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: '16px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Chip label="ACTIVE EXAM NOW" color="warning" size="small" sx={{ fontWeight: 700, mb: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
                    {activeExam.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subject: {activeExam.subject} | Duration: {activeExam.duration} mins | Questions: {activeExam.questionsCount}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ShieldCheck size={20} />}
                  onClick={() => setSelectedExamId(activeExam.id)}
                  sx={{ px: 3, fontWeight: 700 }}
                >
                  Verify Face & Start Exam
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f7fa', borderRadius: '16px' }}>
              <Typography variant="subtitle1" fontWeight={700}>
                No Active Examinations Open Right Now
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check upcoming schedules or review your performance history below.
              </Typography>
            </Paper>
          )}
        </>
      )}

      {/* Quick Navigation Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/student/exams/available')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <PlayCircle color="#1976d2" size={28} />
                <Typography variant="h6" fontWeight={700}>Available Exams</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Inspect all open exams ready for attempt right now.
              </Typography>
              <Button size="small" endIcon={<ArrowRight size={16} />}>Browse Available</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/student/performance')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <TrendingUp color="#2e7d32" size={28} />
                <Typography variant="h6" fontWeight={700}>My Performance</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View your score progression, strong & weak topic breakdown.
              </Typography>
              <Button size="small" color="success" endIcon={<ArrowRight size={16} />}>View Analytics</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/student/ai-recommendations')}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Sparkles color="#9c27b0" size={28} />
                <Typography variant="h6" fontWeight={700}>AI Recommendations</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Get AI-driven study recommendations based on your performance.
              </Typography>
              <Button size="small" color="secondary" endIcon={<ArrowRight size={16} />}>Check AI Guidance</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mandatory Face Verification Modal */}
      <FaceVerificationModal
        open={Boolean(selectedExamId)}
        studentName={user?.name || 'Student'}
        onSuccess={handleFaceVerifySuccess}
        onCancel={() => setSelectedExamId(null)}
      />
    </Box>
  );
}
