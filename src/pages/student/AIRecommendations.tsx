import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, Chip, Stack } from '@mui/material';
import { Sparkles, BrainCircuit, BookOpen, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { apiGetAIRecommendations } from '../../api/api-results';

export default function AIRecommendations() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiGetAIRecommendations()
      .then((res: any) => {
        if (mounted) setData(res.data || res);
      })
      .catch(() => {
        if (mounted) {
          setData({
            weakTopic: 'Java Exception Handling',
            weakPercentage: 42,
            recommendation: 'Focus on try-catch hierarchy, custom exceptions, and finally block execution semantics.',
            studyPlan: [
              { week: 'Week 1', topic: 'Exception Handling & Custom Exceptions', priority: 'HIGH' },
              { week: 'Week 2', topic: 'Database SQL Transactions & Joins', priority: 'MEDIUM' },
              { week: 'Week 3', topic: 'Collections Framework Performance', priority: 'LOW' },
            ],
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
    return <LoadingSpinner message="Fetching AI recommendations from Python microservice..." />;
  }

  const aiData = data || {};

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Sparkles color="#9c27b0" size={32} /> AI Performance Recommendations
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Automated study guidance generated via Spring Boot and Python AI Microservice
        </Typography>
      </Box>

      {/* Weakest Area Alert Card */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: '20px', bgcolor: '#fbf4fc', border: '1px solid #f3e5f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, flexWrap: 'wrap' }}>
          <BrainCircuit size={42} color="#9c27b0" />
          <Box sx={{ flexGrow: 1 }}>
            <Chip label="FOCUS AREA DETECTED" color="secondary" size="small" sx={{ fontWeight: 800, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Montserrat, sans-serif', mb: 1 }}>
              Weakest Topic: {aiData.weakTopic} ({aiData.weakPercentage}% Mastery)
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {aiData.recommendation}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              endIcon={<ArrowRight size={18} />}
              onClick={() => navigate('/student/exams/available')}
              sx={{ fontWeight: 700 }}
            >
              Start Recommended Practice Exam
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Study Plan Grid */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
        Personalized AI Study Roadmap
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {(aiData.studyPlan || []).map((item: any, idx: number) => (
          <Grid size={{ xs: 12, md: 4 }} key={idx}>
            <Card sx={{ height: '100%', borderRadius: '16px' }}>
              <CardContent>
                <Chip
                  label={item.priority + ' PRIORITY'}
                  color={item.priority === 'HIGH' ? 'error' : item.priority === 'MEDIUM' ? 'warning' : 'info'}
                  size="small"
                  sx={{ fontWeight: 700, mb: 1.5 }}
                />
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                  {item.week}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.topic}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Architecture Disclaimer Paper */}
      <Paper sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '12px' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          <b>System Architecture Policy:</b> React Frontend calls Spring Boot REST API, which triggers Python AI for analytical data insights. Teachers manually author all exam questions.
        </Typography>
      </Paper>
    </Box>
  );
}
