/**
 * studentSlice.ts
 * Redux slice for student management.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Student } from '@/types/user';

interface StudentState {
  students: Student[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: StudentState = {
  students: [],
  loading: false,
  error: null,
  success: null,
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    fetchStudentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchStudentsSuccess(state, action: PayloadAction<Student[]>) {
      state.loading = false;
      state.students = action.payload;
    },
    fetchStudentsError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addStudentStart(state, _action: PayloadAction<Omit<Student, 'id' | 'createdAt'>>) {
      state.loading = true;
      state.error = null;
    },
    addStudentSuccess(state, action: PayloadAction<Student>) {
      state.loading = false;
      state.students.push(action.payload);
      state.success = 'Student added successfully';
    },
    updateStudentStart(state, _action: PayloadAction<Student>) {
      state.loading = true;
      state.error = null;
    },
    updateStudentSuccess(state, action: PayloadAction<Student>) {
      state.loading = false;
      const idx = state.students.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) state.students[idx] = action.payload;
      state.success = 'Student updated successfully';
    },
    deleteStudentStart(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    deleteStudentSuccess(state, action: PayloadAction<number>) {
      state.loading = false;
      state.students = state.students.filter((s) => s.id !== action.payload);
      state.success = 'Student deleted successfully';
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
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsError,
  addStudentStart,
  addStudentSuccess,
  updateStudentStart,
  updateStudentSuccess,
  deleteStudentStart,
  deleteStudentSuccess,
  clearSuccess,
  clearError,
} = studentSlice.actions;

export default studentSlice.reducer;
