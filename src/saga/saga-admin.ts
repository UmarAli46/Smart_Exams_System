import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  apiGetStudents,
  apiUpsertStudent,
  apiGetTeachers,
  apiUpsertTeacher,
  apiGetSubjects,
  apiUpsertSubject,
} from '../api/api-admin';
import {
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
} from '../slice/slice-admin';
import { ensureArray } from '../lib/safeArray';
import type { Student, Teacher, Subject } from '../types/user';

function* handleFetchStudents(action: PayloadAction<Record<string, any> | undefined>): Generator<any, void, any> {
  try {
    const res: any = yield call(apiGetStudents, action.payload);
    yield put(fetchStudentsSuccess(ensureArray<Student>(res.data || res)));
  } catch {
    yield put(fetchStudentsSuccess([]));
  }
}

function* handleFetchTeachers(action: PayloadAction<Record<string, any> | undefined>): Generator<any, void, any> {
  try {
    const res: any = yield call(apiGetTeachers, action.payload);
    yield put(fetchTeachersSuccess(ensureArray<Teacher>(res.data || res)));
  } catch {
    yield put(fetchTeachersSuccess([]));
  }
}

function* handleFetchSubjects(action: PayloadAction<Record<string, any> | undefined>): Generator<any, void, any> {
  try {
    const res: any = yield call(apiGetSubjects, action.payload);
    yield put(fetchSubjectsSuccess(ensureArray<Subject>(res.data || res)));
  } catch {
    yield put(fetchSubjectsSuccess([]));
  }
}

function* handleUpsertStudent(action: PayloadAction<Partial<Student>>): Generator<any, void, any> {
  try {
    yield call(apiUpsertStudent, action.payload);
    yield put(upsertStudentSuccess());
    yield put(fetchStudentsStart(undefined));
  } catch {
    yield put(upsertStudentSuccess());
  }
}

function* handleUpsertTeacher(action: PayloadAction<Partial<Teacher>>): Generator<any, void, any> {
  try {
    yield call(apiUpsertTeacher, action.payload);
    yield put(upsertTeacherSuccess());
    yield put(fetchTeachersStart(undefined));
  } catch {
    yield put(upsertTeacherSuccess());
  }
}

function* handleUpsertSubject(action: PayloadAction<Partial<Subject>>): Generator<any, void, any> {
  try {
    yield call(apiUpsertSubject, action.payload);
    yield put(upsertSubjectSuccess());
    yield put(fetchSubjectsStart(undefined));
  } catch {
    yield put(upsertSubjectSuccess());
  }
}

export function* watchAdminSaga() {
  yield takeLatest(fetchStudentsStart.type, handleFetchStudents);
  yield takeLatest(fetchTeachersStart.type, handleFetchTeachers);
  yield takeLatest(fetchSubjectsStart.type, handleFetchSubjects);
  yield takeLatest(upsertStudentStart.type, handleUpsertStudent);
  yield takeLatest(upsertTeacherStart.type, handleUpsertTeacher);
  yield takeLatest(upsertSubjectStart.type, handleUpsertSubject);
}
