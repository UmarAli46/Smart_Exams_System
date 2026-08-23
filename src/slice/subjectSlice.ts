/**
 * subjectSlice.ts
 * Redux slice for subject management.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Subject } from '@/types/user';

interface SubjectState {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: SubjectState = {
  subjects: [],
  loading: false,
  error: null,
  success: null,
};

const subjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    fetchSubjectsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSubjectsSuccess(state, action: PayloadAction<Subject[]>) {
      state.loading = false;
      state.subjects = action.payload;
    },
    fetchSubjectsError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addSubjectStart(state, _action: PayloadAction<Omit<Subject, 'id' | 'createdAt'>>) {
      state.loading = true;
      state.error = null;
    },
    addSubjectSuccess(state, action: PayloadAction<Subject>) {
      state.loading = false;
      state.subjects.push(action.payload);
      state.success = 'Subject added successfully';
    },
    updateSubjectStart(state, _action: PayloadAction<Subject>) {
      state.loading = true;
      state.error = null;
    },
    updateSubjectSuccess(state, action: PayloadAction<Subject>) {
      state.loading = false;
      const idx = state.subjects.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.subjects[idx] = action.payload;
      state.success = 'Subject updated successfully';
    },
    deleteSubjectStart(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    deleteSubjectSuccess(state, action: PayloadAction<number>) {
      state.loading = false;
      state.subjects = state.subjects.filter((s) => s.id !== action.payload);
      state.success = 'Subject deleted successfully';
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
  fetchSubjectsStart,
  fetchSubjectsSuccess,
  fetchSubjectsError,
  addSubjectStart,
  addSubjectSuccess,
  updateSubjectStart,
  updateSubjectSuccess,
  deleteSubjectStart,
  deleteSubjectSuccess,
  clearSuccess,
  clearError,
} = subjectSlice.actions;

export default subjectSlice.reducer;
