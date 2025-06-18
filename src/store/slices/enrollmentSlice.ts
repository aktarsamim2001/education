import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Enrollment {
  _id: string;
  userId: string;
  courseId: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
  };
  progress: number;
  completedLessons: Array<{
    lessonId: string;
    completedAt: string;
  }>;
  paymentStatus: string;
  certificateIssued: boolean;
  lastAccessedAt: string;
  createdAt: string;
}

interface EnrollmentState {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  loading: false,
  error: null,
};

export const enrollInCourse = createAsyncThunk(
  'enrollments/enrollInCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/enrollments/enroll/${courseId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enroll in course');
    }
  }
);

export const fetchUserEnrollments = createAsyncThunk(
  'enrollments/fetchUserEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/enrollments/my-courses');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrollments');
    }
  }
);

export const updateCourseProgress = createAsyncThunk(
  'enrollments/updateProgress',
  async (
    {
      courseId,
      progress,
      completedLessonId,
    }: {
      courseId: string;
      progress?: number;
      completedLessonId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(`/api/enrollments/progress/${courseId}`, {
        progress,
        completedLessonId,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update progress');
    }
  }
);

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Enroll in Course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments.unshift(action.payload);
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch User Enrollments
      .addCase(fetchUserEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchUserEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Progress
      .addCase(updateCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.enrollments.findIndex(
          (enrollment) => enrollment._id === action.payload._id
        );
        if (index !== -1) {
          state.enrollments[index] = action.payload;
        }
      })
      .addCase(updateCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;