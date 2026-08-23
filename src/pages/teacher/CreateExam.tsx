import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Checkbox,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
} from '@mui/material';
import { ArrowLeft, ArrowRight, Save, ShieldCheck } from 'lucide-react';
import SearchBar from '../../component/shared/SearchBar';
import LoadingSpinner from '../../component/shared/LoadingSpinner';
import { fetchQuestionsStart } from '../../slice/slice-questions';
import type { RootState } from '../../store/store';
import type { Question } from '../../types/question';

export default function CreateExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: questions, loading: questionsLoading } = useSelector((s: RootState) => s.questions);

  const [activeStep, setActiveStep] = useState(0);

  // Step 1 State
  const [examName, setExamName] = useState('');
  const [subject, setSubject] = useState('Java Programming');
  const [description, setDescription] = useState('');

  // Step 2 State (Selected Question IDs)
  const [selectedQIds, setSelectedQIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  // Step 3 State (Exam Configuration & Rules)
  const [duration, setDuration] = useState(45);
  const [passingMarks, setPassingMarks] = useState(50);
  const [startDate, setStartDate] = useState('2026-03-01T09:00');
  const [endDate, setEndDate] = useState('2026-03-05T18:00');
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [randomize, setRandomize] = useState(true);
  const [negativeMarking, setNegativeMarking] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchQuestionsStart());
  }, [dispatch]);

  const handleToggleQuestion = (id: number) => {
    if (selectedQIds.includes(id)) {
      setSelectedQIds(selectedQIds.filter((qId) => qId !== id));
    } else {
      setSelectedQIds([...selectedQIds, id]);
    }
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    if (activeStep === 0) {
      if (!examName.trim()) {
        setErrorMsg('Exam title is required.');
        return;
      }
    } else if (activeStep === 1) {
      if (selectedQIds.length === 0) {
        setErrorMsg('Please select at least 1 question from your question bank for this examination.');
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleCreateExam = () => {
    // Dispatch exam creation payload
    navigate('/teacher/exams');
  };

  const filteredQuestions = (questions || []).filter(
    (q) =>
      q.text?.toLowerCase().includes(search.toLowerCase()) ||
      q.topic?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedQuestionsList = (questions || []).filter((q) => selectedQIds.includes(q.id));
  const totalSelectedMarks = selectedQuestionsList.reduce((acc, q) => acc + (q.marks || 2), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/teacher/exams')}>
          Back to My Exams
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          Create New Examination
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        <Step><StepLabel>1. Basic Info</StepLabel></Step>
        <Step><StepLabel>2. Select Questions</StepLabel></Step>
        <Step><StepLabel>3. Exam Rules & Security</StepLabel></Step>
      </Stepper>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 3, fontWeight: 600 }}>
          {errorMsg}
        </Alert>
      )}

      {/* STEP 1 */}
      {activeStep === 0 && (
        <Paper sx={{ p: 3, maxWidth: 650, mx: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
            Step 1: Basic Examination Information
          </Typography>

          <Stack spacing={2.5}>
            <TextField
              label="Examination Title *"
              placeholder="e.g. Java OOP Midterm Spring 2026"
              fullWidth
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />

            <TextField
              select
              label="Subject *"
              fullWidth
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {['Java Programming', 'Database Management Systems', 'Data Structures & Algorithms', 'Web Development', 'Python for AI'].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Description / Special Instructions"
              multiline
              rows={3}
              placeholder="Provide student instructions, rules, or syllabus scope..."
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </Paper>
      )}

      {/* STEP 2 */}
      {activeStep === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
              Step 2: Select Manual Questions ({selectedQIds.length} Selected • {totalSelectedMarks} Total Marks)
            </Typography>
            <SearchBar value={search} onChange={setSearch} placeholder="Filter question text or topic..." />
          </Box>

          {questionsLoading ? (
            <LoadingSpinner message="Fetching questions from question bank..." />
          ) : (
            <Paper sx={{ p: 2, maxH: 450, overflowY: 'auto' }}>
              <Stack spacing={1.5}>
                {filteredQuestions.map((q) => {
                  const isChecked = selectedQIds.includes(q.id);
                  return (
                    <Paper
                      key={q.id}
                      variant="outlined"
                      onClick={() => handleToggleQuestion(q.id)}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        borderColor: isChecked ? 'primary.main' : 'divider',
                        bgcolor: isChecked ? '#e3f2fd' : 'white',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Checkbox checked={isChecked} color="primary" sx={{ p: 0, mt: 0.5 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip label={q.subject} color="primary" size="small" />
                            <Chip label={q.topic} variant="outlined" size="small" />
                            <Chip label={`${q.marks} Marks`} color="secondary" size="small" />
                            <Chip label={q.difficulty} size="small" />
                          </Box>
                          <Typography variant="body1" fontWeight={600}>
                            {q.text}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </Paper>
          )}
        </Box>
      )}

      {/* STEP 3 */}
      {activeStep === 2 && (
        <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
            Step 3: Examination Settings & Security Rules
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Duration (Minutes) *"
                fullWidth
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                label="Passing Score Percentage (%) *"
                fullWidth
                value={passingMarks}
                onChange={(e) => setPassingMarks(Number(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="datetime-local"
                label="Start Date & Time *"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="datetime-local"
                label="End Date & Time *"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Maximum Allowed Attempts *"
                fullWidth
                value={maxAttempts}
                onChange={(e) => setMaxAttempts(Number(e.target.value))}
              >
                {[1, 2, 3, 5].map((n) => (
                  <MenuItem key={n} value={n}>{n} {n === 1 ? 'Attempt' : 'Attempts'}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={<Switch checked={randomize} onChange={(e) => setRandomize(e.target.checked)} color="primary" />}
                label="Randomize Question Order"
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={<Switch checked={negativeMarking} onChange={(e) => setNegativeMarking(e.target.checked)} color="error" />}
                label="Enable Negative Marking (-0.25 penalty for incorrect choices)"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Paper sx={{ p: 2, bgcolor: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '12px' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.dark' }}>
              <ShieldCheck size={18} /> Biometric Facial Recognition Gate Enabled
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Students will be required to pass live biometric facial recognition verification before entering this examination room.
            </Typography>
          </Paper>
        </Paper>
      )}

      {/* Stepper Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>
          Back
        </Button>
        {activeStep < 2 ? (
          <Button variant="contained" endIcon={<ArrowRight size={18} />} onClick={handleNextStep}>
            Next Step
          </Button>
        ) : (
          <Button variant="contained" color="success" startIcon={<Save size={18} />} onClick={handleCreateExam} sx={{ fontWeight: 700 }}>
            Create & Save Examination
          </Button>
        )}
      </Box>
    </Box>
  );
}
