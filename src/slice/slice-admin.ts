import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Student, Teacher, Subject } from '../types/user';

interface AdminState {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  isSuccess: boolean;
}

const initialState: AdminState = {
  students: [],
  teachers: [],
  subjects: [],
  loading: false,
  error: null,
  isSuccess: false,
};

const adminSlice = createSlice({
  name: 'admin',
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
    upsertStudentStart(state, _action: PayloadAction<Partial<Student>>) {
      state.loading = true;
      state.isSuccess = false;
    },
    upsertStudentSuccess(state) {
      state.loading = false;
      state.isSuccess = true;
    },
    upsertTeacherStart(state, _action: PayloadAction<Partial<Teacher>>) {
      state.loading = true;
      state.isSuccess = false;
    },
    upsertTeacherSuccess(state) {
      state.loading = false;
      state.isSuccess = true;
    },
    upsertSubjectStart(state, _action: PayloadAction<Partial<Subject>>) {
      state.loading = true;
      state.isSuccess = false;
    },
    upsertSubjectSuccess(state) {
      state.loading = false;
      state.isSuccess = true;
    },
    clearSuccess(state) {
      state.isSuccess = false;
    },
  },
});

export const {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsError,
  fetchTeachersStart,
  fetchTeachersSuccess,
  fetchTeachersError,
  fetchSubjectsStart,
  fetchSubjectsSuccess,
  fetchSubjectsError,
  upsertStudentStart,
  upsertStudentSuccess,
  upsertTeacherStart,
  upsertTeacherSuccess,
  upsertSubjectStart,
  upsertSubjectSuccess,
  clearSuccess,
} = adminSlice.actions;

export default adminSlice.reducer;
