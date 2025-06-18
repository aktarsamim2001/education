import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

interface Webinar {
  _id: string;
  title: string;
  description: string;
  speaker: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  startTime: string;
  duration: number;
  link: string;
  attendees: string[];
  recordingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface WebinarState {
  webinars: Webinar[];
  webinar: Webinar | null;
  loading: boolean;
  error: string | null;
}

const initialState: WebinarState = {
  webinars: [],
  webinar: null,
  loading: false,
  error: null,
};

export const fetchWebinars = createAsyncThunk(
  'webinars/fetchWebinars',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/webinars');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch webinars');
    }
  }
);

export const fetchWebinarById = createAsyncThunk(
  'webinars/fetchWebinarById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/webinars/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch webinar');
    }
  }
);

export const createWebinar = createAsyncThunk(
  'webinars/createWebinar',
  async (webinarData: Partial<Webinar>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/webinars', webinarData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create webinar');
    }
  }
);

export const updateWebinar = createAsyncThunk(
  'webinars/updateWebinar',
  async ({ id, webinarData }: { id: string; webinarData: Partial<Webinar> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/webinars/${id}`, webinarData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update webinar');
    }
  }
);

export const deleteWebinar = createAsyncThunk(
  'webinars/deleteWebinar',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/webinars/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete webinar');
    }
  }
);

export const registerForWebinar = createAsyncThunk(
  'webinars/registerForWebinar',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/webinars/register/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register for webinar');
    }
  }
);

const webinarSlice = createSlice({
  name: 'webinars',
  initialState,
  reducers: {
    clearWebinar: (state) => {
      state.webinar = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Webinars
      .addCase(fetchWebinars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebinars.fulfilled, (state, action) => {
        state.loading = false;
        state.webinars = action.payload;
      })
      .addCase(fetchWebinars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Webinar by ID
      .addCase(fetchWebinarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebinarById.fulfilled, (state, action) => {
        state.loading = false;
        state.webinar = action.payload;
      })
      .addCase(fetchWebinarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Webinar
      .addCase(createWebinar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWebinar.fulfilled, (state, action) => {
        state.loading = false;
        state.webinars.unshift(action.payload);
      })
      .addCase(createWebinar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Webinar
      .addCase(updateWebinar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWebinar.fulfilled, (state, action) => {
        state.loading = false;
        state.webinars = state.webinars.map((webinar) =>
          webinar._id === action.payload._id ? action.payload : webinar
        );
        state.webinar = action.payload;
      })
      .addCase(updateWebinar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Webinar
      .addCase(deleteWebinar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWebinar.fulfilled, (state, action) => {
        state.loading = false;
        state.webinars = state.webinars.filter((webinar) => webinar._id !== action.payload);
        if (state.webinar?._id === action.payload) {
          state.webinar = null;
        }
      })
      .addCase(deleteWebinar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Register for Webinar
      .addCase(registerForWebinar.fulfilled, (state, action) => {
        const updatedWebinar = action.payload;
        state.webinars = state.webinars.map((webinar) =>
          webinar._id === updatedWebinar._id ? updatedWebinar : webinar
        );
        if (state.webinar?._id === updatedWebinar._id) {
          state.webinar = updatedWebinar;
        }
      });
  },
});

export const { clearWebinar, clearError } = webinarSlice.actions;
export default webinarSlice.reducer;