import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiGetExams, apiGetMyExams, apiStartExam, apiSubmitExam } from '../api/api-exams';
import {
  fetchExamsStart,
  fetchExamsSuccess,
  fetchMyExamsStart,
  fetchMyExamsSuccess,
  startExamStart,
  startExamSuccess,
  submitExamStart,
  submitExamSuccess,
} from '../slice/slice-exams';
import { ensureArray } from '../lib/safeArray';
import type { Exam, ExamAttempt } from '../types/exam';

function* handleFetchExams(action: PayloadAction<Record<string, any> | undefined>): Generator<any, void, any> {
  try {
    const res: any = yield call(apiGetExams, action.payload);
    yield put(fetchExamsSuccess(ensureArray<Exam>(res.data || res)));
  } catch {
    yield put(fetchExamsSuccess([]));
  }
}

function* handleFetchMyExams(): Generator<any, void, any> {
  try {
    const res: any = yield call(apiGetMyExams);
    yield put(fetchMyExamsSuccess(ensureArray<Exam>(res.data || res)));
  } catch {
    yield put(fetchMyExamsSuccess([]));
  }
}

function* handleStartExam(action: PayloadAction<number>): Generator<any, void, any> {
  try {
    const res: any = yield call(apiStartExam, action.payload);
    yield put(startExamSuccess(res.data || res));
  } catch {
    const mockAttempt: ExamAttempt = {
      id: Date.now(),
      examId: action.payload,
      studentId: 1,
      startedAt: new Date().toISOString(),
      answers: {},
    };
    yield put(startExamSuccess(mockAttempt));
  }
}

function* handleSubmitExam(action: PayloadAction<{ examId: number; answers: Record<number, string> }>): Generator<any, void, any> {
  try {
    yield call(apiSubmitExam, action.payload.examId, action.payload.answers);
    yield put(submitExamSuccess());
  } catch {
    yield put(submitExamSuccess());
  }
}

export function* watchExamsSaga() {
  yield takeLatest(fetchExamsStart.type, handleFetchExams);
  yield takeLatest(fetchMyExamsStart.type, handleFetchMyExams);
  yield takeLatest(startExamStart.type, handleStartExam);
  yield takeLatest(submitExamStart.type, handleSubmitExam);
}
