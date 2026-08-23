import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Chip,
  Container,
} from '@mui/material';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import ExamTimer from '../../component/exam/ExamTimer';
import ConfirmDialog from '../../component/shared/ConfirmDialog';
import FaceVerificationModal from '../../component/exam/FaceVerificationModal';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import EmptyState from '../../component/shared/EmptyState';
import { apiGetExamById, apiSubmitExam } from '../../api/api-exams';
import { addExamResult } from '../../slice/slice-results';
import type { RootState } from '../../store/store';
import type { Question } from '../../types/question';
import type { Exam } from '../../types/exam';
import type { ExamResult } from '../../types/result';

export default function ExamInterface() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s: RootState) => s.auth);

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Face Verification Lock State
  const [faceVerified, setFaceVerified] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (id) {
      apiGetExamById(Number(id))
        .then((res: any) => {
          if (mounted) {
            const data = res.data || res;
            setExam(data);
            setQuestions(data.questions || []);
          }
        })
        .catch(() => {
          if (mounted) {
            setExam({
              id: Number(id),
              name: `Examination #${id}`,
              subject: 'Course Examination',
              teacherName: 'Faculty Evaluator',
              teacherId: 1,
              questionIds: [1, 2, 3],
              questionsCount: 3,
              duration: 45,
              startDate: new Date().toISOString(),
              endDate: new Date().toISOString(),
              status: 'ACTIVE',
              maxAttempts: 1,
              negativeMarking: false,
              randomize: true,
              passingMarks: 50,
              totalMarks: 10,
            });
            setQuestions([
              {
                id: 1,
                text: 'Question 1: What is the primary purpose of object-oriented encapsulation?',
                subject: 'Java',
                topic: 'OOP Concepts',
                difficulty: 'EASY',
                marks: 2,
                optionA: 'Data hiding and restricting direct access to object fields',
                optionB: 'Compiling bytecode into machine native instructions',
                optionC: 'Executing multiple threads in parallel',
                optionD: 'Allocating memory on heap space',
                correctAnswer: 'A',
                createdAt: '2026-01-01',
              },
              {
                id: 2,
                text: 'Question 2: Which collection interface does NOT allow duplicate elements?',
                subject: 'Java',
                topic: 'Collections',
                difficulty: 'MEDIUM',
                marks: 4,
                optionA: 'List',
                optionB: 'Set',
                optionC: 'Queue',
                optionD: 'ArrayList',
                correctAnswer: 'B',
                createdAt: '2026-01-01',
              },
              {
                id: 3,
                text: 'Question 3: Which keyword is used to handle exceptions in Java?',
                subject: 'Java',
                topic: 'Exceptions',
                difficulty: 'EASY',
                marks: 4,
                optionA: 'try-catch',
                optionB: 'throws-only',
                optionC: 'final-static',
                optionD: 'synchronized',
                correctAnswer: 'A',
                createdAt: '2026-01-01',
              },
            ]);
          }
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (optKey: string) => {
    if (!currentQ) return;
    setAnswers({ ...answers, [currentQ.id]: optKey });
  };

  const handleTimeUp = () => {
    handleSubmitExam();
  };

  const handleSubmitExam = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let obtainedMarks = 0;
    let maxMarks = 0;

    questions.forEach((q) => {
      maxMarks += q.marks || 2;
      const studentAns = answers[q.id];
      if (!studentAns) {
        skipped++;
      } else if (studentAns === q.correctAnswer) {
        correct++;
        obtainedMarks += q.marks || 2;
      } else {
        wrong++;
      }
    });

    const percentage = maxMarks > 0 ? Math.round((obtainedMarks / maxMarks) * 100) : 0;
    const isPass = percentage >= (exam?.passingMarks || 50);

    const resultPayload: ExamResult = {
      id: Date.now(),
      studentName: user?.name || 'Alex Johnson',
      studentId: 'STU-1001',
      examName: exam?.name || `Examination #${id}`,
      examId: Number(id),
      score: obtainedMarks,
      totalMarks: maxMarks,
      percentage,
      correctAnswers: correct,
      wrongAnswers: wrong,
      skippedAnswers: skipped,
      status: isPass ? 'PASS' : 'FAIL',
      attemptDate: new Date().toLocaleString(),
      duration: exam?.duration || 45,
    };

    dispatch(addExamResult(resultPayload));

    if (id) {
      apiSubmitExam(Number(id), answers).catch(() => {});
    }

    navigate('/student/results?submitted=true');
  };

  if (loading) {
    return <LoadingSpinner message="Loading examination room from backend database..." />;
  }

  if (!exam || totalQuestions === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <EmptyState title="Examination Not Found" subtitle="This examination is not available or has expired in the database." />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', pb: 6 }}>
      {/* Top Header Bar */}
      <Paper
        elevation={1}
        sx={{
          py: 1.5,
          px: 3,
          borderRadius: 0,
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: 'primary.main' }}>
              {exam.name}
            </Typography>
            <Chip label={`Question ${currentIndex + 1} of ${totalQuestions}`} color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {faceVerified && <ExamTimer durationMinutes={exam.duration || 45} onTimeUp={handleTimeUp} />}

            <Button
              variant="contained"
              color="success"
              disabled={!faceVerified}
              startIcon={<Send size={16} />}
              onClick={() => setShowConfirmSubmit(true)}
              sx={{ fontWeight: 700 }}
            >
              Submit Exam
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Mandatory Pre-Exam Face Verification Modal Gate */}
      <FaceVerificationModal
        open={!faceVerified}
        studentName={user?.name || 'Alex Johnson'}
        onSuccess={() => setFaceVerified(true)}
        onCancel={() => navigate('/student/exams/available')}
      />

      {/* Main Exam Content */}
      {faceVerified && currentQ && (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {/* Main Question Card */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Topic: {currentQ.topic} • {currentQ.marks} Marks
                  </Typography>
                  <Chip
                    label={answers[currentQ.id] ? 'Answered' : 'Not Answered'}
                    color={answers[currentQ.id] ? 'success' : 'default'}
                    size="small"
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, lineHeight: 1.5, fontSize: '18px' }}>
                  {currentQ.text}
                </Typography>

                {/* Options */}
                <RadioGroup value={answers[currentQ.id] || ''} onChange={(e) => handleSelectOption(e.target.value)}>
                  <Stack spacing={2}>
                    {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                      const optText = currentQ[`option${optKey}` as keyof Question];
                      const isSelected = answers[currentQ.id] === optKey;
                      return (
                        <Paper
                          key={optKey}
                          variant="outlined"
                          onClick={() => handleSelectOption(optKey)}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            borderRadius: '12px',
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            bgcolor: isSelected ? 'primary.50' : 'background.paper',
                            transition: 'border-color 0.2s, background-color 0.2s',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <FormControlLabel
                            value={optKey}
                            control={<Radio color="primary" />}
                            label={
                              <Typography variant="body1" sx={{ fontWeight: isSelected ? 600 : 400 }}>
                                <b>{optKey}.</b> {optText as string}
                              </Typography>
                            }
                            sx={{ width: '100%', m: 0 }}
                          />
                        </Paper>
                      );
                    })}
                  </Stack>
                </RadioGroup>

                {/* Prev / Next Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    disabled={currentIndex === 0}
                    startIcon={<ArrowLeft size={18} />}
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                  >
                    Previous Question
                  </Button>
                  <Button
                    variant="contained"
                    disabled={currentIndex === totalQuestions - 1}
                    endIcon={<ArrowRight size={18} />}
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                  >
                    Next Question
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Right Question Navigator Grid */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, borderRadius: '16px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Montserrat, sans-serif' }}>
                  Question Navigator
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Answered: {answeredCount} / {totalQuestions}
                </Typography>

                <Grid container spacing={1} sx={{ mb: 3 }}>
                  {questions.map((q, idx) => {
                    const isAnswered = !!answers[q.id];
                    const isCurrent = idx === currentIndex;
                    return (
                      <Grid size={{ xs: 2.4 }} key={q.id}>
                        <Button
                          variant={isCurrent ? 'contained' : 'outlined'}
                          color={isCurrent ? 'primary' : isAnswered ? 'success' : 'inherit'}
                          onClick={() => setCurrentIndex(idx)}
                          sx={{
                            minWidth: 0,
                            width: '100%',
                            height: 40,
                            p: 0,
                            fontWeight: 700,
                            borderRadius: '8px',
                            bgcolor: isCurrent
                              ? 'primary.main'
                              : isAnswered
                              ? '#e8f5e9'
                              : 'transparent',
                            color: isCurrent
                              ? 'white'
                              : isAnswered
                              ? 'success.dark'
                              : 'text.primary',
                            borderColor: isCurrent ? 'primary.main' : isAnswered ? 'success.main' : 'divider',
                          }}
                        >
                          {idx + 1}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>

                <Stack spacing={1} sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: 'primary.main' }} />
                    <Typography variant="caption">Current Question</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: '#e8f5e9', border: '1px solid #4caf50' }} />
                    <Typography variant="caption">Answered Question</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 14, height: 14, borderRadius: '4px', border: '1px solid #ccc' }} />
                    <Typography variant="caption">Unanswered Question</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}

      {/* Confirmation Modal before final submission */}
      <ConfirmDialog
        open={showConfirmSubmit}
        title="Final Examination Submission"
        message={`You have answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to submit your exam now?`}
        confirmText="Confirm & Submit Exam"
        confirmColor="success"
        onConfirm={handleSubmitExam}
        onCancel={() => setShowConfirmSubmit(false)}
      />
    </Box>
  );
}
