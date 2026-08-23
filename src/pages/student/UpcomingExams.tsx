import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, Card, CardContent, Chip, Stack, Paper } from '@mui/material';
import { Calendar, Clock, UserCheck, Lock } from 'lucide-react';
import StatusChip from '../../component/shared/StatusChip';
import EmptyState from '../../component/shared/EmptyState';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchExamsStart } from '../../slice/slice-exams';
import type { RootState } from '../../store/store';

export default function UpcomingExams() {
  const dispatch = useDispatch();
  const { data: exams, loading } = useSelector((s: RootState) => s.exams);

  useEffect(() => {
    dispatch(fetchExamsStart());
  }, [dispatch]);

  const upcomingExams = (exams || []).filter((e) => e.status === 'UPCOMING');

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          Upcoming Examination Schedules
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Exams scheduled by faculty. The start button will unlock automatically when the window opens.
        </Typography>
      </Box>

      {loading ? (
        <LoadingSpinner message="Checking upcoming examination schedules..." />
      ) : upcomingExams.length === 0 ? (
        <Paper sx={{ p: 4 }}>
          <EmptyState
            title="No Upcoming Examinations Scheduled"
            subtitle="There are currently no upcoming exams scheduled for your courses."
          />
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {upcomingExams.map((e) => (
            <Grid size={{ xs: 12, md: 6 }} key={e.id}>
              <Card sx={{ p: 1, borderRadius: '16px', border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
                      <Calendar size={16} />
                      <Typography variant="body2">Starts: {e.startDate}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Clock size={16} />
                      <Typography variant="body2">Duration: {e.duration} minutes</Typography>
                    </Box>
                  </Stack>

                  <Chip
                    icon={<Lock size={14} />}
                    label="Locked until start window"
                    variant="outlined"
                    color="default"
                    sx={{ width: '100%', py: 2, fontWeight: 600 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
