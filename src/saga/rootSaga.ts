import { all } from 'redux-saga/effects';
import { watchAuthSaga } from './saga-auth';
import { watchAdminSaga } from './saga-admin';
import { watchQuestionsSaga } from './saga-questions';
import { watchExamsSaga } from './saga-exams';

export default function* rootSaga() {
  yield all([
    watchAuthSaga(),
    watchAdminSaga(),
    watchQuestionsSaga(),
    watchExamsSaga(),
  ]);
}
