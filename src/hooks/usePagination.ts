import { useState, useMemo, useEffect, useCallback } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
}

export interface UsePaginationReturn<T> {
  // Yêu cầu chính
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  currentData: T[];

  // Các tiện ích mở rộng hữu ích
  canNextPage: boolean;
  canPrevPage: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  itemsPerPage: number;
  setItemsPerPage: (pageSize: number) => void;
  pageNumbers: (number | string)[];
}

/**
 * Custom Hook usePagination<T>
 * Phân trang dữ liệu mảng Generic T[] ở Client-side
 *
 * @param data - Mảng dữ liệu nguồn (Generic T[])
 * @param itemsPerPage - Số phần tử trên mỗi trang (mặc định 10)
 * @param initialPage - Trang bắt đầu (mặc định 1)
 */
export function usePagination<T>(
  data: T[] = [],
  itemsPerPageProp: number = 10,
  initialPage: number = 1
): UsePaginationReturn<T> {
  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    return itemsPerPageProp > 0 ? itemsPerPageProp : 10;
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    return initialPage > 0 ? initialPage : 1;
  });

  // Cập nhật itemsPerPage nếu prop truyền vào thay đổi
  useEffect(() => {
    if (itemsPerPageProp > 0 && itemsPerPageProp !== itemsPerPage) {
      setItemsPerPage(itemsPerPageProp);
    }
  }, [itemsPerPageProp]);

  const totalItems = data.length;

  // Tính tổng số trang (ít nhất là 1 trang để giao diện hiển thị hợp lý)
  const totalPages = useMemo(() => {
    if (totalItems === 0) return 1;
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  // Tự động điều chỉnh currentPage nếu dữ liệu thay đổi làm totalPages < currentPage
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    } else if (currentPage < 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Chuyển tới trang cụ thể có kiểm tra giới hạn hợp lệ (clamp)
  const goToPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(pageNumber);
    },
    [totalPages]
  );

  // Chuyển trang tiếp theo
  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  // Quay lại trang trước
  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  // Tính toán chỉ số phần tử bắt đầu và kết thúc của trang hiện tại
  const startIndex = useMemo(() => {
    if (totalItems === 0) return 0;
    return (currentPage - 1) * itemsPerPage;
  }, [currentPage, itemsPerPage, totalItems]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems);
  }, [startIndex, itemsPerPage, totalItems]);

  // Lấy lát cắt dữ liệu (slice) cho trang hiện tại
  const currentData = useMemo(() => {
    if (totalItems === 0) return [];
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex, totalItems]);

  const canPrevPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  // Thuật toán sinh danh sách số trang thông minh với dấu ba chấm '...'
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    currentData,
    canNextPage,
    canPrevPage,
    startIndex,
    endIndex,
    totalItems,
    itemsPerPage,
    setItemsPerPage,
    pageNumbers,
  };
}
