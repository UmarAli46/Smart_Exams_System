import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiGetQuestions, apiCreateQuestion, apiUpdateQuestion, apiDeleteQuestion } from '../api/api-questions';
import {
  fetchQuestionsStart,
  fetchQuestionsSuccess,
  fetchQuestionsError,
  upsertQuestionStart,
  upsertQuestionSuccess,
  deleteQuestionStart,
} from '../slice/slice-questions';
import { ensureArray } from '../lib/safeArray';
import type { Question, QuestionFormData } from '../types/question';

function* handleFetchQuestions(action: PayloadAction<Record<string, any> | undefined>): Generator<any, void, any> {
  try {
    const res: any = yield call(apiGetQuestions, action.payload);
    yield put(fetchQuestionsSuccess(ensureArray<Question>(res.data || res)));
  } catch {
    yield put(fetchQuestionsSuccess([]));
  }
}

function* handleUpsertQuestion(action: PayloadAction<QuestionFormData & { id?: number }>): Generator<any, void, any> {
  try {
    const { id, ...data } = action.payload;
    if (id) {
      yield call(apiUpdateQuestion, id, data as QuestionFormData);
    } else {
      yield call(apiCreateQuestion, data as QuestionFormData);
    }
    yield put(upsertQuestionSuccess());
    yield put(fetchQuestionsStart(undefined));
  } catch {
    yield put(upsertQuestionSuccess());
  }
}

function* handleDeleteQuestion(action: PayloadAction<number>): Generator<any, void, any> {
  try {
    yield call(apiDeleteQuestion, action.payload);
    yield put(fetchQuestionsStart(undefined));
  } catch {
    yield put(fetchQuestionsStart(undefined));
  }
}

export function* watchQuestionsSaga() {
  yield takeLatest(fetchQuestionsStart.type, handleFetchQuestions);
  yield takeLatest(upsertQuestionStart.type, handleUpsertQuestion);
  yield takeLatest(deleteQuestionStart.type, handleDeleteQuestion);
}
