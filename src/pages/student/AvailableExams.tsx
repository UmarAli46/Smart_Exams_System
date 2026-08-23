import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import { Clock, FileText, UserCheck, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FaceVerificationModal from '../../component/exam/FaceVerificationModal';
import StatusChip from '../../component/shared/StatusChip';
import EmptyState from '../../component/shared/EmptyState';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchExamsStart } from '../../slice/slice-exams';
import type { RootState } from '../../store/store';
import type { Exam } from '../../types/exam';

export default function AvailableExams() {
  const dispatch = useDispatch();
  const { data: exams, loading } = useSelector((s: RootState) => s.exams);

  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchExamsStart());
  }, [dispatch]);

  const handleFaceVerifySuccess = () => {
    if (selectedExamId) {
      navigate(`/student/exams/${selectedExamId}/take`);
    }
  };

  const activeExamsList = (exams || []).filter((e) => e.status === 'ACTIVE' || e.status === 'UPCOMING');

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          Available Examinations
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Exams open for attempt. Biometric face verification is required prior to entering the exam room.
        </Typography>
      </Box>

      {loading ? (
        <LoadingSpinner message="Checking available examinations..." />
      ) : activeExamsList.length === 0 ? (
        <Paper sx={{ p: 4 }}>
          <EmptyState
            title="No Examinations Available Right Now"
            subtitle="There are currently no active or open examinations scheduled for your account."
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {activeExamsList.map((e) => {
            const isActive = e.status === 'ACTIVE';
            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={e.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                    border: isActive ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Chip label={e.subject} color="primary" size="small" sx={{ fontWeight: 600 }} />
                      <StatusChip status={e.status} />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif', mb: 1 }}>
                      {e.name}
                    </Typography>

                    <Stack spacing={1} sx={{ color: 'text.secondary', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserCheck size={16} />
                        <Typography variant="body2">{e.teacherName}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock size={16} />
                        <Typography variant="body2">{e.duration} Minutes Duration</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FileText size={16} />
                        <Typography variant="body2">{e.questionsCount} Questions • {e.totalMarks} Marks</Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                      Attempts Allowed: {e.maxAttempts} | Biometric Verification Required
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={!isActive}
                      startIcon={<ShieldCheck size={18} />}
                      onClick={() => setSelectedExamId(e.id)}
                      sx={{ fontWeight: 700 }}
                    >
                      {isActive ? 'Verify Face & Start Exam' : 'Not Yet Available'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Facial Recognition Verification Modal */}
      <FaceVerificationModal
        open={Boolean(selectedExamId)}
        studentName="Alex Johnson"
        onSuccess={handleFaceVerifySuccess}
        onCancel={() => setSelectedExamId(null)}
      />
    </Box>
  );
}
