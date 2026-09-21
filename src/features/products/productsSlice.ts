import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_PRODUCTS } from '../../data/productsData';
import { ProductItem, ProductsState, SortOption } from './types';

// Giả lập API gọi bất đồng bộ lấy danh sách sản phẩm với độ trễ 600ms
export const fetchProducts = createAsyncThunk<ProductItem[]>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Chuẩn hóa Date thành ISO string để đảm bảo 100% Redux Serializable
      const serializedData: ProductItem[] = MOCK_PRODUCTS.map((item) => ({
        ...item,
        createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt),
        updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : String(item.updatedAt),
      }));

      return serializedData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Không thể kết nối đến máy chủ sản phẩm'
      );
    }
  }
);

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
  selectedCategory: 'all',
  searchTerm: '',
  sortBy: 'default',
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.selectedCategory = 'all';
      state.searchTerm = '';
      state.sortBy = 'default';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Đã có lỗi xảy ra';
      });
  },
});

export const {
  setSelectedCategory,
  setSearchTerm,
  setSortBy,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;

