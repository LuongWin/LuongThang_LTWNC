import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  AlertCircle,
  Package,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchProducts } from './productsSlice';
import { useGetProductsQuery } from './productsApi';
import { ProductCard } from './ProductCard';
import { ProductItem, SortOption } from './types';
import { usePagination } from '../../hooks/usePagination';
import './ProductsView.css';

type FetchMode = 'thunk' | 'rtk-query';

export const ProductsView: React.FC = () => {
  const dispatch = useAppDispatch();

  // 1. Chế độ fetch: 'thunk' (createAsyncThunk) hoặc 'rtk-query' (RTK Query lấy điểm cộng)
  const [fetchMode, setFetchMode] = useState<FetchMode>('thunk');

  // 2. Trạng thái Thunk riêng biệt (Redux Store)
  const {
    items: thunkItems,
    status: thunkStatus,
    error: thunkError,
  } = useAppSelector((state) => state.products);

  // 3. Trạng thái RTK Query riêng biệt (Cache & Hooks)
  const {
    data: rtkItems,
    isLoading: isRtkLoading,
    isFetching: isRtkFetching,
    isError: isRtkError,
    error: rtkError,
    refetch: refetchRtk,
  } = useGetProductsQuery();

  // 4. Kích hoạt fetch thunk khi khởi tạo
  useEffect(() => {
    if (thunkStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [thunkStatus, dispatch]);

  // 5. Quản lý trạng thái Toast thông báo đơn giản (thuần UI state)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 6. Tách biệt hoàn toàn Loading, Error và Data theo đúng fetchMode đang chọn
  const isCurrentLoading =
    fetchMode === 'thunk'
      ? thunkStatus === 'loading'
      : isRtkLoading || isRtkFetching;

  const currentErrorMessage =
    fetchMode === 'thunk'
      ? thunkStatus === 'failed'
        ? thunkError
        : null
      : isRtkError
      ? 'status' in (rtkError as Record<string, unknown>)
        ? JSON.stringify(rtkError)
        : 'Lỗi tải dữ liệu từ RTK Query'
      : null;

  const currentProducts: ProductItem[] =
    fetchMode === 'thunk' ? thunkItems : rtkItems || [];

  // Hàm reload dữ liệu theo từng cơ chế
  const handleRefresh = () => {
    if (fetchMode === 'thunk') {
      dispatch(fetchProducts());
    } else {
      refetchRtk();
    }
    showToast(`Đang tải lại dữ liệu qua ${fetchMode === 'thunk' ? 'createAsyncThunk' : 'RTK Query'}...`);
  };

  // 7. Bộ lọc & Sắp xếp
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  // Trích xuất danh mục
  const categories = useMemo(() => {
    const set = new Set(currentProducts.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [currentProducts]);

  // Lọc và sắp xếp sản phẩm
  const filteredProducts = useMemo(() => {
    let list = [...currentProducts];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [currentProducts, selectedCategory, searchTerm, sortBy]);

  // 8. Tích hợp usePagination kế thừa từ Tuần 2
  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    currentData: paginatedProducts,
    canNextPage,
    canPrevPage,
    pageNumbers,
  } = usePagination<ProductItem>(filteredProducts, itemsPerPage, 1);

  return (
    <div className="products-view-container">
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="cart-floating-toast" role="alert">
          <CheckCircle2 className="w-4 h-4 text-emerald mr-2" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Chuyển đổi trạng thái query */}
      <div className="query-toggle-bar">
        <div className="mode-toggle-group">
          <button
            type="button"
            className={`mode-toggle-btn ${fetchMode === 'thunk' ? 'active' : ''}`}
            onClick={() => setFetchMode('thunk')}
          >
            <Layers className="w-4 h-4" />
            <span>createAsyncThunk</span>
          </button>
          <button
            type="button"
            className={`mode-toggle-btn ${fetchMode === 'rtk-query' ? 'active' : ''}`}
            onClick={() => setFetchMode('rtk-query')}
          >
            <Sparkles className="w-4 h-4" />
            <span>RTK Query</span>
          </button>
        </div>

        <button
          type="button"
          className="refresh-data-btn"
          onClick={handleRefresh}
          disabled={isCurrentLoading}
          title="Tải lại dữ liệu"
        >
          <RefreshCw className={`w-4 h-4 ${isCurrentLoading ? 'animate-spin' : ''}`} />
          <span>Tải lại</span>
        </button>
      </div>

      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="products-toolbar">
        {/* Ô tìm kiếm */}
        <div className="search-box-wrapper">
          <Search className="search-icon w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, hãng hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Lọc danh mục */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Tất cả danh mục' : cat}
            </button>
          ))}
        </div>

        {/* Sắp xếp & Số item/trang */}
        <div className="sort-filter-group">
          <div className="select-wrapper">
            <SlidersHorizontal className="w-3.5 h-3.5 select-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="custom-select"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="rating">Đánh giá: Cao nhất</option>
            </select>
          </div>

          <div className="select-wrapper">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="custom-select"
            >
              <option value={6}>6 sản phẩm / trang</option>
              <option value={12}>12 sản phẩm / trang</option>
              <option value={24}>24 sản phẩm / trang</option>
            </select>
          </div>
        </div>
      </div>

      {/* Trạng thái Loading */}
      {isCurrentLoading && (
        <div className="products-loading-state">
          <div className="loading-spinner" />
          <p>
            Đang tải dữ liệu sản phẩm qua <strong>{fetchMode === 'thunk' ? 'createAsyncThunk' : 'RTK Query'}</strong>...
          </p>
        </div>
      )}

      {/* Trạng thái Lỗi */}
      {!isCurrentLoading && currentErrorMessage && (
        <div className="products-error-state">
          <AlertCircle className="w-8 h-8 text-danger mb-2" />
          <h4>Không thể tải danh sách sản phẩm</h4>
          <p>{currentErrorMessage}</p>
          <button
            type="button"
            className="btn-retry"
            onClick={handleRefresh}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Grid danh sách sản phẩm */}
      {!isCurrentLoading && !currentErrorMessage && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="no-products-state">
              <Package className="w-12 h-12 text-muted mb-3" />
              <h4>Không tìm thấy sản phẩm phù hợp</h4>
              <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
              <button
                type="button"
                className="btn-reset-filters"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSortBy('default');
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddedSuccess={(p) =>
                    showToast(`Đã thêm "${p.name}" vào giỏ hàng!`)
                  }
                />
              ))}
            </div>
          )}

          {/* Thanh phân trang Pagination */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <span className="pagination-info">
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} trong tổng số{' '}
                {filteredProducts.length} sản phẩm
              </span>

              <div className="pagination-controls">
                <button
                  type="button"
                  className="page-btn nav-btn"
                  onClick={prevPage}
                  disabled={!canPrevPage}
                >
                  ← Trước
                </button>

                {pageNumbers.map((page, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`page-btn ${currentPage === page ? 'active' : ''} ${
                      typeof page !== 'number' ? 'dots' : ''
                    }`}
                    onClick={() => typeof page === 'number' && goToPage(page)}
                    disabled={typeof page !== 'number'}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="page-btn nav-btn"
                  onClick={nextPage}
                  disabled={!canNextPage}
                >
                  Sau →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
