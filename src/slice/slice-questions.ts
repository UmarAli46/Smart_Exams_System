import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question, QuestionFormData } from '../types/question';

interface QuestionsState {
  data: Question[];
  selectedQuestion: Question | null;
  loading: boolean;
  error: string | null;
  isSuccess: boolean;
}

const initialState: QuestionsState = {
  data: [],
  selectedQuestion: null,
  loading: false,
  error: null,
  isSuccess: false,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    fetchQuestionsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchQuestionsSuccess(state, action: PayloadAction<Question[]>) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchQuestionsError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    upsertQuestionStart(state, _action: PayloadAction<Partial<QuestionFormData> & { id?: number }>) {
      state.loading = true;
      state.isSuccess = false;
    },
    upsertQuestionSuccess(state) {
      state.loading = false;
      state.isSuccess = true;
    },
    deleteQuestionStart(state, _action: PayloadAction<number>) {
      state.loading = true;
    },
    setSelectedQuestion(state, action: PayloadAction<Question | null>) {
      state.selectedQuestion = action.payload;
    },
    clearSuccess(state) {
      state.isSuccess = false;
    },
  },
});

export const {
  fetchQuestionsStart,
  fetchQuestionsSuccess,
  fetchQuestionsError,
  upsertQuestionStart,
  upsertQuestionSuccess,
  deleteQuestionStart,
  setSelectedQuestion,
  clearSuccess,
} = questionsSlice.actions;

export default questionsSlice.reducer;
