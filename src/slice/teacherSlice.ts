/**
 * teacherSlice.ts
 * Redux slice for teacher management.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Teacher } from '@/types/user';

interface TeacherState {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: TeacherState = {
  teachers: [],
  loading: false,
  error: null,
  success: null,
};

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    fetchTeachersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTeachersSuccess(state, action: PayloadAction<Teacher[]>) {
      state.loading = false;
      state.teachers = action.payload;
    },
    fetchTeachersError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addTeacherStart(state, _action: PayloadAction<Omit<Teacher, 'id' | 'createdAt'>>) {
      state.loading = true;
      state.error = null;
    },
    addTeacherSuccess(state, action: PayloadAction<Teacher>) {
      state.loading = false;
      state.teachers.push(action.payload);
      state.success = 'Teacher added successfully';
    },
    updateTeacherStart(state, _action: PayloadAction<Teacher>) {
      state.loading = true;
      state.error = null;
    },
    updateTeacherSuccess(state, action: PayloadAction<Teacher>) {
      state.loading = false;
      const idx = state.teachers.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.teachers[idx] = action.payload;
      state.success = 'Teacher updated successfully';
    },
    deleteTeacherStart(state, _action: PayloadAction<number>) {
      state.loading = true;
      state.error = null;
    },
    deleteTeacherSuccess(state, action: PayloadAction<number>) {
      state.loading = false;
      state.teachers = state.teachers.filter((t) => t.id !== action.payload);
      state.success = 'Teacher deleted successfully';
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
  fetchTeachersStart,
  fetchTeachersSuccess,
  fetchTeachersError,
  addTeacherStart,
  addTeacherSuccess,
  updateTeacherStart,
  updateTeacherSuccess,
  deleteTeacherStart,
  deleteTeacherSuccess,
  clearSuccess,
  clearError,
} = teacherSlice.actions;

export default teacherSlice.reducer;
