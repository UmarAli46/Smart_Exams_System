import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exam, ExamAttempt } from '../types/exam';

interface ExamsState {
  data: Exam[];
  myExams: Exam[];
  activeExam: Exam | null;
  currentAttempt: ExamAttempt | null;
  loading: boolean;
  error: string | null;
  isSuccess: boolean;
}

const initialState: ExamsState = {
  data: [],
  myExams: [],
  activeExam: null,
  currentAttempt: null,
  loading: false,
  error: null,
  isSuccess: false,
};

const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    fetchExamsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchExamsSuccess(state, action: PayloadAction<Exam[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchExamsError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMyExamsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMyExamsSuccess(state, action: PayloadAction<Exam[]>) {
      state.loading = false;
      state.myExams = action.payload;
    },
    setActiveExam(state, action: PayloadAction<Exam | null>) {
      state.activeExam = action.payload;
    },
    startExamStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    startExamSuccess(state, action: PayloadAction<ExamAttempt>) {
      state.loading = false;
      state.currentAttempt = action.payload;
    },
    submitExamStart(state, _action: PayloadAction<{ examId: number; answers: Record<number, string> }>) {
      state.loading = true;
      state.isSuccess = false;
    },
    submitExamSuccess(state) {
      state.loading = false;
      state.isSuccess = true;
      state.currentAttempt = null;
    },
    clearSuccess(state) {
      state.isSuccess = false;
    },
  },
});

export const {
  fetchExamsStart,
  fetchExamsSuccess,
  fetchExamsError,
  fetchMyExamsStart,
  fetchMyExamsSuccess,
  setActiveExam,
  startExamStart,
  startExamSuccess,
  submitExamStart,
  submitExamSuccess,
  clearSuccess,
} = examsSlice.actions;

export default examsSlice.reducer;
