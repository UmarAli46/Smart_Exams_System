/**
 * examSlice.ts
 * Redux slice for exam management.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Exam } from '@/types/exam';

interface ExamState {
  exams: Exam[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ExamState = {
  exams: [],
  loading: false,
  error: null,
  success: null,
};

const examSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    fetchExamsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchExamsSuccess(state, action: PayloadAction<Exam[]>) {
      state.loading = false;
      state.exams = action.payload;
    },
    fetchExamsError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearSuccess(state) {
      state.success = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  fetchExamsStart,
  fetchExamsSuccess,
  fetchExamsError,
  clearSuccess,
  clearError,
} = examSlice.actions;

export default examSlice.reducer;
