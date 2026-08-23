import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../saga/rootSaga';
import authReducer from '../slice/slice-auth';
import adminReducer from '../slice/slice-admin';
import questionsReducer from '../slice/slice-questions';
import examsReducer from '../slice/slice-exams';
import resultsReducer from '../slice/slice-results';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    questions: questionsReducer,
    exams: examsReducer,
    results: resultsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
