import { useState, useMemo } from 'react';
import { usePagination } from '../../hooks/usePagination';
import { MOCK_PRODUCTS, ExtendedProduct } from '../../data/productsData';
import './ProductList.css';

export function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [itemsPerPageSetting, setItemsPerPageSetting] = useState<number>(6);

  // 1. Trích xuất danh sách danh mục độc nhất
  const categories = useMemo(() => {
    const cats = Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)));
    return ['all', ...cats];
  }, []);

  // 2. Lọc và sắp xếp dữ liệu
  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchTerm, sortBy]);

  // 3. Áp dụng Custom Hook usePagination<ExtendedProduct>
  const {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    currentData: paginatedProducts,
    canNextPage,
    canPrevPage,
    startIndex,
    endIndex,
    totalItems,
    setItemsPerPage,
    pageNumbers,
  } = usePagination<ExtendedProduct>(filteredProducts, itemsPerPageSetting, 1);

  // Xử lý đổi số lượng item/trang
  const handlePageSizeChange = (newSize: number) => {
    setItemsPerPageSetting(newSize);
    setItemsPerPage(newSize);
  };

  // Format tiền tệ VND
  const formatVND = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="product-list-wrapper">
      {/* Header & Bộ lọc */}
      <div className="product-list-header">
        <div className="search-filter-bar">
          <div className="search-input-group">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-controls-group">
            <div className="select-control">
              <label htmlFor="sort-select">Sắp xếp:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="custom-select"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
              </select>
            </div>

            <div className="select-control">
              <label htmlFor="pagesize-select">Hiển thị:</label>
              <select
                id="pagesize-select"
                value={itemsPerPageSetting}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="custom-select"
              >
                <option value={4}>4 sp / trang</option>
                <option value={6}>6 sp / trang</option>
                <option value={9}>9 sp / trang</option>
                <option value={12}>12 sp / trang</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'Tất cả sản phẩm' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Thống kê dữ liệu hiển thị */}
      <div className="pagination-stats-bar">
        <span className="stats-text">
          Đang hiển thị <strong>{totalItems > 0 ? startIndex + 1 : 0}</strong> -{' '}
          <strong>{endIndex}</strong> trên tổng số <strong>{totalItems}</strong> sản phẩm
          {selectedCategory !== 'all' && ` (Danh mục: ${selectedCategory})`}
        </span>
        <span className="stats-page">
          Trang <strong>{currentPage}</strong> / {totalPages}
        </span>
      </div>

      {/* Grid danh sách sản phẩm */}
      {paginatedProducts.length === 0 ? (
        <div className="empty-state">
          <svg
            className="empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <h3>Không tìm thấy sản phẩm nào!</h3>
          <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
        </div>
      ) : (
        <div className="product-grid">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="product-image"
                />
                {product.tag && (
                  <span className={`product-badge badge-${product.tag.toLowerCase().replace(/\s+/g, '-')}`}>
                    {product.tag}
                  </span>
                )}
                <span className="category-tag">{product.category}</span>
              </div>

              <div className="product-card-body">
                <h4 className="product-title" title={product.name}>
                  {product.name}
                </h4>
                <p className="product-desc">{product.description}</p>

                <div className="product-meta">
                  <div className="product-rating">
                    <span className="star-icon">★</span>
                    <span className="rating-val">{product.rating}</span>
                    <span className="sold-count">({product.soldCount} đã bán)</span>
                  </div>
                  <div className="product-stock">
                    Kho: <strong>{product.stock}</strong>
                  </div>
                </div>

                <div className="product-card-footer">
                  <div className="product-price">{formatVND(product.price)}</div>
                  <button
                    type="button"
                    className="add-to-cart-btn"
                    onClick={() => alert(`Đã thêm "${product.name}" vào giỏ hàng!`)}
                  >
                    Chọn mua
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Thanh điều khiển Phân Trang (Pagination Controls) */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            type="button"
            className="pagination-btn prev-btn"
            onClick={prevPage}
            disabled={!canPrevPage}
            title="Trang trước"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Trước</span>
          </button>

          <div className="page-numbers-group">
            {pageNumbers.map((page, idx) => {
              if (page === '...') {
                return (
                  <span key={`dots-${idx}`} className="pagination-ellipsis">
                    ...
                  </span>
                );
              }
              const pageNum = Number(page);
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`page-num-btn ${isActive ? 'active' : ''}`}
                  onClick={() => goToPage(pageNum)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="pagination-btn next-btn"
            onClick={nextPage}
            disabled={!canNextPage}
            title="Trang sau"
          >
            <span>Sau</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
