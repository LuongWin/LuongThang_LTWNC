export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  rating: number;
  soldCount: number;
  tag?: 'Mới' | 'Hot' | 'Giảm giá' | 'Best Seller';
}

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export interface ProductsState {
  items: ProductItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedCategory: string;
  searchTerm: string;
  sortBy: SortOption;
}

