import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExamResult, StudentAnalytics } from '../types/result';

interface ResultsState {
  data: ExamResult[];
  latestResult: ExamResult | null;
  studentAnalytics: StudentAnalytics | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResultsState = {
  data: [],
  latestResult: null,
  studentAnalytics: null,
  loading: false,
  error: null,
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    addExamResult(state, action: PayloadAction<ExamResult>) {
      state.latestResult = action.payload;
      state.data = [action.payload, ...state.data];
    },
    fetchResultsStart(state, _action: PayloadAction<Record<string, any> | undefined>) {
      state.loading = true;
      state.error = null;
    },
    fetchResultsSuccess(state, action: PayloadAction<ExamResult[]>) {
      state.loading = false;
      state.data = action.payload;
      if (action.payload.length > 0) {
        state.latestResult = action.payload[0];
      }
    },
    fetchResultsError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchAnalyticsStart(state) {
      state.loading = true;
    },
    fetchAnalyticsSuccess(state, action: PayloadAction<StudentAnalytics>) {
      state.loading = false;
      state.studentAnalytics = action.payload;
    },
  },
});

export const {
  addExamResult,
  fetchResultsStart,
  fetchResultsSuccess,
  fetchResultsError,
  fetchAnalyticsStart,
  fetchAnalyticsSuccess,
} = resultsSlice.actions;

export default resultsSlice.reducer;
