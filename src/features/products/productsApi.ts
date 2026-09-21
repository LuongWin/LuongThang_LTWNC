import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { MOCK_PRODUCTS } from '../../data/productsData';
import { ProductItem } from './types';

// RTK Query API giả lập lấy danh sách sản phẩm (Điểm cộng nâng cao)
// Cùng sử dụng chung nguồn MOCK_PRODUCTS để tránh trùng lặp dữ liệu
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductItem[], void>({
      async queryFn() {
        try {
          // Giả lập độ trễ mạng 500ms
          await new Promise((resolve) => setTimeout(resolve, 500));

          const serializedData: ProductItem[] = MOCK_PRODUCTS.map((item) => ({
            ...item,
            createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : String(item.createdAt),
            updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : String(item.updatedAt),
          }));

          return { data: serializedData };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: error instanceof Error ? error.message : 'Lỗi lấy dữ liệu từ RTK Query',
            },
          };
        }
      },
      providesTags: ['Products'],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;

