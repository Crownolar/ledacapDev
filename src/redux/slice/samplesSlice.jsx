import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchStates = createAsyncThunk(
  "samples/fetchStates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/states");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch states"
      );
    }
  }
);

export const fetchMarkets = createAsyncThunk(
  "samples/fetchMarkets",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/markets");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch markets"
      );
    }
  }
);

export const fetchSamples = createAsyncThunk(
  "samples/fetchSamples",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/samples");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch samples"
      );
    }
  }
);

export const createSample = createAsyncThunk(
  "samples/createSample",
  async (formData, { rejectWithValue }) => {
    try {
      const payload = formData.isRegistered
        ? {
            stateId: formData.stateId,
            lgaId: formData.lgaId,
            marketId: formData.marketId,
            vendorType: formData.vendorType,
            productName: formData.productName,
            productType: formData.productType,
            price: parseFloat(formData.price),
            brandName: formData.brandName,
            batchNumber: formData.batchNumber,
            isRegistered: true,
            sonNumber: formData.sonNumber,
          }
        : {
            stateId: formData.stateId,
            lgaId: formData.lgaId,
            marketId: formData.marketId,
            vendorType: formData.vendorType,
            productName: formData.productName,
            productType: formData.productType,
            price: parseFloat(formData.price),
            brandName: formData.brandName || "",
            batchNumber: formData.batchNumber || "",
            gpsLatitude: formData.gpsLatitude
              ? parseFloat(formData.gpsLatitude)
              : null,
            gpsLongitude: formData.gpsLongitude
              ? parseFloat(formData.gpsLongitude)
              : null,
            isRegistered: false,
            vendorTypeOther:
              formData.vendorType === "OTHER"
                ? formData.vendorTypeOther
                : undefined,
            productPhotoUrl: formData.productPhoto || "",
          };

      const response = await api.post("/samples", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create sample"
      );
    }
  }
);

const initialState = {
  samples: [],
  states: [],
  markets: [],
  loading: false,
  error: null,
};

const samplesSlice = createSlice({
  name: "samples",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSamples.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSamples.fulfilled, (state, action) => {
        state.loading = false;
        state.samples = action.payload;
      })
      .addCase(fetchSamples.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSample.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSample.fulfilled, (state, action) => {
        state.loading = false;
        state.samples.unshift(action.payload);
      })
      .addCase(createSample.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMarkets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarkets.fulfilled, (state, action) => {
        state.loading = false;
        state.markets = action.payload;
      })
      .addCase(fetchMarkets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default samplesSlice.reducer;
