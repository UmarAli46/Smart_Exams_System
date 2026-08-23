import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Stack,
  Alert,
} from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { upsertQuestionStart } from '../../slice/slice-questions';
import type { QuestionFormData } from '../../types/question';

const questionSchema = z.object({
  subject: z.string().min(1, 'Subject required'),
  topic: z.string().min(1, 'Topic required'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  marks: z.number().min(1, 'Marks must be at least 1').max(20),
  text: z.string().min(10, 'Question text must be at least 10 characters'),
  optionA: z.string().min(1, 'Option A required'),
  optionB: z.string().min(1, 'Option B required'),
  optionC: z.string().min(1, 'Option C required'),
  optionD: z.string().min(1, 'Option D required'),
  correctAnswer: z.enum(['A', 'B', 'C', 'D']),
});

export default function CreateQuestion() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      subject: 'Java Programming',
      topic: '',
      difficulty: 'EASY',
      marks: 2,
      text: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
    },
  });

  const watchAll = watch();

  const onSubmit = (data: QuestionFormData) => {
    dispatch(upsertQuestionStart({ id: editId ? Number(editId) : undefined, ...data }));
    navigate('/teacher/questions');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate('/teacher/questions')}>
          Back to Question Bank
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
          {editId ? 'Edit Manual Question' : 'Manual Question Creation'}
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <b>Strict Business Policy:</b> Teachers must manually author all official examination questions. AI automatic question generation is prohibited.
      </Alert>

      <Grid container spacing={3}>
        {/* Form Inputs */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
              Question Configuration & Options
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Subject" fullWidth>
                      {['Java Programming', 'Database Management Systems', 'Data Structures & Algorithms', 'Web Development', 'Python for AI'].map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="topic"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField {...field} label="Topic Name" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} select label="Difficulty Level" fullWidth>
                      <MenuItem value="EASY">Easy</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="HARD">Hard</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="marks"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Marks"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Controller
              name="text"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Question Statement"
                  multiline
                  rows={3}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  sx={{ mb: 3 }}
                />
              )}
            />

            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Answer Choices (Multiple Choice Options):
            </Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              {(['A', 'B', 'C', 'D'] as const).map((key) => (
                <Controller
                  key={key}
                  name={`option${key}` as keyof QuestionFormData}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label={`Option ${key}`}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />
              ))}
            </Stack>

            <Controller
              name="correctAnswer"
              control={control}
              render={({ field }) => (
                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1 }}>
                    Correct Answer Choice:
                  </FormLabel>
                  <RadioGroup row {...field}>
                    <FormControlLabel value="A" control={<Radio color="success" />} label="Option A" />
                    <FormControlLabel value="B" control={<Radio color="success" />} label="Option B" />
                    <FormControlLabel value="C" control={<Radio color="success" />} label="Option C" />
                    <FormControlLabel value="D" control={<Radio color="success" />} label="Option D" />
                  </RadioGroup>
                </FormControl>
              )}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => navigate('/teacher/questions')}>Cancel</Button>
              <Button type="submit" variant="contained" startIcon={<Save size={18} />}>
                Save Question to Database
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Live Preview Panel */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontFamily: 'Montserrat, sans-serif' }}>
              Student View Preview
            </Typography>

            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              {watchAll.text || 'Question statement preview will appear here...'}
            </Typography>

            <Stack spacing={1}>
              {(['A', 'B', 'C', 'D'] as const).map((key) => {
                const optVal = watchAll[`option${key}` as keyof QuestionFormData];
                const isSelected = watchAll.correctAnswer === key;
                return (
                  <Paper
                    key={key}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderColor: isSelected ? 'success.main' : 'divider',
                      bgcolor: isSelected ? '#e8f5e9' : 'white',
                    }}
                  >
                    <Typography variant="body2">
                      <b>{key}.</b> {optVal || `Option ${key} text`} {isSelected && '✓'}
                    </Typography>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
