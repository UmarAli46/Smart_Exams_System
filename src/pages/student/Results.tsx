import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import { ArrowRight } from 'lucide-react';
import EmptyState from '../../component/shared/EmptyState';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { apiGetResultById, apiGetMyResults } from '../../api/api-results';
import type { RootState } from '../../store/store';
import type { ExamResult } from '../../types/result';

export default function StudentResults() {
  const [searchParams] = useSearchParams();
  const resultId = searchParams.get('resultId');
  const navigate = useNavigate();

  const { latestResult } = useSelector((s: RootState) => s.results);

  const [result, setResult] = useState<ExamResult | null>(latestResult);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (resultId) {
      setLoading(true);
      apiGetResultById(Number(resultId))
        .then((res: any) => {
          if (mounted) setResult(res.data || res);
        })
        .catch(() => {})
        .finally(() => {
          if (mounted) setLoading(false);
        });
    } else if (!latestResult) {
      setLoading(true);
      apiGetMyResults()
        .then((res: any) => {
          if (mounted) {
            const list = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
            setResult(list[0] || null);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (mounted) setLoading(false);
        });
    } else {
      setResult(latestResult);
    }

    return () => {
      mounted = false;
    };
  }, [resultId, latestResult]);

  if (loading) {
    return <LoadingSpinner message="Fetching examination results from database..." />;
  }

  if (!result) {
    return (
      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
        <EmptyState
          title="No Examination Results Found"
          subtitle="You have not submitted any examinations yet. Please go to Available Exams to start an exam."
          action={
            <Button variant="contained" onClick={() => navigate('/student/exams/available')} sx={{ mt: 2 }}>
              Browse Available Exams
            </Button>
          }
        />
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: 'primary.main' }}>
          Examination Results Summary
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {result.examName} — Evaluation calculated dynamically from student submission
        </Typography>
      </Box>

      {/* Dynamic Score Banner */}
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Chip
            label={result.status}
            color={result.status === 'PASS' ? 'success' : 'error'}
            sx={{ fontSize: '16px', fontWeight: 800, px: 2, py: 2.5, borderRadius: '12px' }}
          />
        </Box>

        <Typography variant="h2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
          {result.score} / {result.totalMarks}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: result.status === 'PASS' ? 'success.main' : 'error.main', mb: 3 }}>
          {result.percentage}% Final Percentage
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: '12px' }}>
              <Typography variant="h5" fontWeight={700} color="success.main">{result.correctAnswers}</Typography>
              <Typography variant="caption" color="text.secondary">Correct Choices</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: '12px' }}>
              <Typography variant="h5" fontWeight={700} color="error.main">{result.wrongAnswers}</Typography>
              <Typography variant="caption" color="text.secondary">Wrong Choices</Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: '12px' }}>
              <Typography variant="h5" fontWeight={700} color="text.secondary">{result.skippedAnswers}</Typography>
              <Typography variant="caption" color="text.secondary">Skipped Choices</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="outlined" onClick={() => navigate('/student/dashboard')}>
          Return to Dashboard
        </Button>
        <Button variant="contained" endIcon={<ArrowRight size={18} />} onClick={() => navigate('/student/ai-recommendations')}>
          View AI Study Guidance
        </Button>
      </Stack>
    </Box>
  );
}
